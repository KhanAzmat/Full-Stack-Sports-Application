import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";


export const getApiKeys = createAsyncThunk(
    "apiKey/getApiKeys",
  
    async(_,{dispatch,rejectWithValue})=>{
        try {
            const res = await axios.get("/mqtt/keys");
            console.log(res.data)
            return res.data.data
      
          } catch (err) {
            console.log(err)
            //state.apiKeys=[]
            return rejectWithValue({satus : err.response})
          }
    }

)

export const  generateApiKey = createAsyncThunk(
     "apiKey/generateApiKey",
     async(key,{dispatch,rejectWithValue})=>{

        try {
            const res = await axios.post("/mqtt/key", key);
            
           /* dispatch({
              type: types.TOKEN_GENERATED,
              payload: res.data,
            });*/
             //state.apiToken = res.data
           dispatch(getApiKeys())
           return res.data
        
          } catch (err) {
            const status = err.response.status
            if(status == 409)
            {
                dispatch(setAlerts("Project Name Alrady Exists","error",true))
            }
            else
            {
            
            const errors = err.response.data;
        
            if (errors) {
              dispatch(setAlerts(errors, "error", true));
            }
          }
             return rejectWithValue({status : err.response})
          }
     }
)

export const deleteApiKey = createAsyncThunk(
    "apiKey/deleteApiKey",

    async(id,{dispatch,rejectWithValue})=>{
        try {
            await axios.delete(`/mqtt/key/${id}`);
            
            dispatch(setAlerts("Key Deleted", "success", "true"));
            dispatch(getApiKeys())
          } catch (err) {
                const error = err.response.data
              if(error){
            
              dispatch(setAlerts(error,"error",true))
            
           }else
           {
               dispatch(setAlerts("Cant remove key","error",true))
           }
           return rejectWithValue({status : err.response})
          }
    }


)