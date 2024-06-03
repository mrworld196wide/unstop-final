const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  rowNumber: { type: Number, required: true },
  seatNumber: { type: Number, required: true },
  isReserved: { type: Boolean, default: false },
  // to identify who has reserved the seat
  bookedBy: { type: String, default: null } 
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;