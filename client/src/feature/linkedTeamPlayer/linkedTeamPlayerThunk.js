
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";


export const getLinkedTeamPlayers = createAsyncThunk('linkedTeamPlayer/getLinkedTeamPlayers', async(_, { dispatch, rejectWithValue })=>{
    try{
        const res = await axios.get('/api/linkedTeamPlayer')
        console.log(res.data.data)
        return res.data.data
    }catch(err){
        dispatch(setAlerts('Internal Server Error', true))
        return rejectWithValue({status:err.response})
    }
})

export const createLinkedTeamPlayer = createAsyncThunk('linkedTeamPlayer/createLinkedTeamPlayer', async(formData, { dispatch, rejectWithValue })=>{
    console.log(formData)
    try{  
        // const config = {
        //     headers : {
        //         'Content-Type' : 'application/x-www-form-urlencoded'
        //     },
        // }
        const res = await axios.post('/api/linkedTeamPlayer', formData)
        dispatch(getLinkedTeamPlayers())
    }catch(err){
        if(err.response && err.response.data) {
            dispatch(setAlerts(err.response.data, "error", true));
            } else {
            console.log(err);
            }

            return rejectWithValue({status:err.response})
    }
})

export const addLinkedTeamPlayer = createAsyncThunk('linkedTeamPlayer/addLinkedTeamPlayer', async(data, { dispatch, rejectWithValue })=>{
    console.log(data)
    const { id, formData } = data
    console.log(formData)
    try{
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            },
        }

        const res = await axios.patch(`/api/linkedTeamPlayer/${id}`, formData, config)
        dispatch(getLinkedTeamPlayers())
        console.log('Linked Team Player : ', res.data)
    }catch(err){
        const errors = err.response.data.errors
        console.log(`Errors : ${err.response}`)
        return rejectWithValue({status:err.response})
    }
})

export const removeLinkedTeamPlayers = createAsyncThunk('linkedTeamPlayer/removeLinkedTeamPlayers', async(id, { dispatch, rejectWithValue })=>{
    try{
        console.log(id)
        const res = await axios.patch(`/api/linkedTeamPlayer/removePlayers/${id}`)
        dispatch(getLinkedTeamPlayers())
        console.log('Linked Team Player : ', res.data)
    }catch(err){
        const errors = err.response.data.errors
        console.log(`Errors : ${errors}`)
        return rejectWithValue({status:err.response})
    }
})

export const deleteLinkedTeamPlayer = createAsyncThunk('linkedTeamPlayer/deleteLinkedTeamPlayer', async(id, { dispatch, rejectWithValue })=>{
    try{
        await axios.delete(`/api/linkedTeamPlayer/${id}`)
        dispatch(getLinkedTeamPlayers())
    }catch(err){
        return rejectWithValue({status : err.response})
    }
})

