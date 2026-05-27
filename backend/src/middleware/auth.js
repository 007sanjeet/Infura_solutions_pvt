const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(412).json({ error: 'Authentication token missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look up in admin table first
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (admin) {
      req.user = { id: admin.id, email: admin.email, name: admin.name, role: admin.role, type: 'ADMIN' };
      return next();
    }

    // Look up in regular user table
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (user) {
      req.user = { id: user.id, email: user.email, name: user.name, type: 'USER' };
      return next();
    }

    return res.status(401).json({ error: 'User does not exist.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || req.user.type !== 'ADMIN') {
      return res.status(403).json({ error: 'Access forbidden. Administrative privileges required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access forbidden for role: ${req.user.role}` });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
};
