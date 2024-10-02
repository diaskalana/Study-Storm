const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const notificationRoutes = require("./src/routes/notificationRoutes");
dotenv.config();

const transporter = require('./src/services/emailService');
const { sendMail } = require('./src/controllers/notificationController');

const app = express();
const PORT = process.env.PORT ||4000;


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error:", err));

app.use(express.json());

app.use("/", notificationRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js server is running on port ${PORT}`);
});
