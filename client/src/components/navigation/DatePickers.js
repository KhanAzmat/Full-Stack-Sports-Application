import * as React from 'react';
import dayjs from 'dayjs';
import { Box, InputAdornment, IconButton, Grid, TextField} from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import TodayIcon from '@mui/icons-material/Today';
import { Paper } from '@material-ui/core';
import { useState } from 'react';
import zIndex from '@mui/material/styles/zIndex';
// import { background } from 'jimp/types';

export default function DatePickers(props) {
  const [isError, setIsError] = useState(props.isError)


  const handleFocus = ()=>{
    console.log('On Focus');
  }

  const handleChange = (value)=>{
    if(value) {
      setIsError(false)

    }
    else  setIsError(true)
  }

  const handleClose = (value)=>{
    console.log('Inside Close')
    console.log(value)
  }

  const handleAccept = (value)=>{
    if(value){
      props.chooseDate(value)

    }    
  else setIsError(true)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DesktopDatePicker'
        ]}
        sx={{
          // display:'inline', 
          width:'18vw', 
          // position:'fixed',
        // top:-3,
        // left: props.left,
      }}
      >
      <Paper >
  <DesktopDatePicker 
  label={props.label} 
  minDate={props.start}
  maxDate={props.end}
  onChange={handleChange} 
  onAccept={handleAccept}
  onClose={handleClose}
  sx={{zIndex:'drawer'+1}} 
  slotProps={{
    popper: {
      disablePortal: true,
    },
    textField: {
      sx:{zIndex:'drawer'+2},
      onChange:{handleChange},
      error:isError, 
      size:"small",
      // InputProps: {
      //   color:'primary',
      //   endAdornment: (
      //     <InputAdornment position="end" sx={{zIndex:'drawer'}}>
      //       <TodayIcon />
      //     </InputAdornment>
      //   ),
      // },
    },
  }}/>       
  </Paper>
      </DemoContainer>
    </LocalizationProvider>
  );
}
