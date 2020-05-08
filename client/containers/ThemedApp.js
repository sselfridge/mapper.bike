import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import lightBlue from "@material-ui/core/colors/lightBlue";
import green from "@material-ui/core/colors/green";

import NewApp from "./NewApp";


const theme = createMuiTheme({
  overrides: {
    MuiTab: {
      root: {
        width: "50%",
        "@media (min-width: 0px)": {
          minWidth: 100,
        },
      },
    },
  },
  // typography:{
  //   fontFamily: ['Arial', 'Helvetica', 'sans-serif']
  // },
  palette: {
    primary: lightBlue,
    secondary: green,
    background: "#aadaff",
  },
  status: {
    danger: "orange",
  },
});

theme.shape.borderRadius = theme.spacing(1.2);

const ThemedApp = () => {
  return (
    <ThemeProvider theme={theme}>
      <NewApp />
    </ThemeProvider>
  );
};

export default ThemedApp;
