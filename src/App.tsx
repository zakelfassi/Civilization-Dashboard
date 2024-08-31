import React from "react";
import CivilizationDashboard from "./components/CivilizationDashboard";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CivilizationDashboard />
    </ThemeProvider>
  );
}

export default App;
