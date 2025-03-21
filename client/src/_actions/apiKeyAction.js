
/*import axios from "axios";
import { setAlert } from "./alertAction";
import setAuthToken from "../utils/setAuthToken";
import * as types from "./types";


// Get Users
export const getApiKeys= () => async (dispatch) => {
    try {
      const res = await axios.get("/mqtt/keys");
      console.log(res.data)
      dispatch({
        type: types.GET_API_KEYS,
        payload: res.data.data,
      });

    } catch (err) {
      console.log(err)
    }
  };


//Generate Api Key
  export const generateApiKey = (formData) => async (dispatch) => {
    try {
      const res = await axios.post("/mqtt/key", formData);
      
      dispatch({
        type: types.TOKEN_GENERATED,
        payload: res.data,
      });
  
      dispatch(getApiKeys())
     
  
    } catch (err) {
      const status = err.response.status
      if(status == 409)
      {
          dispatch(setAlert("Project Name Alrady Exists","error",true))
      }
      else
      {
      
      const errors = err.response.data;
  
      if (errors) {
        dispatch(setAlert(errors, "error", true));
      }
    }
     
    }
  };
  


  ///delte api key

  export const deleteApiKey = (id) => async (dispatch) => {
    try {
      await axios.delete(`/mqtt/key/${id}`);
      
      dispatch(setAlert("Key Deleted", "success", "true"));
      dispatch(getApiKeys())
    } catch (err) {
          const error = err.response.data
        if(error){
          dispatch(
        setAlert(error,"error",true)
      );
     }else
     {
         dispatch("Cant remove key","error",true)
     }
    }
  };


  export const removeToken=()=> async(dispatch)=>{
    dispatch({
        type: types.RESET_TOKEN,
        payload: null,
      });

  }


*/