
///This file contains async thunks for authentication
import { createAsyncThunk } from "@reduxjs/toolkit";
//import { usePatchesInScope } from "@reduxjs/toolkit/node_modules/immer/dist/internal";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken"



export const  loadUser = createAsyncThunk('auth/loadUser',async(_, {dispatch,rejectWithValue})=>{
   
        if (localStorage.token) {
            setAuthToken(localStorage.token);
          }
        
          try {
            const res = await axios.get("/api/user/me");
            /*dispatch({
              type: types.USER_LOADED,
              payload: res.data,
            });*/
          return res.data.data
          } catch (err) {
           /* dispatch({
              type: types.AUTH_ERROR,
            });*/

           dispatch(setAlerts("Authentication error","error",true)); 
           return rejectWithValue({status:err.response})
          }
        })


 export const getUsers = createAsyncThunk("auth/getUsers", async(_,{dispatch,rejectWithValue })=>{

    try {
        const res = await axios.get("/api/user/");
        /*dispatch({
          type: types.GET_USERS,
          payload: res.data.data,
        });*/
        //state.users= res.data.data
        return res.data.data

      } catch (err) {
        /*dispatch({
          type: types.AUTH_ERROR,
        });*/ 

        dispatch(setAlerts("Cant Access user list","error",true))
        return rejectWithValue({status:err.response})
      }



 })   
 
 
 export const addUser = createAsyncThunk("auth/addUser",async(formData,{dispatch,rejectWithValue})=>{
    try {
        const res = await axios.post("/api/user/signup", formData);
    
        /*dispatch({
          type: types.REGISTER_SUCCESS,
          payload: res.data,
        });*/
        //state.loading=false
        
    
        dispatch(setAlerts("User Added Successfully", "success", true));
        //dispatch(getUsers());
        return res
    
      } catch (err) {
        console.log(err)
        const errors = err.response.data;
        
        
          dispatch(setAlerts("User Registration failed", "error", true));
          return rejectWithValue({status : err.response})        
    
       /* dispatch({
          type: types.REGISTER_FAIL,
        });*/

        
      }




 })


 export const updateMe = createAsyncThunk("auth/upadteMe",async(formData, {dispatch,rejectWithValue})=>{
    try {
        const res = await axios.patch("/api/user/updateMe", formData);
    
        /*dispatch({
          type: types.USER_LOADED,
          payload: res.data,
        });*/
        
    
        dispatch(setAlerts("Profile Updated!", "success",true));
        //dispatch(loadUser());
        return res.data.data
    
        // history.push("/dashboard");
      } catch (err) {
        /*dispatch({
          type: types.AUTH_ERROR,
        });*/

        dispatch(setAlerts("User update failed", "error",true))
        return rejectWithValue({status : err.response})
      }
 })


 export const login = createAsyncThunk ("auth/login",async(formData,{dispatch, rejectWithValue})=>{
        
  const {email,password} = formData 
  const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post("/api/user/login", body, config);
  
      if(res.data && res.data.token){
        setAuthToken(res.data.token)
        //console.log(res.data.token)
        /*dispatch({
          type: types.LOGIN_SUCCESS,
          payload: res.data,
        });*/
        localStorage.setItem("token", res.data.token);
        /*state.token = res.data.token
        state.isAuthenticated = true
        state.loading = false
        */
        dispatch(loadUser());
        return res.data
       
      }
      return rejectWithValue({status : res.data})
    } catch (err) {
      console.log(err)
     
      const errors = err.response.data;
      if (errors) {
      dispatch(setAlerts("login failed", "error", true));
      }
      localStorage.removeItem("token");
    setAuthToken()
    return rejectWithValue({status : err.response})
     /* dispatch({
        type: types.LOGIN_FAIL,
      });
    }*/
    
    
    /*
    */
  }

 })


 export const updatePassword = createAsyncThunk("auth/updatePassword",async(formData, {dispatch,rejectWithValue})=>{
    try {
        const res = await axios.patch(`/api/user/updateMyPassword/${formData._id}`, formData);
    
        /*dispatch({
          type: types.LOGIN_SUCCESS,
          payload: res.data,
        });*/
        setAuthToken()
            //console.log(res.data.token)
            /*dispatch({
              type: types.LOGIN_SUCCESS,
              payload: res.data,
            });*/
            //localStorage.setItem("token", res.data.token);
            localStorage.removeItem("token")
            /*state.token = res.data.token
            state.isAuthenticated = true
            state.loading = false
            */
            dispatch( setAlerts("Password updated Sucessfully, Please login again", "success", true))
           return res.data


        //setAlerts("Password Updated!", "success");

      } catch (err) {
        const errors = err.response.data;
        console.log(err.response)
        if (errors) {
         dispatch( setAlerts(errors.message, "error", true))
        }
         return rejectWithValue({status : err.response})
       /* dispatch({
          type: types.LOGIN_FAIL,
        });*/
      }



 })





 export const forgotPassword = createAsyncThunk("auth/forgotPassword",async(formData, {dispatch,rejectWithValue})=>{
  try {
      const res = await axios.post(`/api/user/forgotPassword`, formData);
  
      /*dispatch({
        type: types.LOGIN_SUCCESS,
        payload: res.data,
      });*/
      //setAuthToken()
          //console.log(res.data.token)
          /*dispatch({
            type: types.LOGIN_SUCCESS,
            payload: res.data,
          });*/
          //localStorage.setItem("token", res.data.token);
          //localStorage.removeItem("token")
          /*state.token = res.data.token
          state.isAuthenticated = true
          state.loading = false
          */
           

          dispatch( setAlerts("Please check your email, Password reset link is sent!", "success", true))
         return res.data


      //setAlerts("Password Updated!", "success");

    } catch (err) {
      const errors = err.response.data;
      console.log(err.response)
      if (errors) {
       dispatch( setAlerts(errors.message, "error", true))
      }
       return rejectWithValue({status : err.response})
     /* dispatch({
        type: types.LOGIN_FAIL,
      });*/
    }



})






 export const deleteUser = createAsyncThunk("auth/deleUser",async(id,{dispatch,rejectWithValue})=>{

    try {
        await axios.delete(`/api/user/${id}`);
        /*dispatch({
          type: types.USER_DELETED,
          payload: id,
        })*/;

   
        dispatch(setAlerts("User Deleted", "success", "true"));
       // dispatch(getUsers())
       return true
      } catch (err) {
        /*dispatch({
          type: types.AUTH_ERROR,
        });*/
        dispatch(setAlerts("Oparation failed", "error", "true"))
        return rejectWithValue({status :err.response})
      }


 })


 export const getUserCount = createAsyncThunk("auth/getUserCount",async(_,{dispatch, rejectWithValue})=>{
    try {
        const res = await axios.post("/api/user/checkUser");
        console.log("Initial Response",res.data)
        /*dispatch({
          type: types.SET_USER_COUNT,
          payload: res.data.count,
        });*/
        //state.count = res.data.count
        return res.data
      } catch (err) {
        const errors = err.response.data;
        if (errors) {
        dispatch(setAlerts(errors, "error", true));
        }
        return rejectWithValue({status: err.response})
      }
 })


 export const addFirstUser = createAsyncThunk("auth/addFirstUser",async(formData,{dispatch, rejectWithValue})=>{

    try {
        console.log("Sign up first called")
        const res = await axios.post("/api/user/signupFirst", formData);
    
        /*dispatch({
          type: types.REGISTER_SUCCESS,
          payload: res.data,
        });
        */
       dispatch(getUserCount())
        dispatch(setAlerts("User Added Successfully", "success", true));
        //dispatch(getUsers());
       // navigate("/", { replace: true })
        //dispatch(getUserCount())

        return {count:1}
      } catch (err) {
        console.log(err)
        const errors = err.response.data;
        
        
        dispatch(setAlerts("User Registration failed", "error", true));
        
    
        /*dispatch({
          type: types.REGISTER_FAIL,
        });*/
       return rejectWithValue({status:err.response})
      }

    

 })