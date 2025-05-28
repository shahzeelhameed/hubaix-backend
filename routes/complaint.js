const express = require('express');
const complaintsRoutes = express.Router();
const {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    deleteComplaint,
    updateComplaintStatus,
    getComplaintsByUsername
} = require('../controller/complaint.js');

complaintsRoutes.post('/', createComplaint);

// Route to get all complaints
complaintsRoutes.get('/', getAllComplaints);

// Route to get a specific complaint by ID
complaintsRoutes.get('/:id', getComplaintById);

// Route to delete a complaint by ID
complaintsRoutes.delete('/:id', deleteComplaint);

// Route to update the status of a complaint (approve/reject)
complaintsRoutes.put('/:id/status', updateComplaintStatus);

// Route to get complaints by username
complaintsRoutes.get('/user/:username', getComplaintsByUsername);
    
module.exports = complaintsRoutes;
