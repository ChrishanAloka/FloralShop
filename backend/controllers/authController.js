import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
// Verifies Google ID token, upserts user, returns our JWT
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Google credential required' });

    // Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find by googleId first, then by email (in case they registered via phone before)
    let user = await User.findOne({ googleId });
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (user) {
      // Update Google info if missing
      if (!user.googleId) { user.googleId = googleId; user.avatar = picture; await user.save(); }
    } else {
      // New user via Google — phone will be null until they place an order
      user = await User.create({ name, email: email?.toLowerCase(), googleId, avatar: picture });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, role: user.role },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// POST /api/auth/register-customer
// Called when a customer places an order or signs up manually
export const registerCustomer = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || (!phone && !email)) {
      return res.status(400).json({ message: 'Name and either Phone or Email are required' });
    }

    // Check if user already exists by phone or email
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) return res.status(400).json({ message: 'Phone number already registered. Please login instead.' });
    }
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) return res.status(400).json({ message: 'Email already registered. Please login instead.' });
    }

    const user = await User.create({ name, phone, email: email?.toLowerCase(), password });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/admin-login
export const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone, role: 'admin' });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, phone: req.user.phone, email: req.user.email, avatar: req.user.avatar, role: req.user.role } });
};

// POST /api/auth/customer-login (by phone or email)
export const customerLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be phone or email
    if (!identifier) return res.status(400).json({ message: 'Phone or email required' });

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier.toLowerCase() }],
      role: 'customer'
    });

    if (!user) return res.status(404).json({ message: 'No account found with this phone or email' });

    // If user has a password, verify it
    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: 'This account requires a password to login' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
    } else if (password) {
      // If user provided a password but hasn't set one yet, we could either error or allow login and set it.
      // For now, let's just allow login if no password exists (legacy users or checkout-registered).
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone) {
      const existing = await User.findOne({ phone, _id: { $ne: user._id } });
      if (existing) return res.status(400).json({ message: 'Phone number already in use' });
      user.phone = phone;
    }

    await user.save();
    res.json({ user: { id: user._id, name: user.name, phone: user.phone, email: user.email, avatar: user.avatar, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};