import { Typography, Box, Stack, Paper, Card, CardContent, Avatar, List, IconButton, ListItem, ListItemText, Divider, ListSubheader, CardHeader, Badge, Fab } from "@mui/material"
import Header from "../servers/pageHeader"
import { useSelector } from "react-redux"
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SaveIcon from '@mui/icons-material/Save';
import ListCard from "./listCard";
import ListCardTag from "./listCardTag";
import ListCardLinked from "./listCardLinked";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getTags } from "../../feature/tag/tagThunk";
import { getPlayers } from "../../feature/player/playerThunk";
import { getLinkedTagPlayers } from "../../feature/linkedTagPlayer/linkedTagPlayerThunk";
import { setAvailablePlayers } from "../../feature/player/playerThunk";
import { setAvailableTags } from "../../feature/tag/tagThunk";
import { addLinkedTagPlayer } from "../../feature/linkedTagPlayer/linkedTagPlayerThunk";
import { removeTagSelection, removePlayerSelection } from "../../feature/linkedTagPlayer/linkedTagPlayerSlice";

const Tracker = ()=>{
    const height = useSelector(state=>state.dimension.height)
    const width = useSelector(state=> state.dimension.width)
    const dispatch = useDispatch()
    // const players = useSelector(state=>state.tracker.dummyPlayers)
    // const tags = useSelector(state=>state.tracker.dummyTags)
    const playerSelected = useSelector(state=>state.linkedTagPlayer.selectPlayer)
    const tagSelected = useSelector(state=>state.linkedTagPlayer.selectTag)
    const tags = useSelector(state=>state.tag.availableTags)
    const players = useSelector(state=>state.player.availablePlayers)
    const linkedTagPlayers = useSelector(state=>state.linkedTagPlayer.linkedTagPlayers)
    const [enabled,setEnabled] = useState(false)

    useEffect(()=>{
        dispatch(getTags());
        dispatch(getPlayers())
        dispatch(getLinkedTagPlayers())
    }, [])

    useEffect(()=>{
        dispatch(setAvailablePlayers())
        dispatch(setAvailableTags())
    },
    [linkedTagPlayers])

    useEffect(()=>{
        console.log(playerSelected)
        if (playerSelected && tagSelected)
            setEnabled(false)
        else 
            setEnabled(true)
    },[playerSelected, tagSelected])

    useEffect(()=>{
        console.log('Tags')
        console.log(tags)
        console.log(players)
    },
    [tags, players])

    const linkTag = ()=>{
        dispatch(addLinkedTagPlayer({tag:tagSelected, player:playerSelected}))
        dispatch(removeTagSelection())
        dispatch(removePlayerSelection())
        setEnabled(false)
    }


    return <>
    <Box display='grid' gridTemplateRows="0.2fr 99.8fr" gridTemplateAreas='"header" "body"' position='fixed' sx={{height:'100vh', touchAction:'none'}}>
        
            <Box position='fixed' sx={{zIndex:'drawer', gridArea:'head'}} >
          <Header box1_h={height<900? 5.6 : 5} box2={height>width? {height:3.8, width:88}:
      height<900? {height:5, width:92} : {height:4.5, width:95}} label={'Tracker Settings'}/>
  </Box>

  <Box display='grid'  gridTemplateColumns="31fr 31fr 31fr 7fr" gridTemplateAreas='"col1 col2 col3 col4"' position='fixed' sx={{ pt:'8%', touchAction:'none', gridArea:'body', width:'100%', height:'132%' }}>
            <Badge badgeContent='Players' sx={{mt:'1vw', ml:'1vw',gridArea:'col1',"& .MuiBadge-badge": { fontSize: 20, height: 30, minWidth: 15, left:'16%' }}} anchorOrigin={{horizontal:'left', vertical:'top'}} color="primary">
            <Card elevation={3} sx={{borderRadius:'1vw',  overflow:'auto', gridArea:'col1', alignContent:'center', width:'100%', height:'71.8%'}}>
        <CardContent sx={{display:'flex',justifyContent:'center',}}>
            <List style={{maxHeight: '100%', overflow: 'auto'}} disablePadding={true} dense={true} >
                {players.map(player=>{
                    console.log('Player Id : ', player._id)
                    return <ListCard key={player._id}  name={player.name} image={player.image} pId={player._id} color={player.color}  />
                })}
            </List>
        </CardContent>
        </Card>
            </Badge>

            <Badge badgeContent='Tags' sx={{mt:'1vw', ml:'1vw',gridArea:'col2',"& .MuiBadge-badge": { fontSize: 20, height: 30, minWidth: 15, left:'13%' }}} anchorOrigin={{horizontal:'left', vertical:'top'}} color="primary">
        <Card elevation={3} sx={{ borderRadius:'1vw',  overflow:'auto', gridArea:'col2', alignContent:'center',width:'100%',height:'71.8%'}}>
        <CardContent sx={{display:'flex', justifyContent:'center'}}>
            <List style={{maxHeight: '100%', overflow: 'auto'}} disablePadding={true} dense={true}>
                {tags.map(tag=><ListCardTag key={tag._id} color={tag.color} name={tag.tagId} tId={tag._id}/>)}
            </List>
        </CardContent>
        </Card>
</Badge>

<Badge badgeContent='Tagged Players' sx={{ mt:'1vw', ml:'1vw',gridArea:'col3',"& .MuiBadge-badge": { fontSize: 20, height: 30, minWidth: 15, left:'28%' }}} anchorOrigin={{horizontal:'left', vertical:'top'}} color="primary">
        <Card elevation={3} sx={{borderRadius:'1vw', overflow:'auto', gridArea:'col3', alignContent:'center',width:'100%', height:'71.8%'}}>
        <CardContent sx={{display:'flex', justifyContent:'center' }}>
            <List style={{maxHeight: '100%', overflow: 'auto', }} disablePadding={true} dense={true}>            
                {linkedTagPlayers.map(linkedTagPlayer=><ListCardLinked key={linkedTagPlayer._id} image={linkedTagPlayer.player.image} name={linkedTagPlayer.player.name} color={linkedTagPlayer.player.color} linkedTag={linkedTagPlayer} isTag={false}/>)}
            </List>
        </CardContent>
        </Card>
        </Badge>
<Fab sx={{alignSelf:'center', width:'88%',  height:'7%', borderRadius:'1vw', gridArea:'col4',mb:'32vh', ml:'0.5vw' }} disabled={enabled}>
<IconButton onClick={linkTag} size="large">
            <LockIcon sx={{fontSize:'200%', color:`${enabled?'gray':'orange'}`}}/>
            </IconButton>
</Fab>
</Box>
        {/* <Card elevation={3} sx={{alignSelf:'center', width:'90%',  height:'50%', borderRadius:'1vw', gridArea:'col4', m:'1vw'}}>
        <Stack direction='column' spacing={5} sx={{m:'10%'}}>
        <Avatar variant="rounded" sx={{m:'2%', height:'9vh', width:'7vw'}}>
            <IconButton disabled={playerSelected && tagSelected ? false : true} onClick={linkTag} size="large">
            <LockIcon sx={{fontSize:'200%', color:'darkorange'}}/>
            </IconButton>
        </Avatar>

        <Avatar variant="rounded" sx={{m:'2%', height:'9vh', width:'7vw'}}>
            <IconButton>
            <LockOpenIcon sx={{fontSize:'200%'}}/>
            </IconButton>
        </Avatar>
        <Avatar variant="rounded" sx={{m:'2%', height:'9vh', width:'7vw'}}>
            <IconButton>
            <SaveIcon sx={{fontSize:'200%', color:'green'}}/>
            </IconButton>
        </Avatar>
        </Stack>

        </Card> */}
        </Box>
        </>
}

export default Tracker