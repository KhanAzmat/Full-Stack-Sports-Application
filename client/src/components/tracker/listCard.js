import { Card, List, ListItem, ListItemButton, Avatar, Chip, Typography } from "@mui/material"
import { makeStyles, withStyles } from "@material-ui/core/styles";
// import Chip from '@mui/material-next/Chip';
import { onClickPlayer, onClickTag } from '../../feature/linkedTagPlayer/linkedTagPlayerSlice'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


const ListCard = ({name, image, pId })=>{
    const dispatch = useDispatch()
    const [colour, setColour] = useState('#FDD5A0')
    const playerSelected = useSelector(state=>state.linkedTagPlayer.selectPlayer)
    useEffect(()=>{
      console.log('Player Selected : ', playerSelected)
      console.log('Id : ', pId)
        const col = playerSelected === pId? 'darkorange':'#FDD5A0'
        setColour(col)        
    },
    [playerSelected])
   

  useEffect(()=>{
    console.log('Colour : ', colour)
  },
  [colour])

    const selectPlayer = (event)=>{
        console.log('Inside Select Player', event.target.innerText);
        dispatch(onClickPlayer(pId))
    }

    const selectTag = (event)=>{
        console.log('Inside Select tag', event.target.innerText)
        dispatch(onClickTag(pId))
    }


    return <ListItem disablePadding={true} disableTouchRipple>
            <Chip
            sx={{backgroundColor:`${colour}` ,m:'1vw', width:'25vw', height:'10vh', justifyContent:'start', overflow:'hidden',
            "&&:hover": {
              backgroundColor: `${colour}`
            }}}
            clickable={true}
            onClick={selectPlayer}
        avatar={<Avatar src={`/uploads/playerImage/${image}`} style={{height:'10vh', width:'12vh',marginLeft:'0'}} variant='square' />}
        label={<Typography variant="headline" component="h5">{name}</Typography>}
        variant="outlined"
      />
          </ListItem>
          
}

export default ListCard