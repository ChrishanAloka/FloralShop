import api from './api';

export const uploadService = {
    // Upload file → returns { fileId, imageUrl }
    uploadImage: (file, onProgress) => {
        const form = new FormData();
        form.append('image', file);
        return api.post('/upload/image', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: e => onProgress?.(Math.round((e.loaded * 100) / e.total)),
        });
    },

    // Delete a file from Drive by fileId
    deleteImage: (fileId) => api.delete(`/upload/image/${fileId}`),

    // List all images in the MyFlowers folder
    listImages: () => api.get('/upload/images'),
};