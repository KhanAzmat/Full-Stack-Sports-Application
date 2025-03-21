
//This file aync action of floorplan

import  {createAsyncThunk} from "@reduxjs/toolkit"
import { setAlerts } from "../../_actions/alertAction"
import axios from "axios";



export const getFloorplans = createAsyncThunk("floorplan/getFloorplans",async(_,{dispatch,rejectWithValue})=>{
    try {
        const res = await axios.get("/api/floorplan");
        
        /*dispatch({
          type: types.GET_FLOORPLANS,
          payload: res.data.data,
        });*/

        //state.floorplans = res.data.data
        console.log(`getFloorplans : ${res.data.data}`)
        return res.data.data

      } catch (err) {
        /*dispatch({
          type: types.FLOORPLAN_ERROR,
          payload: { status: err.response },
        });*/
        dispatch(setAlerts("Cant access floorplan data", "error", true));
        return rejectWithValue({status : err.response})
      }






})


export const addFloorplan = createAsyncThunk("floorplan/addFloorplan", async(formData,{dispatch, rejectWithValue})=>{


  console.log(formData)
  try {
    const res = await axios.post("/api/floorplan", formData)
/*dispatch({
  type: types.ADD_FLOORPLAN,
 payload: res.data,
});*/
 
 
 dispatch(setAlerts("Floor Plan Added successfully!!", "success", true));
 dispatch(getFloorplans());
  //history.push("/floorplan");
  } catch (err) {
  if(err.response && err.response.data) {
    dispatch(setAlerts("add operation failed", "error", true));
   } else {
     console.log(err);
      }
      return rejectWithValue({status:err.response})
      }
   

})


export const editFloorplan = createAsyncThunk("floorplan/editFloorplan",async(data, {dispatch, rejectWithValue})=>{

  const {formData,id,alertMsg} = data
  try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      console.log("config Data",data)
      const res = await axios.patch(`/api/floorplan/${id}`, formData, config);
  
      /*dispatch({
        type: types.SET_CONFIG_FLOORPLAN,
        payload: res.data,
      });*/

       //state.configFloor = res.data
       
     console.log('Edit floorplan thunk : ', res.data)
      dispatch(setAlerts(alertMsg, "success", true));
      return res.data.data
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlerts(error.msg, "error")));
      }
  
      /*dispatch({
        type: types.FLOORPLAN_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      })*/;

      //state.error =
      dispatch(setAlerts("modify operation failed", "error", true)); 
     return  rejectWithValue({status : err.response})
    }

})


export const deleteFloorplan = createAsyncThunk ("floorplan/deleteFloorplan", async(id,{dispatch,rejectWithValue})=>{

  try {
    await axios.delete(`/api/floorplan/${id}`);
    /*dispatch({
      type: types.DELETE_FLOORPLAN,
      payload: id,
    });*/
       
    return id
    dispatch(setAlerts("Floorplan Deleted", "success", "true"));
  } catch (err) {
    /*dispatch({
      type: types.FLOORPLAN_ERROR,
    });*/
   dispatch(setAlerts("opertion cant be performed","error",true))
   return rejectWithValue({status:err.response}) 


  }


})


export const getConfigFloorplan = createAsyncThunk("floorplan/getConfigFloorplan",async(id,{dispatch,rejectWithValue})=>{
  try {
    const res = await axios.get(`/api/floorplan/${id}`);

    /*dispatch({
      type: types.SET_CONFIG_FLOORPLAN,
      payload: res.data.data,
    });*/
    //state.configFloor = res.data.data
    return res.data.data
  } catch (err) {
    /*dispatch({
      type: types.FLOORPLAN_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
    });*/

     //state.error = 
     dispatch(setAlerts("Cant fetch floors", "error",true))
     return rejectWithValue({status : err.response})
  }

})




export const getDisplayFloorplan = createAsyncThunk("floorplan/getDisplayFloorplan",async(id,{dispatch,rejectWithValue})=>{
  try {
    const res = await axios.get(`/api/floorplan/${id}`);

    /*dispatch({
      type: types.SET_CONFIG_FLOORPLAN,
      payload: res.data.data,
    });*/
    //state.configFloor = res.data.data
    return res.data.data
  } catch (err) {
    /*dispatch({
      type: types.FLOORPLAN_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
    });*/

     //state.error = 
     dispatch(setAlerts("Cant fetch floors", "error",true))
     return rejectWithValue({status : err.response})
  }

})

