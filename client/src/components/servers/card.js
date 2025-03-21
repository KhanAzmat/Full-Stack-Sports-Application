import { Card, Typography, CardMedia, CardContent, CardActionArea } from '@mui/material';
import { useState } from 'react';
import EditForm from './editForm';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentServer } from '../../feature/server/serverSlice';

const ActionCard = ({ key ,server })=>
{
    const dispatch = useDispatch()
    const servers = useSelector(state=>state.server.servers)
    const [open, setOpen] = useState(false)

    const editServer = ()=>{
        const serverToEdit = servers.find(el=>el._id === server._id)
        dispatch(setCurrentServer(serverToEdit))
        setOpen(prev=>!prev)
    }

    return <>
    {open && <EditForm key={key} open={open} editServer={editServer}/>}
        <Card key={key} elevation={5} sx={{maxWidth : 420,m:3, zIndex:'fab', borderRadius:5}}>
        <CardActionArea onClick={editServer}>
          <CardMedia
            component="img"
            height="200"
            sx={{minWidth:'40vw', maxWidth:'40vw', objectFit:'fill'}}
            image={`/uploads/serverImage/${server.image}`}
            alt="server image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {server.name}
            </Typography>
            <Typography variant="body2" >
              <Typography variant='subtitle2' display='inline'>Location : </Typography>
              {server.location}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      </>
}

export default ActionCard