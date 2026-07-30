import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Database cleared.');

    // 1. Create Admin user
    const adminUser = new User({
      name: 'Raj Admin',
      email: 'admin@rajgroceries.com',
      password: 'adminpassword', // Will be hashed automatically by user pre-save hook
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user seeded: admin@rajgroceries.com / adminpassword');

    // 2. Create products
    const initialProducts = [
      {
        name: 'Premium Wheat Flour (Chakki Atta)',
        description: 'Traditional stone-ground whole wheat flour. Sourced directly from local mills. No added maida, rich in fiber.',
        price: 8.99,
        category: 'Atta & Flours',
        stock: 120,
        images: [{ url: 'https://images.unsplash.com/photo-1574325131876-a799988e6375?w=500', public_id: 'atta' }]
      },
      {
        name: 'Cold-Pressed Mustard Oil',
        description: 'Pure and natural mustard seed cooking oil. Cold-pressed Kachi Ghani, rich in aroma, natural preservative.',
        price: 6.50,
        category: 'Cooking Oils',
        stock: 85,
        images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', public_id: 'oil' }]
      },
      {
        name: 'Premium Chocolate Chip Cookies',
        description: 'Crispy cookies loaded with premium dark chocolate chips. Perfect snack for tea-time.',
        price: 3.50,
        category: 'Biscuits & Snacks',
        stock: 150,
        images: [{ url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500', public_id: 'cookies' }]
      },
      {
        name: 'Premium Basmati Rice (Rozana)',
        description: 'Extra long slender grains of basmati rice aged for 1 year for non-sticky fluffy cooking.',
        price: 14.99,
        category: 'Atta & Flours',
        stock: 90,
        images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', public_id: 'rice' }]
      },
      {
        name: 'Digestive Wheat Biscuits',
        description: 'High fiber whole wheat digestive biscuits. Low sugar formula, ideal for fitness conscious snacking.',
        price: 2.75,
        category: 'Biscuits & Snacks',
        stock: 110,
        images: [{ url: 'https://images.unsplash.com/photo-1558961312-50346c099379?w=500', public_id: 'digestive' }]
      },
      {
        name: 'Organic Toor Dal (Arhar)',
        description: 'High-protein unpolished Split pigeon peas dal. Certified organic, chemical-free.',
        price: 3.99,
        category: 'Dals & Pulses',
        stock: 75,
        images: [{ url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500', public_id: 'toordal' }]
      },
      {
        name: 'Red Lentils (Masoor Dal)',
        description: 'Split red lentils. No artificial coloring or polishing agents. Quick to cook.',
        price: 3.25,
        category: 'Dals & Pulses',
        stock: 95,
        images: [{ url: 'https://images.unsplash.com/photo-1547050605-2f87fa0578db?w=500', public_id: 'masoordal' }]
      },
      {
        name: 'Organic Green Moong Dal',
        description: 'Whole green gram dal beans rich in protein and fiber. Excellent choice for sprouting.',
        price: 4.10,
        category: 'Dals & Pulses',
        stock: 65,
        images: [{ url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500', public_id: 'moongdal' }]
      },
      {
        name: 'Lemon Fresh Dishwash Gel',
        description: 'Concentrated dishwashing liquid gel. Cuts through tough oil grease, gentle on skin.',
        price: 4.99,
        category: 'Household Essentials',
        stock: 140,
        images: [{ url: 'https://images.unsplash.com/photo-1585832770485-e38e7d55d244?w=500', public_id: 'dishwash' }]
      },
      {
        name: 'Liquid Laundry Detergent',
        description: 'Advanced enzyme laundry stain remover. Gentle on clothes, preserves color fabrics.',
        price: 9.99,
        category: 'Household Essentials',
        stock: 80,
        images: [{ url: 'https://images.unsplash.com/photo-1610557892470-76d74c52076f?w=500', public_id: 'detergent' }]
      }
    ];

    await Product.insertMany(initialProducts);
    console.log(`${initialProducts.length} Products seeded successfully.`);

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
