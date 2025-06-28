const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../db/index.js');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();
const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    cnic_number,
    role,
    retypepassword,
    phone,
  } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      !retypepassword ||
      !cnic_number ||
      !role ||
      !phone
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== retypepassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const [userExists] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (userExists.length > 0) {
      return res
        .status(409)
        .json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const retypehashed = await bcrypt.hash(retypepassword, 10);

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, retypepassword, cnic_number, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, retypehashed, cnic_number, role]
    );

    res
      .status(201)
      .json({ message: 'User registered successfully', user: result.insertId });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [result] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ user_id: user.user_id }, 'abc123', {
      expiresIn: '1h',
    });

    const { password: _, retypepassword, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send({ message: 'id is required' });
    }

    const [result] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [
      id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];
    const { password, retypepassword, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT * FROM users`);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, cnic_number, role } = req.body;

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const [result] = await pool.query(
      `UPDATE users SET 
                username = COALESCE(?, username),
                email = COALESCE(?, email),
                password = COALESCE(?, password),
                cnic_number = COALESCE(?, cnic_number),
                role = COALESCE(?, role)
             WHERE user_id = ?`,
      [username, email, hashedPassword, cnic_number, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM users WHERE user_id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const sendForgotPasswordEmail = async (req, res) => {
//   const { recipientEmail } = req.body;
//   console.log(recipientEmail);
//   console.log('Processing forgot password request for:', recipientEmail);

//   try {
//     // Check if the user exists
//     const [userResult] = await pool.query(
//       `SELECT * FROM users WHERE email = ?`,
//       [recipientEmail]
//     );

//     if (userResult.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'User with this email does not exist',
//       });
//     }

//     const user = userResult[0];

//     // Generate a new random password
//     const newPassword = crypto.randomBytes(8).toString('hex'); // Generates a secure random 8-character password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password in the database
//     await pool.query(
//       `UPDATE users SET password = ?, retypepassword = ? WHERE email = ?`,
//       [hashedPassword, hashedPassword, recipientEmail]
//     );

//     console.log('Password updated successfully in the database.');

//     const emailHtmlContent = `
//       <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
//           <div style="max-width: 600px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//               <h2 style="color: #1a73e8; text-align: center;">Password Reset Successful</h2>
//               <p style="font-size: 16px; color: #333;">Hello ${user.username},</p>
//               <p style="font-size: 16px; color: #333;">Your password has been successfully reset. Below is your new password:</p>
//               <p style="font-size: 20px; font-weight: bold; color: #1a73e8; text-align: center; padding: 10px; background-color: #f1f1f1; border-radius: 5px;">
//                   ${newPassword}
//               </p>
//               <p style="font-size: 16px; color: #333;">Please use this password to log in and make sure to update it to something more secure as soon as possible.</p>
//               <p style="font-size: 16px; color: #333;">If you did not request this password reset, please contact us immediately.</p>
//               <p style="font-size: 16px; color: #333;">Best regards,</p>
//               <p style="font-size: 16px; color: #333;">The Lyari Team</p>
//           </div>
//       </div>
//     `;

//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.GOOGLE_APP_PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Lyari Support" <${process.env.EMAIL}>`,
//       to: recipientEmail,
//       subject: 'Password Reset Notification',
//       html: emailHtmlContent,
//     });

//     return res.status(200).json({
//       message: 'Password reset email sent successfully',
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error processing forgot password request:', error.message);
//     return { success: false, message: 'Server error. Please try again later.' };
//   }
// };

const sendForgotPasswordEmail = async (req, res) => {
  const { recipientEmail } = req.body;
  console.log('Processing forgot password request for:', recipientEmail);

  try {
    // Step 1: Check if the user exists
    const [userResult] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [recipientEmail]
    );

    if (userResult.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email does not exist',
      });
    }

    const user = userResult[0];

    // Step 2: Generate and hash new password
    const newPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 3: Update password in DB
    await pool.query(
      `UPDATE users SET password = ?, retypepassword = ? WHERE email = ?`,
      [hashedPassword, hashedPassword, recipientEmail]
    );
    console.log('Password updated successfully in the database.');

    // Step 4: Prepare email content
    const emailHtmlContent = `
      <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1a73e8; text-align: center;">Password Reset Successful</h2>
          <p>Hello ${user.username},</p>
          <p>Your password has been reset. Below is your new password:</p>
          <p style="font-size: 20px; font-weight: bold; color: #1a73e8; text-align: center; padding: 10px; background-color: #f1f1f1; border-radius: 5px;">
            ${newPassword}
          </p>
          <p>Please log in with this password and change it immediately.</p>
          <p>If you didn't request this, please contact us.</p>
          <p>– The Lyari Team</p>
        </div>
      </div>
    `;

    // Step 5: Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    // Step 6: Send email
    await transporter.sendMail({
      from: `"Lyari Support" <${process.env.EMAIL}>`,
      to: recipientEmail,
      subject: 'Password Reset Notification',
      html: emailHtmlContent,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    console.error('Error processing forgot password request:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  sendForgotPasswordEmail,
};