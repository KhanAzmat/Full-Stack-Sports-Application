import { createSlice } from "@reduxjs/toolkit";

const layerSlice = createSlice({
    name : 'layer',
    initialState: {
        zValToggle:true,
        view3d:true,
        gridVisible:true
    },

    reducers:{
        togglezAxis:(state, {payload})=>{
            state.zValToggle = !state.zValToggle
        },

        toggleView:(state)=>{
            state.view3d = !state.view3d
        },

        toggleGrid:(state)=>{
            state.gridVisible = !state.gridVisible
        }


    }
})

export const { toggleGrid, toggleView, togglezAxis } = layerSlice.actions
export default layerSlice.reducer