import { createSlice } from "@reduxjs/toolkit";
import { getLinkedTagPlayers, addLinkedTagPlayer,deleteLinkedTagPlayer, savePlaybackData, getAllLaps, getPlaybackData, getPlayersByDate, getLapsByCriteria} from "./linkedTagPlayerThunk";
import * as uuid from "uuid"

const linkedTagPlayerSlice = createSlice({
    name : 'linkedTagPlayer',
    initialState:{
        linkedTagPlayers : [],
        selectPlayer : '',
        selectTag : '',
        error : {},
        loading : true,
        tagPicked : '',
        tagDetails : {},
        saveTagData : false,
        time_start : '',
        laps : [],
        playbackData : [],
        playersForPlayback : [],
        displayCharts : false
    },
    reducers : {
        onClickPlayer:(state, { payload })=>{
            console.log('Payload : ', payload)
            state.selectPlayer = state.selectPlayer === payload?'':payload
        },

        onClickTag:(state, { payload })=>{
            state.selectTag = state.selectTag === payload ? '':payload
        },
        removeTagSelection : (state, { payload })=>{
            state.selectTag = ''
        },
        removePlayerSelection : (state, { payload })=>{
            state.selectPlayer = ''
        },
        setTagPicked : (state, { payload })=>{
            // console.log('Tag Picked : ', payload);
            state.tagPicked = payload;
            state.time_start = Date.now()
        },
        removeTagPicked : (state, { payload }) =>{
            state.tagPicked = '';
        },
        setPosX : (state, { payload })=>{
            state.posX = payload;
        },
        setTagDetails: (state, { payload })=>{
            // console.log('inside tag slice', payload);
            state.tagDetails = payload;
        },
        toggleDataSave: (state, { payload })=>{
            console.log(payload)
            state.saveTagData = payload
            state.lapId = uuid.v4()
        },
        clearPlayerList : (state, { payload })=>{
            state.playersForPlayback = []
        },
        clearLapList : (state, { payload })=>{
            state.laps = []
        },
        setDisplayCharts : (state, { payload })=>{
            state.displayCharts = payload
        }


    },
    extraReducers:{
        [getLinkedTagPlayers.pending] : (state, { payload })=>{
            state.loading = true
        },
        [getLinkedTagPlayers.fulfilled] : (state, { payload })=>{
            state.linkedTagPlayers = payload
            state.loading = false
        },
        [getLinkedTagPlayers.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [addLinkedTagPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [addLinkedTagPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [addLinkedTagPlayer.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },

        [deleteLinkedTagPlayer.pending] : (state, { payload })=>{
            state.loading = true
        },
        [deleteLinkedTagPlayer.fulfilled] : (state, { payload })=>{
            state.loading = false
        },
        [deleteLinkedTagPlayer.rejected] : (state, { payload })=>{
            state.error = payload
            state.loading = false
        },
        // [savePlaybackData.pending] : (state, { payload })=>{
        //     state.loading = true
        // },
        // [savePlaybackData.fulfilled] : (state, { payload })=>{
        //     state.loading = false
        // },
        // [savePlaybackData.rejected] : (state, { payload })=>{
        //     state.loading = false
        //     state.error = payload
        // },

        [getAllLaps.pending] : (state, { payload })=>{
            state.loading = true;
        },
        [getAllLaps.fulfilled] : (state, { payload })=>{
            state.laps = payload;
            state.loading = false;
        },
        [getAllLaps.rejected] : (state, { payload })=>{
            state.error = payload;
            state.loading = false;
        },

        [getPlaybackData.pending] : (state, { payload })=>{
            state.loading = true;
        },
        [getPlaybackData.fulfilled] : (state, { payload })=>{
            state.playbackData = payload;
            state.loading = false;
        },
        [getPlaybackData.rejected] : (state, { payload })=>{
            state.error = payload;
            state.loading = false
        },

        [getPlayersByDate.pending] : (state, { payload })=>{
            state.loading = true;
            state.playersForPlayback = []
        },
        [getPlayersByDate.fulfilled] : (state, { payload })=>{
            console.log(payload)
            state.playersForPlayback = payload
            state.loading = false;
        },
        [getPlayersByDate.rejected] : (state, { payload })=>{
            state.error = payload;
            state.loading = false;
        },

        [getLapsByCriteria.pending] : (state, { payload }) => {
            state.loading = true;
            state.laps = []
        },
        [getLapsByCriteria.fulfilled] : (state, { payload }) => {
            state.laps = payload;
            state.loading = false;
        },
        [getLapsByCriteria.rejected] : (state, { payload }) => {
            state.error = payload;
            state.loading = false;
        }
        

    }

})

export const {onClickTag, onClickPlayer,removeTagSelection ,removePlayerSelection, setTagPicked, removeTagPicked, setPosX, setTagDetails, toggleDataSave, clearPlayerList, setDisplayCharts, clearLapList} = linkedTagPlayerSlice.actions
export default linkedTagPlayerSlice.reducer
