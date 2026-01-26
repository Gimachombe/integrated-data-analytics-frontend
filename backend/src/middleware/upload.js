const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
  }
};

// Configure upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private',
    key: function (req, file, cb) {
      const userId = req.userId || 'anonymous';
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware for single file upload
const uploadSingle = fieldName => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, err => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

// Middleware for multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, err => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
