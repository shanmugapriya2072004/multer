const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

// Authorize roles (e.g. authorize('admin'))
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Role '${req.user.role}' is not authorized to access this resource` 
      });
    }
    next();
  };
};