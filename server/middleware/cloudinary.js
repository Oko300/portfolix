const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require('sharp');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Free plan limits (verified from Cloudinary docs):
// - Images: 10 MB (10_485_760 bytes)
// - Videos / raw: higher, but we keep a practical cap
const CLOUDINARY_IMAGE_MAX = 10 * 1024 * 1024; // 10 MB
const MULTER_MAX = 25 * 1024 * 1024; // 25 MB (multer accepts, we compress images)

const storage = multer.memoryStorage();

const uploadCloud = multer({
  storage,
  limits: {
    fileSize: MULTER_MAX,
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'video/mp4', 'video/webm', 'video/ogg',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
});

/**
 * Compress / resize an image buffer so it fits under Cloudinary Free plan (10 MB).
 * Returns { buffer, mimetype } – non-images are returned unchanged.
 */
const prepareImageForUpload = async (fileBuffer, mimetype) => {
  if (!mimetype || !mimetype.startsWith('image/')) {
    return { buffer: fileBuffer, mimetype };
  }

  // Animated GIFs – leave alone (sharp would flatten them)
  if (mimetype === 'image/gif') {
    if (fileBuffer.length > CLOUDINARY_IMAGE_MAX) {
      throw Object.assign(
        new Error('GIF is too large (max 10 MB on Cloudinary Free plan). Please compress it first.'),
        { http_code: 400, code: 'FILE_TOO_LARGE' }
      );
    }
    return { buffer: fileBuffer, mimetype };
  }

  // Resize long edge to max 1920px and compress to JPEG quality ~80
  // This reliably brings most 15–25 MB phone photos under 10 MB
  let pipeline = sharp(fileBuffer)
    .rotate() // honour EXIF orientation
    .resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    });

  // Prefer WebP when possible; fall back to JPEG for maximum compatibility
  if (mimetype === 'image/png' || mimetype === 'image/webp') {
    pipeline = pipeline.webp({ quality: 80 });
    mimetype = 'image/webp';
  } else {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
    mimetype = 'image/jpeg';
  }

  const compressed = await pipeline.toBuffer();

  // Safety net – if still over limit, compress harder
  if (compressed.length > CLOUDINARY_IMAGE_MAX) {
    const harder = await sharp(fileBuffer)
      .rotate()
      .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 65, mozjpeg: true })
      .toBuffer();

    if (harder.length > CLOUDINARY_IMAGE_MAX) {
      throw Object.assign(
        new Error('Image is still too large after compression (max 10 MB). Please use a smaller file.'),
        { http_code: 400, code: 'FILE_TOO_LARGE' }
      );
    }
    return { buffer: harder, mimetype: 'image/jpeg' };
  }

  return { buffer: compressed, mimetype };
};

/**
 * Upload a buffer to Cloudinary.
 * Images are automatically compressed/resized to stay under the Free plan 10 MB limit.
 */
const uploadToCloudinary = async (fileBuffer, mimetype, options = {}) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not configured');
  }

  const { buffer, mimetype: finalMime } = await prepareImageForUpload(fileBuffer, mimetype);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolix',
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          // Normalise Cloudinary size errors into a clear client-facing message
          if (error.message && error.message.includes('File size too large')) {
            return reject(
              Object.assign(
                new Error('File is too large for Cloudinary Free plan (images max 10 MB). Try a smaller file.'),
                { http_code: 400, code: 'FILE_TOO_LARGE' }
              )
            );
          }
          return reject(error);
        }
        resolve({ ...result, finalMime });
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = {
  uploadCloud,
  cloudinary,
  uploadToCloudinary,
  CLOUDINARY_IMAGE_MAX,
};
