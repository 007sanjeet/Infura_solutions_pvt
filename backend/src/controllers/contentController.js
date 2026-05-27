const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const content = await prisma.webContent.findUnique({
      where: { key },
    });

    if (!content) {
      return res.status(404).json({ error: `Content section for key '${key}' not found.` });
    }

    return res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

const updateContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: 'Content value payload is required.' });
    }

    const updated = await prisma.webContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return res.status(200).json({
      message: `Content section '${key}' updated successfully.`,
      content: updated,
    });
  } catch (error) {
    next(error);
  }
};

const getAllContent = async (req, res, next) => {
  try {
    const contents = await prisma.webContent.findMany();
    // Reduce array to a single object with key-value pairs for easy consumption on frontend
    const contentMap = contents.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return res.status(200).json(contentMap);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContentByKey,
  updateContentByKey,
  getAllContent,
};
