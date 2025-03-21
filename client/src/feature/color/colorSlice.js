
// This slice maintains color of themes

import { createSlice } from "@reduxjs/toolkit";


export const colorSlice = createSlice({

  name : "color",

  initialState:{
      colorIndex : 0
  },

  reducers : {
  setColor:(state,action)=>{
        state.colorIndex = action.payload
  }
}



})


export const {setColor} = colorSlice.actions
export default colorSlice.reducer
