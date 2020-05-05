import React, { useState, useEffect } from "react";
import config from "../../config/keys";

import MyMap from '../components/MyMap'

import {makeStyles} from '@material-ui/core'
const useStyles = makeStyles(theme =>({}))



const Board = props =>{

    const [activities, setActivities] = useState([]);



    return (
        <>
            
            <MyMap/>
        </>
    )
}


export default Board;