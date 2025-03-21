import { createSlice } from "@reduxjs/toolkit";

// const getDimensions = ()=>{
//     const {innerWidth, innerHeight} = window;
//     return { innerWidth, innerHeight}
// }

const dimSlice = createSlice({
    name:'dimension',
    initialState:{height : window.innerHeight, width : window.innerWidth, isMobile : false},
    reducers:{
        handleResize : (state)=>{
            console.log('Height : ', window.screen.height)
            console.log('Width : ', window.screen.width)
            state.height = window.innerHeight
            state.width = window.innerWidth
        },

        setIsMobile : (state)=>{
            state.isMobile = true
        }
    }
})

export const { handleResize, setIsMobile } = dimSlice.actions
export default dimSlice.reducer