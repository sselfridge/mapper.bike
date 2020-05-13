import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { lightBlue, green } from "@material-ui/core/colors/";

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
    MuiListItem: {
      root: {
        paddingBottom: 0,
      },
    },
    MuiListItemText: {
      multiline: {
        marginTop: 0,
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        "&$expanded": {
          minHeight: 40,
        },
      },
      content: {
        "&$expanded": {
          margin: 0,
        },
      },
    },

    MuiExpansionPanelDetails: {
      root: {
        padding: 0,
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
    strava: "#FC4C02",
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
