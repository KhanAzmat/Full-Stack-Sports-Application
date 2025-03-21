import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"


export const getTeams = createAsyncThunk('team/getTeams', async(_, { dispatch, rejectWithValue })=>{
    try{
        const res = await axios.get('/api/team/')
        console.log(res.data.data)
        return res.data.data
    }catch(err){
        return rejectWithValue({status:err.response})
    }
})

export const addTeam = createAsyncThunk('team/addTeam', async(formData, { dispatch, rejectWithValue })=>{
    try{
        console.log(...formData)
        const res = await axios.post('api/team', formData)
        dispatch(getTeams())
    }catch(err){
        console.log(`Error : ${err}`)
        return rejectWithValue({ status:err.response })
    }
})

export const editTeam = createAsyncThunk('team/editTeam', async(data, { dispatch, rejectWithValue })=>{
    const { id, formData } = data
    try{
        const config = {
            headers : {
                'Content-Type' : 'multipart/form-data'
            },
        }
        const res = await axios.patch(`/api/team/${id}`, formData, config)
        dispatch(getTeams())
        console.log('Edit Team : ', res.data)
    }catch(err){
        const errors = err.response.data.errors
        console.log(`Errors : ${errors}`)
        return rejectWithValue({status:err.response})
    }
})

export const deleteTeam = createAsyncThunk('team/deleteTeam', async(id, { dispatch, rejectWithValue })=>{
    try{
        console.log(id)
        await axios.delete(`/api/team/${id}`)
        dispatch(getTeams())
        return id
    }catch(err){
        return rejectWithValue({status:err.repsonse})
    }
})