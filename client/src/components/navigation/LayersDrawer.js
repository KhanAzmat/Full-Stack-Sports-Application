import React from 'react'
import {  useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { Drawer } from '@mui/material'
import DrawerCard from './DrawerCard'

const useStyles = makeStyles((theme) => ({
    drawer: {
      width: '250px',
    },
  }));

const LayersDrawer = (props) => {
const classes = useStyles();
const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  

//For Layers Drawer
const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Drawer id='drawer' anchor="right" open={props.open} onClose={props.close} sx={{zIndex:'1100'}}
    classes={{
      paper: classes.drawer
    }}
  >
        <DrawerCard label='Tag' tags={['ID', 'Alias']} />  
        <DrawerCard label='Anchor' tags={['ID']}/>  
        <DrawerCard label='Geofence' tags={['Alias']}/>  
        <DrawerCard label='Map' />
        

  </Drawer>
  )
};

export default LayersDrawer;
