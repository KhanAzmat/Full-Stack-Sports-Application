import { Typography, Box, Card, Badge, IconButton, CardContent, CardMedia, Avatar, CardActionArea, Grid } from "@mui/material"
import { useState } from "react"
import PlayerForm from "./PlayerForm"
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePlayer } from "../../feature/player/playerThunk";
import { useDispatch } from "react-redux";

const PlayerCard = ({ key , player })=>{
  const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

    const editPlayer = ()=>{
        console.log('Edit Player')
        setOpen(true)
    }

    const handleClose = ()=>{
        setOpen(false)
    }

    const handleDelete = (event)=>{
      event.stopPropagation()
      event.preventDefault()
      dispatch(deletePlayer(player._id))
    }

    return <>
{open && <PlayerForm id={key} player={player} open={open} close={handleClose} />}
<Grid item xs={4}>
         <Badge 
  anchorOrigin={{
    vertical:'-20%',
    horizontal:'left'
  }}
  overlap="circular"
  badgeInset='10px'
        badgeContent={
    <Avatar src={`/uploads/playerImage/${player.image}`}  sx={{height:90, width:90}}/>
        }
        // color='transparent'
        sx={{mt:8, }}
        >
<Card elevation={5} sx={{minWidth : 300, minHeight:180, borderRadius:5}}>
  {/* <Typography sx={{mt:'2%', ml:'80%'}}>Test</Typography> */}
        <CardActionArea onClick={editPlayer}>
           <CardContent sx={{mt:-1}}> 
           <Avatar sx={{ml:'88%', mb:'7%'}} >
            <IconButton onClick={handleDelete} 
            onMouseDown={event=>event.stopPropagation()}  
            onTouchStart={(event) => event.stopPropagation()}>
              <DeleteIcon />  
            </IconButton>
      </Avatar>
            <Typography gutterBottom variant="h6" component="div">
            <Typography variant='subtitle2' display='inline'>Name&nbsp; : </Typography>
              {player.name}
            </Typography>
            <Typography gutterBottom variant="body2" >
            <Typography variant='subtitle2' display='inline'>Initials : </Typography>
              {player.initials}
            </Typography>
            {player.team &&
            <Typography variant="body2" >
            <Typography variant='subtitle2' display='inline'>Team &nbsp; : </Typography>
              {player.team?.name}
            </Typography>}
          </CardContent>
        </CardActionArea>
      </Card>

        </Badge>
        </Grid>
    </>
}

export default PlayerCard