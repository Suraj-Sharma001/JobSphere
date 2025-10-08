import jwt from 'jsonwebtoken';

import asyncHandler from 'express-async-handler';

import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {

 const authHeader = req.headers.authorization;
  let token;

  if (authHeader?.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');

      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token invalid');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

});

const authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

res.status(403);

 throw new Error(`Role "${req.user.role}" not authorized`);
    }
    next();
  };

};

export { protect, authorize };
