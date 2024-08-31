const multer = require('multer');
const crypto = require('crypto');

// Configure multer to use memory storage
const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    // Generate a random 16-byte string for the filename
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return cb(err);
      }
      // Convert the bytes to a hex string and use it as the filename
      const filename = buf.toString('hex');
      // Use the file's original extension
      const fileExtension = file.originalname.split('.').pop();
      cb(null, `${filename}.${fileExtension}`);
    });
  },
});

exports.upload = multer({ storage: storage });
