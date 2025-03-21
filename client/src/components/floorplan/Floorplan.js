import img from './img.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from "react";
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import {
  getFloorplans,
  setCurrentFloorplan,
  deleteFloorplan,
  
  getConfigFloorplan
} from "../../feature/floorplan/floorplanThunk";
import { Link } from "react-router-dom";
import Confirm from "../UI/Confirm";
import AuthAppBar from "../UI/AuthAppBar";
import {setCurrentFloorId, setFloorImage} from "../../feature/floorplan/floorplanSlice"

  import {
    GestureOutlined,
    BorderInnerOutlined,
    Add,
    DeleteOutlined,
    ThreeDRotation,
  } from "@mui/icons-material";
import { Badge, Typography, Fab, Tooltip, Grid, LinearProgress, DialogActions, Paper, Drawer, Stack, Skeleton, ButtonBase } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from "prop-types";
import { connect,useSelector,useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardMedia } from "@mui/material";

import NotAvailable from "../UI/NotAvailable";
import AddFloorPlan from "./AddFloorPlan";

import { setAlerts } from "../../_actions/alertAction";
import { resetAnchor } from "../../feature/anchor/anchorSlice";
import { Grow } from "@mui/material";
import io from "socket.io-client"

//import { getGltfOfFenceFloor } from "../../feature/gltf/gltfSlice";
//import AddGLTF from "./AddGLTF";
import { AnchorIcon, GeoFence } from "../UI/CustomIcon";
import { GltfIcon,FloorplanIcon } from "../UI/CustomIcon";
import { Box } from "@mui/material";

import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";

import { getAnchorsOfFloor } from "../../feature/anchor/anchorThunk";
import {panelColor,themeColor} from '../themeColor'
import { Avatar } from "@mui/material";
import { useTheme } from '@emotion/react';


const useStyles = makeStyles((theme) => ({
  root: {
   
   
  
    
  },
  table: {
    minWidth: 650,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  media: {
    
    height:100
  },
  spinner: {
    width: "100%",
    marginTop: "20%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },

  dialogRoot : {
    borderRadius : '30px',
    maxWidth : 1000

  },
  cardAction: {justifyContent:"space-around"},
  
  icon:{
    [theme.breakpoints.up('xl')]:{
      fontSize:'1.5vw'
    },

    [!theme.breakpoints.up('xl') && theme.breakpoints.up('lg')]:{
      fontSize:'1.8vw'
    }
  }

}));
//var n = 1

const Floorplan = (props) => {
  const theme = useTheme()
  let isLarge = useMediaQuery(theme.breakpoints.up('xl'))
let matchLg = useMediaQuery(theme.breakpoints.up('lg'))
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delId, setDelId] = useState("");
  const [addFloorPlanForm, setAddFloorPlanForm] = useState(false);
  const [addGltfForm,setAddGltfForm] = useState(false)
  const [openFanceFloorplan, setOpenFanceFloorplan] = useState(false);
  const [n,setN] = useState(0)
  const [open, setOpen] = useState(true)
  const [openDrawer, setDrawerOpen] = useState(false)
  const apiToken = useSelector((state)=>state.auth.token)

  const floorplans = useSelector((state)=>state.floorplan.floorplans)
  const colorIndex = useSelector((state)=>state.color.colorIndex)
  const anchorToBeRemoved = useSelector((state)=>state.anchor.anchor)
  const flrImage = useSelector(state=>state.floorplan.flrImage)

  
  const dispatch = useDispatch()
  useEffect(() => {
       console.log('Breakpoint : ' ,isLarge, ' ', matchLg)
        dispatch(getFloorplans());
        setOpen(true)
    //eslint-disable-next-line
  },[]);


  useEffect(()=>{
      if(floorplans)
      {   
          setOpen(false)
      }
  },[floorplans])  
  
  
  const classes = useStyles();

  

  const handleAddFloorPlanOpen = () => {
    
    setAddFloorPlanForm(true);
  };
  const handleAddFloorPlanClose = () => {

    setAddFloorPlanForm(false);
  };
  
  const handleFenceFloorplanOpen = (id) => {
    console.log("geoFloorplan>>",id)
   // e.preventDefault()
    if(id)
    {
      console.log("current floor id>>>>>",id)
     // dispatch(getGltfOfFenceFloor(id))
     dispatch(setCurrentFloorId(id)) 
     dispatch(getConfigFloorplan(id))
     
     setN(n + 1)
     //setOpenFanceFloorplan(true)
    }

    

  } 
  const handleFenceFloorplanClose = (e) => {
   
    //setOpenFanceFloorplan(false)
  } 

  const handleAddGltfForm = (id) => {
    console.log("geoFloorplan>>",id)
   // e.preventDefault()
    if(id)
    {
     console.log("current floor id>>>>>",id)
     dispatch(setCurrentFloorId(id)) 
     setN(n + 1)
     dispatch(setAddGltfForm(true))
    }
    

  }
  
  const handleAddGltfFormClose = (e) => {
   
      setAddGltfForm(false)
  } 



  useEffect(()=>{

    console.log("Anchor config", anchorToBeRemoved)
    if(delId)
    {
    if(anchorToBeRemoved && anchorToBeRemoved.length > 0)
    {

      // when anchor configuration is present
      console.log("anchor To be removed", anchorToBeRemoved)
      const soc = io(`http://${window.location.hostname}:5000`)
      
      
      soc.on("serverresponse",(message)=>{
        console.log("Server response received")
        soc.emit("gatewayconnect",{
          host:anchorToBeRemoved[0].hostname,
          port:anchorToBeRemoved[0].port,
          apiToken:apiToken,
          demo:false
          ///gateway crash
         ///add floor number here (Send floor number to gateway)
        })
      })


      soc.on("gatewayresponse",(message)=>{
        console.log("conneted sucessfully", message)
        if(message["code"]===200)
        {
           
          soc.emit("gatewayrestart",{
           restart:"True"
    
          })
        }
      })


      soc.on("gatewayconfig",(message)=>{
        console.log("Recived Message", message)
        soc.emit("gatewayrestart",{
          restart:"True"
   
         })
       

        
      })

      soc.on("gatewayrestart", (message)=>{
        if(message["code"]===200)
        {
          console.log("Gateway restarted successfully")
          dispatch(resetAnchor())
          dispatch(deleteFloorplan(delId))
          dispatch(getFloorplans())
          setOpen(false)
          soc.disconnect()
          setDelId("")
          dispatch(setAlerts("Floorplan removed ","success",true))
          
        }
        console.log("Gateway restarted")
      })

      soc.on("gatewayerror",(message)=>{
                 console.log("gateway error")
                 dispatch(setAlerts("gateway connection error !!! cant remove floor plan","error",true))
                 soc.disconnect()
                 dispatch(resetAnchor())
                 setOpen(false)
                 setDelId("")
      })

    }
    else if(anchorToBeRemoved && anchorToBeRemoved.length ===0)
    {
        
      console.log("Gateway restarted successfully")
      dispatch(resetAnchor())
      dispatch(deleteFloorplan(delId))
      dispatch(getFloorplans())
      setOpen(false)
      //soc.disconnect()
      setDelId("")

    }
  }





  },[anchorToBeRemoved])



  const onDeleteOpen = (obj) => {
    setConfirmDelete(true);
    setDelId(obj);
  };

  const onDeleteClose = () => {
    setConfirmDelete(false);
  };
  const onDeleteHandler = () => {
    dispatch(getAnchorsOfFloor(delId))
    //dispatch(deleteFloorplan(delId))
    setOpen(true)
    onDeleteClose();
   
    console.log("Marked for delete",delId)
    //dispatch(getFloorplans())
  };
  const titleIcon = <BorderInnerOutlined color='primary' />;

const drawerHandler = () => {
  setDrawerOpen(true)
}




const fabProps = {
  size: isLarge?'medium':'small'
}

  return (
    <React.Fragment>
       {addFloorPlanForm && (
        <AddFloorPlan
          handleClose={handleAddFloorPlanClose}
          open={addFloorPlanForm}
          
        />
      )}


      
      
      
     
     
      {confirmDelete && (
        <Confirm
          open={confirmDelete}
          onClose={onDeleteClose}
          onConfirm={onDeleteHandler}
          title='Confirm Delete?'
          content='Warning! Delete cannot be reversed.'
          handleOpen={onDeleteOpen}
        />
      )}
     
     <Box sx = {{display:"grid",
                  gridTemplateRows: '0.5fr 9fr',
                  gridTemplateColumns:{
                    xl:'0.3fr 1.8fr 8fr 0.3fr',
                    md:'0.3fr 2.8fr 8fr 0.3fr',
                  },
                  gridTemplateAreas : `" . . . ."
                  ". drawer floor ."`, 
                  height : "100%"
                 }} >
       <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        //onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

     
      
               <Paper elevation={6} sx={{ gridRow:'1/3', gridColumn:'1/3', width:{xl:'21.1vw', lg:'25.8vw'}, borderRadius: "0 20px 20px 0",p:{xl:3, lg:3}, bgcolor:'white'}}>
              <AuthAppBar title='Floorplan' icon={titleIcon} />

{floorplans && floorplans.length > 0 ? (
  <Grid container  spacing={1}>
    {floorplans &&
      floorplans.map((fp) => (
        <Grow in={true}>
        <Grid item key={fp._id}>
          <Card sx = {{mt:'-1vh', maxWidth:{xl:'18.4vw', lg:'22vw'}, borderRadius : '30px'}} raised>
            <ButtonBase sx={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}} onClick={event=>{
              event.preventDefault()
              console.log(fp.configured)
              dispatch(setFloorImage(`/uploads/${fp.floorplan}`))
            }}>
            <CardHeader sx={{mt:'-3%', width:'100%', height:'100%'}}
              title={
                
               
                  "Floor :  " + fp.floor
               
              }
              
            />

              <CardMedia
              sx={{width:'100%', height:'100%'}}
                  className={classes.media}
                  image={`/uploads/${fp.floorplan}`}
                  title={"Floor Number : " + fp.floor}
               />

            <CardContent sx={{height:'50%'}}>
              
              <Typography
                variant='body1'
                color='textSecondary'
                // component='p'
                sx={{ overflow:'auto' }}
              >
                Description: {fp.description}
              </Typography>
            </CardContent>
            </ButtonBase>
            <CardActions>

            
            <Tooltip title='Setup Floor Plan'>
            
              <Fab
              //color = "primary"
                // size = "medium"
                {...fabProps}
                aria-label='share'
                //onClick={() => onDeleteOpen(fp._id)}
                //variant = "extended"
                sx = {{  mt:{md:'-10%',xl:0}, background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`}}
              >
                
                 <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                 to= {`/configurefloor/${fp._id}`}>
                 
                    <FloorplanIcon  className={classes.icon}/>
                  
                 </Link>
                 
                
              </Fab>
             
              </Tooltip>
              
              <Tooltip title='Add/Remove Anchors'>
              <Fab
              //color = "primary"
              // size = "medium"
              {...fabProps}
                aria-label='share'
                sx = {{ mt:{md:'-10%',xl:0}, background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`}}
                //onClick={() => onDeleteOpen(fp._id)}
                
              >
                 <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                 to= {`/iptable/${fp._id}`}>
                {
                    
                    <HubRoundedIcon className={classes.icon}/>
                     
                }
                </Link>
              </Fab>
                 </Tooltip>


              <Tooltip title='Configure Anchors'>
              <Fab
              //color = "primary"
              // size = "medium"
              {...fabProps}
                aria-label='share'
                sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                //onClick={() => onDeleteOpen(fp._id)}
                disabled ={fp.configured ? false : true}
              >
                 <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                 to= {`/configureanchor/${fp._id}`}
                 state={{configured : `${fp.configured}`}}>
                {
                    
                        <AnchorIcon   fontSize='large'/>
                     
                }
                </Link>
              </Fab>
                 </Tooltip>


            <Tooltip title='Upload 3D Model' >
              <Fab
              //color = "primary"
              //  size = "medium"
              {...fabProps}
                id = {fp._id}
                //onClick = {()=>handleAddGltfForm(fp._id)}
                disabled ={fp.configured ? false : true}
                sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                
              >
                <Link
                 style = {{textDecoration : "none", color:"#fff"}} 
                to= {`/uploadgltf/${fp._id}`}
                state={{configured : `${fp.configured}`}}>
               
                    <GltfIcon   className={classes.icon} />

               </Link>
              </Fab>
              </Tooltip>
            <Tooltip title='Geo-Fence'  >
              <Fab
              //  size = "medium"
                 //color = "primary"
                  {...fabProps}
                id = {fp._id}
                sx = {{ mt:{md:'-10%',xl:0}, background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                
                disabled ={fp.configured ? false : true}

              >
                <Link 
                 style = {{textDecoration : "none", color:"#fff"}}
                to= {`/drawgeofence/${fp._id}`}
                state={{configured : `${fp.configured}`}}>
                
                 <GeoFence  className={classes.icon}/>
                  
                 </Link>  
                
              </Fab>
              </Tooltip>
              <Tooltip title='Delete'>
              <Fab
              // size = "medium"
              {...fabProps}
                aria-label='share'
                onClick={() => onDeleteOpen(fp._id)}
               // color = "primary"
                sx = {{ mt:{md:'-10%',xl:0}, background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`, color:"#fff"}}
              >
                {
                  
                    <DeleteOutlined  className={classes.icon}/>
                  
                }
              </Fab>
              </Tooltip>

            </CardActions>
          </Card>
        </Grid>
        </Grow>
      ))}
  </Grid>
  
) : (
  // <div className={classes.spinner}>
  //   <LinearProgress />
  //   <NotAvailable component='Floorplans' />
  // </div>

  <Stack spacing={1} sx={{marginLeft:{
    xl:'2%',
    md:'1%'
  }, marginRight:{
    xl:'2%',
    md:'1%'
  }}}>
    <LinearProgress />
  <Skeleton variant="rounded" sx={{
    width : {xl : 330, md : 300},
    height : {xl : 160, md : 130}
  }}/>
  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
  <Stack direction="row" spacing={{xl:3,md:4}}>
  <Skeleton variant="circular" sx={{
    width : {xl : 50, md : 40},
    height : {xl : 50, md : 40}
  }}  />
  <Skeleton variant="circular" sx={{
    width : {xl : 50, md : 40},
    height : {xl : 50, md : 40}
  }}  />
  <Skeleton variant="circular" sx={{
    width : {xl : 50, md : 40},
    height : {xl : 50, md : 40}
  }}  />
  <Skeleton variant="circular" sx={{
    width : {xl : 50, md : 40},
    height : {xl : 50, md : 40}
  }}  />
  <Skeleton variant="circular" sx={{
    width : {xl : 50, md : 40},
    height : {xl : 50, md : 40}
  }}  />
  </Stack>
  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
</Stack>
)}


<Tooltip title='Add Floorplan'>
  <Fab
    color='primary'
    aria-label='add'
    sx = {{position : "fixed",
           bottom : {xl:45, md: 40},
          // left : {xl:309, md: 276}
        left: {xl:'19.6vw', md:332, lg:302}}}
    onClick={handleAddFloorPlanOpen}
    
    disabled = {floorplans && floorplans.length>0 ? true : false}
    size='large'
  >
    <Add fontSize = "large"/>
  </Fab>
</Tooltip>
</Paper>

{floorplans && floorplans.length > 0 ? 
(<Paper elevation={6} sx ={{gridArea:"floor", height : "95%", borderRadius: "10px",ml:'5vw', p:3}} >
<Box

        gridRow='2/3'
        component="img"
        sx={{
          ml:{xl:'1.7vw', lg:'1.5vw'},
          height: {xl:'85vh', lg:'82vh'},
          width: '130vh',
          // maxHeight: { xs: 233, md: 167 },
          // maxWidth: { xs: 350, md: 250 },
        }}
        alt="Floorplan"
        src={flrImage}
      />
     </Paper> ):
     (<Paper elevation={6} sx ={{gridArea:"floor", height : "95%", borderRadius: "10px", ml:'5%', p:3}} >
     <Box
     
             gridRow='2/3'
             sx={{
              pt: {xl:'16%', md:'17%'},
               marginLeft:'100px',
               height: '85vh',
               width: '130vh',
              //  maxHeight: { xs: 233, md: 167 },
              //  maxWidth: { xs: 350, md: 250 },
             }}
             >
              <NotAvailable component='Floorplans' />
              </Box>
          </Paper> )


}
     </Box>
    </React.Fragment>
  );
};

Floorplan.propTypes = {
  floorplans: PropTypes.array.isRequired,
  getFloorplans: PropTypes.func.isRequired,
  setCurrentFloorplan: PropTypes.func.isRequired,
  deleteFloorplan: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  floorplans: state.floorplan.floorplans,
});




export default (Floorplan);


// --------------------------------------------------Previous Code-------------------------------------------------------------------------------------

// 
// import React, { useEffect, useState } from "react";
// import {
//   getFloorplans,
//   setCurrentFloorplan,
//   deleteFloorplan,
  
//   getConfigFloorplan
// } from "../../feature/floorplan/floorplanThunk";
// import { Link } from "react-router-dom";
// import Confirm from "../UI/Confirm";
// import AuthAppBar from "../UI/AuthAppBar";
// import {setCurrentFloorId} from "../../feature/floorplan/floorplanSlice"
// import {
//   GestureOutlined,
//   BorderInnerOutlined,
//   Add,
//   DeleteOutlined,
//   ThreeDRotation,
// } from "@mui/icons-material";
// import { Badge, Typography, Fab, Tooltip, Grid, LinearProgress, DialogActions, Paper } from "@mui/material";
// import makeStyles from '@mui/styles/makeStyles';
// import PropTypes from "prop-types";
// import { connect,useSelector,useDispatch } from "react-redux";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import { CardMedia } from "@mui/material";

// import NotAvailable from "../UI/NotAvailable";
// import AddFloorPlan from "./AddFloorPlan";
// 
// import { setAlerts } from "../../_actions/alertAction";
// import { resetAnchor } from "../../feature/anchor/anchorSlice";
// import { Grow } from "@mui/material";
// import io from "socket.io-client"

// //import { getGltfOfFenceFloor } from "../../feature/gltf/gltfSlice";
// //import AddGLTF from "./AddGLTF";
// import { AnchorIcon, GeoFence } from "../UI/CustomIcon";
// import { GltfIcon,FloorplanIcon } from "../UI/CustomIcon";
// import { Box } from "@mui/material";

// import { Backdrop } from "@mui/material";
// import { CircularProgress } from "@mui/material";
// 
// import { getAnchorsOfFloor } from "../../feature/anchor/anchorThunk";
// import {panelColor,themeColor} from '../themeColor'
// import { Avatar } from "@mui/material";


// const useStyles = makeStyles((theme) => ({
//   root: {
   
   
  
    
//   },
//   table: {
//     minWidth: 650,
//   },
//   fab: {
//     position: "fixed",
//     bottom: theme.spacing(4),
//     right: theme.spacing(4),
//   },
//   media: {
    
//     height:100
//   },
//   spinner: {
//     width: "100%",
//     "& > * + *": {
//       marginTop: theme.spacing(2),
//     },
//   },

//   dialogRoot : {
//     borderRadius : '30px',
//     maxWidth : 1000

//   },
//   cardAction: {justifyContent:"space-around"}


// }));
// //var n = 1
// 
// const Floorplan = (props) => {
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const [delId, setDelId] = useState("");
//   const [addFloorPlanForm, setAddFloorPlanForm] = useState(false);
//   const [addGltfForm,setAddGltfForm] = useState(false)
//   const [openFanceFloorplan, setOpenFanceFloorplan] = useState(false);
//   const [n,setN] = useState(0)
//   const [open, setOpen] = useState(true)
//   const apiToken = useSelector((state)=>state.auth.token)

//   const floorplans = useSelector((state)=>state.floorplan.floorplans)
//   const colorIndex = useSelector((state)=>state.color.colorIndex)
//   const anchorToBeRemoved = useSelector((state)=>state.anchor.anchor)

//   const dispatch = useDispatch()
//   useEffect(() => {
       
//         dispatch(getFloorplans());
//         setOpen(true)
//     //eslint-disable-next-line
//   },[]);


//   useEffect(()=>{
//       if(floorplans)
//       {
//           setOpen(false)
//       }
//   },[floorplans])  
  
  
//   const classes = useStyles();

  

//   const handleAddFloorPlanOpen = () => {
    
//     setAddFloorPlanForm(true);
//   };
//   const handleAddFloorPlanClose = () => {

//     setAddFloorPlanForm(false);
//   };
  
//   const handleFenceFloorplanOpen = (id) => {
//     console.log("geoFloorplan>>",id)
//    // e.preventDefault()
//     if(id)
//     {
//       console.log("current floor id>>>>>",id)
//      // dispatch(getGltfOfFenceFloor(id))
//      dispatch(setCurrentFloorId(id)) 
//      dispatch(getConfigFloorplan(id))
     
//      setN(n + 1)
//      //setOpenFanceFloorplan(true)
//     }

    

//   } 
//   const handleFenceFloorplanClose = (e) => {
   
//     //setOpenFanceFloorplan(false)
//   } 

//   const handleAddGltfForm = (id) => {
//     console.log("geoFloorplan>>",id)
//    // e.preventDefault()
//     if(id)
//     {
//      console.log("current floor id>>>>>",id)
//      dispatch(setCurrentFloorId(id)) 
//      setN(n + 1)
//      dispatch(setAddGltfForm(true))
//     }
    

//   }
  
//   const handleAddGltfFormClose = (e) => {
   
//       setAddGltfForm(false)
//   } 



//   useEffect(()=>{

//     console.log("Anchor config", anchorToBeRemoved)
//     if(delId)
//     {
//     if(anchorToBeRemoved && anchorToBeRemoved.length > 0)
//     {

//       // when anchor configuration is present
//       console.log("anchor To be removed", anchorToBeRemoved)
//       const soc = io(`http://${window.location.hostname}:5000`)
      
      
//       soc.on("serverresponse",(message)=>{
//         console.log("Server response received")
//         soc.emit("gatewayconnect",{
//           host:anchorToBeRemoved[0].hostname,
//           port:anchorToBeRemoved[0].port,
//           apiToken:apiToken,
//           ///gateway crash
//          ///add floor number here (Send floor number to gateway)
//         })
//       })


//       soc.on("gatewayresponse",(message)=>{
//         console.log("conneted sucessfully", message)
//         if(message["code"]===200)
//         {
           
//           soc.emit("gatewayrestart",{
//            restart:"True"
    
//           })
//         }
//       })


//       soc.on("gatewayconfig",(message)=>{
//         console.log("Recived Message", message)
//         soc.emit("gatewayrestart",{
//           restart:"True"
   
//          })
       

        
//       })

//       soc.on("gatewayrestart", (message)=>{
//         if(message["code"]===200)
//         {
//           console.log("Gateway restarted successfully")
//           dispatch(resetAnchor())
//           dispatch(deleteFloorplan(delId))
//           dispatch(getFloorplans())
//           setOpen(false)
//           soc.disconnect()
//           setDelId("")
//           dispatch(setAlerts("Floorplan removed ","success",true))
          
//         }
//         console.log("Gateway restarted")
//       })

//       soc.on("gatewayerror",(message)=>{
//                  console.log("gateway error")
//                  dispatch(setAlerts("gateway connection error !!! cant remove floor plan","error",true))
//                  soc.disconnect()
//                  dispatch(resetAnchor())
//                  setOpen(false)
//                  setDelId("")
//       })

//     }
//     else if(anchorToBeRemoved && anchorToBeRemoved.length ===0)
//     {
        
//       console.log("Gateway restarted successfully")
//       dispatch(resetAnchor())
//       dispatch(deleteFloorplan(delId))
//       dispatch(getFloorplans())
//       setOpen(false)
//       //soc.disconnect()
//       setDelId("")

//     }
//   }





//   },[anchorToBeRemoved])



//   const onDeleteOpen = (obj) => {
//     setConfirmDelete(true);
//     setDelId(obj);
//   };

//   const onDeleteClose = () => {
//     setConfirmDelete(false);
//   };
//   const onDeleteHandler = () => {
//     dispatch(getAnchorsOfFloor(delId))
//     //dispatch(deleteFloorplan(delId))
//     setOpen(true)
//     onDeleteClose();
   
//     console.log("Marked for delete",delId)
//     //dispatch(getFloorplans())
//   };
//   const titleIcon = <BorderInnerOutlined color='primary' />;




//   return (
//     <React.Fragment>
//        {addFloorPlanForm && (
//         <AddFloorPlan
//           handleClose={handleAddFloorPlanClose}
//           open={addFloorPlanForm}
          
//         />
//       )}


      
      
      
     
     
//       {confirmDelete && (
//         <Confirm
//           open={confirmDelete}
//           onClose={onDeleteClose}
//           onConfirm={onDeleteHandler}
//           title='Confirm Delete?'
//           content='Warning! Delete cannot be reversed.'
//           handleOpen={onDeleteOpen}
//         />
//       )}
     
//      <Box sx = {{display:"grid",
//                   gridTemplateRows: '1fr 9fr',
//                   gridTemplateColumns:'0.5fr 9fr 0.5fr',
//                   gridTemplateAreas : `" . . ."
//                   ". floor ."`, 
//                   height : "100%"
//                  }} >
//        <Backdrop
//         sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={open}
//         //onClick={handleClose}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>


//       <Paper elevation={6} sx ={{gridArea:"floor", height : "95%", borderRadius: "10px",p:3}} >
//       <AuthAppBar title='Floorplan' icon={titleIcon} />

//       {floorplans && floorplans.length > 0 ? (
//         <Grid container  spacing={1}>
//           {floorplans &&
//             floorplans.map((fp) => (
//               <Grow in={true}>
//               <Grid item key={fp._id}>
//                 <Card sx = {{ maxWidth : 300, borderRadius : '30px'}} raised>
//                   <CardHeader
//                     title={
                      
                     
//                         "Floor :  " + fp.floor
                     
//                     }
                    
//                   />

//                     <CardMedia
//                         className={classes.media}
//                         image={`/uploads/${fp.floorplan}`}
//                         title={"Floor Number : " + fp.floor}
//                      />

//                   <CardContent >
                    
//                     <Typography
//                       variant='body1'
//                       color='textSecondary'
//                       component='p'
//                     >
//                       Description: {fp.description}
//                     </Typography>
//                   </CardContent>
//                   <CardActions className = {{maxWidth : 250}}>

                  
//                   <Tooltip title='Setup Floor Plan'>
                  
//                     <Fab
//                     //color = "primary"
//                     size = "medium"
//                       aria-label='share'
//                       //onClick={() => onDeleteOpen(fp._id)}
//                       //variant = "extended"
//                       sx = {{ background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`}}
//                     >
                      
//                        <Link 
//                        style = {{textDecoration : "none", color:"#fff"}}
//                        to= {`/configurefloor/${fp._id}`}>
                       
//                           <FloorplanIcon  fontSize ="medium"/>
                        
//                        </Link>
                       
                      
//                     </Fab>
                   
//                     </Tooltip>
                    
//                     <Tooltip title='Configure Anchors'>
//                     <Fab
//                     //color = "primary"
//                     size = "medium"
//                       aria-label='share'
//                       sx = {{ background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
//                       //onClick={() => onDeleteOpen(fp._id)}
//                       disabled ={fp.configured ? false : true}
//                     >
//                        <Link 
//                        style = {{textDecoration : "none", color:"#fff"}}
//                        to= {`/configureanchor/${fp._id}`}>
//                       {
                          
//                               <AnchorIcon   fontSize ="large"/>
                           
//                       }
//                       </Link>
//                     </Fab>
//                        </Tooltip>


//                   <Tooltip title='Upload 3D Model' >
//                     <Fab
//                     //color = "primary"
//                      size = "medium"
//                       id = {fp._id}
//                       //onClick = {()=>handleAddGltfForm(fp._id)}
//                       disabled ={fp.configured ? false : true}
//                       sx = {{ background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                      
//                     >
//                       <Link
//                        style = {{textDecoration : "none", color:"#fff"}} 
//                       to= {`/uploadgltf/${fp._id}`}>
                     
//                           <GltfIcon   fontSize ="large" />

//                      </Link>
//                     </Fab>
//                     </Tooltip>
//                   <Tooltip title='Geo-Fence'  >
//                     <Fab
//                      size = "medium"
//                        //color = "primary"
//                       id = {fp._id}
//                       sx = {{ background: fp.configured? `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`:null}}
                      
//                       disabled ={fp.configured ? false : true}

//                     >
//                       <Link 
//                        style = {{textDecoration : "none", color:"#fff"}}
//                       to= {`/drawgeofence/${fp._id}`}>
                      
//                        <GeoFence  fontSize ="large"/>
                        
//                        </Link>  
                      
//                     </Fab>
//                     </Tooltip>
//                     <Tooltip title='Delete'>
//                     <Fab
//                     size = "medium"
//                       aria-label='share'
//                       onClick={() => onDeleteOpen(fp._id)}
//                      // color = "primary"
//                       sx = {{ background: `linear-gradient(60deg, ${themeColor[colorIndex][0]}, ${themeColor[colorIndex][1]})`, color:"#fff"}}
//                     >
//                       {
                        
//                           <DeleteOutlined  fontSize ="large"/>
                        
//                       }
//                     </Fab>
//                     </Tooltip>

//                   </CardActions>
//                 </Card>
//               </Grid>
//               </Grow>
//             ))}
//         </Grid>
//       ) : (
//         <div className={classes.spinner}>
//           <LinearProgress />
//           <NotAvailable component='Floorplans' />
//         </div>
//       )}
     
     
//       <Tooltip title='Add Floorplan'>
//         <Fab
//           color='primary'
//           aria-label='add'
//           sx = {{position : "fixed",
//                  bottom : 55,
//                 right : 100}}
//           onClick={handleAddFloorPlanOpen}
          
//           disabled = {/**This disbaled will be included on demo version. Code will  be removed on full version */
//                       floorplans && floorplans.length>0 ? true : false}
//           size='large'
//         >
//           <Add fontSize = "large"/>
//         </Fab>
//       </Tooltip>
//      </Paper> 
//      </Box>
//     </React.Fragment>
//   );
// };

// Floorplan.propTypes = {
//   floorplans: PropTypes.array.isRequired,
//   getFloorplans: PropTypes.func.isRequired,
//   setCurrentFloorplan: PropTypes.func.isRequired,
//   deleteFloorplan: PropTypes.func.isRequired,
// };

// const mapStateToProps = (state) => ({
//   floorplans: state.floorplan.floorplans,
// });

// export default (Floorplan);
