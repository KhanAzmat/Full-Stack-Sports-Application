//This slice maintains state of assets

import { createSlice } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";

// import {getAsset,getAssets,addAsset,editAsset,deleteAsset} from "./assetThunk"
import { getPlayers, getPlayer, addPlayer, editPlayer, deletePlayer, setAvailablePlayers, setAvailableTeamPlayers } from './playerThunk'

export const playerSlice = createSlice({
    name : 'player',
    initialState : {
        player : null,
        availablePlayers : [],
        availablePlayersTeam : [],
        players : [],
        loading : true,
        selectedTeam : null,
        error : {}
    },
    reducers : {
        setPlayerToEdit : (state, { payload })=>{
            state.player = payload
        },

        clearPlayer : (state, { payload })=>{
            state.player = null
        },
        selectTeam : (state, { payload })=>{
            console.log('Inside palyer slice : ', payload)
            state.selectedTeam = payload
        },
        clearTeamSelect : (state, { payload })=>{
            state.selectedTeam = null
        },
        removeAvailableTeamPlayers : (state, { payload })=>{
            state.availablePlayersTeam = []
        }

    },
    extraReducers : {
        [getPlayers.pending] : (state, { payload })=>{
            state.loading = true
            state.players = []
        },
        [getPlayers.fulfilled] : (state, { payload })=>{
            state.players = payload
            state.loading = false
        },
        [getPlayers.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [addPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [addPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
            state.players = payload
        },
        [addPlayer.rejected] : (state, { payload })=>{
            state.loading = false
            state.error = payload
        },
        [editPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [editPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [editPlayer.rejected] : (state, { payload })=>{
             state.loading = false
             state.error = payload
        },
        [deletePlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [deletePlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [deletePlayer.rejected] : (state, { payload })=>{
            state.loading = false
            state.error = payload
        },
        [setAvailablePlayers.pending] : (state, { payload })=>{
            state.loading = true
        },
        [setAvailablePlayers.fulfilled] : (state, { payload })=>{
            state.availablePlayers = payload
            state.loading = false
        },
        [setAvailablePlayers.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },
        [setAvailableTeamPlayers.pending] : (state, { payload })=>{
            state.loading = true
        },
        [setAvailableTeamPlayers.fulfilled] : (state, { payload })=>{
            state.availablePlayersTeam = payload
            state.loading = false
        },
        [setAvailableTeamPlayers.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        }


    }
})


export const {setPlayerToEdit,clearPlayer, selectTeam,clearTeamSelect,removeAvailableTeamPlayers } = playerSlice.actions
export default playerSlice.reducer
