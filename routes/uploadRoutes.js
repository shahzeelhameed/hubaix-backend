const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/index.js');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'uc_members');
fs.mkdirSync(uploadDir, { recursive: true });
console.log("✅ Upload directory ensured:", uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const memberId = req.body.member_id;
    if (!memberId) {
      return cb(new Error("member_id is required"));
    }
    const filename = `${memberId}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Route to upload image and update DB
router.post('/upload-image', upload.single('image'), (req, res) => {
  const memberId = req.body.member_id;
  if (!memberId) {
    return res.status(400).json({ error: "member_id is required" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  const imageUrl = `/uploads/uc_members/${req.file.filename}`;
  console.log("📡 Updating DB for member ID:", memberId);

  const sql = `UPDATE uc_members SET img_url = ? WHERE id = ?`;

  db.query(sql, [imageUrl, memberId], (err, result) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    console.log("✅ DB updated for member ID:", memberId);
    return res.json({
      message: "Image uploaded and URL saved to DB",
      imageUrl,
      memberId
    });
  });
});

module.exports = router;
