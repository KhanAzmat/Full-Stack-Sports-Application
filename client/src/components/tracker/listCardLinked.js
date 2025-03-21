import { Card, List, ListItem, ListItemButton, Avatar, Chip, Typography, Badge, IconButton } from "@mui/material"
// import Chip from '@mui/material-next/Chip';
import { onClickPlayer, onClickTag } from '../../feature/tracker/trackerSlice'
import { useDispatch, useSelector } from "react-redux";
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { deleteLinkedTagPlayer } from "../../feature/linkedTagPlayer/linkedTagPlayerThunk";

const ListCardLinked = ({name, color, image, linkedTag })=>{
    const { tagId } = linkedTag.tag
    console.log(tagId)
    const dispatch = useDispatch()
    const playerSelected = useSelector(state=>state.tracker.playerSelected)

    const selectPlayer = (event)=>{
        console.log('Inside Select Player', event.target.innerText);
        dispatch(onClickPlayer(event.target.innerText))
    }

    const selectTag = (event)=>{
        console.log('Inside Select tag', event.target.innerText)
        dispatch(onClickTag(event.target.innerText))
    }

    const handleUnlink = ()=>{
        console.log('Handle Unlink')
        dispatch(deleteLinkedTagPlayer(linkedTag._id))
    }
    return <>
 <ListItem disablePadding={true}>
            <Chip
            sx={{bgcolor:'#FDD5A0',m:'1vw', width:'25vw', height:'10vh', justifyContent:'start', overflow:'hidden',
            "&&:hover": {
                backgroundColor: '#FDD5A0'
              }}}
            clickable={true}
            onClick={selectPlayer}
            onDelete={handleUnlink}
            deleteIcon={<IconButton size='large' disableRipple={true}><LinkOffIcon sx={{ml:'2vw', color:'black'}}/></IconButton>}
            // avatar={<Avatar src={`/uploads/playerImage/${image}`} style={{height:'7vh', width:'7vh'}}/>}
        avatar={<Avatar src={`/uploads/playerImage/${image}`} style={{height:'10vh', width:'8vh',marginLeft:'0'}} variant='square' />}
        label={<><Typography variant="headline" component="h5">{name}</Typography>
                <Typography variant='caption' >{`Tag : ${tagId}`}</Typography></>}
        variant="outlined"
      />
          </ListItem>
    </>
          
}

export default ListCardLinked