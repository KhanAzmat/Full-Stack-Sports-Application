
//This file maitains state of anchor

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { get } from "mongoose";
import { setAlerts } from "../../_actions/alertAction";

import {addUDP, editUDP, getUDP,deleteUDP} from "./udpThunk"
//import { addUDP, editUDP } from "./udpThunk";
//import { getUDP } from "../../../../controllers/udpController";



export const udpSlice = createSlice({

name : "udp",
initialState : {
    udp:null,
    loading: true,
    error:null

},
reducers : {
    resetUDP : (state)=>{
       state.udp=null
    }




},
extraReducers:{
  [addUDP.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addUDP.fulfilled] : (state,{payload})=>{
    console.log("add udp",payload)
   state.udp = payload
   state.loading= false
  },
  [addUDP.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


   
  [editUDP.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editUDP.fulfilled] : (state,{payload})=>{
   //state.anchor = payload
   console.log(payload)
   state.loading= false
  },
  [editUDP.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [deleteUDP.pending]:(state,{payload})=>{
    state.loading = true
  },
  [deleteUDP.fulfilled] : (state,{payload})=>{
   state.udp = null
   state.loading= false
  },
  [deleteUDP.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [getUDP.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getUDP.fulfilled] : (state,{payload})=>{
   
   console.log(payload) 
   if(payload && payload.length > 0){
        state.udp= payload[0]
   }
   else{
    state.udp=null
   }
   state.loading= false
  },
  [getUDP.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

}
})



export const { resetUDP} = udpSlice.actions
export default udpSlice.reducer
