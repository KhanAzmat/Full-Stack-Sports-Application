import { Card, List, ListItem, ListItemButton, Avatar, Chip, Typography } from "@mui/material"
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { onClickPlayer, onClickTag } from '../../feature/linkedTagPlayer/linkedTagPlayerSlice'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


const ListCardTag = ({name, tId })=>{
    const dispatch = useDispatch()
    const [colour, setColour] = useState('#FDD5A0')
    const tagSelected = useSelector(state=>state.linkedTagPlayer.selectTag)
    useEffect(()=>{
      console.log('Tag Selected : ', tagSelected)
          const col = tagSelected === tId ? 'darkorange' : '#FDD5A0'
          setColour(col)   
  },
  [tagSelected])
    

  useEffect(()=>{
    console.log('Colour : ', colour)
  },
  [colour])

    const selectTag = (event)=>{
        console.log('Inside Select tag', event.target.innerText)
        dispatch(onClickTag(tId))
    }


    return <ListItem disablePadding={true} disableTouchRipple>
            <Chip
            sx={{backgroundColor:`${colour}` ,m:'1vw', width:'25vw', height:'10vh',
            "&&:hover": {
              backgroundColor: `${colour}`
            }}}
            clickable={true}
            onClick={selectTag}
        label={<Typography variant="headline" component="h5">{name}</Typography>}
        variant="outlined"
      />
          </ListItem>
          
}

export default ListCardTag