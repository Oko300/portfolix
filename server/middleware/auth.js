const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          message: 'Not authorized, user no longer exists',
          code: 'USER_NOT_FOUND',
        });
      }

      return next();
    } catch (error) {
      console.error(error);

      // Distinguish expired tokens from other JWT failures
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Session expired. Please log in again.',
          code: 'TOKEN_EXPIRED',
          expiredAt: error.expiredAt,
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Not authorized, invalid token',
          code: 'TOKEN_INVALID',
        });
      }

      return res.status(401).json({
        message: 'Not authorized, token failed',
        code: 'TOKEN_FAILED',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token',
      code: 'NO_TOKEN',
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user?.role || 'unknown'} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
