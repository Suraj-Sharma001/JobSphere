import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.branch = req.body.branch || user.branch;
    user.cgpa = req.body.cgpa || user.cgpa;
    user.resume_link = req.body.resume_link || user.resume_link;
    user.company_name = req.body.company_name || user.company_name;

    if (req.body.password)
    
    {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      branch: updatedUser.branch,
      cgpa: updatedUser.cgpa,
      resume_link: updatedUser.resume_link,
      company_name: updatedUser.company_name,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
  
});

export { getUserProfile, updateUserProfile };
