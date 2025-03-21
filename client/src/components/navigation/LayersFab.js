import React, { useEffect } from 'react'
import { Card, CardContent, Button, ButtonGroup, Drawer, IconButton, Stack, Box, Divider, Paper, Typography, ButtonBase} from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import ZoomInIcon from '@mui/icons-material/ZoomIn'; 
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import LayersIcon from '@mui/icons-material/Layers';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector, useDispatch } from 'react-redux'; 
import { useState } from 'react';
import { toggleDataSave } from '../../feature/linkedTagPlayer/linkedTagPlayerSlice';
import { getLinkedTagPlayers } from '../../feature/linkedTagPlayer/linkedTagPlayerThunk';
import { getAllLaps } from '../../feature/linkedTagPlayer/linkedTagPlayerThunk';
import TagCard from './tagCard';


const useStyles = makeStyles((theme) => ({
    bottomRightCard: {
        // width:'120px',
        // height:'36px',
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1200, // Set a higher zIndex to ensure the card appears above other content
    },

    cardContent: {
        // display: 'flex',
        
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    drawer: {
      width: '250px',
    },
    
    button:{
        '&:hover':{backgroundColor:'transparent', color:'black'}
    }
  }));

const LayersFab = (props) => {
  const dispatch = useDispatch()
  const pickedTag = useSelector(state=>state.linkedTagPlayer.pickedTag)
  const posX = useSelector(state=>state.linkedTagPlayer.posX)
    const classes = useStyles();
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [lapStart, setLapStart] = useState(false)
  
  useEffect(()=>{
    if(lapStart){
      dispatch(toggleDataSave(true))
      dispatch(getLinkedTagPlayers())
    }
    else{
      dispatch(toggleDataSave(false))
      dispatch(getAllLaps())
    }
  },[lapStart])

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };
  
    const toggleColor = ()=>{
      setLapStart(prev=>!prev)
    }

    return (
      <div>
        {/* Card with grouped buttons */}
        {/* <Card className={classes.bottomRightCard} sx={{ padding:'0' }}>
          <CardContent className={classes.cardContent} sx={{padding:'0'}}> */}
          <Paper elevation={4} sx={{ borderRadius: '7px' }}>
          {/* <TagCard/> */}
        <Stack className={classes.bottomRightCard} direction='row' spacing={1} >
        
        <Box border='1px solid  #ccc' borderRadius='7px' bgcolor='white' sx={{pt:'1.5%'}}
        // sx={{  display:'flex', flexDirection:'row', 
        // minWidth:'32%'
      // }}
        >
        <Typography display='inline' variant='button'>&nbsp;&nbsp;Speed&nbsp;:&nbsp;</Typography>
            <Typography display='inline' variant='caption' sx={{mt:'2%'}} > {props.speed?Math.round(props.speed *100)/100:'0.00'}&nbsp;&nbsp;</Typography>          
            <Divider sx={{display:'inline', 
            // mt:'-0.15vw'
            }} orientation='vertical' />
            <Typography display='inline' variant='button' >&nbsp;&nbsp;Jumps&nbsp;:&nbsp;</Typography> 
            <Typography display='inline' variant='caption' sx={{mt:'2%'}}>{props.jumpCount?props.jumpCount:'00'}&nbsp;&nbsp;</Typography>
            <Divider sx={{display:'inline', 
            // mt:'-0.15vw'
            }} orientation='vertical' />
            <Typography display='inline' variant='button' >&nbsp;&nbsp;Steps&nbsp;:&nbsp;</Typography> 
            <Typography display='inline' variant='caption' sx={{mt:'2%'}}>{props.stepCount?props.stepCount:'00'}&nbsp;&nbsp;</Typography>
          </Box>

        <Box border='1px solid  #ccc' borderRadius='7px' bgcolor='white' 
        // sx={{  display:'flex', flexDirection:'row', minWidth:'32%'}}
        >
            <Button disableRipple
            onClick={toggleColor}
            color={lapStart?'error':'success'}
            >{lapStart?'STOP':'START'}</Button>
        </Box>

        <Box border='1px solid  #ccc' borderRadius='7px' bgcolor='white'>
        <Stack direction='row' spacing={0}
         justifyContent='center'
         alignItems='center' 
         
         divider={<Divider orientation="vertical" flexItem />}>
            
                <IconButton className={classes.button} disableRipple size='small'>
                    <ZoomInIcon />
                </IconButton>
                <IconButton className={classes.button} disableRipple size='small'>
                    <ZoomOutIcon />
                </IconButton>
        
            </Stack>
        </Box>
        <Box border='1px solid  #ccc' borderRadius='7px' bgcolor='white'>
        <IconButton  className={classes.button} disableRipple size='small' onClick={props.showLayersDrawer}>
                    <LayersIcon />
                </IconButton>
        </Box>

        </Stack>
        </Paper>
      {/* </CardContent>
        </Card> */}
  
        {/* Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawer,
          }}
        >
          <div>Drawer Content</div>
        </Drawer>
      </div>
    );
};

export default LayersFab;
