import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import setAuthToken from "../../utils/setAuthToken";
import {loadUser,getUsers,addUser,updateMe,login, updatePassword,deleteUser,getUserCount,addFirstUser, forgotPassword} from "./authThunk"

import axios from "axios";


export const authSlice = createSlice(
    {
      name:"auth",
      initialState:{
        token: localStorage.getItem("token"),
        isAuthenticated: false,
        loading: true,
        user: {},
        users: [],
        role: "",
        loaded3D : false,
        count: -1,
        error:{},
        reset:false
      },
      reducers:{
      
   

    logout : (state,action)=>{
      setAuthToken()
      localStorage.removeItem("token");
      localStorage.removeItem('seenModal');
      state.isAuthenticated = false
      state.loading = true
      state.user = {}
      state.loaded3D = false
       
       
    }
    ,
    //This state indicates whether 3d model is loaded in canvas
    setLoaded3D : (state,action)=>{
      state.loaded3D = action.payload
    },
  },

    extraReducers : {
      
      [loadUser.pending]:(state,{payload})=>{
        state.loading = true
      },
      [loadUser.fulfilled] : (state,{payload})=>{
        console.log("loadUser payload", payload)
        state.loading = false
        state.isAuthenticated = true
        state.loading = false
        state.user = payload
        state.role = payload.role
      },
      [loadUser.rejected]:(state, {payload})=>{
        state.loading = false
      },

      [getUsers.pending] : (state,{payload})=>{
        state.loading = true
      },

      [getUsers.fulfilled]:(state,{payload}) =>{
        state.users = payload
        state.loading = false
    
      },

      [getUsers.rejected]:(state, {payload})=>{
        state.loading = false
      },

      [addUser.pending]:(state,{payload})=>{
           state.loading = true

      },
      [addUser.fulfilled]: (state,{payload})=>{
        state.loading =false
      },
      [addUser.rejected] : (state,{payload})=>{
        state.loading = false
        state.error = payload
      },

      [updateMe.pending] : (state,{payload})=>{
        state.loading = true
      },


      [updateMe.fulfilled] : (state, {payload})=>{

         state.loading = false
         state.isAuthenticated = true
         state.loading = false
         state.user = payload
         state.role = payload.role

      }
      ,
      [updateMe.rejected] :(state,{payload})=>{
        state.loading = false
        state.error = payload
      }
      ,
      [login.pending] : (state,{payload})=>{
        state.loading = true
      },

      [login.fulfilled] : (state, {payload})=>{
        console.log(payload)
        state.token = payload.token
        state.isAuthenticated = true
        state.loading = false

     },

     [login.rejected] : (state,{payload})=>{

         state.isAuthenticated = false
         state.loading = false
         state.user = {}
         state.loaded3D = false
         state.error = payload
         

     },
     [updatePassword.pending] : (state,{payload})=>{
      state.loading = true
    },
    [updatePassword.fulfilled] : (state, {payload})=>{

      state.token = ""
      //state.isAuthenticated = true
      state.loading = false
      state.isAuthenticated = false
      state.loaded3D = false
     

   },

   [updatePassword.rejected] : (state,{payload})=>{

       state.loading = false
       //state.user = {}
       state.error = payload

   },
   [forgotPassword.pending] : (state,{payload})=>{
    state.loading = true
  },
  [forgotPassword.fulfilled] : (state, {payload})=>{

    //state.token = ""
    //state.isAuthenticated = true
    //state.loading = false
    //state.isAuthenticated = false
    //state.loaded3D = false
    state.reset = true
    state.loading = false
   

 },

 [forgotPassword.rejected] : (state,{payload})=>{

     state.loading = false
     //state.user = {}
     state.error = payload

 }
   
   
   ,
   [deleteUser.pending]:(state,{payload})=>{
    state.loading = true

    }, 
   [deleteUser.fulfilled]: (state,{payload})=>{
      state.loading =false
    },
   [deleteUser.rejected] : (state,{payload})=>{
        state.loading = false
        state.error = payload
     },


     [getUserCount.pending]:(state,{payload})=>{
      state.loading = true
  
      }, 
     [getUserCount.fulfilled]: (state,{payload})=>{
        state.loading =false
        console.log(payload)

        state.count = payload.count
        if(payload.count <=0)
        {
          setAuthToken()
          localStorage.removeItem("token");
          state.isAuthenticated = false
          state.loading = true
          state.user = {}
          state.loaded3D = false
        }

      },
     [getUserCount.rejected] : (state,{payload})=>{
          state.loading = false
          state.error = payload
       },
  

       [addFirstUser.pending]:(state,{payload})=>{
        state.loading = true
    
        }, 
       [addFirstUser.fulfilled]: (state,{payload})=>{
          state.loading =false
          state.count = payload.count
  
        },
       [addFirstUser.rejected] : (state,{payload})=>{
            state.loading = false
            state.error = payload
            state.count = -1
         },


     



















    }



  }
)


export const {logout,setLoaded3D} =authSlice.actions 

export default authSlice.reducer



