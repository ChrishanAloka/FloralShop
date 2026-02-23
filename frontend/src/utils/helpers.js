// Format price
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

// Format date
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

// Category labels
export const CATEGORY_LABELS = {
  '30-bouquets': '30 Flowers Bouquets',
  '50-bouquets': '50 Flowers Bouquets',
  '100-bouquets': '100 Flowers Grand Bouquets',
  '1000-bouquets': '1000 Flower Royal Arrangements',
  'weddings': 'Weddings',
  'birthdays': 'Birthdays',
  'anniversaries': 'Anniversaries',
  'proposals': 'Proposals',
  'graduations': 'Graduations',
  'baby-showers': 'Baby Showers',
  'festive-events': 'Festive Events',
  'corporate-events': 'Corporate Events',
  'fresh-flowers': 'Fresh Flowers',
  'bouquet-wrappers': 'Bouquet Wrappers', // Keep this as it's likely used by the custom builder
};

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

// Order status steps
export const ORDER_STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Google Drive image URL helper
// Input: https://drive.google.com/file/d/FILE_ID/view
// Output: https://drive.google.com/uc?export=view&id=FILE_ID
export const parseDriveUrl = (url) => {
  if (!url) return '';
  // Convert share URL: drive.google.com/file/d/FILE_ID/view
  const shareMatch = url.match(/\/d\/([\w-]+)/);
  if (shareMatch) return `https://drive.google.com/thumbnail?id=${shareMatch[1]}&sz=w1000`;
  // Convert old broken format: uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([\w-]+)/);
  if (ucMatch && url.includes('drive.google.com/uc')) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w1000`;
  }
  // Already a thumbnail or external URL — use as-is
  return url;
};

// Detect mobile
export const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);