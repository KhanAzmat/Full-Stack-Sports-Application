

//This file defines asysnc actions geofence 

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";
import { setGeofenceAddStatus } from "./geofenceSlice";




export const addGeofence = createAsyncThunk("geofence/addGeofence",
 
  async(formData,{dispatch,rejectWithValue})=>{
     console.log("Adding geofence",formData)
    try {
        const res = await axios.post("/api/geoFence", formData);
       
        /*dispatch({
          type: types.ADD_GEOFENCE,
          payload: res.data,
        });*/

        
        
        // history.push("/Geofence");
        dispatch(setGeofenceAddStatus(1))
        dispatch(setAlerts("Geofence Added", "success", true))
        //dispatch(getGeofences());
        console.log("Geofence added")
        return true
      } catch (err) {
        const errors = err.response
        console.log(err)
        console.log(errors.data);
        if(errors.status===406){

          switch(errors.data["message"]){
            
            case "intersects":
              dispatch(setAlerts("Current geofence intersects with other fence","error",true))
            break;
            case "not in location":
              dispatch(setAlerts("Monitor geofence must be within a Location geofence","error",true))
            break;
            case "invalid geofence type":
              dispatch(setAlerts("Invalid geofence type","error",true))
            break;
            default:
              dispatch(setAlerts("Can't create geofence!","error",true))

          }
          
         
          
          return rejectWithValue({status : errors.data["message"]})
    
        } 
        else{
          dispatch(setAlerts(`Internal server error`,"error",true))
        }
        dispatch(setGeofenceAddStatus(2))
        return rejectWithValue({status : "error"})
       
      }
         

  }


)


export const deleteGeoDB = createAsyncThunk("geofence/deleteGeoDB",
           async(id,{dispatch,rejectWithValue})=>{
            try {
                await axios.delete(`/api/geoFence/${id}`);
                /*dispatch({
                  type: types.DELETE_GEOFENCE,
                  payload: id,
                });*/
                //dispatch(getGeofences())
               
                dispatch(setAlerts("Geofence Deleted", "success", "true"));
                //state.addStatus = 3
                //dispatch(setGeofenceAddStatus(3))
                  return {statusCode : 3, id:id}
              } catch (err) {
                console.log(err)
                /*dispatch({
                  type: types.GEOFENCE_ERROR,
                })*/;
                const errors = err.response
                if(errors.status === 404)
                {
                dispatch(setAlerts("Internal error. Geofence can't be deleted", "error", "true"));
                }
                else if(errors.status === 406)
                {
                  dispatch(setAlerts("Cant remove. Please delete Monitor geofences in this Location geofence", "error", "true"));

                }
                //dispatch(setGeofenceAddStatus(2))
                //state.addStatus = 2

                return rejectWithValue({status:"error",statusCode:2})
              }
  
           }

)


export const getGeofencesByFloor = createAsyncThunk(
    "geofence/getGeofencesByFloor",
    async(id,{dispatch,rejectWithValue})=>{
        try {
            const res = await axios.get(`/api/geoFence/floorplan/${id}`);
            /*dispatch({
              type: types.GET_GEOFENCE_OF_FLOOR,
              payload: res.data.data,
            });*/
            //state.floorGeofence = res.data.data
            return res.data.data
          } catch (err) {
            /* dispatch({
              type: types.GEOFENCE_ERROR,
              payload: { status: err.response },
            });*/
            dispatch(setAlerts("Internal server error","error",true))
            return rejectWithValue({status:err.response})
          }
    }


)