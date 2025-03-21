

//This file maintains state of floorplan data
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
//import { get } from "request";
//import { setAlerts } from "../../_actions/alertAction";
import {getFloorplans,
        addFloorplan,
        editFloorplan,
        deleteFloorplan,
        getConfigFloorplan,
        getDisplayFloorplan} from "./floorplanThunk"

export const floorplanSlice = createSlice({

  name : "floorplan",

  initialState:{
    floorplans: [],
    error: {},
    loading: true,
    floorPlanIdx : 0,
    floorPlanId: null,
    floorMenu : false,
    currentFloorNumber : null,
    currentFloorId : null,
    configFloor : null,
    displayFloor : null,
    flrImage:null
  },

  reducers:{
     
  

      setCurrentFloorIndex : (state,action)=>{
       state.floorPlanIdx = action.payload
      },

      setCurrentFloorPlanId : (state,action)=>{
          state.floorPlanId = action.payload
      }
      ,

      showFloorMenu : (state,action)=>{
          state.floorMenu = true
      },

      hideFloorMenu : (state, action)=>{
          state.floorMenu = false
      },

      setCurrentFloorNumber : (state,action) =>{

        state.currentFloorNumber = action.payload

      },
      setCurrentFloorId : (state,action)=>{
          state.currentFloorId = action.payload
      },

      resetConfigFloor : (state)=>{
        state.configFloor = null
      },
      resetDisplayFloor : (state)=>{
        state.displayFloor = null
      },

      setFloorImage : (state, action)=>{
        state.flrImage = action.payload
      }


      

      






  },
  extraReducers :{

    [getFloorplans.pending]:(state,{payload})=>{
      state.loading = true
    },
    [getFloorplans.fulfilled] : (state,{payload})=>{
     console.log(payload.length) 
     state.floorplans =payload
     state.loading= false
     state.flrImage = payload.length !== 0?`/uploads/${payload[0].floorplan}`:null
    },
    [getFloorplans.rejected]:(state, {payload})=>{
      state.loading = false
    },
    
    [addFloorplan.pending] : (state,{payload})=>{
       state.loading = true

    },
    [addFloorplan.fulfilled] : (state,{payload})=>{
      //state.floorplans =payload
      state.loading= false
     },
     [addFloorplan.rejected]:(state, {payload})=>{
       state.loading = false
       state.error = payload
     },

     [editFloorplan.pending] : (state,{payload})=>{
      state.loading = true

   },
   [editFloorplan.fulfilled] : (state,{payload})=>{
     //state.floorplans =payload
     console.log('edit floorplan fulfilled : ',payload.data)
     state.loading= false
     state.configFloor = payload
    },
    [editFloorplan.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },

    [deleteFloorplan.pending] : (state,{payload})=>{
      state.loading = true

   },
   [deleteFloorplan.fulfilled] : (state,{payload})=>{
     //state.floorplans =payload
     state.loading= false
     state.floorplans=state.floorplans.filter(
      (floorplan) => floorplan._id !== payload)
    },
    [deleteFloorplan.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },


    [getConfigFloorplan.pending] : (state,{payload})=>{
      state.loading = true

   },
   [getConfigFloorplan.fulfilled] : (state,{payload})=>{
     //state.floorplans =payload
     state.loading= false
     state.configFloor = payload
    },
    [getConfigFloorplan.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },

    [getDisplayFloorplan.pending] : (state,{payload})=>{
      state.loading = true

   },
   [getDisplayFloorplan.fulfilled] : (state,{payload})=>{
     //state.floorplans =payload
     state.loading= false
     state.displayFloor = payload
    },
    [getDisplayFloorplan.rejected]:(state, {payload})=>{
      state.loading = false
      state.error = payload
    },
    
   






  }





})



export const {
              setCurrentFloorIndex,
              setCurrentFloorPlanId,
              showFloorMenu,
              hideFloorMenu,
              setCurrentFloorNumber,
              setCurrentFloorId,
              resetConfigFloor,
              resetDisplayFloor,
              setFloorImage

               } = floorplanSlice.actions

export default floorplanSlice.reducer







