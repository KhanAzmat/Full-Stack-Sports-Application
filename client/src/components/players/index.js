import { Typography, Box, Card, Badge, IconButton, CardContent, CardMedia, Avatar, CardActionArea, Paper, Grid } from "@mui/material"
import Header from "../servers/pageHeader"
import { useSelector, useDispatch } from "react-redux"
import CancelIcon from '@mui/icons-material/Cancel';
import PlayerCard from "./PlayerCard";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import PlayerForm from "./PlayerForm";
import { useEffect, useState } from "react";
import { getPlayers } from "../../feature/player/playerThunk";
import { getTeams } from "../../feature/team/teamThunk";

const Players = ()=>{
    const dispatch = useDispatch()
    const [openForm, setOpenForm] = useState(false)
    const height = useSelector(state=>state.dimension.height)
    const width = useSelector(state=> state.dimension.width)
    const players = useSelector(state=>state.player.players)

    useEffect(()=>{
        dispatch(getPlayers())
        dispatch(getTeams())
    },[])

    useEffect(()=>{
        console.log('All Players :')
        console.log(players)
    },
    [players])

    const createPlayer = ()=>{
        setOpenForm(true)
    }
    
    const handleClose = ()=>{
        setOpenForm(false)
    }

    return <>
    {openForm && <PlayerForm open={openForm} close={handleClose}/>}
    <Box position='fixed' sx={{height:'100vh', touchAction:'none'}} 
  display='grid'  gridTemplateRows="0.6fr 99.4fr" gridTemplateAreas='"header" "body"'
>
        <Box position='fixed' sx={{zIndex:'drawer', gridArea:'header'}} >
          <Header box1_h={height<900? 5.6 : 5} box2={height>width? {height:3.8, width:88}:
      height<900? {height:5, width:92} : {height:4.5, width:95}} label={'Players'}/>
  </Box>

  
    <Paper elevation={5} sx={{  width:'97.4vw',
     mt:10, ml:2, mr:2, mb:1 , pb:2, pt:1, borderRadius:5, overflow:'auto', gridArea:'body'}} >
    <Grid container display='flex' flexWrap='wrap' justifyContent='start' alignContent='start' sx={{pl:'3.7%', pb:'2%'}} overflow='auto'>

    {players.length>0 && players.map(player => <PlayerCard key={player._id} player={player}/>)}
    </Grid>
    </Paper>
    </Box>
 

   
    <Fab onClick={createPlayer} color="primary" aria-label="add" sx={{position:'fixed', bottom:'2vw', right:'2vw', width:'8vw', height:'8vw'}}>
        <AddIcon sx={{fontSize:'10vw'}}/>
      </Fab>
   
    </>
}

export default Players