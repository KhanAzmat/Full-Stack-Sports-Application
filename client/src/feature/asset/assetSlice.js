
//This slice maintains state of assets

import { createSlice } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";

import axios from "axios"
import {getAsset,getAssets,addAsset,editAsset,deleteAsset} from "./assetThunk"

export const assetSlice = createSlice({
name:"asset",
initialState:{
    asset: null,
    assets: [],
    error: {},
    filtered: null,
    loading: true,
},

reducers:{

    

    setCurrentAsset : (state,action)=>{

        state.asset = action.payload
    },

   

    clearAsset : (state, action)=>{
        state.asset = null
    }
    ,
    filterAsset : (state, payload)=>{

    },
    clearFilter : (state,payload)=>{
            state.filtered = null
    }

},
extraReducers:{

  [getAsset.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getAsset.fulfilled] : (state,{payload})=>{
   state.asset=payload
   state.loading= false
  },
  [getAsset.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [getAssets.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getAssets.fulfilled] : (state,{payload})=>{
   state.assets=payload
   state.loading= false
  },
  [getAssets.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [addAsset.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addAsset.fulfilled] : (state,{payload})=>{
   state.asset=payload
   state.loading= false
  },
  [addAsset.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [editAsset.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editAsset.fulfilled] : (state,{payload})=>{
   state.asset=payload
   state.loading= false
  },
  [editAsset.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [deleteAsset.pending]:(state,{payload})=>{
    state.loading = true
  },
  [deleteAsset.fulfilled] : (state,{payload})=>{
   state.assets=state.assets.filter((asset) => asset._id !==payload)
   state.loading= false
  },
  [deleteAsset.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },




  

}



})



export const {setCurrentAsset,clearAsset,filterAsset, clearFilter} = assetSlice.actions
export default assetSlice.reducer
