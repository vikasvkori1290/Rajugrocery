import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../services/emailService.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiration

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      isVerified: false,
      otpCode: otp,
      otpExpires: expires
    });

    if (user) {
      console.log(`\n==================================================`);
      console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
      console.log(`==================================================\n`);

      // Dispatch real email
      await sendOtpEmail(email, otp);

      res.status(201).json({
        verified: false,
        email: user.email,
        message: 'Verification OTP sent to your email.'
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check if user is verified (only for customers)
      if (user.role !== 'admin' && !user.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        user.otpCode = otp;
        user.otpExpires = expires;
        await user.save();

        console.log(`\n==================================================`);
        console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
        console.log(`==================================================\n`);

        // Dispatch real email
        await sendOtpEmail(email, otp);

        return res.json({
          verified: false,
          email: user.email,
          message: 'Account not verified. Verification OTP sent to your email.'
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || '/avatars/nobita.png',
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update name, phone, address, and avatar (ignore email updates)
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        avatar: updatedUser.avatar || '/avatars/nobita.png',
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin users');
      }
      await user.deleteOne();
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and log in user
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.otpCode !== otp || user.otpExpires < new Date()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '/avatars/nobita.png',
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP code
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otp;
    user.otpExpires = expires;
    await user.save();

    console.log(`\n==================================================`);
    console.log(`[OTP Verification] Resent Code for ${email} is: ${otp}`);
    console.log(`==================================================\n`);

    // Dispatch real email
    await sendOtpEmail(email, otp);

    res.json({ message: 'New OTP code sent to your email.' });
  } catch (error) {
    next(error);
  }
};
