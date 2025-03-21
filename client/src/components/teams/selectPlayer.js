import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {FormHelperText, ListItemText, Checkbox,Box,Button,Dialog,DialogActions,DialogContent,
          DialogTitle,InputLabel,OutlinedInput,MenuItem,FormControl,Select,Chip} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { getPlayers,  setAvailableTeamPlayers } from '../../feature/player/playerThunk';
import { addLinkedTeamPlayer, createLinkedTeamPlayer, getLinkedTeamPlayers } from '../../feature/linkedTeamPlayer/linkedTeamPlayerThunk';
import { clearLinkedTeamPlayers, removeTeamSelection, setTeam } from '../../feature/linkedTeamPlayer/linkedTeamPlayerSlice';
// import { MultiSelect } from "react-multi-select-component";
import Multiselect from 'multiselect-react-dropdown';
import { removeAvailableTeamPlayers } from '../../feature/player/playerSlice';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const names = [
//     'Oliver Hansen',
//     'Van Henry',
//     'April Tucker',
//     'Ralph Hubbard',
//     'Omar Alexander',
//     'Carlos Abbott',
//     'Miriam Wagner',
//     'Bradley Wilkerson',
//     'Virginia Andrews',
//     'Kelly Snyder',
//   ];

function getStyles(name, personName, theme) {
  console.log(name)
  console.log(personName, ' ', personName.indexOf(name))
    return {
      fontWeight:theme.typography.fontWeightMedium,
        // personName.indexOf(name) === -1
        //   ? theme.typography.fontWeightRegular
        //   : theme.typography.fontWeightMedium,
    };
  }

const regexPattern = /^(.*?)\(/
let matches

export default function SelectPlayer({ open, onClose, team }) {
  const dispatch = useDispatch()
  const players = useSelector(state=>state.player.players)
  const linkedTeamPlayers = useSelector(state=>state.linkedTeamPlayer.linkedTeamPlayers)
  const availablePlayers = useSelector(state=>state.player.availablePlayersTeam)
  const teamSet = useSelector(state=>state.linkedTeamPlayer.selectTeam)
  const [openDialog, setDialogOpen] = React.useState(open);
  const [names, setNames] = useState([])
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [defaultNames, setDefaultNames] = React.useState([]);
  const [isError, setIsError] = useState(false)
  const selectRef = useRef()
  // let tempList = []
  useEffect(()=>{
    // dispatch(getPlayers())
    dispatch(getLinkedTeamPlayers())
    dispatch(setTeam(team._id))
    return(()=>{
      dispatch(removeTeamSelection())
      dispatch(removeAvailableTeamPlayers())
      // dispatch(clearLinkedTeamPlayers())
      dispatch(getPlayers())
    })
  },
  [])

  useEffect(()=>{
    if(teamSet)
    dispatch(setAvailableTeamPlayers())
  },
  [teamSet])

  useEffect(()=>{
    console.log(availablePlayers)
    if(Object.keys(availablePlayers).length > 0){
      setNames(availablePlayers.map(player=>(`${player.name}(${player._id})`)))
      let teamPlayers = availablePlayers.filter(player=>
        player.team?._id === team._id
      )
      setPersonName(teamPlayers.map(player=>(`${player.name}(${player._id})`)))
    }
  },
  [availablePlayers])

  // const handleChange = (event) => {
  //  console.log(event.target)
  // };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
        setDialogOpen(false);
        onClose()
    }
  };

  const handleSave = (event, reason)=>{
    if(personName.length === 0)
      {
        setIsError(true)
        return
      }
    let playerIds = []
    personName.forEach(player=>{
      let id = player.substring(player.indexOf('(')+1, player.lastIndexOf(')'))
      playerIds.push(id)
      })
    // const formData = new FormData()
    let selTeam = linkedTeamPlayers.find(player=>player.team._id === team._id)
    if(selTeam){
      // formData.append('players', JSON.stringify(playerIds))
      dispatch(addLinkedTeamPlayer({
        'id' : selTeam._id,
        'formData' : {
          'players' : playerIds
        }
      }))
    }      
    else{      
      // formData.append('team', team._id)
      // formData.append('players', JSON.stringify(playerIds))
      dispatch(createLinkedTeamPlayer({
        'team' : team._id,
        'players' : playerIds
      }))
    }
    if (reason !== 'backdropClick') {
      setDialogOpen(false);
      onClose()
  }
    
  }

  return (
    <div>
      <Dialog disableEscapeKeyDown open={openDialog} onClose={handleClose}>
        <DialogTitle>Select Players</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <FormControl sx={{ m: 1, width: 300 }} error={isError}>
        <InputLabel id="demo-multiple-chip-label">Players</InputLabel>
        <Select
          // defaultOpen={true}
          // defaultValue={defaultNames}
          placeholder='text'
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          // ref={selectRef}
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Players" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                let strName = value.substring(0,value.indexOf('('))
                let id = value.substring(value.indexOf('(')+1, value.lastIndexOf(')'))
                return <Chip key={id} label={strName} />
                })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => {
            let strName = name.substring(0,name.indexOf('('))
            let id = name.substring(name.indexOf('(')+1, name.lastIndexOf(')'))
            console.log(strName)
            return <MenuItem
            key={id}
            value={name}
            style={getStyles(name, personName, theme)}
            // selected={true}
          >
            {strName}
          </MenuItem>

          // <MenuItem key={name.id} value={name}>
          //   <Checkbox checked={personName.indexOf(name)} />
          //   <ListItemText primary={name.name} />
          // </MenuItem>
          })}
        </Select>
        {isError && <FormHelperText>Please select players.</FormHelperText>}
      </FormControl>
          </Box>

{/* <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <FormControl sx={{ m: 1, width: 300 }} error={isError}>
          <Multiselect
          options={availablePlayers}
          selectedValues={personName}
          onSelect={handleChange}
          onRemove={handleChange}
          displayValue='name'/>
          </FormControl>
          </Box> */}
        </DialogContent>                                                                                                                                                                                                                                    
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}