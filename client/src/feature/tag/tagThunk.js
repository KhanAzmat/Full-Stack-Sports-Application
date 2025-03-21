
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlerts } from "../../_actions/alertAction";
import { setAddingTag } from "./tagSlice";

export const getTag = createAsyncThunk(
  "tag/getTag",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/tag/${id}`);

      /*dispatch({
              type: types.GET_TAG,
              payload: res.data.data,
            });*/
      //state.tag = res.data.data
      return res.data.data;
    } catch (err) {
      /*dispatch({
              type: types.TAG_ERROR,
              payload: { msg: err.response.statusText, status: err.response.status },
            });*/
      dispatch(
        setAlerts("Cant acess tag!! Internal server error", "error", true)
      );
      return rejectWithValue({ status: err.response });
    }
  }
);

export const getTagInfo = createAsyncThunk(
  "tag/getTagInfo",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`api/tag/taginfo/${id}`);
      //console.log(res.data);
      /*dispatch({
              type: types.GET_TAG_INFO,
              payload: res.data,
            });*/

      return res.data;
    } catch (err) {
      // dispatch({
      //   type: types.TAG_ERROR,
      //   payload: { msg: err.response.statusText, status: err.response.status },
      // });
      console.log("No Tag information Available");
      dispatch(
        setAlerts("Cant acess tag!! Internal server error", "error", true)
      );
      return rejectWithValue({ status: err.response });
    }
  }
);

export const getTags = createAsyncThunk(
  "tag/getTags",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get("/api/tag");
      console.log(res.data.data)
      return res.data.data;
    } catch (err) {
      /*dispatch({
              type: types.TAG_ERROR,
              payload: { status: err.response },
            });*/

      dispatch(
        setAlerts("Cant acess tag!! Internal server error", "error", true)
      );
      return rejectWithValue({ status: err.payload });
    }
  }
);

export const addTag = createAsyncThunk(
  "tag/addTag",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/api/tag", formData);
      /*dispatch({
          type: types.ADD_TAG,
          payload: res.data,
      });*/
      //state.addingTag = null
      //dispatch(getTags());
      dispatch(setAddingTag(null));
      console.log("tag added", formData);

      dispatch(setAlerts(`New Tag ${formData.tagId} added`, "success", true));
      return null;
    } catch (err) {
      if (err.response && err.response.data) {
        dispatch(setAlerts(err.response.data, "error", true));
      } else {
        console.log(err);
      }
      return rejectWithValue({ status: err.response });
    }
  }
);






export const editTag = createAsyncThunk(
  "tag/editTag",
   async(formData,{dispatch,rejectWithValue})=>{
      try{
        const  id = formData._id
   const res = await axios.patch(`/api/tag/${id}`, formData);
   /*dispatch({
     type: types.ADD_TAG,
     payload: res.data,
   });*/

     //state.addingTag = null
    //dispatch(getTags());
    dispatch(setAddingTag(null))
    console.log("tag height modified", formData)
  
    dispatch(setAlerts(`Height of  tag ${formData.tagId} modified`, "success", true));
    return null
     } catch (err) {
   if(err.response && err.response.data) {
     dispatch(setAlerts(err.response.data, "error", true));
     } else {
       console.log(err);
      }
        return rejectWithValue({status : err.response})
     }

   })





/////enter multiple tags
export const addTags = createAsyncThunk(
  "tag/addTags",
   async(formData,{dispatch,rejectWithValue})=>{
      try{
          console.log("received form data", formData)
   const res = await axios.post("/api/tag/multi/", formData);
   /*dispatch({
     type: types.ADD_TAG,
     payload: res.data,
   });*/

     //state.addingTag = null
    //dispatch(getTags());
    //dispatch(setAddingTag(null))
    console.log("tag added", formData)
  
    dispatch(setAlerts(`Multiple New Tags added`, "success", true));
    return null
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










export const deleteTag = createAsyncThunk(
    "tag/deleteTag",
    
    async(id,{dispatch,rejectWithValue})=>{
        try {
            await axios.delete(`/api/tag/${id}`);
            /*dispatch({
              type: types.DELETE_TAG,
              payload: id,
            });*/
            //state.tags= 
            dispatch(setAlerts("Tag Deleted", "success", "true"));
            return id
          } catch (err) {
            /* dispatch({
              type: types.TAG_ERROR,
            });*/
            
            dispatch(setAlerts("operation failed!", "error", "true"));
            return rejectWithValue({status : err.payload})
          }
    }

)

export const setAvailableTags = createAsyncThunk('tag/setAvailableTags', async(_, { dispatch, getState,rejectWithValue })=>{
  try{
   const state = getState()
   const linkedTagPlayers = state.linkedTagPlayer.linkedTagPlayers
   const tags  = state.tag.tags
   const availableTags = tags.filter(tag=> !linkedTagPlayers.find(el => el.tag._id === tag._id))
   console.log(availableTags)
   return availableTags
  }catch(err){
   console.log(err)
   return rejectWithValue({status:err.repsonse})
  }
})