//This slice maitains and manipulates geofence store

import { createSlice } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import { setAlert } from "../alert/alertSlice";
import axios from "axios"
import {addGeofence,deleteGeoDB,getGeofencesByFloor} from "./geofenceThunk"


export const geofenceSlice = createSlice({
  name: "geofence",
  initialState:{
      geofence:null,
    error: {},
    loading: true,
    floorGeofence:[],
    showGeofenceCard : false,
    geofenceInfo : null,
    numberOfGeofence : null,
    addStatus : 0
  },
  reducers:{
     
      showGeofenceInfo : (state, action)=>{
          state.showGeofenceCard = true
          state.geofenceInfo = action.payload
      }
       ,
       hideGeofenceCard :(state,action)=>{
           state.showGeofenceCard=false
       }
       ,
       setNumberOfGeofence:(state, action)=>{
           state.numberOfGeofence = action.payload
       }
       ,
       ///This method sets geofence creation status
//0 . Geofence yet to be added
//1 . new geofence creation success
//2 . gefence creation or deletion  failed
//3 . geofence sucessfully deleted 

      setGeofenceAddStatus :(state,action)=>{
        state.addStatus = action.payload
       }

    }
    ,
    extraReducers :{
      [addGeofence.pending]:(state,{payload})=>{
        state.loading = true
      },
      [addGeofence.fulfilled] : (state,{payload})=>{
       //state. =payload
       state.loading= false
      },
      [addGeofence.rejected]:(state, {payload})=>{
        state.loading = false
        state.error = payload
      },



      [deleteGeoDB.pending]:(state,{payload})=>{
        state.loading = true
      },
      [deleteGeoDB.fulfilled] : (state,{payload})=>{
       //state. =payload
       state.floorGeofence=state.floorGeofence.filter(
        (geofence) => geofence._id !== payload.id)
       state.loading= false
       state.addStatus = payload.statusCode
      },
      [deleteGeoDB.rejected]:(state, {payload})=>{
        state.loading = false
        state.error = {status:payload.status}
        state.addStatus = payload.statusCode
      },

      [getGeofencesByFloor.pending]:(state,{payload})=>{
        state.loading = true
      },
      [getGeofencesByFloor.fulfilled] : (state,{payload})=>{
       //state. =payload
       state.loading= false
       state.floorGeofence = payload
      },
      [getGeofencesByFloor.rejected]:(state, {payload})=>{
        state.loading = false
        state.error = payload
      },





     

    }

})



export const {showGeofenceInfo,hideGeofenceCard,
             setNumberOfGeofence,setGeofenceAddStatus} = geofenceSlice.actions

export default geofenceSlice.reducer             