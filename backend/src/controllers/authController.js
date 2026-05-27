const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Try finding in admin table first
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return res.status(200).json({
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          type: 'ADMIN',
        },
      });
    }

    // Try finding in user table
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: 'USER',
        },
      });
    }

    return res.status(401).json({ error: 'Invalid credentials.' });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    return res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'SUB_ADMIN',
      },
    });

    return res.status(201).json({
      message: 'Admin account created successfully.',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'SUB_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    // Prevent self demotion
    if (req.user.id === id) {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    return res.status(200).json({
      message: 'Admin role updated successfully.',
      admin: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({ error: 'You cannot delete your own administrative account.' });
    }

    await prisma.admin.delete({ where: { id } });

    return res.status(200).json({ message: 'Admin account deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile,
  getAdmins,
  createAdmin,
  updateAdminRole,
  deleteAdmin,
};
