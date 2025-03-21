import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { get } from "mongoose";
import { setAlerts } from "../../_actions/alertAction";

import {addMQTT, editMQTT, getMQTT,deleteMQTT} from "./mqttThunk"




export const mqttSlice = createSlice({

name : "mqtt",
initialState : {
    mqtt:null,
    loading: true,
    error:null

},
reducers : {
    resetMQTT : (state)=>{
       state.mqtt=null
    }




},
extraReducers:{
  [addMQTT.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addMQTT.fulfilled] : (state,{payload})=>{
    console.log("add mqtt",payload)
   state.mqtt = payload
   state.loading= false
  },
  [addMQTT.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


   
  [editMQTT.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editMQTT.fulfilled] : (state,{payload})=>{
   //state.anchor = payload
   console.log(payload)
   state.loading= false
  },
  [editMQTT.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [deleteMQTT.pending]:(state,{payload})=>{
    state.loading = true
  },
  [deleteMQTT.fulfilled] : (state,{payload})=>{
   state.mqtt = null
   state.loading= false
  },
  [deleteMQTT.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [getMQTT.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getMQTT.fulfilled] : (state,{payload})=>{
   
   console.log(payload) 
   if(payload && payload.length > 0){
        state.mqtt= payload[0]
   }
   else{
    state.mqtt=null
   }
   state.loading= false
  },
  [getMQTT.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

}
})



export const { resetMQTT} = mqttSlice.actions
export default mqttSlice.reducer
