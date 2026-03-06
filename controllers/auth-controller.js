const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//register
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const checkUserExist = await User.findOne({ $or: [{ email }, { username }] });
    if (checkUserExist) {
      return res.status(400).json({
        success: false,
        message: 'User with the same email or username already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    await newUser.save();
    if (newUser) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to register user'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
}
const loginUser = async (req, res) => {
  try {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  const token = jwt.sign({ id: user._id, role: user.role, username: user.username,email: user.email, }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: token
    }
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: 'Failed to login user',
    error: error.message
    });
  }
}
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;  
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};




module.exports = {
  registerUser,
  loginUser,
  changePassword
}