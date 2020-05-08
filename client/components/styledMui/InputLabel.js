import React from 'react'
import {  withStyles} from "@material-ui/core/styles";
import {InputLabel as MuiInputLabel } from '@material-ui/core'


const InputLabel = withStyles((theme) => ({
    root: {
      margin: theme.spacing(0, 0, 1),
    },
  }))(MuiInputLabel);

  export default InputLabel;