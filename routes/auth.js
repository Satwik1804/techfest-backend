import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import User from "../admin/user.js";
import { body, validationResult } from 'express-validator';


dotenv.config()

const router = express.Router();

router.post("/createAdmin", [
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
body('email', "Enter a valid email").isEmail()], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const numberOfRows = await User.countDocuments();

    if (numberOfRows > 0) {
      return res.status(400).send("Admin already exists, Login");
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    req.body.password = await bcrypt.hash(req.body.password, salt)
    const user = new User(req.body);
    await user.save();
    res.send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.SECRET_EMAIL, 
      pass: process.env.SECRET_PASSWORD 
  }
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const mailOptions = {
      from: process.env.SECRET_EMAIL, 
      to: email, 
      subject: 'Forgot Password', 
      text: 'Please reset your password using the link provided in the email.' 
  };

  
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.error('Error occurred:', error.message);
          res.status(500).send('Failed to send email');
      } else {
          console.log('Email sent successfully!');
          console.log('Message ID:', info.messageId);
          res.send('Email sent successfully!');
      }
  });
});

router.post("/login", [
  body('email', "Enter a valid email").isEmail()
], async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const { _id, username, email: userEmail } = user;
    res.json({ success: true, username, email: userEmail });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
  

export default router;