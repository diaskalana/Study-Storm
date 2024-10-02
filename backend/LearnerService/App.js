const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const learnerRoutes = require('./Routes/learnerRoutes');
const progressRoutes = require('./Routes/progressRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register the authentication routes
app.use('/enrollment', learnerRoutes);
app.use('/progress', progressRoutes);

module.exports = app;