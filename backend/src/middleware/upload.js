const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'media';
    if (file.fieldname === 'resume') {
      subfolder = 'resumes';
    } else if (file.fieldname === 'image' || file.fieldname === 'banner' || file.fieldname === 'logo') {
      subfolder = 'images';
    }

    const destDir = path.join(__dirname, '../../uploads', subfolder);
    
    // Ensure dir exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and append unique timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${file.fieldname}-${basename}-${uniqueSuffix}${ext}`);
  },
});

// File filter validator
const fileFilter = (req, file, cb) => {
  const allowedExtensions = {
    resume: ['.pdf', '.doc', '.docx'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
    banner: ['.jpg', '.jpeg', '.png', '.webp'],
    logo: ['.jpg', '.jpeg', '.png', '.svg', '.webp'],
    media: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.pdf', '.doc', '.docx'],
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const field = file.fieldname;

  if (allowedExtensions[field] && allowedExtensions[field].includes(ext)) {
    cb(null, true);
  } else if (!allowedExtensions[field]) {
    // If generic media upload
    const genericAllowed = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.pdf', '.doc', '.docx'];
    if (genericAllowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed.`), false);
    }
  } else {
    cb(new Error(`Invalid file type ${ext} for upload field '${field}'. Allowed: ${allowedExtensions[field].join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;
