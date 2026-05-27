const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Submit contact form
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message content are required.' });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    return res.status(201).json({
      message: 'Your message has been submitted. Our team will contact you shortly.',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// Get contact submissions (Admin only)
const getContactMessages = async (req, res, next) => {
  try {
    const { isResolved, page = 1, limit = 15 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (isResolved !== undefined) {
      where.isResolved = isResolved === 'true';
    }

    const total = await prisma.contactMessage.count({ where });
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    return res.status(200).json({
      messages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Toggle resolved status (Admin only)
const resolveMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isResolved } = req.body;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Message enquiry not found.' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isResolved: isResolved === true || isResolved === 'true' },
    });

    return res.status(200).json({
      message: `Message status updated to ${updated.isResolved ? 'Resolved' : 'Unresolved'}.`,
      messageRecord: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Newsletter Subscribe
const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed to our newsletter.' });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return res.status(201).json({ message: 'Successfully subscribed to the Infura Newsletter.' });
  } catch (error) {
    next(error);
  }
};

// Get newsletter subscribers (Admin only)
const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(subscribers);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  resolveMessage,
  subscribeNewsletter,
  getSubscribers,
};
