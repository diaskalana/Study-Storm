const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const feedbackRoutes = require('./Routes/FeedbackRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register the authentication routes
app.use('/feedback', feedbackRoutes);

module.exports = app;