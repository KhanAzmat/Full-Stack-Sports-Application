
//import { cardActionAreaClasses } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";



export const addUDP = createAsyncThunk(
    "udp/addUDP",
    async(formData, {dispatch,rejectWithValue})=>{

        try {
            const res = await axios.post("/api/udp", formData);
            /*dispatch({
              type: types.ADD_ANCHOR,
              payload: res.data.data,
            });*/

            //state.anchor = res.data.data

            //dispatch(getAnchors());
            //dispatch(getAnchorsOfFloor(formData["floorplan"]))
            dispatch(setAlerts("UDP record Added", "success", true));
            return res.data
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



export const editUDP = createAsyncThunk("udp/editUDP",
      async(data,{dispatch,rejectWithValue})=>{

        const {formData,id} =data 
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
        
            const res = await axios.patch(`/api/udp/${id}`, formData, config);
        
            //dispatch(getAnchorsOfFloor(formData["floorplan"]))
            
            dispatch(setAlerts("UDP Configuration Updated", "success", true));
            return res.data
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


export const getUDP = createAsyncThunk(
    "udp/getUDP",
    async(id,{dispatch,rejectWithValue})=>{
          console.log("floor plan id",id)
        try {
            const res = await axios.get(`/api/udp/${id}`);
        
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



export const deleteUDP = createAsyncThunk ("udp/deleteUDP", async(id,{dispatch,rejectWithValue})=>{

  try {
    await axios.delete(`/api/udp/${id}`);
    /*dispatch({
      type: types.DELETE_FLOORPLAN,
      payload: id,
    });*/
    dispatch(setAlerts("UDP Configuration Disabled", "success", true));
    return id
   // dispatch(setAlerts("Floorplan Deleted", "success", "true"));
  } catch (err) {
    /*dispatch({
      type: types.FLOORPLAN_ERROR,
    });*/
   dispatch(setAlerts("opertion cant be performed","error",true))
   return rejectWithValue({status:err.response}) 


  }


})





