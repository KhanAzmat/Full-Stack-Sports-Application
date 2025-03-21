
//import { cardActionAreaClasses } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";

export const getAnchorDetails = createAsyncThunk('anchor/getAnchorDetails',async (arrIP, {dispatch, rejectWithValue})=>{
  try{
    console.log(arrIP)
    let ipData = {ipList : arrIP}
    const res = await axios.post('/api/anchors/details', ipData)
    console.log('getAnchorDetails: ', res.data.data)
    return res.data.data
  }
  catch(err){
    const errors = err.response.data.errors
    console.log(err)
    return rejectWithValue({status : err.response})

  }
})

export const addAnchor = createAsyncThunk(
    "anchor/addAnchor",
    async(formData, {dispatch,rejectWithValue})=>{

        try {
            const res = await axios.post("/api/anchors", formData);
            /*dispatch({
              type: types.ADD_ANCHOR,
              payload: res.data.data,
            });*/

            //state.anchor = res.data.data

            //dispatch(getAnchors());
            //dispatch(getAnchorsOfFloor(formData["floorplan"]))
            dispatch(setAlerts("Anchor Added", "success", true));
            return res.data.data
          } catch (err) {
            const errors = err.response && err.response.data.errors;
        
            console.log(err);
            if (errors) {
              errors.forEach((error) => dispatch(setAlerts(error.msg, "error", true)));
            }
        
           /* dispatch({
              type: types.ANCHOR_ERROR,
              payload: { msg: err.response.statusText, status: err.response.status },
            });*/

            return rejectWithValue({status : err.response})

          }

    }
)



export const editAnchor = createAsyncThunk("anchor/editAnchor",
      async(data,{dispatch,rejectWithValue})=>{

        const {formData,id,alertMsg} =data 
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
        
            const res = await axios.patch(`/api/anchors/${id}`, formData, config);
        
            //dispatch(getAnchorsOfFloor(formData["floorplan"]))
            
            dispatch(setAlerts("Anchor Configuration Updated", "success", true));
            return true
          } catch (err) {
            const errors = err.response.data.errors;
        
            if (errors) {
              errors.forEach((error) => dispatch(setAlerts(error.msg, "error")));
            }
        
            /*dispatch({
              type: types.ANCHOR_ERROR,
              payload: { msg: err.response.statusText, status: err.response.status },
            });*/
            return rejectWithValue({status : err.response})

          }



      } 


)


export const getAnchorsOfFloor = createAsyncThunk(
    "anchor/getAnchorsOfFloor",
    async(id,{dispatch,rejectWithValue})=>{
          console.log("floor plan id",id)
        try {
            const res = await axios.get(`/api/anchors/floorplan/${id}`);
        
            /*dispatch({
              type: types.GET_ANCHOR,
              payload: res.data.data,
            });*/
            console.log(res.data)
            return res.data.data
            


          } catch (err) {
            /*dispatch({
              type: types.ANCHOR_ERROR,
              payload: { status: err.response },
            });*/

            return rejectWithValue( {status : err.response})
          }
    }

)


export const getAllAnchors = createAsyncThunk(
  'anchor/getAllAnchors',
  async (_, { dispatch, rejectWithValue }) =>{
    try{
      const res = await axios.get('/api/anchors/');
      let anchors = res.data.data[0]
      anchors = JSON.parse(anchors["configuration"])
      console.log('Anchor Length :', anchors.req.anchor.length)
      return anchors.req.anchor
    }catch(err){
      return rejectWithValue({status:err.response})
    }

  }
)




