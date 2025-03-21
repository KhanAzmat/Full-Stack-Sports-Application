import React, { useEffect } from 'react'
import {Box, List, ListItem, ListItemText, Card} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
//   border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




export const HomeScreenModal = () => {
    const [open, setOpen] = React.useState(true);
    const [display,setDisplay] = React.useState(true)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      localStorage.setItem('seenModal', true)
      setOpen(false);
    }
  
    useEffect(()=>{
      let retUser = localStorage.getItem('seenModal');
      setDisplay(!retUser)
    },[])
    return <>
    { 
      display && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Prerequisites...
            </Typography>
            <List component='ul'>
          <ListItem>
            <ListItemText primary="Gateway should be green." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Anchors are powered ON and connected to the same LAN network." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Tags are powered ON." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Floor-plan images and files are available." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Anchor measurement and position has been recorded." />
          </ListItem>
        </List>
          </Card>
        </Modal>
    )
    }
    </>
}
