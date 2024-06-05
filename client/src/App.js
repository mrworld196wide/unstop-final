import React from "react";
import "./App.css";
import SeatAvailability from "./components/SeatAvailability";
import SeatReservationForm from "./components/SeatReservationForm";
import { Grid } from "@mui/material";

function App() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <SeatAvailability />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <SeatReservationForm />
      </Grid>
    </Grid>
  );
}

export default App;
