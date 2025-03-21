import * as React from 'react';
import {Button, ButtonGroup} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTeam } from '../../feature/team/teamThunk';
import { getLinkedTeamPlayers, removeLinkedTeamPlayers } from '../../feature/linkedTeamPlayer/linkedTeamPlayerThunk';
import { useEffect, useState } from 'react';
import { getPlayers } from '../../feature/player/playerThunk';

export default function ConfirmDelete({ open, onClose, team }) {
  const [teamToDel, setTeamToDel] = useState({})
  const [disableButton, setDisableButton] = useState(true)
  const dispatch = useDispatch()
  const linkedTeamPlayers = useSelector(state=>state.linkedTeamPlayer.linkedTeamPlayers)
  useEffect(()=>{
    dispatch(getLinkedTeamPlayers())
    return(()=>{
      dispatch(getPlayers())
    })
  },
  [])

  useEffect(()=>{
    if(Object.keys(linkedTeamPlayers).length>0){
      let temp = linkedTeamPlayers.find(obj=>obj.team._id === team._id)
      console.log(temp)
      setTeamToDel(temp)
      if(temp?.players.length>0)
      setDisableButton(false)
    }
  },
  [linkedTeamPlayers])
  const [openDialog, setOpenDialog] = React.useState(open);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    onClose()
  };

  const handleRemoveTeam = ()=>{
    console.log('Remove Team')
    dispatch(deleteTeam(team._id))
    handleClose()
  }

  const handleRemovePlayers = ()=>{
    console.log('Remove Players')
    // if(Object.keys(linkedTeamPlayers).length>0){
    //   let teamToDel = linkedTeamPlayers.filter(team=>team.team._id === team._id)
    //   dispatch(removeLinkedTeamPlayers(teamToDel._id))
    // }
    console.log(teamToDel)
    dispatch(removeLinkedTeamPlayers(teamToDel._id))
    handleClose()
  }

  return (
    <React.Fragment>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete team ${team.name}?`}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          {/* <Button onClick={handleClose} variant='outlined'>Cancel</Button>
          <Button onClick={handleClose} autoFocus variant='outlined'>
            Delete
          </Button> */}

<ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button autoFocus variant='contained' sx={{width:'18vw',height:'8vh'}} onClick={handleRemovePlayers} disabled={disableButton}>Remove All PLayers</Button>
      <Button autoFocus variant='contained' sx={{width:'18vw',height:'8vh'}} onClick={handleRemoveTeam}>Remove Team</Button>
      {/* <Button>Three</Button> */}
    </ButtonGroup>

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}