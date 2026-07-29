import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0.0,
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock count'],
      default: 0,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
