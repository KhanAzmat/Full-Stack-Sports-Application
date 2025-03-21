
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import {  getAssets } from "../asset/assetThunk";
import axios from "axios";
import { removeTagPicked, setTagPicked } from "../linkedTagPlayer/linkedTagPlayerSlice";


export const getLinkedTag = createAsyncThunk(
    "linkedTag/getLinkedTag",
    
    async(id,{dispatch,rejectWithValue})=>{
        try {
            const res = await axios.get(`/api/linkedTag/${id}`);
        
            /*dispatch({
              type: types.GET_LINKED_TAG,
              payload: res.data.data,
            });*/
           //state.linkedTag = res.data.data
           return res.data.data
          } catch (err) {

            dispatch(setAlerts("Internal server error","error",true))
            return rejectWithValue({status: err.response})
          }

    }


)

export const getLinkedTags = createAsyncThunk(
    "linkedTag/getLinkedTags",

    async(_,{dispatch,rejectWithValue})=>{

        try {
            const res = await axios.get("/api/linkedTag");
            /*dispatch({
              type: types.GET_LINKED_TAGS,
              payload: res.data.data,
            });*/

            //state.linkedTags = res.data.data
         return res.data.data
          } catch (err) {
            /*dispatch({
              type: types.LINKED_TAG_ERROR,
              payload: { status: err.response },
            });*/

            ///state.error = 
            dispatch(setAlerts("Internal server error","error",true))
            return rejectWithValue({status:err.response})
          }

    }


)

export const addLinkedTag = createAsyncThunk(
    "linkedTag/addLinkedTag",
    async(formData, {dispatch,rejectWithValue})=>{
        const { asset, tag } = formData;
        const newFormData = {
          tag: tag._id,
          asset: asset 
        };
      
        try {
          const res = await axios.post("/api/linkedTag", newFormData);
          /*dispatch({
            type: types.ADD_LINKED_TAG,
            payload: res.data,
          });*/
         // state.linkedTag = res.data
         dispatch(getAssets())
         dispatch(setAlerts("Tag successfully Linked to Asset", "success", true));
          return res.data
         
          //dispatch(getAssets())
        } catch (err) {
          if(err.response && err.response.data) {
            dispatch(setAlerts(err.response.data, "error", true));
            } else {
            console.log(err);
            }

            return rejectWithValue({status:err.response})
        }
    }
)


export const editLinkedTag = createAsyncThunk(
    "linkedTag/editLinkedTag",
    async(data,{dispatch,rejectWithValue})=>{
        const {formData, id, alertMsg} = data
        try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
        
            const res = await axios.patch(`/api/linkedTag/${id}`, formData, config);
        
            /*dispatch({
              type: types.GET_LINKED_TAG,
              payload: res.data,
            });*/

            //state.linkedTag = res.data
            
            dispatch(setAlerts(alertMsg, "success", true));
            return res.data
          } catch (err) {
            const errors = err.response.data.errors;
        
            if (errors) {
              errors.forEach((error) => dispatch(setAlerts(error.msg, "error")));
            }
            return rejectWithValue({status: err.response})
          }

    }
)



export const deleteLinkedTag = createAsyncThunk (
    "linkedTag/deleteLinkedTag",

    async(id,{dispatch,rejectWithValue})=>{
        try {
            await axios.delete(`/api/linkedTag/${id}`);
            /*dispatch({
              type: types.DELETE_LINKED_TAG,
              payload: id,
            });*/

           dispatch(getAssets())

            dispatch(setAlerts("tag unlinked from asset", "success", "true"));
            //dispatch(getAssets())
            return id
          } catch (err) {
            /*dispatch({
              type: types.LINKED_TAG_ERROR,
            });*/
            
            dispatch(setAlerts("Internal Server error", "error", "true"));
             return rejectWithValue({status : err.response})
          }
    }


)


export const getLinkedTagbyTag = createAsyncThunk(

    "linkedTag/getLinkkedTagByTag",

    async(id,{dispatch,rejectWithValue})=>{
        try {
            const res = await axios.get(`api/tag/taginfo/${id}`);
            console.log(res)
           /* dispatch({
              type: types.GET_LINKED_TAG_INFO,
              payload: [id, res.data],
            })*/;
          //state.tagId=action.payload
          //state.tagInfo = res.data
          //state.loading= false
          //state.showCard= true
          // console.log('res.data : ', res.data.data.tagId)
          dispatch(removeTagPicked())
          dispatch(setTagPicked(res.data.data.tagId))
          return [id, res.data]
          } catch (err) { 
            console.log(err.response)
            if(err.response.status===404)
            {
            dispatch(setAlerts("New Tag!! yet to be registered", "info", "true"));
            }
            else{
              dispatch(setAlerts("Internal Server error", "error", "true"));
            }
            return rejectWithValue({status : err.response})
          }


    }
)