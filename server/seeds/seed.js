if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const mongoose = require('mongoose');
const Seat = require('../models/Seat');

const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedSeats = async () => {
  try {
    // Clear existing seats
    await Seat.deleteMany();

    // Seeding 80 seats: 11 rows of 7 seats and the last row of 3 seats
    const seats = [];
    for (let row = 1; row <= 12; row++) {
      let seatsInRow = row === 12 ? 3 : 7;
      for (let seat = 1; seat <= seatsInRow; seat++) {
        seats.push({ rowNumber: row, seatNumber: seat });
      }
    }

    await Seat.insertMany(seats);
    console.log('Database seeded with seats');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedSeats();
