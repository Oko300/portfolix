const multer = require('multer');
const path = require('path');

// Use memory storage - no disk needed (works on Render)
const storage = multer.memoryStorage();

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov|avi|zip|rar|js|html|css|py|java|c|cpp|json/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Unsupported file type!');
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
