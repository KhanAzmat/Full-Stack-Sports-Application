

import { createSlice } from "@reduxjs/toolkit"; 
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";
import {addGltf,editGltfWithFile, editGltf,deleteGltf,getGltfOfFloor, getGltfOfDisplayFloor} from "./gltfThunk"





export const gltfSlice = createSlice({
name:"gltf",
initialState:{
    error: {}, 
    loading: true,
    floorGltf : null,
    newGltfName : "om",
    fenceFloorGltf:null,
    showBackdrop : false,
    displayFloorGltf : null

},

reducers : {

      setBackdrop : (state,action)=>{

           state.showBackdrop = action.payload
      },

      resetDisplayFloorGtltf : (state,action)=>{

         state.displayFloorGltf = null

      },

      resetFloorGltf:(state,action)=>{
        state.floorGltf = null
      }


   



},
extraReducers :{
  [addGltf.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addGltf.fulfilled] : (state,{payload})=>{
   //state.g =payload
   state.loading= false
  },
  [addGltf.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [editGltfWithFile.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editGltfWithFile.fulfilled] : (state,{payload})=>{
   //state.g =payload
   state.loading= false
  },
  [editGltfWithFile.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [editGltf.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editGltf.fulfilled] : (state,{payload})=>{
   //state.g =payload
   state.loading= false
  },
  [editGltf.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [deleteGltf.pending]:(state,{payload})=>{
    state.loading = true
  },
  [deleteGltf.fulfilled] : (state,{payload})=>{
   //state.g =payload
   state.loading= false
  },
  [deleteGltf.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [getGltfOfFloor.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getGltfOfFloor.fulfilled] : (state,{payload})=>{
   //state.g =payloadif(pl.length > 0)
        if(payload.length > 0)
            {
              state.newGltfName = payload[0].gltf
              state.floorGltf = payload[0]
          }
   state.loading= false
  },
  [getGltfOfFloor.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [getGltfOfDisplayFloor.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getGltfOfDisplayFloor.fulfilled] : (state,{payload})=>{
   //state.g =payloadif(pl.length > 0)
        if(payload.length > 0)
            {
             // state.newGltfName = payload[0].gltf
              state.displayFloorGltf = payload[0]
          }
   state.loading= false
  },
  [getGltfOfDisplayFloor.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

}



})

export const {setBackdrop,resetDisplayFloorGtltf,resetFloorGltf} = gltfSlice.actions
export default gltfSlice.reducer 