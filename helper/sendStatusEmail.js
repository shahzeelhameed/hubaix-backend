const nodemailer = require('nodemailer');
const { authEmail, googleAppPassword } = require('../config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: authEmail,
        pass: googleAppPassword,
    },
});

const sendStatusUpdateEmail = async (recipientEmail, complaintInfo) => {
    const { complaint_description, cnic_number, priority, status, created_at } = complaintInfo;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #1a73e8; text-align: center;">Your Complaint Status</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">We wanted to inform you that the status of your complaint has been ${status === "approved" ? "Approved Congruatlation" : "Rejected for the some reason"}. Here are the details in your complain</p>
                <p style="margin: 10px 0; padding: 10px; border-left: 5px solid #1a73e8; background-color: #f1f1f1;">
                    <strong style="color: #333;">Complaint Description:</strong> ${complaint_description}
                </p>
                <p style="margin: 10px 0; padding: 10px; border-left: 5px solid #1a73e8; background-color: #f1f1f1;">
                    <strong style="color: #333;">CNIC Number:</strong> ${cnic_number}
                </p>
                <p style="margin: 10px 0; padding: 10px; border-left: 5px solid #1a73e8; background-color: #f1f1f1;">
                    <strong style="color: #333;">Priority:</strong> ${priority}
                </p>
                <p style="margin: 10px 0; padding: 10px; border-left: 5px solid #1a73e8; background-color: #f1f1f1;">
                    <strong style="color: #333;">Status:</strong> ${status}
                </p>
                <p style="margin: 10px 0; padding: 10px; border-left: 5px solid #1a73e8; background-color: #f1f1f1;">
                    <strong style="color: #333;">Created At:</strong> ${new Date(created_at).toLocaleString()}
                </p>
                <p style="font-size: 16px; color: #333;">If you have any questions or need further assistance, please contact us.</p>
                <p style="font-size: 16px; color: #333;">Thank you!</p>
                <p style="font-size: 16px; color: #333;">The Lyari Team</p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: authEmail,
        to: recipientEmail,
        subject: 'Your Complaint Status',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Status update email sent successfully');
    } catch (error) {
        console.error('Error sending status update email:', error);
    }
};

module.exports = sendStatusUpdateEmail
