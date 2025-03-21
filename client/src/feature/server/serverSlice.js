import { createSlice } from "@reduxjs/toolkit";
import { getServer, getServers, editServer, deleteServer, addServer } from './serverThunk'

export const serverSlice = createSlice({
    name : 'server',
    initialState : {
        servers : [],
        loading : true,
        configServer : null,
    },
    reducers : {
        setCurrentServer : (state, { payload })=>{
            state.configServer = payload
        },

        removeCurrentServer : (state, { payload })=>{
            state.configServer = null
        }

    },
    extraReducers: {
        [getServers.pending] : (state, { payload })=>{
            state.loading = true;
        },

        [getServers.fulfilled] : (state, {payload})=>{
            state.loading = false;
            state.servers = payload;
        },

        [getServers.rejected] : (state, {payload})=>{
            console.log('Get Servers Error : ', payload);
            state.loading = false;
        },

        [getServer.pending] : (state, { payload })=>{
            state.loading = true;
        },
        [getServer.fulfilled] : (state, { payload })=>{
            state.loading = false;
            state.configServer = payload;
        },
        [getServer.rejected] : (state, { payload })=>{
            console.log('Get Server Error : ', payload);         
            state.loading = false;
        },
        [editServer.pending] : (state, { payload })=>{
            state.loading = true;
        },
        [editServer.fulfilled] : (state, { payload })=>{
            state.loading = false;
        },
        [editServer.rejected] : (state, { payload })=>{
            state.loading = false
        },
        [deleteServer.pending] : (state, { payload })=>{
            state.loading = true;
        },
        [deleteServer.fulfilled] : (state, { payload })=>{
            console.log('Delete Server Fulfilled : ', payload)
            state.loading = false;
        },
        [deleteServer.rejected] : (state, { payload })=>{
            console.log('Delete Server Error : ',payload)
            state.loading = false;
        },
        [addServer.pending] : (state, { payload })=>{
            state.laoding = true;
        },
        [addServer.fulfilled] : (state, { payload })=>{
            state.loading = false;
            console.log('Add Server Fulfilled : ', payload);
        },
        [addServer.rejected] : (state, { payload })=>{
            state.loading = false;
            console.log('Add Server Rejected : ', payload);
        }

    }
})

export const { setCurrentServer, removeCurrentServer } = serverSlice.actions

export default serverSlice.reducer







