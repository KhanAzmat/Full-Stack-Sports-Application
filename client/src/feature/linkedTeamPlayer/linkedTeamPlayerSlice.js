import { createSlice } from "@reduxjs/toolkit";
import { getLinkedTeamPlayers, addLinkedTeamPlayer,deleteLinkedTeamPlayer, createLinkedTeamPlayer, removeLinkedTeamPlayers} from "./linkedTeamPlayerThunk";


const linkedTeamPlayerSlice = createSlice({
    name : 'linkedTeamPlayer',
    initialState:{
        linkedTeamPlayers : [],
        selectPlayer : '',
        selectTeam : '',
        error : {},
        loading : true
    },
    reducers : {
        // onClickPlayer:(state, { payload })=>{
        //     state.selectPlayer = state.selectPlayer === payload?'':payload
        // },

        setTeam:(state, { payload })=>{
            console.log(payload)
            state.selectTeam = payload 
        },
        removeTeamSelection : (state, { payload })=>{
            state.selectTeam = ''
        },
        clearLinkedTeamPlayers : (state, { payload })=>{
            state.linkedTeamPlayers = []
        },
        // removePlayerSelection : (state, { payload })=>{
        //     state.selectPlayer = ''
        // }

    },
    extraReducers:{
        [getLinkedTeamPlayers.pending] : (state, { payload })=>{
            state.loading = true
        },
        [getLinkedTeamPlayers.fulfilled] : (state, { payload })=>{
            state.linkedTeamPlayers = payload
            state.loading = false
        },
        [getLinkedTeamPlayers.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [createLinkedTeamPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [createLinkedTeamPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [createLinkedTeamPlayer.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [addLinkedTeamPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [addLinkedTeamPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [addLinkedTeamPlayer.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [removeLinkedTeamPlayers.pending] : (state, { payload })=>{
            state.loading = true
        },
        [removeLinkedTeamPlayers.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [removeLinkedTeamPlayers.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [deleteLinkedTeamPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [deleteLinkedTeamPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [deleteLinkedTeamPlayer.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        }
    }

})

export const {setTeam,removeTeamSelection,clearLinkedTeamPlayers} = linkedTeamPlayerSlice.actions
export default linkedTeamPlayerSlice.reducer