const pool = require('../db/index.js');
const sendComplaintEmail = require('../helper/sendEmail.js');
const sendStatusUpdateEmail = require('../helper/sendStatusEmail.js');

const createComplaint = async (req, res) => {
  const {
    user_id,
    complaint_description,
    cnic_number,
    priority,
    created_by,
    author_email,
  } = req.body;

  // Validate required fields
  if (!user_id || !complaint_description || !cnic_number || !created_by) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const [userResult] = await pool.query(
      'SELECT email FROM users WHERE user_id = ?',
      [user_id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = userResult[0].email;

    const [result] = await pool.query(
      `INSERT INTO complaints (created_by, user_id, complaint_description, cnic_number, priority)
             VALUES (?, ?, ?, ?, ?)`,
      [
        created_by,
        user_id,
        complaint_description,
        cnic_number,
        priority || 'medium',
      ]
    );

    const newComplaint = {
      complaint_id: result.insertId,
      created_by,
      user_id,
      complaint_description,
      cnic_number,
      priority: priority || 'medium',
    };

    await sendComplaintEmail(userEmail, author_email, newComplaint);

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT * FROM complaints ORDER BY created_at DESC`
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `SELECT * FROM complaints WHERE user_id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM complaints WHERE complaint_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE complaints
             SET status = ?, resolved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE complaint_id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const [updatedComplaint] = await pool.query(
      `SELECT * FROM complaints WHERE complaint_id = ?`,
      [id]
    );
    const user_id = updatedComplaint[0].user_id;

    const [userResult] = await pool.query(
      'SELECT email FROM users WHERE user_id = ?',
      [user_id]
    );
    const userEmail = userResult[0].email;

    await sendStatusUpdateEmail(userEmail, updatedComplaint[0]);

    res.status(200).json({
      message: `Complaint ${status} successfully`,
      complaint: updatedComplaint[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const [userResult] = await pool.query(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_id = userResult[0].user_id;

    // Then, get complaints by user_id
    const [result] = await pool.query(
      `SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  deleteComplaint,
  updateComplaintStatus,
  getComplaintsByUsername,
};
