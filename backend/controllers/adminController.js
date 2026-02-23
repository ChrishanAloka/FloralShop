import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalProducts, totalCustomers, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name phone'),
    ]);

    // Revenue
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: revenueData[0]?.total || 0,
      recentOrders,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};