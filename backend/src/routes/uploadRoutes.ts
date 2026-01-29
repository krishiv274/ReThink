import express from 'express';
import { getUploadSignature, deleteImage } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All upload routes require authentication
router.use(authMiddleware);

// Get signature for direct Cloudinary upload
router.post('/signature', getUploadSignature);

// Delete an image
router.delete('/:publicId', deleteImage);

export default router;
