

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";



export const getAsset = createAsyncThunk(
   "asset/getAsset",
   async(id,{dispatch,rejectWithValue})=>{
    try {
        const res = await axios.get(`/api/asset/${id}`);
    
        /*dispatch({
          type: types.GET_ASSET,
          payload: res.data.data,
        });*/
        //state.asset = res.data.data
        return res.data.data
      } catch (err) {

        dispatch(setAlerts("Asset not found","error",true))
        return rejectWithValue({status:err.response})
      }
   }


)


export const getAssets = createAsyncThunk(
    "asset/getAssets",
    async(_,{dispatch,rejectWithValue})=>{
    
        try {
            const res = await axios.get("/api/asset/");
            /*dispatch({
              type: types.GET_ASSETS,
              payload: res.data.data,
            });
            */
           //state.assets = res.data.data
            return res.data.data

          } catch (err) {
            /*dispatch({
              type: types.ASSET_ERROR,
              payload: { status: err.response },
            });*/

            return rejectWithValue({status:err.response})
          }

    }
 
 
 )

 export const addAsset = createAsyncThunk(
     "asset/addAsset",

     async(formData,{dispatch,rejectWithValue})=>{
    
        try {
            const res = await axios.post("/api/asset", formData);
            /*dispatch({
              type: types.ADD_ASSET,
              payload: res.data,
            });*/
            //state.asset = res.data
            dispatch(getAssets());
            dispatch(setAlerts("Asset Added", "success", true));
            return res.data
             } catch (err) {
            if(err.response && err.response.data) {
              dispatch(setAlerts(err.response.data, "error", true));
            } else {
               console.log(err);
            }
            return rejectWithValue({status : err.response})
          }

    }

 )



 export const editAsset = createAsyncThunk(
    "asset/editAsset",

    async(data,{dispatch,rejectWithValue})=>{
   
        const {id, formData, alertMsg} = data
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
        
            const res = await axios.patch(`/api/asset/${id}`, formData, config);
        
            /*dispatch({
              type: types.GET_ASSET,
              payload: res.data,
            });
            */
            dispatch(setAlerts(alertMsg, "success", true));
            return res.data

           
          } catch (err) {
            const errors = err.response.data.errors;
        
            if (errors) {
              errors.forEach((error) => dispatch(setAlerts(error.msg, "error")));
            }

            return rejectWithValue({status : err.response})
          }

   }

)

export const deleteAsset = createAsyncThunk(
    "asset/deleteAsset",
    async(id,{dispatch,rejectWithValue})=>{
        try {
            await axios.delete(`/api/asset/${id}`);
            /*dispatch({
              type: types.DELETE_ASSET,
              payload: id,
            });*/
            //state.assets = state.assets.filter((asset) => asset._id !== action.payload)
            dispatch(getAssets())
            dispatch(setAlerts("Asset Deleted", "success", "true"));
            return id
          } catch (err) {
            
            dispatch(setAlerts("Cant delete", "error", "true"));
            return rejectWithValue({status:err.response})
          }
    }
 
 
 )
 




