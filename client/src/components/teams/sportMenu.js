import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SportsMenu({ chooseSport, defaultSport }) {
  const [sports, setSports] = React.useState(defaultSport);

  const handleChange = (event) => {
    setSports(event.target.value);
    chooseSport(event.target.value)
  };

  return (
    <Box 
    // minWidth='210%' 
    // sx={{height:'70%'}}
    >
     <FormControl 
     sx={{ minWidth:226, }}
     >
        <Select
          value={sports}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{height:'41px'}}
        >
          <MenuItem value="">
            <em>None Selected</em>
          </MenuItem>
          <MenuItem value={'basketball'}>Basketball</MenuItem>
          <MenuItem value={'football'}>Football</MenuItem>
          <MenuItem value={'baseball'}>Baseball</MenuItem>
        </Select>
        {/* <FormHelperText>Without label</FormHelperText> */}
      </FormControl>
    </Box>
  );
}