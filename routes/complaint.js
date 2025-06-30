const express = require('express');
const complaintsRoutes = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  deleteComplaint,
  updateComplaintStatus,
  getComplaintsByUsername,
} = require('../controller/complaint.js');

complaintsRoutes.post('/api/create-complaint', createComplaint);

// Route to get all complaints
complaintsRoutes.get('/getAllComplaints', getAllComplaints);

// Route to get a specific complaint by ID
complaintsRoutes.get('/getComplaint/:id', getComplaintById); // filter the complain by user_id , id which is passed is userID;

// Route to delete a complaint by ID
complaintsRoutes.delete('/delete-complaint/:id', deleteComplaint);

// Route to update the status of a complaint (approve/reject)
complaintsRoutes.put('/:id/status', updateComplaintStatus);

// Route to get complaints by username
complaintsRoutes.get('/user/:username', getComplaintsByUsername);

module.exports = complaintsRoutes;
