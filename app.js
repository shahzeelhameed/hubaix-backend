const express = require("express");
const db = require("./db/index.js");
const bodyParser = require("body-parser");
// const apiRoutes = require('./routes/apiRoutes');
const cors = require("cors"); // Import the cors middleware
const userRoutes = require("./routes/userRoutes.js");
const complaintsRoutes = require("./routes/complaint.js");
const paymentController = require("./controller/payment.js");
const seedUser = require("./seedUser.js");

const app = express();
app.use(cors()); // Enable CORS for all routes

// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

app.use("/", userRoutes);
app.use("/complaints", complaintsRoutes);
app.post("/make-payment", paymentController.makePayment);
app.post("/save-payment", paymentController.savePayment);
app.get("/get-payments", paymentController.getPayments);
// Mount the API routes

// app.use('/api', apiRoutes);

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
