import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Typography, Box, Alert } from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import SeatAvailability from "./SeatAvailability";
const SeatReservationForm = () => {
  const [seatCount, setSeatCount] = useState("");
  const [reservedBy, setReservedBy] = useState("");
  const [error, setError] = useState("");
  const [availableSeatsCount, setAvailableSeatsCount] = useState(null);
  const [bookedSeatsCount, setBookedSeatsCount] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Yup schema for data validation
  const schema = Yup.object().shape({
    seatCount: Yup.number()
      .integer()
      .positive()
      .max(7, "User is not allowed to book more than 7 seats")
      .required("Please enter the number of seats"),
    reservedBy: Yup.string().required(
      "Please enter the name of the person reserving the seats"
    ),
  });

  useEffect(() => {
    // Fetching available seats count and booked seats count from the server
    const fetchSeatAvailability = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/availability"
        );
        setAvailableSeatsCount(response.data.availableSeatsCount);
        setBookedSeatsCount(response.data.bookedSeatsCount);
      } catch (error) {
        console.error("Error fetching seat availability:", error);
      }
    };

    fetchSeatAvailability();
  }, []);

  //It clears error message when seatCount changes
  useEffect(() => {
    setError("");
  }, [seatCount]);

  const handleSeatCountChange = (event) => {
    setSeatCount(event.target.value);
  };

  const handleReservedByChange = (event) => {
    setReservedBy(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validating input
      await schema.validate({ seatCount, reservedBy });

      // Checkiing if there are sufficient available seats
      if (availableSeatsCount < seatCount) {
        setErrorMessage("Insufficient seats available");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
        return;
      }

      // Make API request to reserve seats
      const response = await axios.post("http://localhost:5000/api/reserve", {
        numSeats: seatCount,
        bookedBy: reservedBy,
      });

      // Update seat availability
      setAvailableSeatsCount(availableSeatsCount - seatCount);
      setBookedSeatsCount(parseInt(bookedSeatsCount) + parseInt(seatCount));

      // Format the reserved seats for the alert
      const reservedSeatsFormatted = response.data.reservedSeats
        .map((seat) => `${7 * (seat.rowNumber - 1) + seat.seatNumber}`)
        .join(", ");

      setSuccessMessage(`Reserved Seat Numbers: ${reservedSeatsFormatted}`);
      setSeatCount("");
      setReservedBy("");

      // to clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        setError(validationError.message);
      } else {
        console.error("Error reserving seats:", validationError);
        setError("An error occurred while reserving seats. Please try again.");
      }
    }
  };

  return (
    <Grid
      container
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      sx={{
        py: "1%",
      }}
    >
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <SeatAvailability availableSeatsCount={availableSeatsCount} bookedSeatsCount={bookedSeatsCount}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ py: "0.5%", display: "flex", justifyContent: "center" }}
        >
          {successMessage && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error">
              {errorMessage}
            </Alert>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ py: "3%", display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              borderRadius: "10px",
              padding: "20px",
              border: "2px solid #ccc",
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "black",
            }}
          >
            <Box
              sx={{
                borderRadius: "10px",
                padding: "20px",
                border: "2px solid #ccc",
                width: "80%",
                my: "4%",
                bgcolor: "white",
              }}
            >
              <Typography variant="h6" textAlign={"center"}>
                Total Seats: 80
              </Typography>
            </Box>
            <Box
              sx={{
                borderRadius: "10px",
                padding: "20px",
                border: "2px solid #ccc",
                width: "80%",
                my: "4%",
                bgcolor: "white",
              }}
            >
              <Typography variant="h6" textAlign={"center"}>
                Booked Seats: {bookedSeatsCount}
              </Typography>
            </Box>
            <Box
              sx={{
                borderRadius: "10px",
                padding: "20px",
                border: "2px solid #ccc",
                width: "80%",
                my: "4%",
                bgcolor: "white",
              }}
            >
              <Typography variant="h6" textAlign={"center"}>
                Available Seats: {availableSeatsCount}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ textAlign: "center" }}
        >
          <TextField
            className="seatsToReserve"
            id="outlined-basic"
            type="number"
            label="Seats to Reserve"
            variant="outlined"
            value={seatCount}
            onChange={handleSeatCountChange}
            inputProps={{ min: "0" }}
            error={!!error}
            helperText={error}
            sx={{ width: "50%", my: "2%" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ textAlign: "center" }}
        >
          <TextField
            className="reservedBy"
            id="outlined-basic"
            type="string"
            label="Reserved By"
            variant="outlined"
            value={reservedBy}
            onChange={handleReservedByChange}
            sx={{ width: "50%", my: "2%" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ textAlign: "center" }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!seatCount || !reservedBy}
            sx={{ my: "0.6%" }}
          >
            Book
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SeatReservationForm;
