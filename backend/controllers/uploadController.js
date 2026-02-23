import multer from 'multer';
import { uploadToDrive, deleteFromDrive, listDriveImages } from '../services/driveService.js';

// Store uploads in memory — we stream directly to Drive, nothing written to disk
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
    },
});

// POST /api/upload/image
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image file provided' });
        const result = await uploadToDrive(req.file.buffer, req.file.originalname, req.file.mimetype);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('Drive upload error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/upload/image/:fileId
export const deleteImage = async (req, res) => {
    try {
        await deleteFromDrive(req.params.fileId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/upload/images  — browse existing Drive images
export const listImages = async (req, res) => {
    try {
        const files = await listDriveImages();
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};