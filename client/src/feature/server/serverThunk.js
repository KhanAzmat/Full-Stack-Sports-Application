
import  {createAsyncThunk} from "@reduxjs/toolkit"
// import { setAlerts } from "../../_actions/alertAction"
import axios from "axios";



export const getServers = createAsyncThunk('server/getServers', async(_, { dispatch, rejectWithValue })=>{
    try{
        const res = await axios.get('/api/server')
        console.log('All Servers : ', res.data.data)
        return res.data.data
    }catch(err){
        return rejectWithValue({ status:err.response })
    }
})


export const addServer = createAsyncThunk('server/addServer', async(serverData, { dispatch, rejectWithValue })=>{
    console.log(serverData)
    try{
        const res = await axios.post('/api/server', serverData)
        dispatch(getServers())
    }catch(err){
        console.log(err)
        return rejectWithValue({ status:err.response })
    }
} )

export const editServer = createAsyncThunk('server/editServer', async(serverData, { dispatch, rejectWithValue })=>{
    const { data, id } = serverData
    console.log('Form Data : ', ...data)
    console.log('id : ', id)

    try{
        const config = {
            header : {
                'Content-Type' : 'multipart/form-data',
            },
        }
        const res = await axios.patch(`/api/server/${id}`, data, config)
        dispatch(getServers())
        console.log('Edit Server : ', res.data)
        return res.data.data
    }catch(err){
        const errors = err.response.data.errors
        if(errors)
            console.log('Edit Server Errors : ', errors)
        return  rejectWithValue({status : err.response})
    }
})

export const deleteServer = createAsyncThunk('server/deleteServer', async(id, { dispatch, rejectWithValue })=>{
    try{
        await axios.delete(`/api/server/${id}`)
        dispatch(getServers())
        return id
    }catch(err){
        return rejectWithValue({ status:err.response })
    }
})

export const getServer = createAsyncThunk('server/getServer', async(id, { dispatch, rejectWithValue })=>{
    try{
        const res = await axios.get(`/api/server/${id}`)
        console.log(res.data)
        return res.data.data
    }catch(err){
        console.log(err)
        return rejectWithValue({ status:err.repsonse })
    }
})
