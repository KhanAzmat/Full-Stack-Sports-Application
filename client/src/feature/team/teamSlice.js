import { createSlice } from "@reduxjs/toolkit";
import { getTeams, editTeam, addTeam, deleteTeam } from "./teamThunk";


const teamSlice = createSlice({
    name : 'team',
    initialState:{
        teams : [],
        error : {},
        loading : true,
    },
    reducers:{},
    extraReducers : {
        [getTeams.pending] : (state, { payload })=>{
            state.loading = true
        },
        [getTeams.fulfilled] : (state, { payload })=>{
            state.teams = payload
            state.loading = false
        },
        [getTeams.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },
        [addTeam.pending] : (state, { payload })=>{
            state.loading = true
        },
        [addTeam.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [addTeam.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },
        [editTeam.pending] : (state, { payload })=>{
            state.loading = true
        },
        [editTeam.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [editTeam.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },
        [deleteTeam.pending] : (state, { payload })=>{
            state.loading = true
        },
        [deleteTeam.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [deleteTeam.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },
    }
})

// export const {setPlayerToEdit,clearPlayer, selectTeam,clearTeamSelect } = teamSlice.actions
export default teamSlice.reducer