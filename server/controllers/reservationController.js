const Seat = require("../models/Seat");

const reserveSeats = async (req, res) => {
  const { numSeats, bookedBy } = req.body;
  //checking if the number of seats is more than 7 or not
  if (numSeats > 7) {
    return res
      .status(400)
      .json({ error: "Cannot reserve more than 7 seats at a time" });
  }
  try {
    // Checking the total number of available seats
    const availableSeatsCount = await Seat.countDocuments({
      isReserved: false,
    });
    //Checking  if available seats is less than number of seats to be booked
    if (availableSeatsCount < numSeats) {
      return res
        .status(400)
        .json({
          error: `Only ${availableSeatsCount} seats available, cannot reserve ${numSeats} seats`,
        });
    }

    let reservedSeats = [];

    // Finding rows with available seats and their counts
    const rows = await Seat.aggregate([
      { $match: { isReserved: false } },
      {
        $group: {
          _id: "$rowNumber",
          seats: { $push: { _id: "$_id", seatNumber: "$seatNumber" } },
          count: { $sum: 1 },
        },
      },
      // Sort rows by rowNumber
      { $sort: { _id: 1 } },
    ]);

    // Trying to reserve seats in one row if possible
    for (const row of rows) {
      if (row.count >= numSeats) {
        const seatIds = row.seats.slice(0, numSeats).map((seat) => seat._id);
        reservedSeats = seatIds;
        break;
      }
    }
    // If not enough seats in one row, reserve available seats
    if (reservedSeats.length === 0) {
      const availableSeats = await Seat.find({ isReserved: false }).limit(
        numSeats
      );
      reservedSeats = availableSeats.map((seat) => seat._id);
    }
    // Fetching the reserved seat details for logging
    const reservedSeatDetails = await Seat.find({
      _id: { $in: reservedSeats },
    });

    // Updating reserved seats in the database
    await Seat.updateMany(
      { _id: { $in: reservedSeats } },
      { isReserved: true, bookedBy }
    );

    // Logging the reserved seats
    reservedSeatDetails.forEach((seat) => {
      console.log(`Reserved Row: ${seat.rowNumber}, Seat: ${seat.seatNumber}`);
    });

    res.json({
      success: true,
      reservedSeats: reservedSeatDetails.map((seat) => ({
        rowNumber: seat.rowNumber,
        seatNumber: seat.seatNumber,
      })),
    });
  } catch (error) {
    console.error("Error reserving seats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const countSeats = async (req, res) => {
  // Getting the count of available and booked seats
  try {
    const availableSeatsCount = await Seat.countDocuments({
      isReserved: false,
    });
    const bookedSeatsCount = await Seat.countDocuments({ isReserved: true });
    res.json({
      availableSeatsCount,
      bookedSeatsCount,
    });
  } catch (error) {
    console.error("Error counting seats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllSeats = async (req, res) => {
  // Getting all the seats and there isReserved value
  try {
    const seats = await Seat.find();

    // Calculating actual seat position and adding isReserved property
    const seatsWithPosition = seats.map(seat => ({
      CoachPosition: (7 * (seat.rowNumber - 1)) + seat.seatNumber,
      isReserved: seat.isReserved
    }));

    res.json(seatsWithPosition);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  reserveSeats,
  countSeats,
  getAllSeats
};
