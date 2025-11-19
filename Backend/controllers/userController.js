import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import AdminAudit from '../models/AdminAudit.js';

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

// Admin or owner: get user by id
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // allow if owner or admin
  if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
    res.status(403);
    throw new Error('Not authorized to view this profile');
  }
  const user = await User.findById(id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// Admin or owner: update user by id
const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin && req.user._id.toString() !== id) {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // define allowed fields
  const ownerFields = ['name', 'branch', 'cgpa', 'resume_link', 'company_name'];
  const adminFields = ['name', 'branch', 'cgpa', 'resume_link', 'company_name', 'role', 'email'];

  const allowed = isAdmin ? adminFields : ownerFields;
  const changes = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      changes[field] = { from: user[field], to: req.body[field] };
      user[field] = req.body[field];
    }
  });

  if (!isAdmin && req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();

  if (isAdmin && Object.keys(changes).length) {
    await AdminAudit.create({
      admin: req.user._id,
      targetUser: updated._id,
      changes,
      reason: req.body.reason || 'admin update',
      ip: req.ip,
    });
  }

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    branch: updated.branch,
    cgpa: updated.cgpa,
    resume_link: updated.resume_link,
    company_name: updated.company_name,
  });
});

export { getUserById, updateUserById };
