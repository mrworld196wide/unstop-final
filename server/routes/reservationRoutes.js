// backend/routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Route to handle seat reservation
router.post('/reserve', reservationController.reserveSeats);

module.exports = router;
