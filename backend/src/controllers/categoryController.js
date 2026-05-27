const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.jobCategory.findMany({
      include: {
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, iconName, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const existing = await prisma.jobCategory.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'A job category with this name already exists.' });
    }

    const category = await prisma.jobCategory.create({
      data: {
        name,
        iconName: iconName || 'Briefcase',
        description,
      },
    });

    return res.status(201).json({
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, iconName, description } = req.body;

    const existing = await prisma.jobCategory.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Job category not found.' });
    }

    if (name && name !== existing.name) {
      const nameCheck = await prisma.jobCategory.findUnique({ where: { name } });
      if (nameCheck) {
        return res.status(400).json({ error: 'A job category with this name already exists.' });
      }
    }

    const updated = await prisma.jobCategory.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        iconName: iconName !== undefined ? iconName : existing.iconName,
        description: description !== undefined ? description : existing.description,
      },
    });

    return res.status(200).json({
      message: 'Category updated successfully.',
      category: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.jobCategory.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Job category not found.' });
    }

    // Delete category
    await prisma.jobCategory.delete({ where: { id } });

    return res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
