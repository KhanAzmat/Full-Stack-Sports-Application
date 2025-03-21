
import { createSlice } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";
import { setAlert } from "../alert/alertSlice";

import {getLinkedTag,getLinkedTags,addLinkedTag,editLinkedTag,deleteLinkedTag,getLinkedTagbyTag} from "./linkedTagThunk"



export const linkeTagSlice = createSlice({
  name:"linkedTag",
  initialState : {

    linkedTag: null,
    linkedTags: [],
    error: {},
    filtered: null,
    loading: true,
    tagInfo: null,
    showCard: false,
    tagId : ""

  },
  reducers:{
   
    
    hideInfoCard : (state,action) =>{
      state.tagId=""
      state.showCard = false

    }


    

    




  },
  extraReducers :{
       
    [getLinkedTag.pending]:(state,{payload})=>{
      state.loading = true
    },
    [getLinkedTag.fulfilled] : (state,{payload})=>{
     state.linkedTag=payload
     state.loading= false
    },
    [getLinkedTag.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },


    [getLinkedTags.pending]:(state,{payload})=>{
      state.loading = true
    },
    [getLinkedTags.fulfilled] : (state,{payload})=>{
     state.linkedTags=payload
     state.loading= false
    },
    [getLinkedTags.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },
  


    [addLinkedTag.pending]:(state,{payload})=>{
      state.loading = true
    },
    [addLinkedTag.fulfilled] : (state,{payload})=>{
     state.linkedTag=payload
     state.loading= false
    },
    [addLinkedTag.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },



    [editLinkedTag.pending]:(state,{payload})=>{
      state.loading = true
    },
    [editLinkedTag.fulfilled] : (state,{payload})=>{
     state.linkedTag=payload
     state.loading= false
    },
    [editLinkedTag.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },




    [deleteLinkedTag.pending]:(state,{payload})=>{
      state.loading = true
    },
    [deleteLinkedTag.fulfilled] : (state,{payload})=>{
     state.linkedTags=  state.linkedTags= state.linkedTags.filter(
      (linkedTag) => linkedTag._id !== payload)
     state.loading= false
    },
    [deleteLinkedTag.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },

    [getLinkedTagbyTag.pending]:(state,{payload})=>{
      state.loading = true
    },
    [getLinkedTagbyTag.fulfilled] : (state,{payload})=>{
      state.tagId=payload[0]
      state.tagInfo = payload[1]
      state.loading= false
      state.showCard= true
     //state.loading= false
    },
    [getLinkedTagbyTag.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },

  }





})


export const {hideInfoCard} = linkeTagSlice.actions
export default linkeTagSlice.reducer