import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      '30-bouquets', '50-bouquets', '100-bouquets', '1000-bouquets',
      'weddings', 'birthdays', 'anniversaries', 'proposals', 'graduations',
      'baby-showers', 'festive-events', 'corporate-events',
      'fresh-flowers', 'bouquet-wrappers'
    ],
  },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  // Google Drive image URL (e.g., https://drive.google.com/uc?export=view&id=FILE_ID)
  imageUrl: { type: String, default: '' },
  driveFileId: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  // For flowers: unit is "stem", for bouquets: "piece", for supplies: "unit"
  unit: { type: String, default: 'piece' },
  // Extra metadata for event bouquets
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);