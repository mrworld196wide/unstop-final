const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/reserve', reservationController.reserveSeats);
router.get('/availability', reservationController.countSeats);
router.get('/seats', reservationController.getAllSeats);

module.exports = router;
