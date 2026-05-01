const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, `../../uploads/${folder}`);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`);
  }
});

const imageFilter = (req, file, cb) => {
  if (/image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype)) cb(null, true);
  else cb(new Error('Images uniquement (jpg, png, webp, gif)'));
};

exports.uploadEventImage   = multer({ storage: storage('events'),   fileFilter: imageFilter, limits: { fileSize: 5e6 } }).single('image');
exports.uploadPaymentProof = multer({ storage: storage('receipts'), fileFilter: imageFilter, limits: { fileSize: 5e6 } }).single('paymentProof');
exports.uploadLogo         = multer({ storage: storage('logos'),    fileFilter: imageFilter, limits: { fileSize: 2e6 } }).single('logo');
