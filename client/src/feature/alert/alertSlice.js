// This slice maintains alerts of application


import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from "uuid"

export const alertSlice = createSlice({
name:"alert",

initialState :{
    value : [],
    
},
reducers : {

    setAlert : (state,action)=>{
          console.log(state.value)
          state.value=[...state.value, action.payload]
          
        
    },

    removeAlert : (state,action)=>{
        state.value=state.value.filter((alert) => alert.id !== action.payload)
    }

}



})


export const {setAlert, removeAlert} = alertSlice.actions
//export {setAlert, removeAlert}
export default alertSlice.reducer