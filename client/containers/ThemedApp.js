import React from "react";
import { ThemeProvider,createMuiTheme } from "@material-ui/core/styles";
import NewApp from './NewApp'

import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});
const ThemedApp = (props) => {
  return (
    <ThemeProvider>
      <NewApp />
    </ThemeProvider>
  );
};

export default ThemedApp;
