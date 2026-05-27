const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

const getBanners = async (req, res, next) => {
  try {
    const { all } = req.query; // If all is 'true', return inactive banners too (for admin)
    const where = {};
    if (all !== 'true') {
      where.isActive = true;
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
};

const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, linkUrl, order, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Banner title is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a banner image.' });
    }

    const imagePath = req.file.path.replace(/\\/g, '/');
    const relativePath = imagePath.includes('uploads/') 
      ? 'uploads/' + imagePath.split('uploads/')[1] 
      : imagePath;

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        linkUrl,
        imageUrl: relativePath,
        order: order ? parseInt(order) : 0,
        isActive: isActive === 'true' || isActive === true,
      },
    });

    return res.status(201).json({
      message: 'Banner uploaded successfully.',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, linkUrl, order, isActive } = req.body;

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found.' });
    }

    let imageUrl = banner.imageUrl;
    if (req.file) {
      // Remove old image if exists
      const oldPath = path.resolve(__dirname, '../../', banner.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      const newPath = req.file.path.replace(/\\/g, '/');
      imageUrl = newPath.includes('uploads/') 
        ? 'uploads/' + newPath.split('uploads/')[1] 
        : newPath;
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: title !== undefined ? title : banner.title,
        subtitle: subtitle !== undefined ? subtitle : banner.subtitle,
        linkUrl: linkUrl !== undefined ? linkUrl : banner.linkUrl,
        imageUrl,
        order: order !== undefined ? parseInt(order) : banner.order,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : banner.isActive,
      },
    });

    return res.status(200).json({
      message: 'Banner updated successfully.',
      banner: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found.' });
    }

    // Delete image file
    const imgPath = path.resolve(__dirname, '../../', banner.imageUrl);
    if (fs.existsSync(imgPath)) {
      try {
        fs.unlinkSync(imgPath);
      } catch (err) {
        console.error('Failed to delete banner file:', err);
      }
    }

    await prisma.banner.delete({ where: { id } });

    return res.status(200).json({ message: 'Banner deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
