const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");

const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
    });
    await newUser.save();

    // Generate JWT for auto-login
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendMail(
      email,
      "Welcome to RBAC System",
      `Hi ${username}, your account has been successfully created!`
    );

    // Send response with token
    res.status(201).json({
      message: `User registered with username: ${username}`,
      token, // <-- auto-login token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ${username} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOtp = await bcrypt.hash(otp, 10);

    //Save Otp & expiry in DB
    user.otp = hashOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    // Send OTP via email
    await sendMail(
      user.email,
      "Your Login OTP",
      `Hello ${user.username}, your OTP is ${otp}. It will expire in 5 minutes.`
    );

    // Create a temp token for OTP verification
    const tempToken = jwt.sign(
      { id: user._id, purpose: "OTP-Verification" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res
      .status(200)
      .json({ message: "OTP sent to your email. Please verify.", tempToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, tempToken } = req.body;

    if (!otp || !tempToken)
      return res.status(400).json({ message: "OTP and tempToken required" });

    // Verify tempToken
    let decoded
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "Temp token expired on Invalid" });
    }

    // Check purpose
    if (decoded.purpose !== "OTP-Verification") {
      return res.status(401).json({ message: "Invalid token purpose." });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.otp || !user.otpExpiry)
      return res
        .json(404)
        .json({ message: "No OTP found. Please login again." });

    // Check expiry
    if (user.otpExpiry < new Date()) {
      user.otp = null;
      user.otpExpiry = null;
      return res
        .status(404)
        .json({ message: "OTP expired , Please login again" });
    }

    // Compare OTP
    const isValid = await bcrypt.compare(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Clear OTP fields
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Issue final JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login Succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = { register, login, verifyOtp };
