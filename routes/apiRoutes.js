// const express = require('express');
// const db = require('../db/index.js');
// const transporter = require('../emailSender.js');
// const router = express.Router();
// const jwt = require('jsonwebtoken');

// // Function to generate a JWT token
// const generateToken = (user) => {
//   return jwt.sign({ email: user.email }, 'absbsbsbdjd', { expiresIn: '1h' }); // Replace 'your-secret-key' with an actual secret key
// };
// // GET endpoint to retrieve users from the database and send them as JSON
// router.get('/users', (req, res) => {
//   const query = 'SELECT UserID, Name, Email FROM user';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching users:', err);
//       res.status(500).json({ error: 'Failed to fetch users' });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });
// router.get('/complaint', (req, res) => {

//   const query = 'SELECT * FROM Complaints WHERE Stat = "pending"';
//   db.query(query, (err, results) => {
//     if (err) throw err;
//     else {
//       console.log("gut")
//       res.status(200).json(results);
//     }
//   });
// });
// router.get('/complaints/approved', (req, res) => {
//   const query = 'SELECT * FROM Complaints WHERE Stat = "approved"';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching approved complaints:', err);
//       res.status(500).json({ error: 'Failed to fetch approved complaints' });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

// // Endpoint to fetch rejected complaints
// router.get('/complaints/rejected', (req, res) => {
//   const query = 'SELECT * FROM Complaints WHERE Stat = "rejected"';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching rejected complaints:', err);
//       res.status(500).json({ error: 'Failed to fetch rejected complaints' });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });
// router.post('/stat', (req, res) => {
//   const { string1, string2 } = req.body;
//   const query = 'UPDATE complaints SET Stat = ? WHERE CNIC = ?;';

//   db.query(query, [string1, string2], (err, results) => {
//     if (err) {
//       console.error('Error updating complaints:', err);
//       res.status(500).json({ error: 'Failed to update complaints' });
//     } else {

//       res.status(200).json(results);
//     }
//   });
// });

// router.post('/img', (req, res) => {
//   try {
//     const { image } = req.body;

//     // Assuming 'images' is the name of the column in your table to store images
//     const query = 'UPDATE complaints SET images = ? WHERE user = "admin";';

//     db.query(query, [image], (err, results) => {
//       if (err) {
//         console.error('Error updating image:', err);
//         res.status(500).json({ error: 'Failed to update image' });
//       } else {
//         res.status(200).json(results);
//       }
//     });
//   } catch (error) {
//     console.error('Error processing image upload:', error);
//     res.status(500).json({ error: 'Failed to process image upload' });
//   }
// });

// //Server Side Login Command
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Ensure that email and password are provided
//   if (!email || !password) {
//     return res.status(403).json({ error: 'Email and password are required' });
//   }

//   try {
//     // Check user credentials in the database
//     const query = 'SELECT * FROM users WHERE user = ? AND password = ?';

//     // Use a promise-based approach for the database query
//     const results = await new Promise((resolve, reject) => {
//       db.query(query, [email, password], (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     if (results.length > 0) {
//       // User credentials are valid
//       const user = results[0];
//       const token = generateToken(user); // Generate JWT token

//       // Send the token in the response body
//       res.status(201).json({ message: 'Login successful', token });
//     } else {
//       res.status(401).json({ error: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Failed to process login' });
//   }
// });

// // GET endpoint to retrieve users from the database and send them as JSON
// router.post('/users/email', (req, res) => {

//   const { email } = req.body;
//   console.log(email);

//   const query = `SELECT * FROM users WHERE email = '${email}'`;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching users:', err);
//       res.status(500).json({ error: 'Failed to fetch users' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// router.delete('/delete', (req, res) => {
//   const { email } = req.body;
//   console.log('Deleting user with email:', email);

//   const deleteQuery = `DELETE FROM user WHERE email = '${email}'`;

//   db.query(deleteQuery, (err, result) => {
//     if (err) {
//       console.error('Error deleting user:', err);
//       res.status(500).json({ error: 'Failed to delete user' });
//     } else {
//       // Check if any rows were affected (if no user with the given email was found)
//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: 'User not found' });
//       } else {
//         res.json({ message: 'User deleted successfully' });
//       }
//     }
//   });
// });

// router.post('/users/userinfo', (req, res) => {
//   const { email } = req.body; // Extract the email from the request body

//   // Check if the email is provided
//   if (!email) {
//     return res.status(400).json({ error: 'Email is required in the request body' });
//   }

//   const query = 'SELECT * FROM userinfo WHERE userEmail = ?'; // SQL query to select data for the given email

//   // Execute the query with the email parameter
//   db.query(query, [email], (err, results) => {
//     if (err) {
//       console.error('Error fetching user info:', err);
//       res.status(500).json({ error: 'Failed to fetch user info' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// router.get('/hello', (req, res) => {
//   res.json({ message: 'Hello, World!' });
// });

// module.exports = router;
