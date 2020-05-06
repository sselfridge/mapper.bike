import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import lightBlue from "@material-ui/core/colors/lightBlue";
import green from "@material-ui/core/colors/green";

import NewApp from "./NewApp";

const theme = createMuiTheme({
  overrides: {
    MuiTab: {
      // Name of the rule
      root: {
        // Some CSS
        // minWidth: 100,
        width: "50%",
        "@media (min-width: 0px)": {
          minWidth: 100,
        },
      },
    },
  },
  palette: {
    primary: lightBlue,
    secondary: green,
    background: "#aadaff",
  },
  status: {
    danger: "orange",
  },
});

const ThemedApp = () => {
  return (
    <ThemeProvider theme={theme}>
      <NewApp />
    </ThemeProvider>
  );
};

export default ThemedApp;
