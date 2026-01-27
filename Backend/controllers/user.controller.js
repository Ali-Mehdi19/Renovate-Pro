import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import dotenv from 'dotenv';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

dotenv.config();

// 🟩 Register (Sign Up)
export const registerUser = async (req, res) => {
  try {

    const { fullName, email, password, role } = req.body;

    // Validation
    if (!fullName || !email || !password || !role) {
      return new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return  new ApiError(400, "User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return new ApiResponse(201, { message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    new ApiError(500, "Server error during registration", error);
  }
};

// 🟦 Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new ApiError(400, "Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new ApiError(400, "Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    new ApiError(500, "Server error during login", error);
  }
};

// 🟨 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return new ApiError(404, "User not found");
    }
    return new ApiResponse(200, user);
  } catch (error) {
    console.error(error);
    new ApiError(500, "Server error during profile retrieval", error);
  }
};

// 🟧 Update User Profile 
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email }
     = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email },
      { new: true }
    ).select("-password");
    if (!user) {
      return new ApiError(404, "User not found");
    }
    return new ApiResponse(200, user);
  } catch (error) {
    console.error(error);
    new ApiError(500, "Server error during profile update", error);
  }
};


