const cors = require('cors');

const express = require('express');
const app = express();

// CORS middleware
app.use(cors());

// Health route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Other routes go here

module.exports = app;