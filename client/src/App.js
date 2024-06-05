import React from "react";
import "./App.css";

import SeatReservationForm from "./components/SeatReservationForm";
import { Grid } from "@mui/material";

function App() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <SeatReservationForm />
      </Grid>
    </Grid>
  );
}

export default App;
