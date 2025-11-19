// FILE: server/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name,
         email,
         password,
         role,
         branch,
         cgpa,
         resume_link,
         company_name
        } = req.body;

  // If registering as admin, require the ADMIN_SECRET_KEY env value or admin_key
  if (role === 'admin') {
    const { admin_key } = req.body;
    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret) {
      res.status(500);
      throw new Error('Server misconfiguration: ADMIN_SECRET_KEY not set');
    }
    if (!admin_key || admin_key !== secret) {
      res.status(400);
      throw new Error('Invalid admin key');
    }
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    branch,
    cgpa,
    resume_link,
    company_name,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      cgpa: user.cgpa,
      resume_link: user.resume_link,
      company_name: user.company_name,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      cgpa: user.cgpa,
      resume_link: user.resume_link,
      company_name: user.company_name,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export {
  registerUser, 
  authUser
};
