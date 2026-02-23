import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
  imageUrl: String,
});

const customBouquetSchema = new mongoose.Schema({
  flowers: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    pricePerStem: Number,
  }],
  wrapper: {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    imageUrl: String,
  },
  totalFlowerCost: Number,
  note: String,
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  orderType: { type: String, enum: ['standard', 'custom-bouquet'], default: 'standard' },
  items: [orderItemSchema],
  customBouquet: customBouquetSchema,
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now },
  }],
  deliveryNote: { type: String },
  whatsappSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);