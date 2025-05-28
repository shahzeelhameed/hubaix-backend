const nodemailer = require("nodemailer");
const { authEmail, googleAppPassword } = require("../config");

const sendComplaintEmail = async (recipientEmail, authorEmail, information) => {
  console.log("info", recipientEmail, authorEmail, information);
  const {
    complaint_description,
    cnic_number,
    priority = "medium",
    status = "pending",
    created_at,
  } = information;

  // Create reusable transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: authEmail,
      pass: googleAppPassword,
    },
  });

  // Define email content for the recipient
  const recipientHtmlContent = `
        <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #1a73e8; text-align: center;">New Complaint Submitted</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">You have a new complaint submitted. Here are the details:</p>
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
                    <strong style="color: #333;">Created At:</strong> ${new Date(
                      created_at
                    ).toLocaleString()}
                </p>
                <p style="font-size: 16px; color: #333;">Thank you for your attention to this matter.</p>
                <p style="font-size: 16px; color: #333;">The Lyari  Team</p>
            </div>
        </div>
    `;

  // Define email content for the author
  const authorHtmlContent = `
        <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #000; text-align: center;">New Complaint Notification</h2>
                <p style="font-size: 16px; color: #333;">Dear Author,</p>
                <p style="font-size: 16px; color: #333;">A new complaint has been submitted by a user. Here are the details:</p>
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
                    <strong style="color: #333;">Created At:</strong> ${new Date(
                      created_at
                    ).toLocaleString()}
                </p>
                <p style="font-size: 16px; color: #333;">Please review the complaint at your earliest convenience.</p>
                <p style="font-size: 16px; color: #333;">Best regards,</p>
                <p style="font-size: 16px; color: #333;">The Lyari Team</p>
            </div>
        </div>
    `;

  // Send email to the recipient
  try {
    await transporter.sendMail({
      from: authEmail,
      to: recipientEmail,
      subject: "New Complaint Submitted",
      html: recipientHtmlContent,
    });
    console.log("Email sent to recipient successfully");
  } catch (error) {
    console.error("Error sending email to recipient:", error);
  }

  // Send email to the author
  try {
    await transporter.sendMail({
      from: authEmail,
      to: authorEmail,
      subject: "New Complaint Notification",
      html: authorHtmlContent,
    });
    console.log("Email sent to author successfully");
  } catch (error) {
    console.error("Error sending email to author:", error);
  }
};

module.exports = sendComplaintEmail;
