import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

/**
 * Generate a signature for direct Cloudinary uploads from frontend
 * POST /api/upload/signature
 */
export const getUploadSignature = async (req: Request, res: Response): Promise<void> => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'rethink-items';
    
    // Create signature for secure upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        transformation: 'c_limit,w_1200,h_1200,q_auto:good',
      },
      process.env.CLOUDINARY_API_SECRET || ''
    );

    res.status(200).json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ message: 'Failed to generate upload signature' });
  }
};

/**
 * Delete an image from Cloudinary
 * DELETE /api/upload/:publicId
 */
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      res.status(400).json({ message: 'Public ID is required' });
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      message: 'Image deleted successfully',
      result,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};
