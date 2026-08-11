import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

function readData(modelName) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const file = path.join(DATA_DIR, `${modelName}.json`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function writeData(modelName, data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const file = path.join(DATA_DIR, `${modelName}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function toMongooseDoc(modelClass, rawItem) {
  if (!rawItem) return null;
  const doc = new modelClass(rawItem);
  for (let key in rawItem) {
    if (doc[key] === undefined || doc[key] === null) {
      doc[key] = rawItem[key];
    }
  }
  if (rawItem.password) {
    Object.defineProperty(doc, 'password', {
      value: rawItem.password,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
  return doc;
}

function setupMockDatabase() {
  const overrideModelMethods = (model) => {
    model.find = async function(query = {}) {
      const data = readData(this.modelName);
      const results = data.filter(item => {
        for (let key in query) {
          if (key === 'category' && query[key] && item.category !== query[key]) return false;
          if (key === 'name' && query[key] && query[key].$regex) {
            const regex = new RegExp(query[key].$regex, query[key].$options || 'i');
            if (!regex.test(item.name)) return false;
          } else if (key !== 'category' && key !== 'name' && item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
      return results.map(item => toMongooseDoc(this, item));
    };

    model.findById = function(id) {
      const modelInstance = this;
      const execute = () => {
        const data = readData(modelInstance.modelName);
        const found = data.find(item => item._id && (item._id.toString() === id.toString() || item.id === id));
        return found ? toMongooseDoc(modelInstance, found) : null;
      };

      return {
        select: function() { return this; },
        then: function(resolve, reject) {
          try {
            resolve(execute());
          } catch (e) {
            reject(e);
          }
        }
      };
    };

    model.findOne = function(query) {
      const modelInstance = this;
      const execute = () => {
        const data = readData(modelInstance.modelName);
        const found = data.find(item => {
          for (let key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
        return found ? toMongooseDoc(modelInstance, found) : null;
      };

      return {
        select: function() { return this; },
        then: function(resolve, reject) {
          try {
            resolve(execute());
          } catch (e) {
            reject(e);
          }
        }
      };
    };

    model.create = async function(doc) {
      const data = readData(this.modelName);
      let docObj = { ...doc };
      if (this.modelName === 'User' && docObj.password) {
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.default.genSalt(10);
        docObj.password = await bcrypt.default.hash(docObj.password, salt);
      }
      const newDoc = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...docObj,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      data.push(newDoc);
      writeData(this.modelName, data);
      return new this(newDoc);
    };

    model.insertMany = async function(docs) {
      const data = readData(this.modelName);
      const seeded = docs.map(doc => ({
        _id: doc._id || new mongoose.Types.ObjectId().toString(),
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      const newData = [...data, ...seeded];
      writeData(this.modelName, newData);
      return seeded.map(item => new this(item));
    };

    model.deleteMany = async function() {
      writeData(this.modelName, []);
      return { deletedCount: 0 };
    };
  };

  // Apply overrides to base Model class
  overrideModelMethods(mongoose.Model);

  // Apply overrides to already compiled models
  for (let modelName in mongoose.models) {
    overrideModelMethods(mongoose.models[modelName]);
  }

  // Mock instance methods like save, deleteOne
  mongoose.Model.prototype.save = async function() {
    const modelName = this.constructor.modelName;
    const data = readData(modelName);
    const docObj = this.toObject();

    if (modelName === 'User' && docObj.password && !docObj.password.startsWith('$2a$') && !docObj.password.startsWith('$2b$')) {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.default.genSalt(10);
      docObj.password = await bcrypt.default.hash(docObj.password, salt);
    }

    if (!docObj._id) {
      docObj._id = new mongoose.Types.ObjectId().toString();
    } else {
      docObj._id = docObj._id.toString();
    }

    const idx = data.findIndex(item => item._id && item._id.toString() === docObj._id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...docObj, updatedAt: new Date() };
    } else {
      data.push({
        ...docObj,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    writeData(modelName, data);
    return this;
  };

  mongoose.Model.prototype.deleteOne = async function() {
    const modelName = this.constructor.modelName;
    const data = readData(modelName);
    if (!this._id) return { deletedCount: 0 };
    const id = this._id.toString();
    const filtered = data.filter(item => item._id && item._id.toString() !== id);
    writeData(modelName, filtered);
    return { deletedCount: 1 };
  };
}

const connectDB = async () => {
  try {
    // Attempt local MongoDB connection with 10s timeout
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Database Connection Warning: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log('--- STARTING IN-MEMORY JSON FALLBACK DATABASE ---');
      setupMockDatabase();
    } else {
      console.error('Database connection failed in production mode. Fallback database disabled.');
      throw error;
    }
  }
};

export default connectDB;
