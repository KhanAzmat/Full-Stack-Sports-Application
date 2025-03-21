import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {Select, Button, Grid} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
    //   maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 150
    },
    sx:{
        backgroundColor:'red'
    }
  },
};

// const names = [
//   'Oliver Hansen',
//   'Van Henry',
//   'April Tucker',
//   'Ralph Hubbard',
//   'Omar Alexander',
//   'Carlos Abbott',
//   'Miriam Wagner',
//   'Bradley Wilkerson',
//   'Virginia Andrews',
//   'Kelly Snyder',
// ];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function PlayerList({ search }) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
const [selectedPlayers, setSelectedPlayers] = useState([])
const [names, setNames] = useState([])
const playerNames = useSelector(state=>state.linkedTagPlayer.playersForPlayback)


useEffect(()=>{
    console.log(playerNames)
    if(playerNames.length>0)
    setNames(playerNames)
},
[playerNames])

useEffect(()=>{
    if(personName.length > 0)
    setSelectedPlayers(personName)
}
,[personName])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleClick = ()=>{
    // search(selectedPlayers)
    search()
    setPersonName([])
    setSelectedPlayers([])
  }
  return (
    <div>
        <Grid container justifyContent='center'>
            {/* <Grid item xs={12}>
            <FormControl sx={{
        width: '100%', 
        }} size='small' >
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          sx={{backgroundColor:'white'}}
        >
          {names.length>0 && names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>

      </FormControl>
            </Grid> */}
            <Grid item sx={{position:'relative', top:10}}>
            <Button variant="contained" onClick={handleClick} sx={{ 
        }}>Find</Button>
            </Grid>
        </Grid>
     
    </div>
  );
}
