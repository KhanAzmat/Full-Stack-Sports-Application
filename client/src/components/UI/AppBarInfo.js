import React from "react";
import {connect} from  'react-redux'
import { Typography} from "@mui/material";


const AppBarInfo =(props)=>{

    return(
<>
               <Typography variant='body2' >
                {props.floor?"Floor : " + props.floor : "Please Select a floor from floor menu-->"}
               </Typography>
                
                
               
               <Typography variant='body2' style={{marginLeft:4}}>
                 {props.floor && props.numberOfGeofence?"Geofences: " + props.numberOfGeofence:null}
                </Typography>
</>
    )
}

const mapStateToProps = (state) => ({
    
    floor : state.floorplan.currentFloorNumber,
    numberOfGeofence : state.geofence.numberOfGeofence
  });

export default connect(mapStateToProps,null)(AppBarInfo)




