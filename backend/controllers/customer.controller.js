import bcrypt from 'bcryptjs';
import Customer from '../models/customer.model.js';
import generateToken from '../utils/generateToken.js';

// Cookie options - shared
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// -----------------------------------------------------------
// @desc    Register a new customer
// @route   POST /customers/register
// @access  Public
// -----------------------------------------------------------
export const registerCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // 1. Validate all fields are present
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // 2. Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        // 3. Check duplicate email
        const existing = await Customer.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // 4. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create customer
        const customer = await Customer.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
        });

        // 6. Send response (never send password)
        return res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during registration',
        });
    }
};

// -----------------------------------------------------------
// @desc    Login customer
// @route   POST /customers/login
// @access  Public
// -----------------------------------------------------------
export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // 1. Find customer (include password for comparison)
        const customer = await Customer.findOne({ email: email.toLowerCase() });

        // 2. Compare credentials - do NOT reveal which one failed
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // 3. Generate JWT
        const token = generateToken(customer._id);

        // 4. Store in HttpOnly cookie
        res.cookie('token', token, cookieOptions);

        // 5. Respond
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get current customer profile
// @route   GET /customers/me
// @access  Protected
// -----------------------------------------------------------
export const getMyProfile = async (req, res) => {
    // req.user was attached by `protect` middleware
    return res.status(200).json({
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        createdAt: req.user.createdAt,
    });
};

// -----------------------------------------------------------
// @desc    Logout customer
// @route   POST /customers/logout
// @access  Protected
// -----------------------------------------------------------
export const logoutCustomer = async (req, res) => {
    res.cookie('token', '', {
        ...cookieOptions,
        maxAge: 0,
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

// -----------------------------------------------------------
// @desc    Change password (BONUS)
// @route   PATCH /customers/change-password
// @access  Protected
// -----------------------------------------------------------
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old and new password are required',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters',
            });
        }

        // Fetch customer WITH password
        const customer = await Customer.findById(req.user._id);

        const isMatch = await bcrypt.compare(oldPassword, customer.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Old password is incorrect',
            });
        }

        customer.password = await bcrypt.hash(newPassword, 10);
        await customer.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
