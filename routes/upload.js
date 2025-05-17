const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ֆայլերը կպահվեն ./uploads/
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
