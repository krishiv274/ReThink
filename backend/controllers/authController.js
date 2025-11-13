import User from "../models/User.js";
import { clearAuthCookieOptions, authCookieOptions } from '../utils/cookieOptions.js';
import generateToken from '../utils/generateToken.js';

// SIGNUP
const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json("All fields are require!");
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" })
        };

        const newUser = await User.create({ name, username, email, password });

        // Generate JWT
        const token = generateToken(newUser.id);
        res.cookie("token", token, authCookieOptions);

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (err) {
        console.error("Error signing up!", err);
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Please provide username/email and password" });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = generateToken(user._id);
        res.cookie("token", token, authCookieOptions);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGOUT
const logout = (req, res) => {
    res.clearCookie("token", clearAuthCookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
};

// GET PROFILE (Protected Route)
const getProfile = async (req, res) => {
    try {
        // req.user is set in authMiddleware
        if (!req.user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: req.user._id,
                name: req.user.name,
                username: req.user.username,
                email: req.user.email,
                rethinkPoints: req.user.rethinkPoints,
                createdAt: req.user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { signup, login, logout, getProfile }; 