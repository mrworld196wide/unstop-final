import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";

const SeatAvailability = () => {
  const [seatsData, setSeatsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/seats");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSeatsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid
      container
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      sx={{ py: "2%", display: "flex", justifyContent: "center", mt: "4.5%" }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          py: "1%",
          border: "3px solid #000000",
          width: "360px", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {[...Array(12)].map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {[...Array(rowIndex === 11 ? 3 : 7)].map((_, seatIndex) => {
              const seatNumber = rowIndex * 7 + seatIndex + 1;
              const seatData = seatsData.find(
                (seat) => seat.CoachPosition === seatNumber
              );
              const backgroundColor = seatData?.isReserved
                ? "#C63541"
                : "#b5e550";

              return (
                <Box
                  key={seatIndex}
                  sx={{
                    borderRadius: "10px",
                    padding: "10px",
                    border: "2px solid #ccc",
                    m: "1%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "25px",
                    height: "20px",
                    backgroundColor,
                  }}
                >
                  <Typography sx={{ my: "2%" }}>{seatNumber}</Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default SeatAvailability;
