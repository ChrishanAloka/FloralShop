import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.isAvailable = available === 'true';
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get wrappers (for custom bouquet builder)
export const getWrappers = async (req, res) => {
  try {
    const wrappers = await Product.find({ category: 'bouquet-wrappers', isAvailable: true });
    res.json(wrappers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get fresh flowers (for custom bouquet builder)
export const getFreshFlowers = async (req, res) => {
  try {
    const flowers = await Product.find({ category: 'fresh-flowers', isAvailable: true });
    res.json(flowers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};