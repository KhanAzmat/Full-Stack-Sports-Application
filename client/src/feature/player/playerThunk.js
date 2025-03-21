import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";


export const getPlayers = createAsyncThunk('player/getPlayers', async(_, { dispatch, rejectWithValue })=>{
    try{
        const res = await axios.get('/api/player/')
        console.log(res.data.data)
        return res.data.data
    }catch(err){
        return rejectWithValue({status : err.response})
    }
})

export const addPlayer = createAsyncThunk('player/addPlayer', async(formData, { dispatch, rejectWithValue })=>{
    try{
        // console.log(...formData)
        const res = await axios.post('api/player', formData)
        // dispatch(getPlayers())
        console.log(res.data.data)
        return res.data.data
    }catch(err){
        console.log(`Error : ${err}`)
        return rejectWithValue({ status:err.response })
    }
})

export const editPlayer = createAsyncThunk('player/editPlayer', async(data, { dispatch, rejectWithValue })=>{
    console.log('Inside Edit Player')
    const { id, formData } = data
    console.log(...formData)
    try{
        const config = {
            headers : {
                'Content-Type' : 'multipart/form-data'
            },
        }

        const res = await axios.patch(`/api/player/${id}`, formData, config)
        dispatch(getPlayers())
        console.log('Edit Player : ', res.data)
    }catch(err){
        const errors = err.response.data.errors
        console.log(`Errors : ${errors}`)
        return rejectWithValue({status:err.response})
    }
})


export const deletePlayer = createAsyncThunk('player/editPlayer', async(id, { dispatch, rejectWithValue })=>{
    console.log('Inside Delete Player Thunk')
    try{
        await axios.delete(`/api/player/${id}`)
        dispatch(getPlayers())
        return id
    }catch(err){
        return rejectWithValue({status:err.repsonse})
    }
})

export const setAvailablePlayers = createAsyncThunk('player/setAvailablePlayers', async(_, { dispatch, getState,rejectWithValue })=>{
   try{
    console.log('inside setAvailablePlayers')
    const state = getState()
    const linkedTagPlayers = state.linkedTagPlayer.linkedTagPlayers
    console.log('Linked tag players : ',linkedTagPlayers)
    const players  = state.player.players
    const availablePlayers = players.filter(player=> !linkedTagPlayers.find(el => el.player._id === player._id))
    console.log(availablePlayers)
    return availablePlayers
   }catch(err){
    console.log(err)
    return rejectWithValue({status:err.repsonse})
   }
})
 

export const setAvailableTeamPlayers = createAsyncThunk('player/setAvailableTeamPlayers', async(_, { dispatch, getState, rejectWithValue })=>{
    try{
        console.log('Inside set available team players')
        const state = getState()
        const players = state.player.players
        const team = state.linkedTeamPlayer.selectTeam
        console.log('team : ', team)
        console.log('players : ', players)
        const availablePlayers = players.filter(player=>(!player.team || player.team._id === team))
        console.log(availablePlayers)
        return availablePlayers
    }catch(err){
        console.log(err)
        return rejectWithValue({status:err.response})
    }
})
