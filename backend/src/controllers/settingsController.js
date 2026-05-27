const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Seed default on-demand
      settings = await prisma.settings.create({
        data: {
          id: 'default-settings',
          companyName: 'Infura Solutions',
          email: 'info@infurasolutions.com',
          phone: '+91 98765 43210',
          address: 'Noida Uttar Pradesh',
          seoTitle: 'Infura Solutions',
          seoDescription: 'Premium recruitment services.',
          socialLinks: { facebook: '', linkedin: '', twitter: '', instagram: '' },
          themeSettings: { primaryColor: '#ffffff', secondaryColor: '#f4f6f8', accentColor: '#0284c7', premiumAccent: '#c5a880' },
        },
      });
    }

    return res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const {
      companyName,
      email,
      phone,
      address,
      seoTitle,
      seoDescription,
      seoKeywords,
      socialLinks, // Object or JSON string
      themeSettings, // Object or JSON string
    } = req.body;

    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found.' });
    }

    let logoUrl = settings.logoUrl;
    if (req.file) {
      // Remove old logo if it existed
      if (settings.logoUrl) {
        const oldLogoPath = path.resolve(__dirname, '../../', settings.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          try {
            fs.unlinkSync(oldLogoPath);
          } catch (e) {
            console.error('Failed to delete old logo file:', e);
          }
        }
      }

      const newPath = req.file.path.replace(/\\/g, '/');
      logoUrl = newPath.includes('uploads/') 
        ? 'uploads/' + newPath.split('uploads/')[1] 
        : newPath;
    }

    const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    const parsedThemeSettings = typeof themeSettings === 'string' ? JSON.parse(themeSettings) : themeSettings;

    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        companyName: companyName !== undefined ? companyName : settings.companyName,
        email: email !== undefined ? email : settings.email,
        phone: phone !== undefined ? phone : settings.phone,
        address: address !== undefined ? address : settings.address,
        seoTitle: seoTitle !== undefined ? seoTitle : settings.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : settings.seoDescription,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : settings.seoKeywords,
        logoUrl,
        socialLinks: parsedSocialLinks !== undefined ? parsedSocialLinks : settings.socialLinks,
        themeSettings: parsedThemeSettings !== undefined ? parsedThemeSettings : settings.themeSettings,
      },
    });

    return res.status(200).json({
      message: 'Website configuration updated successfully.',
      settings: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
