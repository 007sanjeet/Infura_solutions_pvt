const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const getMediaFiles = async (req, res, next) => {
  try {
    const list = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a file to upload.' });
    }

    const filePath = req.file.path.replace(/\\/g, '/');
    const relativePath = filePath.includes('uploads/') 
      ? 'uploads/' + filePath.split('uploads/')[1] 
      : filePath;

    const media = await prisma.media.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: relativePath,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    return res.status(201).json({
      message: 'Media file uploaded successfully.',
      media,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ error: 'Media file not found in database.' });
    }

    // Delete from disk
    const diskPath = path.resolve(__dirname, '../../', media.path);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.error('Failed to unlink media file from storage:', err);
      }
    }

    // Delete record from DB
    await prisma.media.delete({ where: { id } });

    return res.status(200).json({ message: 'Media file deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMediaFiles,
  uploadMedia,
  deleteMedia,
};
