const transporter = require('../services/emailService');
const Notification = require('../models/notificationModel');
const sendSMS = require('../services/smsService');

exports.sendNotification = async (req, res) => {
  const notifications = req.body.notifications; // Array of notifications
  try {
    // Use Promise.all to send emails concurrently
    await Promise.all(notifications.map(async (notification) => {
      const { email, message } = notification;

      // Send email
      await transporter.sendMail({
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Notification',
        text: message,
      });

      // Save notification to MongoDB
      await Notification.create({ email, message });
    }));

    res.status(200).send('Notifications sent and saved.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while sending the notifications.');
  }
};

exports.getNotifications = async (req, res) => {
  const { email } = req.query;
  try {
    const notifications = await Notification.find({ email});
    res.status(200).json(notifications);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching the notifications.');
  }
}

exports.sendSMSNotification = async (req, res) => {
  const {numbers, message} = req.body; // numbers = [0715886675]  ||  numbers = [0715886675, 0346774384,...]        message = "Hello, this is a test message."

  // Call the sendSMS function from smsService.js
  sendSMS(numbers, message);
}

exports.sendOtpEmail = async (req, res) => {
  const mailBody = req.body; // Assuming the request body contains mail details
  sendMail(mailBody);
  res.send('Email sent successfully');
}


const sendMail = async (mailBody) => {
  try {
      // Send mail with defined transport object
      await transporter.sendMail({
          from: 'avishkatest123@gmail.com',
          to: mailBody.to,
          subject: mailBody.subject,
          text: mailBody.text
      });
      console.log('Mail sent successfully');
  } catch (error) {
      console.error('Error sending mail:', error);
  }
};


