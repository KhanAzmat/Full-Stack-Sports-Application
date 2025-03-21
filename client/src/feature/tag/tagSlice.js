

///This slice maintains state of tags


import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlerts } from "../../_actions/alertAction";
import {getTag, getTagInfo,getTags,addTag,deleteTag,addTags,editTag, setAvailableTags} from "./tagThunk"

export const tagSlice = createSlice({

name : "tag",
initialState:{
  tag: null,
  availableTags : [],
  tags: [],
  error: {},
  filtered: null,
  loading: true,
  showCard: false,
  tagInfo: null,
  addingTag : null,
  tagData:null

},
reducers : {


   setCurrentTag:(state, action)=>{
       state.tag= action.payload
   },

  

   setAddingTag : (state, action)=>{
       state.addingTag = action.payload
   },


   setTagData : (state, action)=>{
    state.tagData = action.payload
   }

},
extraReducers:{
  [getTag.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getTag.fulfilled] : (state,{payload})=>{
   state.tag=payload
   state.loading= false
  },
  [getTag.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [getTagInfo.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getTagInfo.fulfilled] : (state,{payload})=>{
   state.tag=payload
   state.loading= false
  },
  [getTagInfo.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },


  [getTags.pending]:(state,{payload})=>{
    state.loading = true
  },
  [getTags.fulfilled] : (state,{payload})=>{
   state.tags=payload
   state.loading= false
  },
  [getTags.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [addTag.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addTag.fulfilled] : (state,{payload})=>{
   state.addingTag = payload
   state.loading= false
  },
  [addTag.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

   


  [addTags.pending]:(state,{payload})=>{
    state.loading = true
  },
  [addTags.fulfilled] : (state,{payload})=>{
   //state.addingTag = payload
   state.loading= false
  },
  [addTags.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [editTag.pending]:(state,{payload})=>{
    state.loading = true
  },
  [editTag.fulfilled] : (state,{payload})=>{
   //state.addingTag = payload
   state.loading= false
  },
  [editTag.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },



  [deleteTag.pending]:(state,{payload})=>{
    state.loading = true
  },
  [deleteTag.fulfilled] : (state,{payload})=>{
   state.tags=state.tags.filter((um) => um._id !== payload)
   state.loading= false
  },
  [deleteTag.rejected]:(state, {payload})=>{
    state.loading = false
    state.error = payload
  },

  [setAvailableTags.pending] : (state, { payload })=>{
    state.loading = true
},
[setAvailableTags.fulfilled] : (state, { payload })=>{
    state.availableTags = payload
    state.loading = false
},
[setAvailableTags.rejected] : (state, { payload })=>{
    state.error = payload
    state.loading = false
}




}



})

export const {setCurrentTag,setAddingTag,setTagData} = tagSlice.actions
export default tagSlice.reducer