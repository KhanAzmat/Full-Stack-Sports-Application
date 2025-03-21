
import { createSlice } from '@reduxjs/toolkit'
import { setAlerts } from '../../_actions/alertAction'
import axios from "axios";
import { setAlert } from '../alert/alertSlice';
import {getApiKeys,generateApiKey,deleteApiKey} from "./apiKeyThunk"
/// This slice provides api key finctonality
export const apiKeySlice = createSlice({
name:"apiKey",

initialState:{
    apiKeys:[],
    apiToken : null,
    loading:false,
    error:{}
},
reducers: {

 
    resetToken : (state)=>{

        state.apiToken = null

    },

    removeToken : (state)=>{
      state.apiToken = null
    }













},
extraReducers:{
   
  [getApiKeys.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getApiKeys.fulfilled] : (state,{payload})=>{
   state.apiKeys=payload
   state.loading= false
  },
  [getApiKeys.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
    state.apiKeys =[]
  },

  [generateApiKey.pending]:(state,{payload})=>{
    state.loading = true
  },
  [generateApiKey.fulfilled] : (state,{payload})=>{
   state.apiToken=payload
   state.loading= false
  },
  [generateApiKey.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [deleteApiKey.pending]:(state,{payload})=>{
    state.loading = true
  },
  [deleteApiKey.fulfilled] : (state,{payload})=>{
   //state.apiToken=payload
   state.loading= false
  },
  [deleteApiKey.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },





  

}



})


export const {resetToken,removeToken} = apiKeySlice.actions
export default apiKeySlice.reducer
