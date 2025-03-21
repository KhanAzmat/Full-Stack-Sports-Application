import { Stack, Tooltip, Fab, Divider } from '@mui/material'
import { Link } from "react-router-dom";
import { GltfIcon, FloorplanIcon, AnchorIcon, GeoFence} from "../UI/CustomIcon";
import{ DeleteOutlined } from "@mui/icons-material";
import {panelColor,themeColor} from '../themeColor'
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import { Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice';
import { useDispatch } from 'react-redux';
import { getConfigFloorplan } from '../../feature/floorplan/floorplanThunk';


const useStyles = makeStyles({
    button: {
      borderColor:'black',
      borderWidth:'100%'
      }
    
  });

const ProgressBar = (props) => {
  const { id, configured } = props
  // const [id, setId] = useState(null)
  // const [configured, setConfigured] = useState(false)
const floorplans = useSelector(state => state.floorplan.floorplans)
// useEffect(()=>{
//   const floorplan = floorplans.find(element => element._id === id)
//   setConfigured(floorplan.configured)
//   console.log(`Inside useEffect -- ID : ${id} configured : ${configured}`)
// }, [id])

// useEffect(()=>{
//   setId(props.id)
//   setConfigured(props.configured)
// },[props['id'], props['configured']])

console.log(`ID : ${id} configured : ${configured}`)

    const classes = useStyles();
    let colorIndex = useSelector((state)=>state.color.colorIndex) 


  let urlPath = window.location.pathname
  urlPath = urlPath.substring(
    urlPath.indexOf("/") + 1, 
    urlPath.lastIndexOf("/")
)

  return (
    <Stack alignItems='center' spacing={0} direction='row' ml='22%' mb='0.5%' >

<Divider spacing={0} flexItem style={{ flexGrow: 1}} sx={{ '&::before, &::after':{
  zIndex:1300,
  borderWidth:3,
      borderColor:'primary.light',
    mt:'-17%',
}}} >



<Tooltip title='Setup Floor Plan'>

            <Fab className={classes.button}
            //color = "primary"
              size = "small"
             
              aria-label='share'
              //onClick={() => onDeleteOpen(fp._id)}
              //variant = "extended"
              sx = {{  mt:{md:'0%',xl:'10%'}, background: `linear-gradient(180deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`, 
                      boxShadow:urlPath === 'configurefloor'? '0 0 8px 5px #89CFF0':null}}
            >
              
               
              <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                 to= {`/configurefloor/${id}`}>
                  <FloorplanIcon  fontSize ="small"/>
                  {console.log('Pathname : ', urlPath)}
                  </Link> 
               
               </Fab>   
                      
            </Tooltip>
            
</Divider>
        

<Divider spacing={0} flexItem style={{width:'100%',flexGrow: 1}} sx={{'&::before, &::after':{
  borderWidth:3,
    borderColor:'primary.light',
    mt:'-17%',
}}} >
<Tooltip title='Add/Remove Anchors'>
              <Fab
              //color = "primary"
              size = "small"
                aria-label='share'
                // sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                sx = {{ mt:{md:'0%',xl:'10%'}, background:`linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`,
                boxShadow:urlPath === 'iptable'? '0 0 8px 5px #89CFF0':null}}
                //onClick={() => onDeleteOpen(fp._id)}
                // disabled ={configured ? false : true}
              >
                 <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                 to= {`/iptable/${id}`}>
                    <HubRoundedIcon fontSize ="small"/>
            
                </Link>
              </Fab>
                 </Tooltip>
</Divider>


<Divider spacing={0} flexItem style={{ flexGrow: 1}} sx={{'&::before, &::after':{
  borderWidth:3,
  
    borderColor:configured?'primary.light':null,
    mt:'-17%',
}}} >
<Tooltip title='Configure Anchors'>
              <Fab
              //color = "primary"
              size = "small"
                aria-label='share'
                // sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                sx = {{ mt:{md:'0%',xl:'10%'}, background:configured?`linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null,
                boxShadow:urlPath === 'configureanchor'? '0 0 8px 5px #89CFF0':null}}
                //onClick={() => onDeleteOpen(fp._id)}
                disabled ={configured ? false : true}
              >
                 <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                 to= {`/configureanchor/${id}`}
                 state={{configured : `${configured}`}}>
                    <AnchorIcon   fontSize ="large"/>
            
                </Link>
              </Fab>
                 </Tooltip>
</Divider>
            
<Divider spacing={0} flexItem style={{width:'100%', flexGrow: 1}} sx={{'&::before, &::after':{
  borderWidth:3,
    borderColor:configured?'primary.light':null,
    mt:'-17%',
}}} >
<Tooltip title='Upload 3D Model' >
        <Fab
              //color = "primary"
                size='small'             
                // id = {fp._id}
                //onClick = {()=>handleAddGltfForm(fp._id)}
                disabled ={configured ? false : true}
                // sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                sx = {{ mt:{md:'0%',xl:'10%'}, background:configured?`linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null,
                boxShadow:urlPath === 'uploadgltf'? '0 0 8px 5px #89CFF0':null}} 
              >
               <Link
                 style = {{textDecoration : "none", color:"#fff"}} 
                to= {`/uploadgltf/${id}`}
                state={{configured : `${configured}`}}>
               
                    <GltfIcon   fontSize ="medium" />

               </Link>
              </Fab>
              </Tooltip>
</Divider>
        
<Divider spacing={0} flexItem style={{ flexGrow: 1}} sx={{'&::before, &::after':{
  borderWidth:3,
    borderColor:configured?'primary.light':null,
    mt:'-17%',
}}} >
<Tooltip title='Geo-Fence'  >
              <Fab
               size = "small"
                 //color = "primary"
                // id = {fp._id}
                // sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                sx = {{ mt:{md:'0%',xl:'10%'}, background:configured?`linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null,
                boxShadow:urlPath === 'drawgeofence'? '0 0 8px 5px #89CFF0':null}}
                disabled ={configured ? false : true}
              >
                <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                to= {`/drawgeofence/${id}`}
                state={{configured : `${configured}`}}>
                
                 <GeoFence  fontSize ="medium"/>
                  
                 </Link>  
                
              </Fab>
              </Tooltip>
</Divider>
             {/* <Divider spacing={0} flexItem style={{ flexGrow: 1}} sx={{'&::before, &::after':{
              borderWidth:3,
    borderColor:'black',
    mt:'-17%',
}}} >
             <Tooltip title='Delete'>
              <Fab
              size = "small"
                aria-label='share'
                // onClick={() => onDeleteOpen(fp._id)}
               // color = "primary"
                // sx = {{ mt:{md:'-10%',xl:0}, background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`, color:"#fff"}}
                sx = {{ mt:{md:'0%',xl:'10%'}, background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`}}
              >
                
                  
                    <DeleteOutlined  fontSize ="medium"/>
                  
                
              </Fab>
              </Tooltip>
             </Divider> */}
    </Stack>
  )
}





export default ProgressBar  