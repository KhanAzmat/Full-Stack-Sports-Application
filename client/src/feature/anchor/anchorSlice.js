
//This file maitains state of anchor

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { get } from "mongoose";
import { setAlerts } from "../../_actions/alertAction";

import {addAnchor, editAnchor, getAllAnchors, getAnchorDetails, getAnchorsOfFloor} from "./anchorThunk"



export const anchorSlice = createSlice({

name : "anchor",
initialState : {
  ipList:[],
    rList:[],
    anchor: null,
    anchors: [],
    error: {},
    filtered: null,
    loading: true,
    anchorDetails:[],
    anchorList:[]
},
reducers : {
    resetAnchor : (state)=>{
       state.anchor=null
    },

    setRole : (state, { payload }) => {
      state.rList = payload
    },

    setIpList : (state, { payload }) =>{
      state.ipList = payload
    }




},
extraReducers:{
  [addAnchor.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addAnchor.fulfilled] : (state,{payload})=>{
   state.anchor = payload
   state.loading= false
  },
  [addAnchor.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


   
  [editAnchor.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editAnchor.fulfilled] : (state,{payload})=>{
   //state.anchor = payload
   state.loading= false
  },
  [editAnchor.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [getAnchorsOfFloor.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getAnchorsOfFloor.fulfilled] : (state,{payload})=>{
   state.anchor = payload
   state.loading= false
  },
  [getAnchorsOfFloor.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [getAnchorDetails.pending]:(state)=>{state.loading=true},
  [getAnchorDetails.fulfilled]:(state, {payload})=>{
    state.anchorDetails = payload
    state.loading = false
  },
  [getAnchorDetails.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [getAllAnchors.pending]:(state)=>{state.loading=true},
  [getAllAnchors.fulfilled]:(state, { payload })=>{
    state.anchorList = payload;
    state.loading = false;
  },
  [getAllAnchors.rejected]:(state, { payload })=>{
    state.loading = false;
    state.error = payload
  }

}
})



export const { resetAnchor, setRole, setIpList} = anchorSlice.actions
export default anchorSlice.reducer
