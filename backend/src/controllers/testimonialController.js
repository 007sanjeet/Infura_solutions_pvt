const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTestimonials = async (req, res, next) => {
  try {
    const { featuredOnly } = req.query;
    const where = {};
    if (featuredOnly === 'true') {
      where.isFeatured = true;
    }

    const list = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, clientRole, company, feedback, isFeatured, avatarUrl } = req.body;

    if (!clientName || !clientRole || !company || !feedback) {
      return res.status(400).json({ error: 'Client Name, Role, Company, and Feedback are required.' });
    }

    const item = await prisma.testimonial.create({
      data: {
        clientName,
        clientRole,
        company,
        feedback,
        avatarUrl,
        isFeatured: isFeatured === true || isFeatured === 'true',
      },
    });

    return res.status(201).json({
      message: 'Testimonial added successfully.',
      testimonial: item,
    });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientName, clientRole, company, feedback, isFeatured, avatarUrl } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: clientName !== undefined ? clientName : existing.clientName,
        clientRole: clientRole !== undefined ? clientRole : existing.clientRole,
        company: company !== undefined ? company : existing.company,
        feedback: feedback !== undefined ? feedback : existing.feedback,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : existing.avatarUrl,
        isFeatured: isFeatured !== undefined ? (isFeatured === true || isFeatured === 'true') : existing.isFeatured,
      },
    });

    return res.status(200).json({
      message: 'Testimonial updated successfully.',
      testimonial: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    await prisma.testimonial.delete({ where: { id } });

    return res.status(200).json({ message: 'Testimonial deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
