import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { createNotification, notifyAdmins } from './notificationController.js';
dotenv.config();

const buildWhatsAppMessage = (order) => {
  let msg = `🌸 *NEW ORDER #${order._id.toString().slice(-6).toUpperCase()}*\n\n`;
  msg += `👤 *Customer:* ${order.customerName}\n`;
  msg += `📞 *Phone:* ${order.customerPhone}\n\n`;

  if (order.orderType === 'standard') {
    msg += `🛒 *Order Items:*\n`;
    order.items.forEach(item => {
      msg += `  • ${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}\n`;
    });
  } else {
    msg += `💐 *Custom Bouquet:*\n`;
    msg += `  *Flowers:*\n`;
    order.customBouquet.flowers.forEach(f => {
      msg += `    • ${f.name} x${f.quantity} — $${(f.pricePerStem * f.quantity).toFixed(2)}\n`;
    });
    msg += `  *Wrapper:* ${order.customBouquet.wrapper?.name || 'N/A'} — $${order.customBouquet.wrapper?.price?.toFixed(2) || '0.00'}\n`;
    if (order.customBouquet.note) msg += `  *Note:* ${order.customBouquet.note}\n`;
  }

  msg += `\n💰 *Total: $${order.totalAmount.toFixed(2)}*\n`;
  if (order.deliveryNote) msg += `\n📝 *Note:* ${order.deliveryNote}\n`;
  return msg;
};

export const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, orderType, items, customBouquet, deliveryNote } = req.body;

    // Upsert customer
    let customer;
    if (req.user) {
      customer = req.user;
      if (!customer.phone) {
        customer.phone = customerPhone;
        await customer.save();
      }
    } else {
      customer = await User.findOne({ phone: customerPhone });
      if (!customer) {
        customer = await User.create({ name: customerName, phone: customerPhone });
      }
    }

    let totalAmount = 0;
    let orderData = { customer: customer._id, customerName, customerPhone, orderType, deliveryNote };

    if (orderType === 'standard') {
      // Validate stock
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product || product.quantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product?.name || item.product}` });
        }
        totalAmount += product.price * item.quantity;
      }
      orderData.items = items;
    } else {
      // Custom bouquet
      let flowerCost = 0;
      for (const f of customBouquet.flowers) {
        const product = await Product.findById(f.product);
        if (!product || product.quantity < f.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product?.name}` });
        }
        flowerCost += product.price * f.quantity;
        f.pricePerStem = product.price;
        f.name = product.name;
      }
      const wrapper = await Product.findById(customBouquet.wrapper.product);
      const wrapperPrice = wrapper?.price || 0;
      totalAmount = flowerCost + wrapperPrice;
      orderData.customBouquet = {
        ...customBouquet,
        totalFlowerCost: flowerCost,
        wrapper: { ...customBouquet.wrapper, price: wrapperPrice, name: wrapper?.name, imageUrl: wrapper?.imageUrl },
      };
    }

    orderData.totalAmount = totalAmount;
    orderData.statusHistory = [{ status: 'pending', note: 'Order created' }];

    const order = await Order.create(orderData);

    // Deduct stock
    if (orderType === 'standard') {
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
      }
    } else {
      for (const f of customBouquet.flowers) {
        await Product.findByIdAndUpdate(f.product, { $inc: { quantity: -f.quantity } });
      }
    }

    const whatsappMessage = buildWhatsAppMessage(order);
    const whatsappPhone = process.env.ADMIN_WHATSAPP?.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    // Generate token for this customer
    const { default: jwt } = await import('jsonwebtoken');
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      order,
      whatsappMessage,
      whatsappUrl,
      webWhatsappUrl: `https://web.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}`,
      token,
      customerId: customer._id,
    });

    // Create notifications
    createNotification({
      recipient: customer._id,
      title: 'Order Placed! 🌸',
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been received and is being processed.`,
      type: 'order',
      link: '/profile'
    });

    notifyAdmins({
      title: 'New Order Received',
      message: `${customerName} placed a new order (#${order._id.toString().slice(-6).toUpperCase()}) for ${order.totalAmount.toFixed(2)}.`,
      type: 'order',
      link: '/admin'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate('customer', 'name phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();

    // Create notifications for status update
    createNotification({
      recipient: order.customer,
      title: 'Order Status Updated',
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} is now ${status.toUpperCase()}${note ? ': ' + note : ''}.`,
      type: 'status',
      link: '/profile'
    });

    notifyAdmins({
      title: 'Order Status Changed',
      message: `Order #${order._id.toString().slice(-6).toUpperCase()} was updated to ${status.toUpperCase()}.`,
      type: 'status',
      link: '/admin'
    });

    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};