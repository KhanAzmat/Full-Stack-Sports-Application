import { createSlice } from "@reduxjs/toolkit";

const trackerSlice = createSlice(
    {
        name:'tracker',
        initialState:{
            selectPlayer : '',
            selectTag : '',
            dummyPlayers : [
                {
                    id:1,
                    name:'Player 1',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:2,
                    name:'Player 2',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:3,
                    name:'Player 3',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:4,
                    name:'Player 4',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:5,
                    name:'Player 5',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:6,
                    name:'Player 6',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:7,
                    name:'Player 7',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:8,
                    name:'Player 8',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:9,
                    name:'Player 9',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:10,
                    name:'Player 10',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:11,
                    name:'Player 11',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
                {
                    id:12,
                    name:'Player 12',
                    img:'/static/media/avatar.jpeg',
                    color:'gray'
                },
            ],

            dummyTags : [
                {
                    _id:1,
                    tagId : 'Tag_1',
                    color:'gray'
                },
                {
                    id:2,
                    color:'gray'
                },
                {
                    id:3,
                    color:'gray'
                },
                {
                    id:4,
                    color:'gray'
                },
                {
                    id:5,
                    color:'gray'
                },
                {
                    id:6,
                    color:'gray'
                },
                {
                    id:7,
                    color:'gray'
                },
                {
                    id:8,
                    color:'gray'
                },
                {
                    id:9,
                    color:'gray'
                },
                {
                    id:10,
                    color:'gray'
                },
                
            ],

            playerSelected:null,
            tagSelected:null,
            countLinked:0,
        },

        reducers:{
            onClickPlayer:(state, { payload })=>{
                state.selectPlayer = state.selectPlayer === payload?'':payload
            },

            onClickTag:(state, { payload })=>{
                state.selectTag = state.selectTag === payload ? '':payload
            },

            onLinkTag:(state)=>{
                const player = state.dummyPlayers.find(player=>player.name === state.playerSelected)
                player.color = 'orange'
                console.log(player)
                const tag = state.dummyTags.find(tag=>tag.id === state.tagSelected)
                tag.color = 'orange'
                console.log(tag)

                state.dummyPlayers = state.dummyPlayers.filter(player=>player.name !== state.playerSelected)
                state.dummyTags = state.dummyTags.filter(tag=>tag.id !== state.tagSelected)
                state.dummyPlayers.splice(state.countLinked, 0, player)
                state.dummyTags.splice(state.countLinked, 0, tag)

                state.countLinked++
                state.playerSelected=null
                state.tagSelected=null
            }
        }
    }
)


export const { onClickPlayer, onClickTag, onLinkTag } = trackerSlice.actions
export default trackerSlice.reducer