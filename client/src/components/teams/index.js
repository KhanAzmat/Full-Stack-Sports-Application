
import { Typography, Box, Stack, Paper, Card, CardContent, Avatar, List, IconButton, Fab } from "@mui/material"
import Header from "../servers/pageHeader"
import { useDispatch, useSelector } from "react-redux"
import TeamCard from "./teamCard"
import AddIcon from '@mui/icons-material/Add';
import TeamForm from "./teamForm";
import { useEffect, useState } from "react";
import { getTeams } from "../../feature/team/teamThunk";
import { getPlayers } from "../../feature/player/playerThunk";
import { getLinkedTeamPlayers } from "../../feature/linkedTeamPlayer/linkedTeamPlayerThunk";


const Teams = ()=>{
    const dispatch = useDispatch()
    const height = useSelector(state=>state.dimension.height)
    const width = useSelector(state=> state.dimension.width)
    const teams = useSelector(state=>state.team.teams)
    const [openForm, setOpenForm] = useState(false)

    useEffect(()=>{
        dispatch(getTeams())
        dispatch(getPlayers())
        
    },
    [])
    useEffect(()=>{
        console.log(teams)
    },
    [teams])

    const createTeam = ()=>{
        setOpenForm(true)
    }

    const closeForm = ()=>{
        setOpenForm(false)
    }

    return <>
    {openForm && <TeamForm open={openForm} onClose={closeForm} />}

    <Box display='grid' gridTemplateRows='10% 3% 88% 3%' gridTemplateColumns='2% 96% 2%' sx={{touchAction:'none', position:'fixed'}}>
            <Box position='fixed' sx={{zIndex:'drawer'}} gridRow='1/2' gridColumn='1/4'>
          <Header box1_h={height<900? 5.6 : 5} box2={height>width? {height:3.8, width:88}:
      height<900? {height:5, width:92} : {height:4.5, width:95}} label={'Teams'}/>
  </Box>

  <Card elevation={3} sx={{ borderRadius:'1vw', height:'86.7vh', minWidth:'96vw', overflow:'auto', gridRow:'3/4', gridColumn:'2/3'}}>
        <CardContent sx={{display:'grid', gridTemplateColumns:'1% 98% 1%', justifyContent:'center', alignContent:'center'}}>
            <List style={{maxHeight: '100%', overflow: 'auto', gridColumn:'2/3'}}>
                {/* {dummyTeams.map(team=><TeamCard key={team.id} logo={team.logo} name={team.name} location={team.location} editTeam={createTeam}/>)} */}
                {teams.map(team=><TeamCard key={team.id} team={team} editTeam={createTeam}/>)}
            </List>
        </CardContent>
        </Card>
  </Box>
  <Fab onClick={createTeam} color="primary" aria-label="add" sx={{position:'fixed', bottom:'3.5%', right:'3%', width:'8vw', height:'8vw'}}>
        <AddIcon sx={{fontSize:'10vw'}}/>
      </Fab>
    </>
}

export default Teams