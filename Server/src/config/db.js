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
    doc.password = rawItem.password;
  }
  return doc;
}

function setupMockDatabase() {
  // Override Mongoose Model static query methods
  mongoose.Model.find = async function(query = {}) {
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

  mongoose.Model.findById = async function(id) {
    const data = readData(this.modelName);
    const found = data.find(item => item._id && (item._id.toString() === id.toString() || item.id === id));
    return found ? toMongooseDoc(this, found) : null;
  };

  mongoose.Model.findOne = function(query) {
    const model = this;
    const execute = () => {
      const data = readData(model.modelName);
      const found = data.find(item => {
        for (let key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
      return found ? toMongooseDoc(model, found) : null;
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

  mongoose.Model.create = async function(doc) {
    const data = readData(this.modelName);
    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newDoc);
    writeData(this.modelName, data);
    return new this(newDoc);
  };

  mongoose.Model.insertMany = async function(docs) {
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

  mongoose.Model.deleteMany = async function() {
    writeData(this.modelName, []);
    return { deletedCount: 0 };
  };

  // Mock instance methods like save, deleteOne
  mongoose.Model.prototype.save = async function() {
    const modelName = this.constructor.modelName;
    const data = readData(modelName);
    const docObj = this.toObject();

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
    // Attempt local MongoDB connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Database Connection Warning: ${error.message}`);
    console.log('--- STARTING IN-MEMORY JSON FALLBACK DATABASE ---');
    setupMockDatabase();
  }
};

export default connectDB;
