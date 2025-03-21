import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Switch, Chip, Drawer, Typography, Stack, FormControlLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FloorMenu } from '../UI/Menu';
import FloorDropDown from './FloorDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { toggleGrid, toggleView, togglezAxis } from '../../feature/layerSlice';

const useStyles = makeStyles((theme) => ({
    switch: {
        color:theme.palette.primary.main,
    }
}));

const DrawerCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const zValToggle = useSelector(state=>state.layer.zValToggle)
    const view3d = useSelector(state=> state.layer.view3d)
    const gridVisible = useSelector(state=>state.layer.gridVisible)
  const [toggleState, setToggleState] = React.useState(false);
  const [selectedChips, setSelectedChips] = React.useState([]);

  const handleToggleChange = () => {
    setToggleState(!toggleState);
    if(!toggleState){
        setSelectedChips([]);
    }
  };

  const handleClickChip = (label) => {
    if(toggleState){
        if (selectedChips.includes(label)) {
            setSelectedChips(selectedChips.filter((chip) => chip !== label));
          } else {
            setSelectedChips([...selectedChips, label]);
          }
    }
  };

  const chipColor = (label) => {    
    if(toggleState && selectedChips.includes(label)){
        return 'primary';
    }
    else{
        return 'default';
    }
  }

  const chipsData = props.tags//['Chip 1', 'Chip 2', 'Chip 3', 'Chip 4'];

  const handleZAxis = (e)=>{
    e.preventDefault()
    dispatch(togglezAxis())
   }
  
   const handleView = (e)=>{
    e.preventDefault()
    dispatch(toggleView())
   }
  
   const handleGrid = (e)=>{
    e.preventDefault()
    dispatch(toggleGrid())
   }

  return (
    <React.Fragment>
    {props.label !== 'Map' && 
    <Card sx={{ width:'220px', height:'100px', margin:'15px'}}>
    <CardHeader title={
      <Typography
      variant="h6"
      sx={{
        fontSize: '18px', // Adjust the font size as needed
        
        /* Add other styles if needed */
      }}
    >
      {props.label}
    </Typography>
    }
    action={
      <Switch
      className={classes.switch}
      sx={{alignSelf:'center', marginTop:'-10px', marginRight:'-5px'}}
            checked={toggleState}
            onChange={handleToggleChange}
            inputProps={{ 'aria-label': 'toggle switch' }}
          />
    }
    sx={{height:'40px', alignItems:'center', justifyContent: 'space-between', paddingBottom: '8px'}}/>
    <Divider />
    <CardContent>
      <Grid container spacing={2}>
        {chipsData.map((label, index) => (
          <Grid item key={index}>
            <Chip
            sx={{borderRadius:'8px', height:'28px', fontSize:'12px', '&:hover': {
              backgroundColor: selectedChips.includes(label) ? 'orange' : 'default',
            },
          boxShadow:2}}
              label={label}
              clickable
              onClick={() => handleClickChip(label)}
              color={chipColor(label)}
              variant='filled'
            />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>}
  {props.label === 'Map' &&
  <Card sx={{ width:'220px', height:'150px', margin:'15px'}}>
  <CardHeader title={
    <Typography
    variant="h6"
    sx={{
      fontSize: '18px', // Adjust the font size as needed
      
      /* Add other styles if needed */
    }}
  >
    {props.label}
  </Typography>
  }
   sx={{height:'40px', alignItems:'center', justifyContent: 'space-between', paddingBottom: '8px'}}/>
  <Divider />
  <CardContent>
    <Grid container spacing={2} >
      {/* {chipsData.map((label, index) => (
        <Grid item key={index}>
          <Chip
          sx={{borderRadius:'8px', height:'28px', fontSize:'12px', '&:hover': {
            backgroundColor: selectedChips.includes(label) ? 'orange' : 'default',
          },}}
            label={label}
            clickable
            onClick={() => handleClickChip(label)}
            color={chipColor(label)}
            variant='filled'
          />
        </Grid>
      ))} */}
      {/* <FloorMenu/> */}
      <Grid item xs={6} >
      {/* <FloorDropDown/> */}
      <FloorMenu/>
      </Grid>
      
      <Grid item xs={6}>
      <FormControlLabel sx={{margin:0, padding:0}}
        control={<Switch size="small" checked={zValToggle} onChange={handleZAxis} />}
        label={<Typography sx={{fontSize:'10px'}} color="textSecondary">Z-Index</Typography>}
      />
      </Grid>

      <Grid item xs={6} >
      <FormControlLabel sx={{margin:0, padding:0}}
        control={<Switch size="small" checked={view3d} onChange={handleView} />}
        label={<Typography sx={{fontSize:'10px'}} color="textSecondary">View</Typography>}
      />
      </Grid>
      <Grid item xs={6} >
      <FormControlLabel sx={{margin:0, padding:0}}
        control={<Switch size="small" checked={gridVisible} onChange={handleGrid} />}
        label={<Typography sx={{fontSize:'10px'}} color="textSecondary">Grid</Typography>}
      />
      </Grid>
    </Grid>
  </CardContent>
</Card>}
  </React.Fragment>
  );
};

export default DrawerCard;
