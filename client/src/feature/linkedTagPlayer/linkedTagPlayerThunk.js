
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";


export const getLinkedTagPlayers = createAsyncThunk(
    "linkedTagPlayer/getLinkedTagPlayers",

    async(_,{dispatch,rejectWithValue})=>{

        try {
            const res = await axios.get("/api/linkedTagPlayer");
            // console.log(res.data.data)
         return res.data.data
          } catch (err) {
            dispatch(setAlerts("Internal server error","error",true))
            return rejectWithValue({status:err.response})
          }

    }


)

export const addLinkedTagPlayer = createAsyncThunk(
    "linkedTagPlayer/addLinkedTagPlayer",
    async(formData, {dispatch,rejectWithValue})=>{
        const { player, tag } = formData;
        // const newFormData = {
        //   tag: tag._id,
        //   player: player 
        // };
      console.log(formData)
        try {
          const res = await axios.post("/api/linkedTagPlayer", formData);
         dispatch(getLinkedTagPlayers())
        //  dispatch(setAlerts("Tag successfully Linked to Asset", "success", true));
        //   return res.data
         
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

export const deleteLinkedTagPlayer = createAsyncThunk (
    "linkedTagPlayer/deleteLinkedTagPlayer",

    async(id,{dispatch,rejectWithValue})=>{
        try {
            await axios.delete(`/api/linkedTagPlayer/${id}`);
           dispatch(getLinkedTagPlayers())

            // dispatch(setAlerts("tag unlinked from asset", "success", "true"));
            return id
          } catch (err) {            
            // dispatch(setAlerts("Internal Server error", "error", "true"));
             return rejectWithValue({status : err.response})
          }
    }


)

export const savePlaybackData = createAsyncThunk(
  'linkedTagPlayer/savePlaybackData', 
  async(playbackData, { dispatch, rejectWithValue })=>{
    try{
      console.log(playbackData)
      const res = await axios.post('api/linkedTagPlayer/savePlaybackData', playbackData);
      console.log(res)
      // dispatch(getAllPlaybackData())
    }catch(err){
      return rejectWithValue({status : err.response})
    }
  }
)

export const getPlaybackData = createAsyncThunk(
  'linkedTagPlayer/getPlaybackData',
  async(id, { dispatch, rejectWithValue })=>{
    console.log('ID : ', id)
    try{
      const res = await axios.get(`api/linkedTagPlayer/getPlaybackData/${id}`)
      // console.log(res.data.data)
      return res.data.data
    }catch(err){
      return rejectWithValue({status:err.response})
    }
  }
)

export const getAllLaps = createAsyncThunk(
  'linkedTagPlayer/getAllLaps',
  async(_, { dispatch, rejectWithValue })=>{
    try{
      const res = await axios.get('api/linkedTagPlayer/getAllLaps')
      console.log(res.data.data)
      return res.data.data
    }catch(err){
      return rejectWithValue({status:err.response})
    }
  }
)


export const getLapsByCriteria = createAsyncThunk(
  'linkedTagPlayer/getLapsByCriteria',
  async(conditions, { dispatch, rejectWithValue })=>{
    try{
      console.log(conditions)
      // const res = await axios.get('api/linkedTagPlayer/getLapsByCriteria')
      const res = await axios.get('api/linkedTagPlayer/getLapsByCriteria', {
        params:{
            ...conditions
        }
    })
      console.log(res.data.data)
      return res.data.data
    }catch(err){
      return rejectWithValue({status:err.response})
    }
  }
)


export const getPlayersByDate = createAsyncThunk(
  'linkedTagPlayer/getPlayersByDate',
  async(dates, { dispatch, rejectWithValue })=>{
    try{
      console.log(dates)
      const res = await axios.get('api/linkedTagPlayer/getPlayersByDate', {
        params:{
            ...dates
        }
    })

    let data = res.data.data.map(el=>el.player)
      console.log(res.data.data)
      return data;
    }catch(err){
      return rejectWithValue({status:err.response})
    }
  }
)
