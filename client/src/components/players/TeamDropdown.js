import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react'
import { selectTeam } from '../../feature/player/playerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getTeams } from '../../feature/team/teamThunk';

export default function TeamDropdown({ defaultTeam, select }) {
  // const dispatch = useDispatch()
  const [team, setTeam] = useState(defaultTeam?defaultTeam:'');
  const teams = useSelector(state=>state.team.teams)
  // useEffect(()=>{
  //   dispatch(getTeams())
  // },
  // [])
  useEffect(()=>{
    if(teams.length>0)
    console.log(teams.map(team=>team._id))
  },[teams])

  const handleChange = (event) => {
    event.preventDefault()
    console.log('List Value : ', event.target.value)
    setTeam(event.target.value);
    select(event.target.value)

  };

  console.log(defaultTeam, ' ', select)
  return (
    <Box 
    // minWidth='210%' 
    // sx={{height:'70%'}}
    >
     <FormControl 
     sx={{ minWidth:226, }}
     >
        <Select
          value={team}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{height:'41px'}}
        >
          <MenuItem value="">
            <em>None Selected</em>
          </MenuItem>
          {
            teams.map(team=><MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>)
          }
          {/* <MenuItem value={'Team 1'}>Team 1</MenuItem>
          <MenuItem value={'Team 2'}>Team 2</MenuItem>
          <MenuItem value={'Team 3'}>Team 3</MenuItem> */}
          {/* <MenuItem value={1}>Create a Team.</MenuItem> */}
        </Select>
        {/* <FormHelperText>Without label</FormHelperText> */}
      </FormControl>
    </Box>
  );
}