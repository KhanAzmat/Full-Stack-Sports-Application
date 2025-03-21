







import * as THREE from 'three'
import {DragControls} from "three/examples/jsm/controls/DragControls"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { Button, Grid, Typography, AppBar, Toolbar, Divider } from "@mui/material";
import React, { useContext } from "react";
import { connect, useSelector,useDispatch } from "react-redux";
import { panelColor } from "../../components/themeColor";
import Box from "@mui/material/Box"
import { useEffect } from 'react';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import { IconButton, Fab } from '@mui/material';
import { Tooltip } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { Outlet } from 'react-router-dom';
import ProgressBar from './ProgressBar'
import { FormLabel } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn'; 
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IPTable } from './ManipulateAnchor';
//import { useDispatch } from 'react-redux';

import { useCallback,useState } from 'react';





import Loadingbutton from "@mui/lab/LoadingButton"
import {IOSSwitch} from "../UI/Switch"
import {Backdrop,Card,CardContent, CardTitle,CardActions} from "@mui/material"
import { CloseRounded, SwitchVideo } from '@mui/icons-material';
import { resetAnchor } from '../../feature/anchor/anchorSlice';
import NoDisplay from '../UI/NoDisplay';
import { setAlerts } from "../../_actions/alertAction"; 
import { MenuList,MenuItem,Paper ,Menu} from '@mui/material';
import { ListItem,TextField,Checkbox } from '@mui/material';
import { Select,FormControl,InputLabel } from '@mui/material';
import {Radio,RadioGroup,FormControlLabel} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Slide } from '@mui/material';

import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material' 
import io from 'socket.io-client'
import zIndex from '@mui/material/styles/zIndex';
import{ Switch,Stack} from '@mui/material';
import {addAnchor,getAnchorsOfFloor,editAnchor} from '../../feature/anchor/anchorThunk';
import { FILTER_GLTF } from '../../_actions/types';
import { SettingsSharp } from '@mui/icons-material';
import { current } from '@reduxjs/toolkit';
//import { config } from 'dotenv/types';
import {resetConfigFloor} from "../../feature/floorplan/floorplanSlice"
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, LinearProgress } from '@mui/material';
import {Table,TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {Grow} from '@mui/material'
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles'; 
import { DeleteOutlined } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
let animateRef =null

const PanelBox = {}


let convert = import('xml-js')
let widthVector = null
let scene, camera, renderer,cube
let loaded = false
let box = null
let projector
let mousexy = null
let mouseMove = null
let points = []
let ring=null 
let controls = null
let orbit = null
let point1 = null
let line =null
let canvas=null
let canvasPoints = []
let movePoint = null
let floorPlanCenter = null
let moveRay=null
let cameraPosition=0.0
let gridHelper = null
let coordinateCentered = true
let corner1=null
let circleMesh1=null
let corner2=null
let corner3=null
let target = new THREE.Vector3()
let intersectionPlane=new THREE.Plane( new THREE.Vector3( 0,-1,0 ), 0 );
let dragRay = new THREE.Raycaster()
let circle = null
let axisControl = null
let floorPlan = null
let floorPlanMidPoint = null
let anchorList=[]
let group=null
let clickRay = null
let dragGroup = null
let spriteArray = []
let anchorRanging = {} 
let anchorImage = null
let anchorCanvasRef = {}
let anchorConfig ={}
const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/


let currentSelected = ""
let frustumSize = 20
let aspect = 0.0
let lineObjects = []
let spriteObjects = []
//let currentSelected
let selectedAnc = ""












////////////////////////////////////////Anchor Ip list///////////////////////////////////////////////////////
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const useStyles = makeStyles({
  table: {
   
  },
  container:{
    maxHeight : 500,
    minWidth: 500,
  } 
});
////////////////////////////////////IP table code need to be written//////////////////////






////////////////////////////////////////////////////////////////////Configure Anchor component/////////////////////////////////////////////////////////////////

//import Box from "@mui/material/TextField";

const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
const OutlinedDiv = ({ children, label,sx }) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent
      }}
      inputProps={{ children: children }}
      sx={sx}
    />
  );
};
//export default OutlinedDiv;


const AnchorPlan = (props)=>{

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("xl"))
  const dispatch = useDispatch()  
  const navigate = useNavigate()
  const apiToken = useSelector((state)=>state.auth.token) 
  const colorIndex = useSelector((state)=>state.color.colorIndex)
    const configFloor = useSelector((state)=>state.floorplan.configFloor)
    const storedAnchors = useSelector((state)=>state.anchor.anchor)
    const [local,setLocal] = React.useState({x:1.0,y:1.0})
    const [state,setState] = React.useState({contextMenu : null,
                                             discoveredAnc:[],
                                             selectedAnc:[],
                                             openAncList:false,
                                             anchors : [],
                                             ancList:[],
                                             anchorLoc : {},
                                             masterList : [],
                                             showMasterList :false,
                                             currentAnc : "",
                                             currentMultiMaster : '',
                                             confedAnchor:null,
                                             calculatedRange : {},
                          
                                             confed:false , ///Indicated configured or not
                                             //localX : 1.0,
                                             //localY : 1.0
                                             floorData : null,
                                             loaded : false,
                                             rangingOn : false,
                                             showIp :false,
                                             lastSelectedAnc:"",
                                             demoMode : true,
                                             loadingFindAnc:false,
                                             findAncList:null

                                          }) 
    const [comm,setComm] = React.useState({socket:null, 
                                           gatewayConnected : false,
                                           hostName:"localhost",
                                           port:9009,
                                           netComm:false,//connection in progress
                                           rtlsOn : false,


                                          })


    //const [contextMenu, setContextMenu] = React.useState(null)
    ///const [discoveredAnc, setDiscoveredAnc] = React.useState([])
    //const [selectedAnc, setSelectedAnc] = React.useState([])
   /// const [openAncList,setOpenAncList] = React.useState(false)
   // const [anchors, setAnchors] = React.useState([])
    //const [mMList, setMMList] = React.useState([])
    //const [ancList,setAncList] =   React.useState([])
    ///const [anchorLoc, setAnchorLoc] =React.useState({})
    
    //const [masterList, setMasterList] = React.useState([])
    //const [selectedMaster, setSelectedMaster]  = React.useState("")

    //const [showMasterList, setShowMasterList] = React.useState(false)
  // const [anchorRanging,setAnchorRanging] = React.useState({})

    //const [currentAnc, setCurrentAnc]= React.useState("")
    //const [currentMultiMaster, setCurrentMultiMaster] = React.useState('')
    const  cont  = React.useState(true)
    const colIndex = colorIndex
 
    //const [localX,setLocalX] = React.useState(1.0)
    //const [localY,setLocalY] = React.useState(1.0)
    //const [socket, setSocket] = React.useState(null)
    //const [gateway,setGateway] = React.useState("")
    ///const [gatewayConnected, setGetwayConnected] = React.useState(false)
    //const [calculatedRange,setCalculatedRange] =React.useState({})
    //const [hostName,setHostName] = React.useState("")
    //const [port,setPort] = React.useState(3334)
    //const [netComm,setNetComm] = React.useState(false)
    //const [rtlsOn, setRtlsOn] =React.useState(false)
   
    //const [confed,setConfed]=React.useState(false)
///This function initializes threejs canvas
    const init3d=()=>{
 
        anchorImage = new Image()
        anchorImage.src = '/anchor.svg'
        canvas = document.querySelector("#anchor")
        //console.log(canvas)
        renderer =new THREE.WebGLRenderer({canvas})
        //renderer.setPixelRatio(devicePixelRatio)
        //console.log("height",canvas.offsetHeight)
        scene = new THREE.Scene()
        //camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight,.1,1000)
        
        frustumSize = 20
        aspect = canvas.clientWidth / canvas.clientHeight
        camera =new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        //canvas.appendChild(renderer.domElement)
        scene.background = new THREE.Color(panelColor[colIndex].p1)
   
       /*const gui = new dat.GUI()
        const scale=gui.addFolder("scale")
        scale.add(control,"scaleX",0.1,3)
        scale.add(control,"scaleY",0.1,3)
        scale.add(control,"scaleZ",0.1,3)*/
        orbit = new OrbitControls(camera,renderer.domElement)
        orbit.enableRotate= false
       // orbit.enableZoom=false
   
        const geometry = new THREE.SphereGeometry( 0.2,22,22  );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        movePoint = new THREE.Mesh(geometry,material)
        //scene.add(movePoint
       
         
        
        gridHelper = new THREE.GridHelper(10000,10000)
        gridHelper.material.transparent=true
        gridHelper.material.opacity=0.25
        scene.add(gridHelper)
        cameraPosition=10
        camera.position.y= cameraPosition
        camera.lookAt(0,0,0)
   
   
        
        moveRay = new THREE.Raycaster()
        //moveRay.
        clickRay = new THREE.Raycaster()

        //floorPlan = new THREE.Object3D()
        //scene.add(floorPlan)


        
   
      
       canvas.addEventListener("mousemove",documentMouseMove,false)
       //canvas.addEventListener("mousedown",mouseDown,false)
       //canvas.addEventListener("mouseup",mouseUp,false)
       
      console.log(state.ancList)
      console.log(state.anchorLoc)

      
   
   }



   


  ///Creates a new web socket connection

  ///On pageload creates new socket connection 


  const toFloorplan=()=>{

    if(comm.socket)
    {
      comm.socket.disconnect()
    
    }
    navigate("/floorplans")
  }

  useEffect(()=>{

   const soc = io(`http://${window.location.hostname}:5000`)
   /*const soc = io(`http://localhost:9000`,{
                     extraHeaders :{
                      Authorization : apiToken
              }}) */  

   //setSocket(soc)
   //setState({...state, socket : soc})
   setComm((comm)=>{return {...comm, socket : soc}})

   return ()=> {
     
    console.log("Disconnecting existing socket")
    soc.disconnect()
  
    soc.close()
    removePLane()
    cancelAnimationFrame(animateRef)
  }


  },[])

///process received message
/**
 * This method facilitates backend communication with websocket server. This method recives response from backend server and
 * and process them.  
 * */  

useEffect(()=>{
  
 
  const onConnect = (message)=>{
    console.log(message)
    if(message.status === "success")
    {
    dispatch(setAlerts("Socket connected","success",true))
    }
    else if(message.status ==="failed")
    {
      dispatch(setAlerts("Socket connection failed","error",true))
    }
  }


  //This function is invoked when gateway sucessfully connected
  const onGatewayResponse=(message)=>{
    console.log("gatewayresponse",message)
    if(message["code"]===200 && message["message"]==="Connected Sucessfully")
    {

     /* socket.emit("gatewaycommand",{
        command : {
          "_declaration":{
            "_attributes":{
              "version":"1.0",
              "encoding":"utf-8"
            }
          },
           "req":{
                "_attributes":{
                    "type":"rf cfg"
                },
                "rf":{
                  "_attributes":{
                    "chan":"5",
                     "prf":"64",
                      "rate":"6810",
                       "code":"3", 
                       "plen":"1024",
                       "pac":"32",
                       "nsfd":"0"
                  }
                }
           }
  
  
        }
      })*/



      comm.socket.emit("gatewaycommand",{
        command : {
          "_declaration":{
            "_attributes":{
              "version":"1.0",
              "encoding":"utf-8"
            }
          },
           "req":{
                "_attributes":{
                    "type":"cle cfg"
                }
           }
  
  
        }
      })  

  /*  socket.emit("gatewaycommand",{
      command : {
        "_declaration":{
          "_attributes":{
            "version":"1.0",
            "encoding":"utf-8"
          }
        },
         "req":{
              "_attributes":{
                  "type":"anchor list"
              }
         }


      }
    }) */
    dispatch(setAlerts("GateWay connected","success",true))
    //setNetComm(false)
    //setGetwayConnected(true)
    setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : true}})
  }
  /*else if(message["code"]===200 && message["message"]==="Disconnected")
  {
    dispatch(setAlerts("GateWay Disconnected","success",true))
    setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : false}})
  }*/

  }   


  const onFindAnc=(msg)=>{
    console.log("recived message", msg)
    let flist = null
    if(msg["response"]==="anc list" && msg["code"]===200)
    {
      flist = msg["data"]
    }
    setState((prevState)=>{return {...prevState, loadingFindAnc:false,findAncList:flist, showIp:true}})
  }


  const onGatewayConfig = (msg)=>{
      console.log("received message", msg)
      if(msg["code"] === 404 && msg["message"]==="dns config missing")
      {
         //setState((prevState)=>{return {...prevState, showIp:true}})
          setComm((comm)=>{return {...comm, netComm:false, gatewayConnected:true}})
         dispatch(setAlerts("No configuration found!!Please search and some anchor","info",true))
         
      }
      if(msg["code"]===400)
      {
           switch(msg["message"]){

            case "anchor not available":
             console.log(msg["ipList"])
             dispatch(setAlerts("Some anchors are  not reachable. please check ip","error",true))
             break
             
            default:
              dispatch(setAlerts("Cant configure due too error in Gateway","error",true))

           }
      }
      if(msg["code"]===200)
      {
        
        dispatch(setAlerts("Anchor DNS configuration stored sucessfully!! please reconnect","success",true))

        if(comm.socket)
        {
          comm.socket.emit("gatewaydisconnect",{
            closegateway:true
    
          }) 
        } 
        
        setState((prevState)=>{return {...prevState, showIp:false}})
        //setComm((comm)=>{return {...comm, gatewayConnected:false}})
      }
      if(msg["code"]===102)
      {
        dispatch(setAlerts("please wait processing your request","info",true))
      }
     

      if(msg["code"]!==102)
      {
        setComm((comm)=>{return{...comm,netComm:false}})
      }
      console.log(comm)
  }

 


  const onGatewayError =(message)=>{
    console.log("gatewayerror",message)
    if(message["code"]===500)
    {
    dispatch(setAlerts("Gateway connection error, Host not reachable", "error",true))
    //setGetwayConnected(false)
    setComm((comm)=>{return{...comm,netComm:false,gatewayConnected : false}})
    }
    else if(message["code"]===400 && message["message"] =="Wrong command")
    {
      dispatch(setAlerts("Command format error!!", "error",true))
    }
    else if(message["code"]===400 && message["message"] =="Anchor not found")
    {
      dispatch(setAlerts("Cant configure!!! Anchor" + message["ancId"] +"not reachable", "error",true))
    }
  }

  
  const onGatewayclose=(message)=>{
    console.log("gatewayClose",message)
    if(message["status"]==="closed")
    {
      dispatch(setAlerts("Gateway connection closed", "success",true))
      //setNetComm(false)
      //setGetwayConnected(false)
      setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : false}})

    }
  }

  const onGatewaydata = (data)=>{
    console.log("gatewaydata",data)
    const  response = data["response"]
     switch(response["ind"]["_attributes"]["type"])
    {

    /**Available anchors */
    case  "anchor list": 
         const anchorss =[]
         response["ind"]["anchor"].forEach((obj)=>{
         anchorss.push(obj["_attributes"]["addr"])
         }) 
         //setDiscoveredAnc(anchors)
         console.log("state list",state)
         setState((state)=>{return {...state, discoveredAnc : [...anchorss], openAncList : true}})
    break;

    /** Renge test response */

    case "range test":
    console.log(response)
         
         const anc1 = response["ind"]["initiator"]["_attributes"]["addr"]
         const anc2 = response["ind"]["initiator"]["responder"]["_attributes"]["addr"]
         const distance = response["ind"]["initiator"]["responder"]["_attributes"]["distance"]
         const obj = {anc1,anc2,distance}
         //setCalculatedRange(obj)
         setState((state)=> {return{...state,rangingOn : false, calculatedRange:{...obj}}})



    
    break; 

    ///Display status message of cle operation
    case "system status":
       const msg = response["ind"]["_attributes"]["msg"]
        if(msg ==="ranging")
        {
          console.log("alert mgs",msg)
         dispatch(setAlerts("ranging started","info",true))
        }
    break;
    
    case "cle cfg" :
      console.log(response["ind"]["cle"]["_attributes"])
      if(response["ind"]["cle"]["_attributes"]["state"]==="1")
      {
        console.log("State", comm)
        setComm((comm)=>{return{...comm,rtlsOn : true}})
      }
    break;


    case "rtls start":
      dispatch(setAlerts("RTLS started","success",true))
    break


    case "rtls stop":
      dispatch(setAlerts("RTLS stopped","success",true))
    break


    default : 
       console.log(response)

   }
  }


  if(comm.socket)
  {
 comm.socket.on("serverresponse",onConnect)
  comm.socket.on("gatewayresponse",onGatewayResponse)
comm.socket.on("gatewayerror",onGatewayError)
  comm.socket.on("gatewaydata",onGatewaydata)
  comm.socket.on("gatewayclose",onGatewayclose)
  comm.socket.on("gatewayconfig", onGatewayConfig)
  comm.socket.on("findanc", onFindAnc)
  }
 return ()=>{
        if(comm.socket)
        {
    
          comm.socket.off("serverresponse",onConnect)
          comm.socket.off("gatewayresponse",onGatewayResponse)
          comm.socket.off("gatewayerror",onGatewayError)
        comm.socket.off("gatewaydata",onGatewaydata)
          comm.socket.off("gatewayclose",onGatewayclose)
          comm.socket.on("findanc", onFindAnc)
        }

 }

},[comm.socket])

/





const setCurrentAnc = (anc)=>{
  console.log("setCurrentAnc->", anc)
  
   updateSelectedCanvas(state.currentAnc, anc)
   //prevAnc = state.lastSelectedAnc
 
      const prevAnc = state.currentAnc
      setState((prev)=>{return {...prev,lastSelectedAnc : prevAnc, currentAnc : anc}})
   
  


}
////sends ip address for configuration
const configureIp=(ipList)=>{
  
  const anclist = ipList.filter((obj)=> obj.add===true )
  console.log("After filter",anclist)
  if(anclist && anclist.length > 3)
  { 
 
  
  const message = {message:"dns config", iplist:anclist}

console.log("Message", message)
 

  if(comm.socket)
  {
     comm.socket.emit("gatewayconfig",message)
  }
}
else{
  dispatch(setAlerts("Atleast three anchor needed! Can't Update list","error",true))
}
}






  
const showDiscoveredAnchorList=()=>{
console.log(`comm.socket : ${{comm}}`)
  if(comm.socket)
  {
    comm.socket.emit("gatewaycommand",{
      command : {
        "_declaration":{
          "_attributes":{
            "version":"1.0",
            "encoding":"utf-8"
          }
        },
         "req":{
              "_attributes":{
                  "type":"anchor list"
              }
         }


      }
    })
  }
  
  //setOpenAncList(true)
  //setState({...state, openAncList : true})

}

const closeAnchorList=()=>{
  //setOpenAncList(false)
  setState((state)=>{return{...state, openAncList :false}})
}



const updateSelectedAnchorList=()=>{

  const ancSet = new Set(state.ancList)
  const newAnc = []
  state.selectedAnc.forEach((item)=>{
    if(!ancSet.has(item))
       {
       ancSet.add(item)
       newAnc.push(item)
       }
  })
  //setSelectedAnc([])
  
  //setAncList([...ancSet])
  
  console.log([...ancSet])
  const anl = [...ancSet]
  const loc = {}
  newAnc.forEach((item)=>{loc[item]={x:0.0,y:0.0,z:0.0,type:"",masterToFollow:"",masterAnchor:[],dbload:false}})
  console.log(loc)
  //setAnchorLoc({...anchorLoc,...loc})

  setState((state)=>{return {...state, ancList : [...ancSet], anchorLoc : {...state.anchorLoc, ...loc}, selectedAnc : [], openAncList : false}})

//  closeAnchorList()

  

}

const removeCurrentAnchor=()=>{
    
  const ancSet = new Set(state.ancList)
  ancSet.delete(state.currentAnc)
  
  const ancObj = scene.getObjectByName(state.currentAnc)
  scene.remove(ancObj)

  const rangeObj = anchorRanging[state.currentAnc]
  console.log(rangeObj)

  if(rangeObj)
  {
     for(const anc in rangeObj)
     {
     
       
      scene.remove(rangeObj[anc]["line"])  
      delete anchorRanging[anc][state.currentAnc]
        
     }
     delete anchorRanging[state.currentAnc]
  }

 //delete anchorLoc[currentAnc]
  //setCurrentAnc('')
  
  //setAncList([...ancSet])
  const {[state.currentAnc]:anc, ...rest} = state.anchorLoc
  setState((state)=>{return{...state, ancList:[...ancSet], anchorLoc : {...rest}}})
  setCurrentAnc("")
}



const handleDiscovedSelect = (event)=>{
  const {options} = event.target  
  if(options.selectedIndex!== -1)
  {
    const opt = []
    const idx = []
    
    const selectedSet = new Set()
    
    //console.log(options.selectedIndex)
    for (let i = 0, l = options.length; i < l ; i += 1) {
        if (options[i].selected) {
          selectedSet.add(options[i].value)
          //opt.push(options[i].value);
          //idx.push(i)
        }
      }

   console.log(selectedSet)   
   //setSelectedAnc([...selectedSet])
   //setConfed(false)

   setState((state)=>{return {...state, selectedAnc : [...selectedSet], confed : false}})

  }  

}





   ///This mouse event records the mouse pointer movement of three js canvas

   const documentMouseMove=useCallback((event)=>{
    const mouseMove = new THREE.Vector2()
    mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
    mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    
    moveRay.setFromCamera( mouseMove, camera );
    var intersects = moveRay.intersectObjects(scene.children,false);
    
   // console.log(intersects)
    if(intersects.length>0)
    {
       
        const point =  intersects[0].point
       
        // setLocalX(point.x)
        //setLocalY(-point.z) 
        //setState({...state, localX:point.x, localY:-point.z}) 
        setLocal({...local, x:point.x, y:-point.z})    
    }
},[cont])


///This mouse event takes two points from user


const resetLocation=()=>{

    
    orbit.target=new THREE.Vector3(0,0,0)
    camera.position.set(0,cameraPosition,0)
    coordinateCentered = true
    orbit.update()
    
}


const resizeRendererToDisplaySize=(renderer)=>{
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    //console.log(width,height)
    const needResize = canvas.width!== width || canvas.height!==height
    if(needResize)
    {
        renderer.setSize(width,height,false)
    }
    return needResize
}





const placeAnchor=()=>{




}


const createCanvas = (ancName,type)=>{
  var canvas = document.createElement("canvas")
  canvas.height=125
  canvas.width =100
  var ctx = canvas.getContext("2d");
const name = ancName.substring(7)
ctx.font = "20px Arial"
ctx.fillText(name,0,20)
ctx.drawImage(anchorImage,5,25,80,80)

// Create gradient
//ctx.clearRect(0,0,640,480);

if(type ==="Slave")
 {
   ctx.fillStyle = 'rgba( 0, 181, 9,0.20)';
 }
 else if(type==="Primary Master") {
  ctx.fillStyle = 'rgba(250, 0, 0, 0.20)';
 }
 else if(type==="Secondary Master"){
  ctx.fillStyle = 'rgba(0, 0, 255, 0.20)';
 }
 else{
ctx.fillStyle = 'rgba(0, 0, 200, 0.05)';
 }
ctx.beginPath();
ctx.arc(45, 65, 29, 0, 2 * Math.PI);
ctx.fill()
//ctx.clearRect
anchorCanvasRef[ancName] = {ctx:ctx}
return canvas
}


const updateCanvas= (ancName, type)=>{

const ctx = anchorCanvasRef[ancName]["ctx"]
const texture = anchorCanvasRef[ancName]["texture"]
//ctx.clearRect(0,0,125,100)
//ctx.font = "20px Arial"
//ctx.fillText(ancName,1,20)

ctx.clearRect(5,25,81,81)
ctx.drawImage(anchorImage,5,25,80,80)

// Create gradient
//ctx.clearRect(0,0,640,480);
if(type ==="Slave")
 {
   ctx.fillStyle = 'rgba( 0, 181, 9,0.20)';
 }
 else if(type==="Primary Master") {
  ctx.fillStyle = 'rgba(250, 0, 0, 0.20)';
 }
 else{
  ctx.fillStyle = 'rgba(0, 0, 255, 0.20)';
 }

ctx.beginPath();
ctx.arc(45, 65, 29, 0, 2 * Math.PI);
ctx.fill()
texture.needsUpdate = true

}





const updateSelectedCanvas=(anc1,anc2, selected=false)=>{
  if(anc1)
  {
  const ctx = anchorCanvasRef[anc1]["ctx"]
  const texture = anchorCanvasRef[anc1]["texture"]

  //ctx.clearRect(0,0,125,100)
  //ctx.font = "20px Arial"
  //ctx.fillText(ancName,1,20)
  
  ctx.clearRect(0,105,100,14)
  texture.needsUpdate = true
  }

  if(anc2)
  {
    const ctx1 = anchorCanvasRef[anc2]["ctx"]
  const texture1 = anchorCanvasRef[anc2]["texture"]
  ctx1.fillStyle = 'rgba( 255, 168, 38,0.80)';
  ctx1.fillRect(0,105,100,14)
  texture1.needsUpdate = true
  selectedAnc= anc2 
  }


 
  if(selected)
  {
  
  //ctx.drawImage(anchorImage,5,25,80,80)
  
  // Create gradient
  //ctx.clearRect(0,0,640,480);
  /*if(type ==="Slave")
   {
     ctx.fillStyle = 'rgba( 0, 181, 9,0.20)';
   }
   else if(type==="Primary Master") {
    ctx.fillStyle = 'rgba(250, 0, 0, 0.20)';
   }
   else{
    ctx.fillStyle = 'rgba(0, 0, 255, 0.20)';
   }
  
  ctx.beginPath();
  ctx.arc(45, 65, 29, 0, 2 * Math.PI);
  */
  
  }
  

}

const drawPlane = (uri,configFloor)=>{

    const loader = new THREE.TextureLoader()
    const width = 10
    
    loader.load(uri,(texture)=>{
        console.log("txture>>",texture)
      const height = width * (texture.image.height / texture.image.width)
      let plane = new THREE.PlaneGeometry(width,height)
      //plane.translate(width/2,height/2,0)
      let planeMat = new THREE.MeshBasicMaterial({map:texture,transparent:true, opacity:0.5})
      console.log("txture>>",texture)
      
      cube = new THREE.Mesh(plane,planeMat)
     /// cube.position.setX(width/2)
      //cube.position.setZ(height/2)
      cube.position.setY(0.001)
      cube.geometry.translate(width/2,height/2,0)
      
      const diag = Math.sqrt((width*width) + (height*height))
      
    
     widthVector = new THREE.Vector3(width,0,0)
      
      
     
     




     const cubeCenter = new THREE.Vector3(width/2,height/2,0)
     
     
      
      
      
      cube.rotateX(-0.5 * Math.PI)
      
      //scene.add(cube)
       
      floorPlan = new THREE.Object3D()
     
      //floorPlan.add(widthVector)
      floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
      
      if(configFloor.data["configured"])
      {
        cube.scale.setScalar(configFloor.data["scale"])
        cube.rotateZ(configFloor.data["angle"])
        cube.material.opacity = configFloor.data["opacity"]
        floorPlan.position.setX(configFloor.data["x"])
        floorPlan.position.setY(configFloor.data["y"])
        floorPlan.position.setZ(configFloor.data["z"])
        camera.position.y =configFloor.data["camera"]
        cameraPosition =  camera.position.y
        frustumSize = 20 * cube.scale.x
        camera.left = (frustumSize * aspect  / -2) 
        camera.right = (frustumSize * aspect / 2)
        camera.top =  (frustumSize  / 2)
        camera.bottom = (frustumSize  / -2)  
        
        cameraPosition =  camera.position.y
        camera.updateProjectionMatrix()
      }
      else
      {
        cameraPosition = width*1.3
        camera.position.y = cameraPosition      
      }
     


      floorPlan.add(cube)
      scene.add(floorPlan)
    
     

    // scene.add(floorPlan)

    })
    
    
    


}


////Removes range lines after succes 

const removeLines = ()=>{

  if(lineObjects && lineObjects.length>0)
  {
      lineObjects.forEach((obj)=>{scene.remove(obj)})
  }
  lineObjects.length=0


}
////This function adds rfdistance line from primary and secondary master to slave

const drawLinesAfterConfig=(anchorRanging,anchorLoc)=>{
    const ancs = Object.keys(anchorRanging)
    ancs.forEach((ancr)=>{
       
      const list = Object.keys(anchorRanging[ancr])
      list.forEach((an)=>{
            console.log(anchorRanging[ancr][an])
            if(anchorRanging[ancr][an]["line"]===null && scene)
            {
                const line = getLine()
                const obj = anchorRanging[ancr][an]
                const p1 = anchorLoc[ancr]
                const p2 = anchorLoc[an]
                //some time this code throwing error.
                const v1 = new THREE.Vector3(p1["x"],0.02,-p1["y"])
                const v2 = new THREE.Vector3(p2["x"],0.02,-p2["y"])
                line.geometry.setFromPoints([v1,v2])
                obj["line"]=line
                scene.add(line)
                lineObjects.push(line)
                const x = (Number(v1.x) + Number(v2.x))/2
                const z =  (Number(v1.z) + Number(v2.z))/2
                const spriteLoc = new THREE.Vector3(x,0.02,z )
                addLineSprite(obj,v1.distanceTo(v2),spriteLoc) 
            }
      }) 





    }) 




}

////This function loads anchor configuartion from database

useEffect(()=>{

  console.log(storedAnchors)
  if(storedAnchors && storedAnchors.length> 0)
  {


    anchorRanging = {}
    removeLines()
    const data = storedAnchors[0]
   
    const obj = JSON.parse(data["configuration"])
    const anc = obj["req"]["anchor"]
    console.log(anc)
//loc[item]={x:0.0,y:0.0,z:0.0,type:"",masterToFollow:"",masterAnchor:[]}
    const list = []
    const loc={}
    const mlist = []
    anc.forEach((item)=>{
      const addr = item["_attributes"]["addr"]
      list.push(addr)
      const obj = {}
     
      obj["x"]=parseFloat(item["_attributes"]["x"])
      obj["y"]=parseFloat(item["_attributes"]["y"])
      obj["z"]=parseFloat(item["_attributes"]["z"])
      obj["dbload"] = true

      if(item["_attributes"]["master"]==="0")
      {
        obj["type"] = "Slave"
        obj["masterToFollow"]=""
        const ma =[]
        if(Array.isArray(item["masteranchor"]))
        {
                const ml = item["masteranchor"]
                ml.forEach((it)=>{
                  const maddr =it["_attributes"]["addr"] 
                  ma.push(maddr)
                  const lineObj= {"line":null,"range":it["_attributes"]["rfdistance"]}
                  const o1 = {...anchorRanging[addr],[maddr]:lineObj}
                  const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
                  anchorRanging[addr] = o1
                  anchorRanging[maddr] = o2
                  
                })
        }
        else
        {
         const  maddr = item["masteranchor"]["_attributes"]["addr"]
         ma.push(maddr)
         const lineObj= {"line":null,"range": item["masteranchor"]["_attributes"]["rfdistance"]}
         const o1 = {...anchorRanging[addr],[maddr]:lineObj}
         const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
         anchorRanging[addr] = o1
         anchorRanging[maddr] = o2

        }
        obj["masterAnchor"]=ma
       

        
      }
      else if (item["_attributes"]["master"]==="1" && item["_attributes"]["master_addr"]!=="0")
      {
        obj["type"] = "Secondary Master"
        obj["masterToFollow"]=item["_attributes"]["master_addr"]
        mlist.push(addr)
        const ma =[]
        if(Array.isArray(item["masteranchor"]))
        {
                const ml = item["masteranchor"]
                ml.forEach((it)=>{
                  const maddr =it["_attributes"]["addr"] 
                  ma.push(maddr)
                  const lineObj= {"line":null,"range":it["_attributes"]["rfdistance"]}
                  const o1 = {...anchorRanging[addr],[maddr]:lineObj}
                  const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
                  anchorRanging[addr] = o1
                  anchorRanging[maddr] = o2
                })
        }
        else
        {
          const  maddr = item["masteranchor"]["_attributes"]["addr"]
          ma.push(maddr)
          const lineObj= {"line":null,"range":item["masteranchor"]["_attributes"]["rfdistance"]}
          const o1 = {...anchorRanging[addr],[maddr]:lineObj}
          const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
          anchorRanging[addr] = o1
          anchorRanging[maddr] = o2
        }
        obj["masterAnchor"]=ma
        

      }
      else if(item["_attributes"]["master"]==="1" && item["_attributes"]["master_addr"]==="0")
      {
        obj["type"] = "Primary Master"
        obj["masterToFollow"]=item["_attributes"]["master_addr"]
        obj["masterAnchor"]=[]
        mlist.push(addr)
      }
      loc[addr] = obj
    })
    
   console.log(anchorRanging)
     console.log(mlist)
     drawLinesAfterConfig(anchorRanging,loc)
     //setHostName(data["hostname"])
     //setPort(data["port"])
    //setMasterList(["",...mlist])
   
    //setAnchorLoc(loc)
   
    //setAncList(list)
    
   setState((state)=>{return{...state, masterList :["",...mlist], anchorLoc:loc,ancList:list,confed:true, confedAnchor:storedAnchors}})
   setComm((comm)=>{return{...comm, hostName : data["hostname"], port:data["port"]}}) 
   dispatch(resetAnchor())
   
  }


},[storedAnchors])




const removePLane = ()=>{

  if(cube)
  {
    console.log("removing floorplan.......")
    floorPlan.remove(cube)
    cube.geometry.dispose()
    cube.material.map.dispose()
    cube.material.dispose()
    scene.remove(floorPlan)
    cube=null
    floorPlan = null

  }

}
//load floorplan
useEffect(()=>{

  if(state.floorData)
  {
    const floorplanUri = `/uploads/${state.floorData.data.floorplan}`
    console.log("floorplanUri",floorplanUri)
      drawPlane(floorplanUri,state.floorData)

  }

},[state.floorData])


useEffect(()=>{
    if(configFloor)
    {
     
     setState((prevState)=>{return {...prevState,floorData : configFloor }})
      
      //props.getGeofencesByFloor(props.configFloor.data._id)
      dispatch(getAnchorsOfFloor(configFloor.data._id))
      
      dispatch(resetConfigFloor())
    }

    return()=>{
      //dispatch(resetConfigFloor())
      //removePLane()
    }
  
  },[configFloor])




const centerOnFloorPlan = ()=>{
  
    if(cube)
    {
      
      //const midPoint = new THREE.Vector3(0,0,0)
      //orbit.reset()

       
      const center = new THREE.Vector3(cube.geometry.parameters.width/2,cube.geometry.parameters.height/2,0)
      const midPoint = cube.localToWorld(center)
      console.log(midPoint)
      orbit.target = midPoint
      camera.position.set(midPoint.x,cameraPosition,midPoint.z)
      //camera.lookAt(floorPlanCenter)
      coordinateCentered = false
      orbit.update()
       

    }


}





///Changes background color on theme selection
useEffect(()=>{
  if(scene)
  {
  scene.background = new THREE.Color(panelColor[colIndex].p1)
  }
},[colIndex])



///This function creates anchor and places on screen

const drawAnchor=()=>{
      
  
  //xml form
     anchorConfig = {
      "_declaration":{
        "_attributes":{
          "version":"1.0",
          "encoding":"utf-8"
        }
      },

       "req" : {
             "_attributes":{
                 "type":"anchor cfg"
             },

             "anchor":[]

       }
    }

      

      for(let i =0;i< state.ancList.length;++i)
      {
          const ancr = {"_attributes":{
            "addr":state.ancList[i],
             "id":"0"
            //"master":"0", "master_addr":"0", 
            //"master_lag_delay":"0", 
            //"ant_delay_rx":"16492",
             //"ant_delay_tx":"16492",
             
          }};
          
          const ancObj =scene.getObjectByName(state.ancList[i]) 
          if(!ancObj)
          {
            let texture=null
            if( state.ancList[i] in state.anchorLoc && state.anchorLoc[state.ancList[i]]["dbload"])
            {
            texture = new THREE.CanvasTexture(createCanvas(state.ancList[i],state.anchorLoc[state.ancList[i]]["type"]))
            }
            else{
              texture = new THREE.CanvasTexture(createCanvas(state.ancList[i]))
            }
            anchorCanvasRef[state.ancList[i]]["texture"] = texture
            let plane = new THREE.PlaneGeometry(1,1.25)
            let planeMat = new THREE.MeshBasicMaterial({map:texture ,transparent:true, opacity:0.9 })
           
            
            const anc = new THREE.Mesh(plane,planeMat)
          
            anc.position.setY(0.02)
           //widthVector = new THREE.Vector3(width,0,0)
            
            anc.rotateX(-0.5 * Math.PI)
          
          
          //const anc = cube.clone()
          anc.name = state.ancList[i]
          anchorList.push(anc)
          //addSprite(ancList[i],anc)


          if(state.ancList[i] in state.anchorLoc && state.anchorLoc[state.ancList[i]]["dbload"])
          {
            anc.position.setX(state.anchorLoc[state.ancList[i]]["x"])
          anc.position.setZ(-state.anchorLoc[state.ancList[i]]["y"])
          }
          else
          {
          const x = Math.random() * 3
          const z = Math.random() * 3
          const sign = Math.random() > 0.5 ? 1 : -1
          ancr["_attributes"]["x"] = (x).toString()
          ancr["_attributes"]["y"] =  (sign *(-1) * z ).toString()
          ancr["_attributes"]["z"] = "0"
          state.anchorLoc[state.ancList[i]]["x"]=x
          state.anchorLoc[state.ancList[i]]["y"]=(sign *(-1) * z )
          anc.position.setX(sign * x)
          anc.position.setZ(sign * z)
          }
          
          console.log(state.floorData)
          if(state.floorData && state.floorData.data["scale"]  < 1)
            {
             anc.scale.setScalar(state.floorData.data["scale"])
            } 
          scene.add(anc)


          }
          else{
            ancr["_attributes"]["x"] =(ancObj.position.x).toString()
            ancr["_attributes"]["y"] = (-ancObj.position.z).toString()
            ancr["_attributes"]["z"] ="0"

          }
          ancr["_attributes"]["master"] = "0"
          ancr["_attributes"]["master_addr"]="0"
          ancr["_attributes"]["master_lag_delay"]="0"
          ancr["_attributes"]["ant_delay_rx"]="16492"
          ancr["_attributes"]["ant_delay_tx"]="16492"
          anchorConfig["req"]["anchor"].push(ancr)


      }
      
      console.log(anchorConfig)


    //initial random update
      if(comm.gatewayConnected && !state.confed)
      {
     //comm.socket.emit("gatewaycommand",{command:anchorConfig})
      }
     
       

     
      axisControl = new DragControls([],camera,renderer.domElement)
      axisControl.addEventListener("drag", handleAxisDrag)
      canvas.addEventListener('click',onClick,false)
      //canvas.addEventListener('mousedown',mouseDown,false)
      axisControl.addEventListener("dragend",handleAxisDragEnd)
       
}


const handleAxisDrag = useCallback((event)=>{
   // console.log( event.object.name)
  
   const obj = event.object
   //const loc = {...anchorLoc}
  obj.position.x=  Number.parseFloat( obj.position.x).toFixed(3)
   obj.position.z=  Number.parseFloat( obj.position.z).toFixed(3)
   obj.position.y = 0.02
   console.log(obj.position)
   const pos = {x:obj.position.x, y : obj.position.z}
   //const anc1=anchorLoc[obj.name]
   //anc1["x"]= obj.position.x
   //anc1["y"]= -obj.position.z
   console.log(obj.name)
   const rangeObj = anchorRanging[obj.name]
   console.log(rangeObj)
   if(rangeObj)
   {
      for(const anc in rangeObj)
      {
          const other = scene.getObjectByName(anc)
          const line = rangeObj[anc]["line"]
          //const sprite = rangeObj[anc]["sprite"]
          const x = (Number(obj.position.x) + Number(other.position.x))/2
          const z = (Number(obj.position.z) + Number(other.position.z))/2
          //sprite.position.setX(x)
          //sprite.position.setZ(z)
          const v1 = obj.position
          const v2 = other.position
          
       const spriteLoc = new THREE.Vector3(x,0.02,z )
          line.geometry.setFromPoints([obj.position,other.position])
          updateLineSprite(rangeObj[anc],v1.distanceTo(v2),spriteLoc)
         
      }
   }

   //setAnchorLoc({...anchorLoc,[obj.name]:anc1 })


},[cont])






const showLinesOfSelectedAnchor = (selected)=>{

   if(currentSelected !=="")
   {
      const prevObj = anchorRanging[currentSelected]
      if(prevObj)
      {
        for(const anc in prevObj)
         {
          const line = prevObj[anc]["line"]
          line.visible = false
         }
      }  
   }

   const rangeObj = anchorRanging[selected]

   if(rangeObj)
   {
    for(const anc in rangeObj)
    {
     const line = rangeObj[anc]["line"]
     line.visible = true
    }
    
   }

   currentSelected = selected
}


//This method updates anchor position after drag complete
const handleAxisDragEnd = useCallback((event)=>{
 
//const anchorList = anchorConfig["req"]["anchor"]
const anchorObj = event.object
const anchor = state.anchorLoc[anchorObj.name]
anchor["x"] = anchorObj.position.x
anchor["y"] =-anchorObj.position.z
//anchor["z"] = 0.0
 console.log(anchorConfig)
 //setAnchorLoc(loc)*/
},[cont])

const onClick=useCallback((event)=>{
    event.preventDefault();
    
    const mouseMove = new THREE.Vector2()
    mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
    mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    
    clickRay.setFromCamera( mouseMove, camera );
    var intersects = clickRay.intersectObjects(anchorList,true);
    
    
    if(intersects.length>0)
    {
       let object = intersects[0].object
       console.log(intersects[0])
       //setCurrentAnc(object.name)
        showLinesOfSelectedAnchor(object.name)
        //setAnchors([object.name])
        //setCurrentAnc(object.name)

                const  anc1 = state.currentAnc
                console.log("previous anchor",selectedAnc)
      
               if(selectedAnc)
                {
                 const ctx = anchorCanvasRef[selectedAnc]["ctx"]
                 const texture = anchorCanvasRef[selectedAnc]["texture"]
                 ctx.clearRect(0,105,100,14)
                 texture.needsUpdate = true
                }


                const anc2= object.name
                const ctx1 = anchorCanvasRef[anc2]["ctx"]
                const texture1 = anchorCanvasRef[anc2]["texture"]
                ctx1.fillStyle = 'rgba( 255, 168, 38,0.90)';
                ctx1.fillRect(0,105,100,14)
                texture1.needsUpdate = true 
                selectedAnc = object.name       



        


        setState((state)=>{return{...state,anchors:[object.name],currentAnc:object.name }})
        
       /*if(dragGroup.childrens.includes(object)===true)
       {
           scene.attach(object)
       }
       else
       {
           dragGroup.attach(object)
       }*/
       console.log(object)
       const draggableObject = axisControl.getObjects()
       draggableObject.length =0

       axisControl.transformGroup = true
       draggableObject.push(object)

       
       
    }

    


},[cont])



/// This method adds multilateration master for slave and secondary master
const addMultiMaster = ()=>{
  const anc = state.anchorLoc[state.currentAnc]
  const aset = new Set(anc["masterAnchor"])
  aset.add(state.currentMultiMaster)
  anc["masterAnchor"] = [...aset]
 // setAnchorLoc({...anchorLoc,[currentAnc]:anc}) 
  //setShowMasterList(false)
 setState((state)=>{return{...state, showMasterList:false}})


}


// This method select multilateration master
const handleMultiMaster=(event)=>{
  console.log(event.target.value)
    //setCurrentMultiMaster(event.target.value)
   setState((state)=>{return {...state, currentMultiMaster: event.target.value}})
}

const animate = (time)=>{
    time*=0.001
    if(cube)
    {
    //cube.rotation.x=time;
    //cube.rotation.y =time;
   // cube.rotation.z =time;
    
    }
    if(resizeRendererToDisplaySize(renderer))
    {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth/canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    renderer.render(scene,camera)
    //console.log(orbit.target)
    orbit.update()
    animateRef=requestAnimationFrame(animate)
    

}




const addSprite=(name,ancObj)=>{

 let spriteCanvas = document.createElement("canvas");
    let ctx = spriteCanvas.getContext("2d");
   

     //ctx.fillStyle = "white";
   // ctx.globalAlpha = 0;
     //ctx.lineWidth = 5;
    // ctx.strokeStyle = "black";
    //ctx.stroke();
    //ctx.fillRect(0, 0, 250, 60);
    
   /* ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.rect(1,1,249, 60);
    ctx.stroke();
    */
    const fontSize = 40
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "black";
    ctx.font = "bold "+fontSize+"px Georgia";
    ctx.border = "1px"

    ctx.fillText(name, 70, 40, 250);


    let spriteTex = new THREE.Texture(spriteCanvas);
    spriteTex.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: spriteTex, depthWrite: false, depthTest: true });
    material.map.maxFilter = THREE.LinearFilter;
    //const map = new THREE.TextureLoader().load( '/uploads/stamp/' + icon );
    
   // const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );

    const sprite = new THREE.Sprite(material);
    sprite.name = name+ "-sprite";
    sprite.position.set(0,0.265,0);
   // sprite.rotateX(0.5 * Math.PI)
    
    //sprite.position.y = .1;
   sprite.scale.set(0.05 * fontSize, 0.025 * fontSize, 0.075*fontSize)
    console.log(sprite)
    ancObj.add(sprite);
    spriteArray.push(sprite)

}

///This method creates a line 
const getLine=()=>{

  const linegeo = new THREE.BufferGeometry()
  const lineMat = new THREE.LineBasicMaterial({color: "#FF00FF"})
  const line  = new THREE.Line(linegeo,lineMat)
  return line

}



//This method creates a line sprite
const addLineSprite=(lineInfo,lineLen,spriteLoc)=>{


  let spriteCanvas = document.createElement("canvas");
  let context1 = spriteCanvas.getContext("2d");
   

     /*ctx.fillStyle = "white";
    ctx.globalAlpha = 1;
     ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.strokeStyle = "red";
    ctx.rect(1,1,249, 249);
    ctx.stroke()
    */
    //ctx.stroke();
    //ctx.fillRect(0, 0, 250, 60);
   
   /* ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.rect(1,1,249, 60);
    ctx.stroke();
    */
    /*const fontSize = 40
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "black";
    ctx.font = "bold "+fontSize+"px Georgia";
    ctx.border = "1px"

    ctx.fillText("OM", 4,20,200);
  */
    

       
				//texture1.needsUpdate = true;


context1.font = "italic 30px Arial";
//context1.clearRect(0,0,640,480);
var message1 = "line length : " +    Number.parseFloat(lineLen).toFixed(3)  
 var message2 = "twr_range : " + Number.parseFloat(lineInfo["range"]).toFixed(3)
var metrics = context1.measureText(message1);
var width = metrics.width;
context1.fillStyle = "rgba(0,0,0,1)"; // text color
context1.fillText( message1, 4,20 );
context1.fillText( message2, 4,60 );
				  



    
  console.log("add line sprite")
  let spriteTex = new THREE.Texture(spriteCanvas);
  spriteTex.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: spriteTex, transparent:true, depthWrite: false, depthTest: true });
  material.map.maxFilter = THREE.LinearFilter;
    //const map = new THREE.TextureLoader().load( '/uploads/stamp/' + icon );
    
   // const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );

  const sprite = new THREE.Sprite(material);
  sprite.name = "line"+ "-sprite";
  sprite.position.setX(spriteLoc.x)
  sprite.position.setY(spriteLoc.y)
  sprite.position.setZ(spriteLoc.z)
   //sprite.rotateX(0.5 * Math.PI)
    
   // sprite.position.y = (-0.1);
    //sprite.scale.set(20, 10, 2)
  sprite.scale.set(0.05 * 40, 0.025 * 40, 0.075*40)
  sprite.visible=true
  console.log(sprite)
  console.log(spriteLoc)
    //ancObj.add(sprite);
    //spriteArray.push(sprite)
  lineInfo["sprite"]= sprite
  lineInfo["context"] = context1
  lineInfo["texture"] = spriteTex
  lineInfo["spriteCanvas"] = spriteCanvas
    //lineInfo
    //scene.add(sprite)
  lineInfo["line"].add(sprite)
    

}


//This method updates line sprite
const updateLineSprite=(lineInfo,lineLen,spriteLoc)=>{

    const context1 = lineInfo["context"]
    const spriteTex = lineInfo["texture"]

    context1.clearRect(0,0,640,480);
    var message1 = "line length : " +    Number.parseFloat(lineLen).toFixed(3)  
    var message2 = "twr_range : " + Number.parseFloat(lineInfo["range"]).toFixed(3) 
    var metrics = context1.measureText(message1);
    var width = metrics.width;
    context1.fillStyle = "rgba(0,0,0,1)"; // text color
    context1.fillText( message1, 4,20 );
    context1.fillText( message2, 4,60 );
    
    if(spriteLoc)
    {
      lineInfo["sprite"].position.setX(spriteLoc.x)
      lineInfo["sprite"].position.setY(spriteLoc.y)
      lineInfo["sprite"].position.setZ(spriteLoc.z)
    }
    spriteTex.needsUpdate = true


   

}




/**This method updates the line sprite and range after two way ranging test  */
useEffect(()=>{
if(scene && state.calculatedRange!=={})
{
  //console.log(calculatedRange)
  const anc1 = state.calculatedRange["anc1"]
  const anc2 = state.calculatedRange["anc2"]
  const distance = state.calculatedRange["distance"]
 
  const obj1 = scene.getObjectByName(anc1)
  const obj2 = scene.getObjectByName(anc2)
  if(obj1 && obj2)
  {
  const v1 = obj1.position
  const v2 = obj2.position
  console.log(v1,v2)
  const robj = anchorRanging[anc1][anc2]
  robj["range"] = distance
  updateLineSprite(robj,v1.distanceTo(v2))
 // setCalculatedRange({})
  }

}


},[state.calculatedRange])





///Activate rightclick context menu on anchor list

useEffect(()=>{
    const anchorListLoc = document.querySelector("#anchorList")
    anchorListLoc.addEventListener("contextmenu",handleContextMenu,true)
},[])






///Draw anchor on screen when anchor list available

useEffect(()=>{
  if(state.ancList.length>0)
  {
  
 
   
  
  //setCurrentAnc([ancList[0]])

  drawAnchor()
  //setState((state)=>{return{...state, currentAnc : state.ancList[0]}}) 
  setCurrentAnc(state.ancList[0]) 
  }
 
  //console.log(state.ancList)
  //console.log(anchorLoc)

},[state.ancList])




useEffect(()=>{
    if(!state.loaded)
    {
    init3d()
    
    //drawObject()
    //drawBox()
    //drawPlane()
    //drawCylinder()
    //drawfonts()
    //addLight()
   // addMultipleObject()
    //drawLine()
  
    
    //animate2()
    animate()
    //loaded = true
    setState((prevState)=>{return {...prevState, loaded:true}})
    }
    //console.log("3D model loaded")
})


const handleTextChange=(event,value)=>{
  if(state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc)
  {

  if(event.target.value.match(/^-?\d*\.?\d*$/))
  {
  console.log(event.target.name)
  const anchorName = event.target.name.split("-") 
  const obj = scene.getObjectByName(anchorName[0])
  console.log(obj)
  //anchorLoc[anchorName[0]][anchorName[1]] = value
  //obj.position[anchorName[1]]=value
  const aobj = state.anchorLoc[anchorName[0]]
  
  aobj[anchorName[1]]=   event.target.value

  obj.position.x = aobj.x==="-"?0:aobj.x
  obj.position.z = aobj.y==="-"?0:-aobj.y
  
  /* setAnchorLoc((prevState)=> {
       return{...prevState, [anchorName[0]]:anc }
    })
  */
    const rangeObj = anchorRanging[anchorName[0]]
    console.log(rangeObj)
    if(rangeObj)
    {
       for(const anc in rangeObj)
       {
           const other = scene.getObjectByName(anc)
           const line = rangeObj[anc]["line"]
          // const sprite = rangeObj[anc]["sprite"]
          const x = (Number(obj.position.x) + Number(other.position.x))/2
          const z = (Number(obj.position.z) + Number(other.position.z))/2
         // sprite.position.setX(x)
          //sprite.position.setZ(z)
          const v1 = obj.position
          const v2 = other.position
          const spriteLoc = new THREE.Vector3(x,0.02,z )
          line.geometry.setFromPoints([obj.position,other.position])
          updateLineSprite(rangeObj[anc],v1.distanceTo(v2),spriteLoc)
           //line.geometry.setFromPoints([obj.position,other.position])
       }
    }


    //setAnchorLoc({...anchorLoc,[anchorName[0]]:aobj})
    setState((state)=>{return{...state, anchorLoc : {...state.anchorLoc, [anchorName[0]]:aobj}}})
  }

  }

}

const handleSelectedItem=(event)=>{
 console.log(event.target.tabIndex)
 //setCurrentAnc(state.ancList[event.target.tabIndex])
 //setState((state)=>{return{...state, currentAnc :state.ancList[event.target.tabIndex] }})
 setCurrentAnc(state.ancList[event.target.tabIndex])
} 

const handleContextMenu =  useCallback((event)=>{
  event.preventDefault()
  if(anchorList.length > 0)
  {
   /* setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );
   */
    setState((state)=>{return {...state, contextMenu : 
                                     state.contextMenu === null?
                                     {
                                       mouseX : event.clientX - 2,
                                       mouseY : event.clientY - 4,
                                     }
                                     :
                                     null
                                     }})


  } 

},[cont])

const handleMenuClose=(event)=>{
  console.log("Menu close")
  setState((state)=>{return{...state, contextMenu : null, anchors : [state.anchors[0]]}})
  //anchors.length=1
}



const handleRanging= useCallback((event)=>{
  if(!state.confed)
  {
      dispatch(setAlerts("Some anchors yet to be configured. Can't perform two way ranging", "error",true))
      setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
      return
  }

  if(!comm.gatewayConnected)
  {
    dispatch(setAlerts("location gateway is not connected . Can't perform two way ranging", "error",true))
      setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
      return
  }

  if(comm.rtlsOn)
  {
    dispatch(setAlerts("Rtls is on. Can't perform two way ranging", "error",true))
      setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
      return
  }
  
  if(state.rangingOn)
  {
    dispatch(setAlerts("Can't start new ranging while another ranging operation in progress", "error",true))
    setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
    return
  }

  if(state.anchors.length===2)
  {
  if(anchorRanging==={} || !(state.anchors[0] in anchorRanging) || !(state.anchors[1] in anchorRanging[state.anchors[0]]))
  {
       const anc1 = scene.getObjectByName(state.anchors[0])
       const anc2 = scene.getObjectByName(state.anchors[1])

       //Call for two wy ranging of twr of two anchor


       if(comm.socket && comm.gatewayConnected)
       {
         comm.socket.emit("gatewaycommand",{
          command : {
            "_declaration":{
              "_attributes":{
                "version":"1.0",
                "encoding":"utf-8"
              }
            },
             "req":{
                  "_attributes":{
                      "type":"range test",
                      "num_ranges":"50"
                  },
                "anchor":[{"_attributes":{"addr":state.anchors[0]}},{"_attributes":{"addr":state.anchors[1]}}]


             }
    
    
          }
        })
        setState((prevState)=>{return {...prevState, rangingOn:true}})

       }


       
       //Two way rangiing call invoked hare.
       const pos1 = anc1.position
       const pos2 = anc2.position 
       const x = (Number(pos1.x) + Number(pos2.x))/2
       const z =  (Number(pos1.z) + Number(pos2.z))/2
       const spriteLoc = new THREE.Vector3(x,0.02,z )

       const line=getLine()
       line.geometry.setFromPoints([anc1.position,anc2.position])
             
       const ref1 = {"line":line,"range":0}
       
       const anc1Obj = {...anchorRanging[state.anchors[0]],[state.anchors[1]]:ref1}
       const anc2Obj = {...anchorRanging[state.anchors[1]],[state.anchors[0]]:ref1}
       const newObj = {...anchorRanging}
       newObj[state.anchors[0]] = anc1Obj
       newObj[state.anchors[1]] = anc2Obj
       //console.log(newObj)
       addLineSprite(ref1,pos1.distanceTo(pos2),spriteLoc)
       lineObjects.push(line)
       scene.add(line)
      // scene.add(ref1["sprite"]) 
       //setAnchorRanging({...anchorRanging,[anchors[0]]:anc1Obj,[anchors[1]]:anc2Obj})
       anchorRanging = newObj
       console.log(anchorRanging)



  
  }
  else if((state.anchors[0] in anchorRanging) && (state.anchors[1] in anchorRanging[state.anchors[0]]))
  {
    if(comm.socket && comm.gatewayConnected)
    {
      comm.socket.emit("gatewaycommand",{
       command : {
         "_declaration":{
           "_attributes":{
             "version":"1.0",
             "encoding":"utf-8"
           }
         },
          "req":{
               "_attributes":{
                   "type":"range test",
                   "num_ranges":"50"
               },
             "anchor":[{"_attributes":{"addr":state.anchors[0]}},{"_attributes":{"addr":state.anchors[1]}}]


          }
 
 
       }
     })
    }

  }
  
  
  //anchors.length=1
  
  //setContextMenu(null)
  setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}}) 
  }
},[cont])

//// This function add multilateration master to follow

const handleAddMaster = (event)=>{
 // setCurrentMultiMaster('') 
 // setShowMasterList(true) 

setState((state)=>{return {...state, currentMultiMaster:"", showMasterList : true}})
  
}

const closeMasterList=()=>{
  //setShowMasterList(false)
  setState((state)=>{return{...state, showMasterList : false }})
}


// This function handles master selection
const handleMasterselction=(event)=>{

  console.log("event",event.target.value)
 
    const anc = state.anchorLoc[state.currentAnc]
    if(anc["type"]==="Secondary Master")
    {
      anc["masterToFollow"] = event.target.value
      //setAnchorLoc({...anchorLoc,[currentAnc]:anc})
    }


}

//This function clears master list
const clearMMList = ()=>{
  const anc = state.anchorLoc[state.currentAnc]
  anc["masterAnchor"]=[]
  // setAnchorLoc({...anchorLoc,[currentAnc]:anc})
  setState((state)=>{return {...state,anchorLoc :{...state.anchorLoc, [state.currentAnc]:anc}}})
}


//This function 

const handleAnchorType=(event)=>{
    console.log("handle Anchor type",event.target.value)
    console.log("Handle anchoe type",event.target.name)
    const loc = state.anchorLoc
    loc[event.target.name]["type"] = event.target.value
    let mset
    if(state.masterList)
    {
   mset = new Set(state.masterList.slice(1))
    }
    else{
     mset = new Set()
    }
   ///Change anchor background color
    updateCanvas(state.currentAnc,event.target.value)
    if(event.target.value==="Primary Master" || event.target.value==="Secondary Master")
    {
   
    mset.add(event.target.name)
    
      //setMasterList(["",...mset])
    // setState((state)=>{return {...state, masterList : ["",...mset], anchorLoc:{...loc}}})
    }
    else if(mset.has(event.target.name)){
       mset.delete(event.target.name)
       //setMasterList(["",...mset])
       
    }
   //setAnchorLoc({...anchorLoc,[event.target.name] : ancInfo})
   setState((state)=>{return{...state,masterList:["",...mset], anchorLoc : {...loc}}})
}


const handleConnect=(event)=>{

  const gateway = {host:comm.hostName,port:comm.port}
  console.log("floor Data",state.floorData)
   if(comm.socket)
    {

       if(event.target.checked){
        console.log("gateway connect")
        //setNetComm(true)
        
        comm.socket.emit("gatewayconnect",{
        host:comm.hostName,
        port:comm.port,
        apiToken:apiToken,
        // This code need to be updated. becuse it send floor information on every connect. wich is updated in backend 
        floor: state.floorData.data.floor ,
        demo: state.demoMode? "on" : "off",


      })
      setComm((comm)=>{return{...comm, netComm:true}})
    }else if(!event.target.checked && comm.gatewayConnected)
     {

       
       comm.socket.emit("gatewaydisconnect",{
        closegateway:true

      }) 
      setComm((comm)=>{return{...comm, netComm:true}})


     /* socket.emit("gatewaycommand",{
      command : {
        "_declaration":{
          "_attributes":{
            "version":"1.0",
            "encoding":"utf-8"
          }
        },
         "req":{
              "_attributes":{
                  "type":"anchor list"
              }
         }


      }
    })
     */
    }
    

  }
}


const handleDemoCheck = (e)=>{
//setState(prevState=>{return {...prevState, demoMode:e.target.checked}})
setState(prevState=>{return {...prevState, loadingFindAnc:true}})
const message = {command:"findanc"}
if(comm.socket)
  {
     comm.socket.emit("findanc",message)
  }

}


const handleGatewayChange=(event)=>{
  let val = event.target.value
  //setGateway(val)
}



const handleSelectAnchor = (event)=>{
  const {options} = event.target  
  if(options.selectedIndex!== -1)
  {
    const opt = []
    const idx = []

    let k = 0
    
    //console.log(options.selectedIndex)
    for (let i = 0, l = options.length; i < l && k <=2 ; i += 1) {
        if (options[i].selected) {
            k += 1
          opt.push(options[i].value);
          idx.push(i)
        }
      }
   
      if(opt.length<=2)
      {
        //setCurrentAnc(ancList[idx[0]])
  
       // setAnchors(opt)


        setState((state)=>{return {...state,  anchors : [...opt]}}) 
        setCurrentAnc(state.ancList[idx[0]]) 
        if(axisControl && anchorList)
        {
        const draggableObject = axisControl.getObjects()
        draggableObject.length =0
        axisControl.transformGroup = true
        draggableObject.push(anchorList[idx[0]])
        showLinesOfSelectedAnchor(state.ancList[idx[0]])
        } 


        if(opt.length===2)
        {

        }

      }
   
      console.log(idx)
  }  

}




const handleConfigure=()=>{
 const anchorConfig = {
    "_declaration":{
      "_attributes":{
        "version":"1.0",
        "encoding":"utf-8"
      }
    },

     "req" : {
           "_attributes":{
               "type":"anchor cfg"
                 },

           "anchor":[]

     }
  }

  const configuredAnchor = Object.keys(state.anchorLoc)
  
  if(configuredAnchor.length < 4)
  {
      dispatch(setAlerts("Atleast 4 anchors required for configuration","error",true))
      return
  }


   let primaryMasterSet = false
  let i=0
 for( let anc of configuredAnchor){
    //const anc = configuredAnchor[i]
    const ancr = {"_attributes":{
      "addr":anc,
      "id": 0,

    }}
    i = i+1
    ancr["_attributes"]["x"] = (state.anchorLoc[anc]["x"]).toString()
    ancr["_attributes"]["y"] = (state.anchorLoc[anc]["y"]).toString()
    ancr["_attributes"]["z"] = (state.anchorLoc[anc]["z"]).toString()
    ancr["_attributes"]["master"] = "0"
    ancr["_attributes"]["master_addr"]="0"
    ancr["_attributes"]["master_lag_delay"]="0"
    ancr["_attributes"]["ant_delay_rx"]="16454"
    ancr["_attributes"]["ant_delay_tx"]="16454"


      //"master":"0", "master_addr":"0", 
      //"master_lag_delay":"0", 
      //"ant_delay_rx":"16492",
       //"ant_delay_tx":"16492",
       

       
    //}}
    
   
    
    if(state.anchorLoc[anc]["type"]==="Primary Master")
    {
     
      if(!primaryMasterSet)
      {
      ancr["_attributes"]["master"]="1"
      primaryMasterSet = true
      }
      else{
        dispatch(setAlerts("Configuraion Failed! Can't set multiple primary master","error",true))
        return
      }
    }
    else if(state.anchorLoc[anc]["type"]==="Secondary Master"){
      console.log("Seconadry Master",state.anchorLoc[anc])
      ancr["_attributes"]["master"] ="1"
      if(state.anchorLoc[anc]["masterToFollow"])
      {
        ancr["_attributes"]["master_addr"] =state.anchorLoc[anc]["masterToFollow"]
        ancr["_attributes"]["master_lag_delay"] = "2000"
      }
      else{
        dispatch(setAlerts(`Can't configure! Secondary master ${anc} not following any master`,"error",true))
        return
      }
       
      const clockM = state.anchorLoc[anc]["masterAnchor"]
      if(clockM.length==1)
      {
        const obj = {}
        obj["addr"] = clockM[0]
        
        const rfdist = anchorRanging[anc][clockM[0]] && ("range" in anchorRanging[anc][clockM[0]] ) ?   anchorRanging[anc][clockM[0]]["range"] : 0
        obj["rfdistance"] = rfdist.toString()

        ancr["masteranchor"]={"_attributes": obj}
      }
      else if(clockM.length > 1)
      {
          const list =[]
          clockM.forEach((master)=>{
            const obj = {}
            obj["addr"] = master
            
            const rfdist = anchorRanging[anc][master] && ("range" in anchorRanging[anc][master] ) ?   anchorRanging[anc][master]["range"] : 0
            obj["rfdistance"] = rfdist.toString()
            list.push({"_attributes":obj})
          })
          ancr["masteranchor"] = list
      }

    }
    else if(state.anchorLoc[anc]["type"]==="Slave")
    {
       
      ancr["_attributes"]["master"]="0"

      const clockM = state.anchorLoc[anc]["masterAnchor"]
      if(clockM.length===1)
      {
        const obj = {}
        obj["addr"] = clockM[0]
        
        const rfdist = anc in anchorRanging && clockM[0] in anchorRanging[anc] && ("range" in anchorRanging[anc][clockM[0]] ) ?   anchorRanging[anc][clockM[0]]["range"] : 0
        obj["rfdistance"] = rfdist.toString()

        ancr["masteranchor"]={"_attributes": obj}
      }
      else if(clockM.length > 1)
      {
          const list =[]
          clockM.forEach((master)=>{
            const obj = {}
            obj["addr"] = master
            
            const rfdist = anchorRanging[anc][master] && ("range" in anchorRanging[anc][master] ) ?   anchorRanging[anc][master]["range"] : 0
            obj["rfdistance"] = rfdist.toString()
            list.push({"_attributes":obj})
          })
          ancr["masteranchor"] = list
      }
      else{
        dispatch(setAlerts(`Can't configure! Slave Anchor ${anc} not associated with any master`,"error",true))
        return 
      }

    }
    else{

      dispatch(setAlerts(`Can't configure! Anchor ${anc} is not configured`,"error",true))
      return

    }


  

    
    
   
  anchorConfig["req"]["anchor"].push(ancr)

    }


   console.log(anchorConfig)
/*<rf chan="2" prf="64" rate="6810" code="9" plen="128" pac="8" nsfd="0"/>*/

   const channelConfig = {
    "_declaration":{
      "_attributes":{
        "version":"1.0",
        "encoding":"utf-8"
      }
    },

     "req" : {
           "_attributes":{
               "type":"rf cfg"
                 },

           "rf":{"_attributes" : {"chan":"2",
                                  "prf":"64",
                                  "rate":"6810",
                                  "code" : "9",
                                  "plen" : "128",
                                  "pac": "8",
                                  "nsfd":"0"

           }}

     }
//     "req" : {
//       "_attributes":{
//           "type":"rf cfg"
//             },

//       "rf":{"_attributes" : {"chan":"5",
//                              "prf":"64",
//                              "rate":"6810",
//                              "code" : "9",
//                              "plen" : "128",
//                              "pac": "8",
//                              "nsfd":"0"

//       }}

// }

   }
  console.log(channelConfig)

   if(comm.socket)
   {
    comm.socket.emit("gatewaycommand",{
      command : channelConfig
    })
    
    comm.socket.emit("gatewaycommand",{
      command : anchorConfig
    })

    comm.socket.emit("gatewaycommand",{
      command : {
        "_declaration":{
          "_attributes":{
            "version":"1.0",
            "encoding":"utf-8"
          }
        },
         "req":{
              "_attributes":{
                  "type":"log stop"
              }
         }


      }
    })
   }


   const obj = {}
  obj["hostname"] = comm.hostName
  obj["port"] = comm.port
  obj["floorplan"] = state.floorData.data._id
  obj["configuration"]= JSON.stringify(anchorConfig)
  
 //console.log("anchor length",state.confedAnchor.length)

  if(state.confedAnchor && state.confedAnchor.length>0)
  {
       dispatch(editAnchor({formData:obj,id:state.confedAnchor[0]._id}))
  }
  else
  {
      dispatch(addAnchor(obj))
  }
  //setConfed(true)
  setState((state)=>{return {...state, confed:true}})
}




//This method activates and deactivates rtls
const handleRtls =(event)=>{
 const rtls = event.target.checked
   const command = {
    "_declaration":{
      "_attributes":{
        "version":"1.0",
        "encoding":"utf-8"
      }
    },

     "req" : {
           "_attributes":{
               "type":""
                 }
                }
              }
    
  if(event.target.checked)
  {
    command["req"]["_attributes"]["type"]="rtls start"
    //setRtlsOn(true)
    setComm((comm)=>{return {...comm, rtlsOn : true}})

  } 
  else{
   
    command["req"]["_attributes"]["type"]="rtls stop"
    //setRtlsOn(false)
    setComm((comm)=>{return{...comm, rtlsOn:false}})
  }   
  


const command2 = {
  "_declaration":{
    "_attributes":{
      "version":"1.0",
      "encoding":"utf-8"
    }
  },

   "req" : {
         "_attributes":{
             "type":"motion filter",
             "filter_type":"2",
             "filter_length":"10"

               }
              }
            }
  
  if(comm.socket)
  {
    comm.socket.emit("gatewaycommand",{
      command : command
    })

    if(rtls)
    {
      comm.socket.emit("gatewaycommand",{
        command : command2
      })
    }


  }


  
              


}



const handleAddressChange = (event)=>{


  if(event.target.name === "hostName")
  {
    //setHostName(event.target.value)
    //setState({...state, hostName : event.target.value})
     setComm((comm)=>{return{...comm, hostName : event.target.value }})
  }
  else if(event.target.name==="port" && !isNaN(event.target.value)){
   // setPort(event.taget.value)
   setComm((comm)=>{return {...comm, port:event.target.value}})
  }
}


const closeIp=(e,reason)=>{
  
  //console.log("reason",reason)
  if(reason ==="backdropClick")
  {
    e.preventDefault()
  }else
  {
  setState((prevState)=>{return {...prevState, showIp:false}})
  }
}

const openIp=()=>{
  setState((prevState)=>{return {...prevState, showIp : true}})
}

   
    return <React.Fragment>
   {
    state.showIp &&
    <IPTable
    showIp ={state.showIp}
    closeIp = {closeIp}
    configureIP = {configureIp}
    toFloorplan = {toFloorplan}
    netComm = {comm.netComm}
    >
 
    </IPTable>
   }
    {/*console.log("GateWay Connected", state.ancList)*/}

    {!matches && 
      (<Dialog
      open= {!matches}
      fullScreen
    >
      <DialogContent>
       
      
      <LinearProgress/>
      <NoDisplay/>
      

      </DialogContent>
   

    </Dialog>)
    }
    
    {state.openAncList &&
      (<Dialog
    open={state.openAncList}
    onClose={closeAnchorList}
    
    >
      <DialogTitle>Select Anchors For Multilateration</DialogTitle>
        <DialogContent >
                          
                          {/* <TextField 
                             label="Gateway IP"
                                   name="ipadress"
                                   size="small"
                                   value={gateway}
                                   onChange={handleGatewayChange}
                                   //helperText =  {`${Number.parseFloat(rotationAngle).toFixed(3)} °`}
                                   InputLabelProps={{
                                      shrink: true,
                                      }}
                                   inputProps={{type:"text"}}
                                  sx={{mt:2,mr:1}}                             
                                     />
                      <Button  variant="contained"   
                      onClick={handleConnect} 
                     sx ={{mt:3,ml:1}}
                      size="small"
                                    disabled={socket?false:true}>Connect</Button>  */ }     
                    
        <FormControl variant="standard" id="anchorList" sx= {{mt:2}} fullWidth>      
                       
                       
                       <InputLabel shrink htmlFor="multiple-native">
                              Discovered Anchors
                       </InputLabel> 
                       
                        <Select
                          variant="standard"
                          multiple
                          native
                          value={state.selectedAnc}
                          onChange={handleDiscovedSelect}
                          label="Discovered Anchor"
                          //sx={{height:"100%"}}
                          inputProps={{
                          id: 'multiple-native',
                          size:12
                          }}>
                             

                        {
                            state.discoveredAnc && state.discoveredAnc.map((item,index)=>
                            
                              <option key={item} value={item}>
                                     {item}
                              </option>
                              

                            )
                        } 
                        
                       </Select>
                     </FormControl>  
        </DialogContent>
        
        <DialogActions>
                      
                     <Button variant="contained"  onClick={updateSelectedAnchorList} size="small" >Select</Button>
                     <Button variant="contained"  onClick={closeAnchorList} size="small">Close</Button>
        </DialogActions>
    </Dialog> 
      )
    }
    {/* <AppBar position="fixed" sx={{ width:'79.3%', borderRadius:'10px 0 0 10px', bgcolor:'gray'}}>
        <Toolbar>
          
        <ProgressBar/>

        </Toolbar>
      </AppBar> */}
    <Box sx = {{display:"grid",
              gridTemplateRows:'0.35fr 9.65fr',
              gridTemplateColumns:'2.5fr 9.65fr',
              gridTemplateAreas : `" . floor"
              "drawer floor"`, 
              height : "100%",
              bgcolor:'transparent'
             }} >

<Paper elevation={8} sx={{ 
  gridRow:'1/3',
  gridColumn:'1/2',
  display:"grid",
  gridTemplateColumns : "0.5fr 8fr 0.5fr ",
  gridTemplateRows : "0.5fr 3fr 0.3fr 4fr 0.5fr",
  gridTemplateAreas : `" . . ."
                        " . list ."
                        ". . . 
                        ". set ."
                        ". . ."`, 
                      borderRadius: "0 20px 20px 0",
                      bgcolor:'white',
                      alignContent:'center'
                          }}>

    {/*Anchor List */}
              
    <Card elevation={5} sx={{gridRow:'2/3', gridColumn:'2/3', width:'90%', ml:'4%'}}
                    >  
                    <CardContent> 
                      <Box sx = {{border:"2px solid black",borderRadius: "5px",p:1}}>
                        <Box sx= {{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff",fontSize:"small"}}>Anchor Set</Box>   
                        <Box  sx = {{display:"grid",
                                      gridTemplateRows : "repeat(15,1fr)",
                                      gridTemplateColumns : "repeat(10,1fr)",}}>
                       <FormControl
                         variant="standard"
                         id="anchorList"
                         sx={{gridRow :"2/12",gridColumn:"1/11"}}
                         size="small">      
                       
                      
                       <Select
                         variant="standard"
                         multiple
                         native
                         value={state.anchors}
                         onChange={handleSelectAnchor}
                         label="Anchor List"
                         inputProps={{
                         id: 'select-multiple-native',
                         size:7
                         }}
                         sx={{fontSize:"small"}}>
                            

                       {
                           state.ancList.map((item,index)=>
                           
                             <option key={item} value={item}>
                                    {item}
                             </option>
                             

                           )
                       } 
                       
                      </Select>
                      
                      <Menu
                       open={state.contextMenu!==null}
                       onClose={handleMenuClose}
                       anchorReference="anchorPosition"
                       anchorPosition={
                       state.contextMenu !== null
                         ? { top: state.contextMenu.mouseY, left: state.contextMenu.mouseX }
                             : undefined
                               }
                        >
                                 <MenuItem onClick={handleRanging}>Two Way Ranging</MenuItem>
                                 
                        </Menu>
                     </FormControl>
                     </Box>
                        <Stack  direction ="row" spacing={3} alignItems="center" justifyContent={"space-around"}>
                         <Button variant="contained" disabled ={!comm.gatewayConnected} onClick={showDiscoveredAnchorList} size="small" >Add</Button>
                         <Button variant="contained"  disabled={state.currentAnc && state.ancList?false:true} 
                                onClick={removeCurrentAnchor}
                                 size="small" 
                               >Remove</Button>
                         </Stack>      
                     </Box>
                     </CardContent>
                     <CardActions sx={{display:"flex",mt:-1,alignItems:"center",justifyContent:"center"}}>
                     <Button variant="contained"  
                       disabled = {!comm.gatewayConnected || (comm.gatewayConnected && comm.rtlsOn)}
                       size="small" 
                        onClick={handleConfigure}>Configure</Button>
                     </CardActions>
                     </Card>  
                           
                    {/*Anchor List   ends*/}


                    {/*anchor position menu*/}
                    <Card elevation={5} sx = {{gridRow:'4/5', gridColumn:'2/3'}}>
                      <CardContent>
                     <Box sx = {{
                                  border:"2px solid black",borderRadius: "5px",p:1
                                }}>
                          <Box   id="anchorList" sx={{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff",fontSize:"small" }}>Selected Anchor Settings </Box> 
                     
                               <Box  sx = {{display:"grid",
                                      gridTemplateRows : "repeat(12,1fr)",
                                      gridTemplateColumns : "repeat(15,1fr)",}}>
                                {/* <FormLabel  sx={{gridRow : "2/4", gridColumn : "2/6" }}><Typography variant='caption'>{state.currentAnc && state.currentAnc.length>0? state.currentAnc.slice(5):""}</Typography> </FormLabel> */}
                                 <TextField
                                   variant="standard"
                                   label="X"
                                   name={state.currentAnc + "-x"}
                                   size="small"
                                   value = {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc? state.anchorLoc[state.currentAnc].x:0}
                                   InputLabelProps={{
                                      shrink: true,
                                      }}
                                   //inputProps={{ pattern :"/^-?\d*\.?\d*$/", placeholder:anchorLoc[currentAnc].x }}
                                   sx={{gridRow : "2/4",gridColumn:"2/6",fontSize:"small"}}
                                   onChange = {handleTextChange} />


                                <TextField
                                  variant="standard"
                                  label="Y"
                                  name={state.currentAnc + "-y"}
                                  size="small"
                                  value= {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc?state.anchorLoc[state.currentAnc].y:0}
                                  InputLabelProps={{
                                     shrink: true,
                                     }}
                                  //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                  sx={{gridRow : "2/4",gridColumn:"7/11"}}
                                  onChange = {handleTextChange} />    

<TextField
                                  variant="standard"
                                  label="Z"
                                  name={state.currentAnc + "-z"}
                                  size="small"
                                  value= {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc?state.anchorLoc[state.currentAnc].z:0}
                                  InputLabelProps={{
                                     shrink: true,
                                     }}
                                  //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                  sx={{gridRow : "2/4",gridColumn:"12/16"}}
                                  onChange = {handleTextChange} />   
                       
                                   

                                    <FormControl
                                      variant="standard"
                                      size="small"
                                      sx={{gridRow : "4/9", gridColumn:"1/9", fontSize:"small"}}>
                                      
                                     <RadioGroup 
                                        
                                           name={state.currentAnc}
                                           onChange = {handleAnchorType}
                                           value = {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc && state.anchorLoc[state.currentAnc]["type"]!==""? state.anchorLoc[state.currentAnc]["type"]:""}
                                           defaultValue=""
                                            sx={{fontSize:"small",p:0}}
                                            
                                     >
                                         <FormControlLabel 
                                         disabled = {!state.currentAnc }
                                         //value="Slave"
                             
                                         value = "Primary Master" 
                                         control={
                                         <Radio  size="small"/>
                                         }
                                          //label="Slave" 
                                          label = "Primary Master"
                                          sx={{fontSize:"small"}} />
                                         <FormControlLabel 
                                         disabled = {!state.currentAnc}
                                         //value="Primary Master" 
                                         value = "Slave"
                                         control={
                                         <Radio   size="small"/>
                                         } 
                                         //label="Primary Master" 
                                         label = "Slave"
                                         sx={{fontSize:"small"}} />
                                         <FormControlLabel 
                                         disabled = {!state.currentAnc}
                                         value="Secondary Master" control={
                                         <Radio  size="small" />
                                         } label="Secondary Master" sx={{fontSize:"small"}} />
 
                                     </RadioGroup>
                                    </FormControl>

                                    <FormControl
                                      variant="standard"
                                      id="masterToFollow"
                                      sx={{gridRow:"7/9",gridColumn:"9/16",fontSize:"small"}}
                                      size="small">
                                    <InputLabel  shrink  id="master-to-follow">Master to follow (Seconadry)</InputLabel>
                                    <Select
                                      variant="standard"
                                      //labelId="demo-multiple-checkbox-label"

                                      //multiple

                                      onClick={handleMasterselction}
                                      //input={<OutlinedInput label="Master to follow" />}
                                      native
                                      //renderValue={(selected) => selected}                 
                                      //MenuProps={MenuProps}
                                      label="Master to follow"
                                      inputProps={{
                                       id: 'master-to-follow',
                                          }}
                                      disabled = {state.currentAnc && 
                                                   state.anchorLoc &&  
                                                   state.currentAnc in 
                                                   state.anchorLoc && 
                                                   state.anchorLoc[state.currentAnc]["type"]==="Secondary Master"?false:true}
                                      value={state.currentAnc && 
                                             state.anchorLoc && 
                                             state.currentAnc in 
                                             state.anchorLoc && 
                                             state.anchorLoc[state.currentAnc]["type"]==="Secondary Master" && 
                                                                                          state.anchorLoc[state.currentAnc]["masterToFollow"]!==""? 
                                                                                          state.anchorLoc[state.currentAnc]["masterToFollow"]: undefined}>
                                     {/*masterList.map((master) => (
                                      <MenuItem key={master} value={master}>
                                      <Checkbox checked={selectedMaster.indexOf(master) > -1} />
                                      <ListItemText primary={master} />
                                      </MenuItem>                   
                                     ))*/}

                                     {
                                        state.masterList.filter((item)=>item!==state.currentAnc).map((item,index)=>
                           
                                        <option key={item} value={item}>
                                               {item}
                                        </option>
                                        
       
                                      )
                                     }
                                     </Select>     
                                     </FormControl>  
                                     
                                   
                                 
                       <FormControl
                         variant="standard"
                         id="multilaterationMasterList"
                         sx={{gridRow :"9/11",gridColumn:"3/14" , fontSize:"small"}}
                         size="small">      
                       
                       
                       <InputLabel shrink htmlFor="multi-master-list">
                              Multilateration Master List
                       </InputLabel> 
                       
                        <Select
                          variant="standard"
                          multiple
                          native
                          //value={m}

                          //onChange={handleSelectAnchor}
                          label="Multilateration Master List"
                          //sx={{height:"100%"}}
                          inputProps={{
                          id: 'multi-master-list',
                          size:2
                          }}>
                             

                        {
                           state.currentAnc && 
                           state.anchorLoc && 
                           state.currentAnc in state.anchorLoc &&  
                           state.anchorLoc[state.currentAnc]["masterAnchor"] &&  
                           state.anchorLoc[state.currentAnc]["masterAnchor"].map((item,index)=>
                            
                              <option key={item} value={item}>
                                     {item}
                              </option>
                              

                            )
                        } 
                        
                       </Select>   
                      </FormControl>
                      <Button variant="contained"
                       disabled = {
                        state.currentAnc && 
                        state.anchorLoc &&  
                        state.currentAnc in 
                        state.anchorLoc && 
                        state.anchorLoc[state.currentAnc]["type"]==="Primary Master"?true:false
                      } 
                       onClick ={handleAddMaster}
                        size="small" sx={{gridRow : "12/13", gridColumn:"5/8"}}>Add</Button>
                       <Button variant="contained" 
                       onClick ={clearMMList} 
                       disabled = {
                        state.currentAnc && 
                        state.anchorLoc &&  
                        state.currentAnc in 
                        state.anchorLoc && 
                        state.anchorLoc[state.currentAnc]["type"]==="Primary Master"?true:false

                       }
                        size="small" sx = {{gridRow : "12/13", gridColumn : "9/12"}}>clear</Button>
                        </Box>
                       </Box>
                       </CardContent></Card>
                    
                       {/**Anchor settings ends*/}

                    

    </Paper>
    <Box sx={{
         gridArea:"floor",
        display:"grid",
        gridTemplateColumns :"repeat(24,1fr)",
        gridTemplateRows:"repeat(24,1fr)",
        height:"100%"
    
    }}>
           {/**3D canvas */}
           <Box   sx = {{bgcolor:panelColor[colIndex].p1,
                gridRow:"1/25", gridColumn:"1/25",p:0}}>    
              
                     <Box component="canvas" sx = {{height:"99%", width:"100%"}} id="anchor"/>
           </Box>       
           {/**3D canvas ends */}     
           <Box sx = {{gridRow : "24", gridColumn:"11/13",display:"flex",alignItems:"center", justifyItems:"center", gap:"2",pointerEvents : "none",userSelect:"none" }}>
              <Tooltip title="Current mouse pointer position" arrow>                   
                  <FormLabel sx={{border: "2px solid", textAlign:"center"}}>X:{Number.parseFloat(local.x).toFixed(3)} | Y:{Number.parseFloat(local.y).toFixed(3) } </FormLabel>
                </Tooltip>  
           </Box>

          
           <Paper  elevation={4} sx={{ borderRadius: '7px',gridRow : "24", gridColumn :"23/25", width:'3.5vw', height:'3.5vh'}}>     
        <Stack direction='row' spacing={0}
         justifyContent='center'
         alignItems='center' alignSelf='center'
         
         divider={<Divider variant='middle' orientation="vertical" flexItem />}>
                <IconButton  disableRipple size='small'>
                    <ZoomInIcon />
                </IconButton>
                <IconButton disableRipple size='small'>
                    <ZoomOutIcon />
                </IconButton>
            </Stack>   
        </Paper>  
        <Paper style={{position:'relative', right:'-74px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "24", gridColumn :"21/23", width:'1.8vw', height:'3.5vh'}}>                 
                <IconButton onClick={centerOnFloorPlan} disableRipple size='small'>
                    <MapRoundedIcon />
                </IconButton>
                </Paper>
          <Paper style={{position:'relative', right:'-22px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "24", gridColumn :"21/23", width:'1.8vw', height:'3.5vh'}}>                 
          <Tooltip title="Center on coordinate" arrow>
          <IconButton onClick={resetLocation} disableRipple size='small'>
              <MyLocationRoundedIcon />
          </IconButton>
          </Tooltip>
          </Paper>
          <Paper style={{position:'relative', right:'-35%'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "24", gridColumn :"19/21", width:'4.5vw', height:'3.5vh'}}>                 
          <Tooltip title='Toggle RTLS' >
          <Stack direction="row" spacing={1} alignItems="center" mt='6%' ml='5%'>

                            
                            
                            <Typography sx={{fontSize:"small"}}>RTLS</Typography>
                            <IOSSwitch  checked = {comm.rtlsOn}  disabled={!comm.gatewayConnected} onChange={handleRtls}  />
                           
                            
                          </Stack>
                          </Tooltip>
          </Paper>

          <Paper style={{position:'relative', right:'-2vw'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "24", gridColumn :"17/19", width:'5.7vw', height:'3.5vh'}}>                 
          <Tooltip title='Toggle Gateway Link' >
          <Stack direction="row" spacing={1} alignItems="center" mt='6%' ml='5%'>

                            
                            
                            <Typography sx={{fontSize:"small"}}>Gateway</Typography>
                            <IOSSwitch  disabled={(comm.hostName===""||comm.port===""|| comm.netComm || !comm.socket)} 
                            checked={comm.gatewayConnected}
                            onChange={handleConnect}/>
                           
                            
                          </Stack>
                          </Tooltip>
          </Paper>

            {/**Master Selection Dialog */}
            <Slide direction="up" in={state.showMasterList} mountOnEnter unmountOnExit>
                  

                   <Paper elevation="6" sx = {{gridRow : "6/10",gridColumn:"8/12",
                               display:"grid",
                               gridTemplateColumns : 'repeat(12,1fr)',
                               gridTemplateRows: 'repeat(6,1fr)' ,
                              gridGap : "15px",
                               borderRadius : "10px",
                                p:1
                               }}>

                      
                       <FormControl
                         variant="standard"
                         id="multipleMaster"
                         sx={{ m: 1,gridRow :"2/4",gridColumn:"2/12"}}
                         size="small">      
                       
                       
                       <InputLabel shrink htmlFor="mutiple-master">
                              Select Nearest Master
                       </InputLabel> 
                       
                        <Select
                          variant="standard"
                          //multiple
                          native
                          //value={currentMultiMaster}
                          onClick = {handleMultiMaster}
                          //onChange={handleMultiMaster}
                          label="Select Nearest Master"
                          //sx={{height:"100%"}}
                          inputProps={{
                          id: 'multiple-master',
                          
                          }}>
                             

                        {
                            state.masterList.filter((item)=>item!==state.currentAnc).map((item,index)=>
                            
                              <option key={item} value={item}>
                                     {item}
                              </option>
                              

                            )
                        } 
                        
                       </Select>            
                     </FormControl>
                     <Button variant="contained" onClick={addMultiMaster} size="small" sx={{gridRow : "5/6", gridColumn:"6/9"}}>Add</Button>
                     <Button variant="contained" onClick = {closeMasterList} size="small" sx = {{gridRow : "5/6", gridColumn : "9/12"}}>Close</Button>

                  </Paper>
                    
                </Slide>
                {/**Master selection dialog ends */}

                {/**Connection menu */}

                      {/* <Card sx={{gridRow :"3/11",gridColumn:"21/25"}}>
                        <CardContent>
                        <Box sx = {{  border:"2px solid black",borderRadius: "5px",p:1}}>
                        <Box sx= {{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff",fontSize:"small"}}>Gateway Options</Box>
                          
                          
                          
                          <Stack direction="row" spacing={1} alignItems="center" sx={{m:0}}>

                            <Typography sx={{fontSize:"small"}}>Delinked</Typography>
                            <IOSSwitch  disabled={(comm.hostName===""||comm.port===""|| comm.netComm || !comm.socket)} 
                            checked={comm.gatewayConnected}
                            onChange={handleConnect} />
                            <Typography sx={{fontSize:"small"}}>Linked</Typography>
                          </Stack>
                          
                       </Box>  


                      <Box sx = {{ border:"2px solid black",borderRadius: "5px", mt:3}}>
                        <Box sx= {{height:"max-content",width:"max-content",mt:"-15px",ml:"10px",background:"#fff",fontSize:"small"}}>RTLS Status</Box>
                          <Stack direction="row" sx={{mt:1,mb:1}}spacing={1} alignItems="center" justifyContent="space-around">

                            <Typography fontSize="small">Off</Typography>
                            <IOSSwitch  checked = {comm.rtlsOn}  disabled={!comm.gatewayConnected} onChange={handleRtls} />
                            <Typography fontSize ="small">On</Typography>
                          </Stack>
                       </Box>
                       </CardContent>
                       </Card> */}
                      {/*Connection menu ends*/}
              
                   {/*Configuration */}
                      
                    
                  
                     


              
             </Box>
            </Box>  
             <Outlet/>
      
     
    </React.Fragment>;
       
  
}


const mapStateToProps=(state)=>({
    colorIndex:state.color.colorIndex,
    configFloor : state.floorplan.configFloor,
    anchors : state.anchor.anchor
     
  })




export default AnchorPlan


// ------------------------------------------------------------Previous Code-----------------------------------------------------------------------------
// 
// 
// 
// 
// 
// 
// 

// import * as THREE from 'three'
// import {DragControls} from "three/examples/jsm/controls/DragControls"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
// import { Button, Grid, Typography } from "@mui/material";
// import React, { useContext } from "react";
// import { connect, useSelector,useDispatch } from "react-redux";
// import { panelColor } from "../../components/themeColor";
// import Box from "@mui/material/Box"
// import { useEffect } from 'react';
// import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
// import { IconButton } from '@mui/material';
// import { Tooltip } from '@mui/material';
// import MapRoundedIcon from '@mui/icons-material/MapRounded';
// import { Outlet } from 'react-router-dom';

// import { FormLabel } from '@mui/material';

// //import { useDispatch } from 'react-redux';

// import { useCallback,useState } from 'react';



// 
// 

// import {IOSSwitch} from "../UI/Switch"
// import {Backdrop,Card,CardContent, CardTitle,CardActions} from "@mui/material"
// import { CloseRounded, SwitchVideo } from '@mui/icons-material';
// import { resetAnchor } from '../../feature/anchor/anchorSlice';
// import NoDisplay from '../UI/NoDisplay';
// import { setAlerts } from "../../_actions/alertAction"; 
// import { MenuList,MenuItem,Paper ,Menu} from '@mui/material';
// import { ListItem,TextField,Checkbox } from '@mui/material';
// import { Select,FormControl,InputLabel } from '@mui/material';
// import {Radio,RadioGroup,FormControlLabel} from '@mui/material'
// import { useNavigate } from 'react-router-dom';
// import { Slide } from '@mui/material';

// import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material' 
// import io from 'socket.io-client'
// import zIndex from '@mui/material/styles/zIndex';
// import{ Switch,Stack} from '@mui/material';
// import {addAnchor,getAnchorsOfFloor,editAnchor} from '../../feature/anchor/anchorThunk';
// import { FILTER_GLTF } from '../../_actions/types';
// import { SettingsSharp } from '@mui/icons-material';
// import { current } from '@reduxjs/toolkit';
// //import { config } from 'dotenv/types';
// import {resetConfigFloor} from "../../feature/floorplan/floorplanSlice"
// import { useTheme } from '@mui/material/styles';
// import { useMediaQuery, LinearProgress } from '@mui/material';
// import {Table,TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
// import {Grow} from '@mui/material'
// import withStyles from '@mui/styles/withStyles';
// import makeStyles from '@mui/styles/makeStyles'; 
// import { DeleteOutlined } from '@mui/icons-material';

// const PanelBox = {}
// 
// 
// let convert = import('xml-js')
// let widthVector = null
// let scene, camera, renderer,cube
// let loaded = false
// let box = null
// let projector
// let mousexy = null
// let mouseMove = null
// let points = []
// let ring=null 
// let controls = null
// let orbit = null
// let point1 = null
// let line =null
// let canvas=null
// let canvasPoints = []
// let movePoint = null
// let floorPlanCenter = null
// let moveRay=null
// let cameraPosition=0.0
// let gridHelper = null
// let coordinateCentered = true
// let corner1=null
// let circleMesh1=null
// let corner2=null
// let corner3=null
// let target = new THREE.Vector3()
// let intersectionPlane=new THREE.Plane( new THREE.Vector3( 0,-1,0 ), 0 );
// let dragRay = new THREE.Raycaster()
// let circle = null
// let axisControl = null
// let floorPlan = null
// let floorPlanMidPoint = null
// let anchorList=[]
// let group=null
// let clickRay = null
// let dragGroup = null
// let spriteArray = []
// let anchorRanging = {} 
// let anchorImage = null
// let anchorCanvasRef = {}
// let anchorConfig ={}
// const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

// 
// let currentSelected = ""
// let frustumSize = 20
// let aspect = 0.0
// let lineObjects = []
// let spriteObjects = []
// //let currentSelected
// let selectedAnc = ""










// 

// ////////////////////////////////////////Anchor Ip list///////////////////////////////////////////////////////
// const StyledTableCell = withStyles((theme) => ({
//   head: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   body: {
//     fontSize: 14,
    
//   },
// }))(TableCell);

// const StyledTableRow = withStyles((theme) => ({
//   root: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
// }))(TableRow);


// const useStyles = makeStyles({
//   table: {
   
//   },
//   container:{
//     maxHeight : 500,
//     minWidth: 500,
//   } 
// });
// ////////////////////////////////////IP table code need to be written//////////////////////
// function IPTable(props) {

//   //const tags = useSelector((state)=>state.tag.tags)
  
//   const dispatch = useDispatch()
//   const classes = useStyles();

//   const navigate = useNavigate()
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const [delId, setDelId] = useState("");
//   const [iPList, setIPList] = useState([{"id":"","ip":""}])
//   const onDeleteHandler = () => {
//     //dispatch(deleteTag(delId));
//     onDeleteClose();
//     //dispatch(getTags())
//   };

//   const onDeleteOpen = (id) => {
//     //setConfirmDelete(true);
//     //setDelId(id);
//   };

//   const onDeleteClose = () => {
//     //setConfirmDelete(false);
//   };


//   const handleAddRow = ()=>{
//     setIPList((prevList)=>{return[...prevList, {"id":"", "ip":""}]})
//   }


//   const handleChange = (e)=>{
    
//      const [k,idx] = e.target.name.split("-")
//      //iPList[idx] = e.target.value
//      console.log("Values are ",k,idx)
//      setIPList((oldList)=>{
//       const list = [...oldList]
//       list[idx][k] = e.target.value
//       return list
//      })
//     console.log(iPList)
//   }

//   const handleDelete = (idx)=>{
//     console.log("delete Index",idx)
//      setIPList((prevList)=>{
//       const newList = [...prevList]
//       newList.splice(idx,1)
//       console.log("New List Afetr splice", newList)
//       return newList

//      })       

//   }

//   const checkIp = (idx)=>{
//     //console.log(iPList[idx])
//     if(iPList[idx]["ip"]==="")
//     { 
//       return false
//     }
//     else 
//     {
//       return !iPList[idx]["ip"].match(ipformat)
//     }
  
  
//   }

//   return <>

//    <Dialog
//    open={props.showIp}
//    onClose = {props.closeIp}
//    disableEscapeKeyDown
//    >
//     <DialogTitle><Typography align="left">Enter IP Address of Anchor installed on the floor</Typography>
      
//     </DialogTitle>
//     <DialogContent>
//    <TableContainer component={Paper} className={classes.container}>
//      <Table stickyHeader  aria-label="customized table" size = "small">
//        <TableHead >
//          <TableRow>
          
//          <StyledTableCell align="center">Anchor ID</StyledTableCell>
//            <StyledTableCell align="center">IP Address</StyledTableCell>
//            <StyledTableCell align="center">Remove</StyledTableCell>
//          </TableRow>
//        </TableHead>
//        <TableBody>
//          {iPList.map((item,index) => (
//             <Grow
//             in={true}
            
//             {...(true? { timeout: 1000 } : {})}
//           >
//            <StyledTableRow key={index}>
//            <StyledTableCell align="center"><TextField
//                                               //hiddenLabel
//                                               //error = {checkIp(index)}
//                                               name = {"id-"+index} 
//                                               id="outlined-basic" 
//                                               label="-" 
//                                               onChange={handleChange}
//                                               variant="outlined" 
//                                               value={item["id"]}
//                                               //helperText = {checkIp(index)?"Inavalid ip": ""}
//                                               /></StyledTableCell>
            
             
//              <StyledTableCell align="center"><TextField
//                                               //hiddenLabel
//                                               error = {checkIp(index)}
//                                               name = {"ip-"+index} 
//                                               id="outlined-basic" 
//                                               label="-" 
//                                               onChange={handleChange}
//                                               variant="outlined" 
//                                               helperText = {checkIp(index)?"Inavalid ip": ""}
//                                                value = {item["ip"]}
//                                               /></StyledTableCell>
            
            

//             <StyledTableCell align="center">
//                    <IconButton aria-label='delete' 
//                    onClick = {()=>{handleDelete(index)}}
//                    size="large">
//                      {
//                        <Tooltip title='Remove row'>
//                          <DeleteOutlined color='primary' />
//                        </Tooltip>
//                      }
//                    </IconButton>

//              </StyledTableCell>
//            </StyledTableRow>
//            </Grow>
//          ))}
//        </TableBody>
//      </Table>
//    </TableContainer>
//    </DialogContent>
//    <DialogActions>
//    <Button color = "secondary" onClick={props.toFloorplan}>Floorplan</Button>
//     <Button color = "secondary" onClick={handleAddRow}>Add Row</Button>
//     <Button color = "secondary" 
//     onClick={()=>{props.configureIP(iPList)}}
//     disabled={props.netComm}
//     >Configure</Button>
//    </DialogActions>
//    </Dialog>
//   </>;
// }






// ////////////////////////////////////////////////////////////////////Configure Anchor component/////////////////////////////////////////////////////////////////

// //import Box from "@mui/material/TextField";

// const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
// const OutlinedDiv = ({ children, label,sx }) => {
//   return (
//     <TextField
//       variant="outlined"
//       label={label}
//       multiline
//       InputLabelProps={{ shrink: true }}
//       InputProps={{
//         inputComponent: InputComponent
//       }}
//       inputProps={{ children: children }}
//       sx={sx}
//     />
//   );
// };
// //export default OutlinedDiv;

// 
// const AnchorPlan = (props)=>{

//   const theme = useTheme()
//   const matches = useMediaQuery(theme.breakpoints.up("xl"))
//   const dispatch = useDispatch()  
//   const navigate = useNavigate()
//   const apiToken = useSelector((state)=>state.auth.token) 
//   const colorIndex = useSelector((state)=>state.color.colorIndex)
//     const configFloor = useSelector((state)=>state.floorplan.configFloor)
//     const storedAnchors = useSelector((state)=>state.anchor.anchor)
//     const [local,setLocal] = React.useState({x:1.0,y:1.0})
//     const [state,setState] = React.useState({contextMenu : null,
//                                              discoveredAnc:[],
//                                              selectedAnc:[],
//                                              openAncList:false,
//                                              anchors : [],
//                                              ancList:[],
//                                              anchorLoc : {},
//                                              masterList : [],
//                                              showMasterList :false,
//                                              currentAnc : "",
//                                              currentMultiMaster : '',
//                                              confedAnchor:null,
//                                              calculatedRange : {},
                          
//                                              confed:false , ///Indicated configured or not
//                                              //localX : 1.0,
//                                              //localY : 1.0
//                                              floorData : null,
//                                              loaded : false,
//                                              rangingOn : false,
//                                              showIp :false,
//                                              lastSelectedAnc:"",
//                                              demoMode : true
//                                           }) 
//     const [comm,setComm] = React.useState({socket:null, 
//                                            gatewayConnected : false,
//                                            hostName:"localhost",
//                                            port:9009,
//                                            netComm:false,//connection in progress
//                                            rtlsOn : false,


//                                           })


//     //const [contextMenu, setContextMenu] = React.useState(null)
//     ///const [discoveredAnc, setDiscoveredAnc] = React.useState([])
//     //const [selectedAnc, setSelectedAnc] = React.useState([])
//    /// const [openAncList,setOpenAncList] = React.useState(false)
//    // const [anchors, setAnchors] = React.useState([])
//     //const [mMList, setMMList] = React.useState([])
//     //const [ancList,setAncList] =   React.useState([])
//     ///const [anchorLoc, setAnchorLoc] =React.useState({})
    
//     //const [masterList, setMasterList] = React.useState([])
//     //const [selectedMaster, setSelectedMaster]  = React.useState("")

//     //const [showMasterList, setShowMasterList] = React.useState(false)
//   // const [anchorRanging,setAnchorRanging] = React.useState({})

//     //const [currentAnc, setCurrentAnc]= React.useState("")
//     //const [currentMultiMaster, setCurrentMultiMaster] = React.useState('')
//     const  cont  = React.useState(true)
//     const colIndex = colorIndex
 
//     //const [localX,setLocalX] = React.useState(1.0)
//     //const [localY,setLocalY] = React.useState(1.0)
//     //const [socket, setSocket] = React.useState(null)
//     //const [gateway,setGateway] = React.useState("")
//     ///const [gatewayConnected, setGetwayConnected] = React.useState(false)
//     //const [calculatedRange,setCalculatedRange] =React.useState({})
//     //const [hostName,setHostName] = React.useState("")
//     //const [port,setPort] = React.useState(3334)
//     //const [netComm,setNetComm] = React.useState(false)
//     //const [rtlsOn, setRtlsOn] =React.useState(false)
   
//     //const [confed,setConfed]=React.useState(false)
// ///This function initializes threejs canvas
//     const init3d=()=>{
 
//         anchorImage = new Image()
//         anchorImage.src = '/anchor.svg'
//         canvas = document.querySelector("#anchor")
//         //console.log(canvas)
//         renderer =new THREE.WebGLRenderer({canvas})
//         //renderer.setPixelRatio(devicePixelRatio)
//         //console.log("height",canvas.offsetHeight)
//         scene = new THREE.Scene()
//         //camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight,.1,1000)
        
//         frustumSize = 20
//         aspect = canvas.clientWidth / canvas.clientHeight
//         camera =new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
//         renderer.setSize(canvas.clientWidth, canvas.clientHeight)
//         //canvas.appendChild(renderer.domElement)
//         scene.background = new THREE.Color(panelColor[colIndex].p1)
   
//        /*const gui = new dat.GUI()
//         const scale=gui.addFolder("scale")
//         scale.add(control,"scaleX",0.1,3)
//         scale.add(control,"scaleY",0.1,3)
//         scale.add(control,"scaleZ",0.1,3)*/
//         orbit = new OrbitControls(camera,renderer.domElement)
//         orbit.enableRotate= false
//        // orbit.enableZoom=false
   
//         const geometry = new THREE.SphereGeometry( 0.2,22,22  );
//         const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//         movePoint = new THREE.Mesh(geometry,material)
//         //scene.add(movePoint
       
         
        
//         gridHelper = new THREE.GridHelper(10000,10000)
//         gridHelper.material.transparent=true
//         gridHelper.material.opacity=0.25
//         scene.add(gridHelper)
//         cameraPosition=10
//         camera.position.y= cameraPosition
//         camera.lookAt(0,0,0)
   
   
        
//         moveRay = new THREE.Raycaster()
//         //moveRay.
//         clickRay = new THREE.Raycaster()

//         //floorPlan = new THREE.Object3D()
//         //scene.add(floorPlan)


        
   
      
//        canvas.addEventListener("mousemove",documentMouseMove,false)
//        //canvas.addEventListener("mousedown",mouseDown,false)
//        //canvas.addEventListener("mouseup",mouseUp,false)
       
//       console.log(state.ancList)
//       console.log(state.anchorLoc)

      
   
//    }



//    


//   ///Creates a new web socket connection

//   ///On pageload creates new socket connection 


//   const toFloorplan=()=>{

//     if(comm.socket)
//     {
//       comm.socket.disconnect()
    
//     }
//     navigate("/floorplans")
//   }

//   useEffect(()=>{

//    const soc = io(`http://${window.location.hostname}:5000`)
//    /*const soc = io(`http://localhost:9000`,{
//                      extraHeaders :{
//                       Authorization : apiToken
//               }}) */  

//    //setSocket(soc)
//    //setState({...state, socket : soc})
//    setComm((comm)=>{return {...comm, socket : soc}})

//    return ()=> {
     
//     console.log("Disconnecting existing socket")
//     soc.disconnect()
  
//     soc.close()
//     removePLane()
//   }


//   },[])

// ///process received message
// /**
//  * This method facilitates backend communication with websocket server. This method recives response from backend server and
//  * and process them.  
//  * */  

// useEffect(()=>{
  
 
//   const onConnect = (message)=>{
//     console.log(message)
//     if(message.status === "success")
//     {
//     dispatch(setAlerts("Socket connected","success",true))
//     }
//     else if(message.status ==="failed")
//     {
//       dispatch(setAlerts("Socket connection failed","error",true))
//     }
//   }


//   //This function is invoked when gateway sucessfully connected
//   const onGatewayResponse=(message)=>{
//     console.log("gatewayresponse",message)
//     if(message["code"]===200 && message["message"]==="Connected Sucessfully")
//     {

//      /* socket.emit("gatewaycommand",{
//         command : {
//           "_declaration":{
//             "_attributes":{
//               "version":"1.0",
//               "encoding":"utf-8"
//             }
//           },
//            "req":{
//                 "_attributes":{
//                     "type":"rf cfg"
//                 },
//                 "rf":{
//                   "_attributes":{
//                     "chan":"5",
//                      "prf":"64",
//                       "rate":"6810",
//                        "code":"3", 
//                        "plen":"1024",
//                        "pac":"32",
//                        "nsfd":"0"
//                   }
//                 }
//            }
  
  
//         }
//       })*/



//       comm.socket.emit("gatewaycommand",{
//         command : {
//           "_declaration":{
//             "_attributes":{
//               "version":"1.0",
//               "encoding":"utf-8"
//             }
//           },
//            "req":{
//                 "_attributes":{
//                     "type":"cle cfg"
//                 }
//            }
  
  
//         }
//       })  

//   /*  socket.emit("gatewaycommand",{
//       command : {
//         "_declaration":{
//           "_attributes":{
//             "version":"1.0",
//             "encoding":"utf-8"
//           }
//         },
//          "req":{
//               "_attributes":{
//                   "type":"anchor list"
//               }
//          }


//       }
//     }) */
//     dispatch(setAlerts("GateWay connected","success",true))
//     //setNetComm(false)
//     //setGetwayConnected(true)
//     setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : true}})
//   }
//   /*else if(message["code"]===200 && message["message"]==="Disconnected")
//   {
//     dispatch(setAlerts("GateWay Disconnected","success",true))
//     setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : false}})
//   }*/

//   }   



//   const onGatewayConfig = (msg)=>{
//       console.log("received message", msg)
//       if(msg["code"] === 404 && msg["message"]==="dns config missing")
//       {
//          setState((prevState)=>{return {...prevState, showIp:true}})
//          dispatch(setAlerts("Anchor DNS  configuration missing","error",true))
         
//       }
//       if(msg["code"]===400)
//       {
//            switch(msg["message"]){

//             case "anchor not available":
//              console.log(msg["ipList"])
//              dispatch(setAlerts("Some anchors are  not reachable. please check ip","error",true))
//              break
             
//             default:
//               dispatch(setAlerts("Cant configure due too error in Gateway","error",true))

//            }
//       }
//       if(msg["code"]===200)
//       {
        
//         dispatch(setAlerts("Anchor DNS configuration stored sucessfully!! please reconnect","success",true))

//         if(comm.socket)
//         {
//           comm.socket.emit("gatewaydisconnect",{
//             closegateway:true
    
//           }) 
//         } 
//         setState((prevState)=>{return {...prevState, showIp:false}})
//        //setComm((comm)=>{return {...comm, netComm:true}})
//       }
//       if(msg["code"]===102)
//       {
//         dispatch(setAlerts("please wait processing your request","info",true))
//       }
     

//       if(msg["code"]!==102)
//       {
//         setComm((comm)=>{return{...comm,netComm:false}})
//       }
      
//   }

 


//   const onGatewayError =(message)=>{
//     console.log("gatewayerror",message)
//     if(message["code"]===500)
//     {
//     dispatch(setAlerts("Gateway connection error, Host not reachable", "error",true))
//     //setGetwayConnected(false)
//     setComm((comm)=>{return{...comm,netComm:false,gatewayConnected : false}})
//     }
//     else if(message["code"]===400 && message["message"] =="Wrong command")
//     {
//       dispatch(setAlerts("Command format error!!", "error",true))
//     }
//     else if(message["code"]===400 && message["message"] =="Anchor not found")
//     {
//       dispatch(setAlerts("Cant configure!!! Anchor" + message["ancId"] +"not reachable", "error",true))
//     }
//   }

  
//   const onGatewayclose=(message)=>{
//     console.log("gatewayClose",message)
//     if(message["status"]==="closed")
//     {
//       dispatch(setAlerts("Gateway connection closed", "success",true))
//       //setNetComm(false)
//       //setGetwayConnected(false)
//       setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : false}})

//     }
//   }

//   const onGatewaydata = (data)=>{
//     console.log("gatewaydata",data)
//     const  response = data["response"]
//      switch(response["ind"]["_attributes"]["type"])
//     {

//     /**Available anchors */
//     case  "anchor list": 
//          const anchorss =[]
//          response["ind"]["anchor"].forEach((obj)=>{
//          anchorss.push(obj["_attributes"]["addr"])
//          }) 
//          //setDiscoveredAnc(anchors)
//          console.log("state list",state)
//          setState((state)=>{return {...state, discoveredAnc : [...anchorss], openAncList : true}})
//     break;

//     /** Renge test response */

//     case "range test":
//     console.log(response)
         
//          const anc1 = response["ind"]["initiator"]["_attributes"]["addr"]
//          const anc2 = response["ind"]["initiator"]["responder"]["_attributes"]["addr"]
//          const distance = response["ind"]["initiator"]["responder"]["_attributes"]["distance"]
//          const obj = {anc1,anc2,distance}
//          //setCalculatedRange(obj)
//          setState((state)=> {return{...state,rangingOn : false, calculatedRange:{...obj}}})



    
//     break; 

//     ///Display status message of cle operation
//     case "system status":
//        const msg = response["ind"]["_attributes"]["msg"]
//         if(msg ==="ranging")
//         {
//           console.log("alert mgs",msg)
//          dispatch(setAlerts("ranging started","info",true))
//         }
//     break;
    
//     case "cle cfg" :
//       console.log(response["ind"]["cle"]["_attributes"])
//       if(response["ind"]["cle"]["_attributes"]["state"]==="1")
//       {
//         console.log("State", comm)
//         setComm((comm)=>{return{...comm,rtlsOn : true}})
//       }
//     break;


//     case "rtls start":
//       dispatch(setAlerts("RTLS started","success",true))
//     break


//     case "rtls stop":
//       dispatch(setAlerts("RTLS stopped","success",true))
//     break


//     default : 
//        console.log(response)

//    }
//   }


//   if(comm.socket)
//   {
//  comm.socket.on("serverresponse",onConnect)
//   comm.socket.on("gatewayresponse",onGatewayResponse)
// comm.socket.on("gatewayerror",onGatewayError)
//   comm.socket.on("gatewaydata",onGatewaydata)
//   comm.socket.on("gatewayclose",onGatewayclose)
//   comm.socket.on("gatewayconfig", onGatewayConfig)
//   }
//  return ()=>{
//         if(comm.socket)
//         {
    
//           comm.socket.off("serverresponse",onConnect)
//           comm.socket.off("gatewayresponse",onGatewayResponse)
//           comm.socket.off("gatewayerror",onGatewayError)
//         comm.socket.off("gatewaydata",onGatewaydata)
//           comm.socket.off("gatewayclose",onGatewayclose)
//         }

//  }

// },[comm.socket])

// /





// const setCurrentAnc = (anc)=>{
//   console.log("setCurrentAnc->", anc)
  
//    updateSelectedCanvas(state.currentAnc, anc)
//    //prevAnc = state.lastSelectedAnc
 
//       const prevAnc = state.currentAnc
//       setState((prev)=>{return {...prev,lastSelectedAnc : prevAnc, currentAnc : anc}})
   
  


// }
// ////sends ip address for configuration
// const configureIp=(ipList)=>{

//   for(let i=0;i<ipList.length;++i)
//   {
//     if(ipList[i]["id"].trim()==="")
//     {
//       dispatch(setAlerts("Blank anchor id address in achor list!!","error",true))
//       return
//     }
//     if(ipList[i]["id"].indexOf(" ")!=-1)
//     {
//       dispatch(setAlerts("Anchor id can't contain space character","error",true))
//       return
//     }
//     if(ipList[i]["ip"].trim()==="")
//     {
//       dispatch(setAlerts("Blank ip address in achor IP list!!","error",true))
//       return
//     }
//     if(!ipList[i]["ip"].match(ipformat))
//     {
//       dispatch(setAlerts("Invalid ip address in achor IP list!!","error",true))
//       return
//     }
//   }
//   const message = {message:"dns config", iplist:ipList}

// console.log("Message", message)
 

//   if(comm.socket)
//   {
//      comm.socket.emit("gatewayconfig",message)
//   }
// }






  
// const showDiscoveredAnchorList=()=>{

//   if(comm.socket)
//   {
//     comm.socket.emit("gatewaycommand",{
//       command : {
//         "_declaration":{
//           "_attributes":{
//             "version":"1.0",
//             "encoding":"utf-8"
//           }
//         },
//          "req":{
//               "_attributes":{
//                   "type":"anchor list"
//               }
//          }


//       }
//     })
//   }
  
//   //setOpenAncList(true)
//   //setState({...state, openAncList : true})

// }

// const closeAnchorList=()=>{
//   //setOpenAncList(false)
//   setState((state)=>{return{...state, openAncList :false}})
// }



// const updateSelectedAnchorList=()=>{

//   const ancSet = new Set(state.ancList)
//   const newAnc = []
//   state.selectedAnc.forEach((item)=>{
//     if(!ancSet.has(item))
//        {
//        ancSet.add(item)
//        newAnc.push(item)
//        }
//   })
//   //setSelectedAnc([])
  
//   //setAncList([...ancSet])
  
//   console.log([...ancSet])
//   const anl = [...ancSet]
//   const loc = {}
//   newAnc.forEach((item)=>{loc[item]={x:0.0,y:0.0,z:0.0,type:"",masterToFollow:"",masterAnchor:[],dbload:false}})
//   console.log(loc)
//   //setAnchorLoc({...anchorLoc,...loc})

//   setState((state)=>{return {...state, ancList : [...ancSet], anchorLoc : {...state.anchorLoc, ...loc}, selectedAnc : [], openAncList : false}})

// //  closeAnchorList()

  

// }

// const removeCurrentAnchor=()=>{
    
//   const ancSet = new Set(state.ancList)
//   ancSet.delete(state.currentAnc)
  
//   const ancObj = scene.getObjectByName(state.currentAnc)
//   scene.remove(ancObj)

//   const rangeObj = anchorRanging[state.currentAnc]
//   console.log(rangeObj)

//   if(rangeObj)
//   {
//      for(const anc in rangeObj)
//      {
     
       
//       scene.remove(rangeObj[anc]["line"])  
//       delete anchorRanging[anc][state.currentAnc]
        
//      }
//      delete anchorRanging[state.currentAnc]
//   }

//  //delete anchorLoc[currentAnc]
//   //setCurrentAnc('')
  
//   //setAncList([...ancSet])
//   const {[state.currentAnc]:anc, ...rest} = state.anchorLoc
//   setState((state)=>{return{...state, ancList:[...ancSet], anchorLoc : {...rest}}})
//   setCurrentAnc("")
// }



// const handleDiscovedSelect = (event)=>{
//   const {options} = event.target  
//   if(options.selectedIndex!== -1)
//   {
//     const opt = []
//     const idx = []
    
//     const selectedSet = new Set()
    
//     //console.log(options.selectedIndex)
//     for (let i = 0, l = options.length; i < l ; i += 1) {
//         if (options[i].selected) {
//           selectedSet.add(options[i].value)
//           //opt.push(options[i].value);
//           //idx.push(i)
//         }
//       }

//    console.log(selectedSet)   
//    //setSelectedAnc([...selectedSet])
//    //setConfed(false)

//    setState((state)=>{return {...state, selectedAnc : [...selectedSet], confed : false}})

//   }  

// }





//    ///This mouse event records the mouse pointer movement of three js canvas

//    const documentMouseMove=useCallback((event)=>{
//     const mouseMove = new THREE.Vector2()
//     mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
//     mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    
//     moveRay.setFromCamera( mouseMove, camera );
//     var intersects = moveRay.intersectObjects(scene.children,false);
    
//    // console.log(intersects)
//     if(intersects.length>0)
//     {
       
//         const point =  intersects[0].point
       
//         // setLocalX(point.x)
//         //setLocalY(-point.z) 
//         //setState({...state, localX:point.x, localY:-point.z}) 
//         setLocal({...local, x:point.x, y:-point.z})    
//     }
// },[cont])


// ///This mouse event takes two points from user


// const resetLocation=()=>{

    
//     orbit.target=new THREE.Vector3(0,0,0)
//     camera.position.set(0,cameraPosition,0)
//     coordinateCentered = true
//     orbit.update()
    
// }


// const resizeRendererToDisplaySize=(renderer)=>{
//     const canvas = renderer.domElement
//     const width = canvas.clientWidth
//     const height = canvas.clientHeight
//     //console.log(width,height)
//     const needResize = canvas.width!== width || canvas.height!==height
//     if(needResize)
//     {
//         renderer.setSize(width,height,false)
//     }
//     return needResize
// }


// 


// const placeAnchor=()=>{




// }

// 
// const createCanvas = (ancName,type)=>{
//   var canvas = document.createElement("canvas")
//   canvas.height=125
//   canvas.width =100
//   var ctx = canvas.getContext("2d");
// const name = ancName.substring(7)
// ctx.font = "20px Arial"
// ctx.fillText(name,0,20)
// ctx.drawImage(anchorImage,5,25,80,80)

// // Create gradient
// //ctx.clearRect(0,0,640,480);

// if(type ==="Slave")
//  {
//    ctx.fillStyle = 'rgba( 0, 181, 9,0.20)';
//  }
//  else if(type==="Primary Master") {
//   ctx.fillStyle = 'rgba(250, 0, 0, 0.20)';
//  }
//  else if(type==="Secondary Master"){
//   ctx.fillStyle = 'rgba(0, 0, 255, 0.20)';
//  }
//  else{
// ctx.fillStyle = 'rgba(0, 0, 200, 0.05)';
//  }
// ctx.beginPath();
// ctx.arc(45, 65, 29, 0, 2 * Math.PI);
// ctx.fill()
// //ctx.clearRect
// anchorCanvasRef[ancName] = {ctx:ctx}
// return canvas
// }


// const updateCanvas= (ancName, type)=>{

// const ctx = anchorCanvasRef[ancName]["ctx"]
// const texture = anchorCanvasRef[ancName]["texture"]
// //ctx.clearRect(0,0,125,100)
// //ctx.font = "20px Arial"
// //ctx.fillText(ancName,1,20)

// ctx.clearRect(5,25,81,81)
// ctx.drawImage(anchorImage,5,25,80,80)

// // Create gradient
// //ctx.clearRect(0,0,640,480);
// if(type ==="Slave")
//  {
//    ctx.fillStyle = 'rgba( 0, 181, 9,0.20)';
//  }
//  else if(type==="Primary Master") {
//   ctx.fillStyle = 'rgba(250, 0, 0, 0.20)';
//  }
//  else{
//   ctx.fillStyle = 'rgba(0, 0, 255, 0.20)';
//  }

// ctx.beginPath();
// ctx.arc(45, 65, 29, 0, 2 * Math.PI);
// ctx.fill()
// texture.needsUpdate = true

// }



// 

// const updateSelectedCanvas=(anc1,anc2, selected=false)=>{
//   if(anc1)
//   {
//   const ctx = anchorCanvasRef[anc1]["ctx"]
//   const texture = anchorCanvasRef[anc1]["texture"]

//   //ctx.clearRect(0,0,125,100)
//   //ctx.font = "20px Arial"
//   //ctx.fillText(ancName,1,20)
  
//   ctx.clearRect(0,105,100,14)
//   texture.needsUpdate = true
//   }

//   if(anc2)
//   {
//     const ctx1 = anchorCanvasRef[anc2]["ctx"]
//   const texture1 = anchorCanvasRef[anc2]["texture"]
//   ctx1.fillStyle = 'rgba( 255, 168, 38,0.80)';
//   ctx1.fillRect(0,105,100,14)
//   texture1.needsUpdate = true
//   selectedAnc= anc2 
//   }


 
//   if(selected)
//   {
  
//   //ctx.drawImage(anchorImage,5,25,80,80)
  
//   // Create gradient
//   //ctx.clearRect(0,0,640,480);
//   /*if(type ==="Slave")
//    {
//      ctx.fillStyle = 'rgba( 0, 181, 9,0.20)';
//    }
//    else if(type==="Primary Master") {
//     ctx.fillStyle = 'rgba(250, 0, 0, 0.20)';
//    }
//    else{
//     ctx.fillStyle = 'rgba(0, 0, 255, 0.20)';
//    }
  
//   ctx.beginPath();
//   ctx.arc(45, 65, 29, 0, 2 * Math.PI);
//   */
  
//   }
  

// }

// const drawPlane = (uri,configFloor)=>{

//     const loader = new THREE.TextureLoader()
//     const width = 10
    
//     loader.load(uri,(texture)=>{
//         console.log("txture>>",texture)
//       const height = width * (texture.image.height / texture.image.width)
//       let plane = new THREE.PlaneGeometry(width,height)
//       //plane.translate(width/2,height/2,0)
//       let planeMat = new THREE.MeshBasicMaterial({map:texture,transparent:true, opacity:0.5})
//       console.log("txture>>",texture)
      
//       cube = new THREE.Mesh(plane,planeMat)
//      /// cube.position.setX(width/2)
//       //cube.position.setZ(height/2)
//       cube.position.setY(0.001)
//       cube.geometry.translate(width/2,height/2,0)
      
//       const diag = Math.sqrt((width*width) + (height*height))
      
    
//      widthVector = new THREE.Vector3(width,0,0)
      
      
     
     




//      const cubeCenter = new THREE.Vector3(width/2,height/2,0)
     
     
      
      
      
//       cube.rotateX(-0.5 * Math.PI)
      
//       //scene.add(cube)
       
//       floorPlan = new THREE.Object3D()
     
//       //floorPlan.add(widthVector)
//       floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
      
//       if(configFloor.data["configured"])
//       {
//         cube.scale.setScalar(configFloor.data["scale"])
//         cube.rotateZ(configFloor.data["angle"])
//         cube.material.opacity = configFloor.data["opacity"]
//         floorPlan.position.setX(configFloor.data["x"])
//         floorPlan.position.setY(configFloor.data["y"])
//         floorPlan.position.setZ(configFloor.data["z"])
//         camera.position.y =configFloor.data["camera"]
//         cameraPosition =  camera.position.y
//         frustumSize = 20 * cube.scale.x
//         camera.left = (frustumSize * aspect  / -2) 
//         camera.right = (frustumSize * aspect / 2)
//         camera.top =  (frustumSize  / 2)
//         camera.bottom = (frustumSize  / -2)  
        
//         cameraPosition =  camera.position.y
//         camera.updateProjectionMatrix()
//       }
//       else
//       {
//         cameraPosition = width*1.3
//         camera.position.y = cameraPosition      
//       }
     


//       floorPlan.add(cube)
//       scene.add(floorPlan)
    
     

//     // scene.add(floorPlan)

//     })
    
    
    


// }


// ////Removes range lines after succes 

// const removeLines = ()=>{

//   if(lineObjects && lineObjects.length>0)
//   {
//       lineObjects.forEach((obj)=>{scene.remove(obj)})
//   }
//   lineObjects.length=0


// }
// ////This function adds rfdistance line from primary and secondary master to slave

// const drawLinesAfterConfig=(anchorRanging,anchorLoc)=>{
//     const ancs = Object.keys(anchorRanging)
//     ancs.forEach((ancr)=>{
       
//       const list = Object.keys(anchorRanging[ancr])
//       list.forEach((an)=>{
//             console.log(anchorRanging[ancr][an])
//             if(anchorRanging[ancr][an]["line"]===null)
//             {
//                 const line = getLine()
//                 const obj = anchorRanging[ancr][an]
//                 const p1 = anchorLoc[ancr]
//                 const p2 = anchorLoc[an]
//                 //some time this code throwing error.
//                 const v1 = new THREE.Vector3(p1["x"],0.02,-p1["y"])
//                 const v2 = new THREE.Vector3(p2["x"],0.02,-p2["y"])
//                 line.geometry.setFromPoints([v1,v2])
//                 obj["line"]=line
//                 scene.add(line)
//                 lineObjects.push(line)
//                 const x = (Number(v1.x) + Number(v2.x))/2
//                 const z =  (Number(v1.z) + Number(v2.z))/2
//                 const spriteLoc = new THREE.Vector3(x,0.02,z )
//                 addLineSprite(obj,v1.distanceTo(v2),spriteLoc) 
//             }
//       }) 





//     }) 




// }

// ////This function loads anchor configuartion from database

// useEffect(()=>{

//   console.log(storedAnchors)
//   if(storedAnchors && storedAnchors.length> 0)
//   {


//     anchorRanging = {}
//     removeLines()
//     const data = storedAnchors[0]
   
//     const obj = JSON.parse(data["configuration"])
//     const anc = obj["req"]["anchor"]
//     console.log(anc)
// //loc[item]={x:0.0,y:0.0,z:0.0,type:"",masterToFollow:"",masterAnchor:[]}
//     const list = []
//     const loc={}
//     const mlist = []
//     anc.forEach((item)=>{
//       const addr = item["_attributes"]["addr"]
//       list.push(addr)
//       const obj = {}
     
//       obj["x"]=parseFloat(item["_attributes"]["x"])
//       obj["y"]=parseFloat(item["_attributes"]["y"])
//       obj["z"]=parseFloat(item["_attributes"]["z"])
//       obj["dbload"] = true

//       if(item["_attributes"]["master"]==="0")
//       {
//         obj["type"] = "Slave"
//         obj["masterToFollow"]=""
//         const ma =[]
//         if(Array.isArray(item["masteranchor"]))
//         {
//                 const ml = item["masteranchor"]
//                 ml.forEach((it)=>{
//                   const maddr =it["_attributes"]["addr"] 
//                   ma.push(maddr)
//                   const lineObj= {"line":null,"range":it["_attributes"]["rfdistance"]}
//                   const o1 = {...anchorRanging[addr],[maddr]:lineObj}
//                   const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
//                   anchorRanging[addr] = o1
//                   anchorRanging[maddr] = o2
                  
//                 })
//         }
//         else
//         {
//          const  maddr = item["masteranchor"]["_attributes"]["addr"]
//          ma.push(maddr)
//          const lineObj= {"line":null,"range": item["masteranchor"]["_attributes"]["rfdistance"]}
//          const o1 = {...anchorRanging[addr],[maddr]:lineObj}
//          const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
//          anchorRanging[addr] = o1
//          anchorRanging[maddr] = o2

//         }
//         obj["masterAnchor"]=ma
       

        
//       }
//       else if (item["_attributes"]["master"]==="1" && item["_attributes"]["master_addr"]!=="0")
//       {
//         obj["type"] = "Secondary Master"
//         obj["masterToFollow"]=item["_attributes"]["master_addr"]
//         mlist.push(addr)
//         const ma =[]
//         if(Array.isArray(item["masteranchor"]))
//         {
//                 const ml = item["masteranchor"]
//                 ml.forEach((it)=>{
//                   const maddr =it["_attributes"]["addr"] 
//                   ma.push(maddr)
//                   const lineObj= {"line":null,"range":it["_attributes"]["rfdistance"]}
//                   const o1 = {...anchorRanging[addr],[maddr]:lineObj}
//                   const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
//                   anchorRanging[addr] = o1
//                   anchorRanging[maddr] = o2
//                 })
//         }
//         else
//         {
//           const  maddr = item["masteranchor"]["_attributes"]["addr"]
//           ma.push(maddr)
//           const lineObj= {"line":null,"range":item["masteranchor"]["_attributes"]["rfdistance"]}
//           const o1 = {...anchorRanging[addr],[maddr]:lineObj}
//           const o2 =  {...anchorRanging[maddr],[addr]:lineObj}
//           anchorRanging[addr] = o1
//           anchorRanging[maddr] = o2
//         }
//         obj["masterAnchor"]=ma
        

//       }
//       else if(item["_attributes"]["master"]==="1" && item["_attributes"]["master_addr"]==="0")
//       {
//         obj["type"] = "Primary Master"
//         obj["masterToFollow"]=item["_attributes"]["master_addr"]
//         obj["masterAnchor"]=[]
//         mlist.push(addr)
//       }
//       loc[addr] = obj
//     })
    
//    console.log(anchorRanging)
//      console.log(mlist)
//      drawLinesAfterConfig(anchorRanging,loc)
//      //setHostName(data["hostname"])
//      //setPort(data["port"])
//     //setMasterList(["",...mlist])
   
//     //setAnchorLoc(loc)
   
//     //setAncList(list)
    
//    setState((state)=>{return{...state, masterList :["",...mlist], anchorLoc:loc,ancList:list,confed:true, confedAnchor:storedAnchors}})
//    setComm((comm)=>{return{...comm, hostName : data["hostname"], port:data["port"]}}) 
//    dispatch(resetAnchor())
   
//   }


// },[storedAnchors])



// 
// const removePLane = ()=>{

//   if(cube)
//   {
//     console.log("removing floorplan.......")
//     floorPlan.remove(cube)
//     cube.geometry.dispose()
//     cube.material.map.dispose()
//     cube.material.dispose()
//     scene.remove(floorPlan)
//     cube=null
//     floorPlan = null

//   }

// }
// //load floorplan
// useEffect(()=>{

//   if(state.floorData)
//   {
//     const floorplanUri = `/uploads/${state.floorData.data.floorplan}`
//     console.log("floorplanUri",floorplanUri)
//       drawPlane(floorplanUri,state.floorData)

//   }

// },[state.floorData])


// useEffect(()=>{
//     if(configFloor)
//     {
     
//      setState((prevState)=>{return {...prevState,floorData : configFloor }})
      
//       //props.getGeofencesByFloor(props.configFloor.data._id)
//       dispatch(getAnchorsOfFloor(configFloor.data._id))
      
//       dispatch(resetConfigFloor())
//     }

//     return()=>{
//       //dispatch(resetConfigFloor())
//       //removePLane()
//     }
  
//   },[configFloor])




// const centerOnFloorPlan = ()=>{
  
//     if(cube)
//     {
      
//       //const midPoint = new THREE.Vector3(0,0,0)
//       //orbit.reset()

       
//       const center = new THREE.Vector3(cube.geometry.parameters.width/2,cube.geometry.parameters.height/2,0)
//       const midPoint = cube.localToWorld(center)
//       console.log(midPoint)
//       orbit.target = midPoint
//       camera.position.set(midPoint.x,cameraPosition,midPoint.z)
//       //camera.lookAt(floorPlanCenter)
//       coordinateCentered = false
//       orbit.update()
       

//     }


// }



// 

// ///Changes background color on theme selection
// useEffect(()=>{
//   if(scene)
//   {
//   scene.background = new THREE.Color(panelColor[colIndex].p1)
//   }
// },[colIndex])



// ///This function creates anchor and places on screen

// const drawAnchor=()=>{
      
  
//   //xml form
//      anchorConfig = {
//       "_declaration":{
//         "_attributes":{
//           "version":"1.0",
//           "encoding":"utf-8"
//         }
//       },

//        "req" : {
//              "_attributes":{
//                  "type":"anchor cfg"
//              },

//              "anchor":[]

//        }
//     }

      
// 
//       for(let i =0;i< state.ancList.length;++i)
//       {
//           const ancr = {"_attributes":{
//             "addr":state.ancList[i],
//              "id":"0"
//             //"master":"0", "master_addr":"0", 
//             //"master_lag_delay":"0", 
//             //"ant_delay_rx":"16492",
//              //"ant_delay_tx":"16492",
             
//           }};
          
//           const ancObj =scene.getObjectByName(state.ancList[i]) 
//           if(!ancObj)
//           {
//             let texture=null
//             if( state.ancList[i] in state.anchorLoc && state.anchorLoc[state.ancList[i]]["dbload"])
//             {
//             texture = new THREE.CanvasTexture(createCanvas(state.ancList[i],state.anchorLoc[state.ancList[i]]["type"]))
//             }
//             else{
//               texture = new THREE.CanvasTexture(createCanvas(state.ancList[i]))
//             }
//             anchorCanvasRef[state.ancList[i]]["texture"] = texture
//             let plane = new THREE.PlaneGeometry(1,1.25)
//             let planeMat = new THREE.MeshBasicMaterial({map:texture ,transparent:true, opacity:0.9 })
           
            
//             const anc = new THREE.Mesh(plane,planeMat)
          
//             anc.position.setY(0.02)
//            //widthVector = new THREE.Vector3(width,0,0)
            
//             anc.rotateX(-0.5 * Math.PI)
          
          
//           //const anc = cube.clone()
//           anc.name = state.ancList[i]
//           anchorList.push(anc)
//           //addSprite(ancList[i],anc)


//           if(state.ancList[i] in state.anchorLoc && state.anchorLoc[state.ancList[i]]["dbload"])
//           {
//             anc.position.setX(state.anchorLoc[state.ancList[i]]["x"])
//           anc.position.setZ(-state.anchorLoc[state.ancList[i]]["y"])
//           }
//           else
//           {
//           const x = Math.random() * 3
//           const z = Math.random() * 3
//           const sign = Math.random() > 0.5 ? 1 : -1
//           ancr["_attributes"]["x"] = (x).toString()
//           ancr["_attributes"]["y"] =  (sign *(-1) * z ).toString()
//           ancr["_attributes"]["z"] = "0"
//           state.anchorLoc[state.ancList[i]]["x"]=x
//           state.anchorLoc[state.ancList[i]]["y"]=(sign *(-1) * z )
//           anc.position.setX(sign * x)
//           anc.position.setZ(sign * z)
//           }
          
//           console.log(state.floorData)
//           anc.scale.setScalar(state.floorData.data["scale"])
          
//           scene.add(anc)


//           }
//           else{
//             ancr["_attributes"]["x"] =(ancObj.position.x).toString()
//             ancr["_attributes"]["y"] = (-ancObj.position.z).toString()
//             ancr["_attributes"]["z"] ="0"

//           }
//           ancr["_attributes"]["master"] = "0"
//           ancr["_attributes"]["master_addr"]="0"
//           ancr["_attributes"]["master_lag_delay"]="0"
//           ancr["_attributes"]["ant_delay_rx"]="16492"
//           ancr["_attributes"]["ant_delay_tx"]="16492"
//           anchorConfig["req"]["anchor"].push(ancr)


//       }
      
//       console.log(anchorConfig)


//     //initial random update
//       if(comm.gatewayConnected && !state.confed)
//       {
//      //comm.socket.emit("gatewaycommand",{command:anchorConfig})
//       }
     
       

     
//       axisControl = new DragControls([],camera,renderer.domElement)
//       axisControl.addEventListener("drag", handleAxisDrag)
//       canvas.addEventListener('click',onClick,false)
//       //canvas.addEventListener('mousedown',mouseDown,false)
//       axisControl.addEventListener("dragend",handleAxisDragEnd)
       
// }

// 
// const handleAxisDrag = useCallback((event)=>{
//    // console.log( event.object.name)
  
//    const obj = event.object
//    //const loc = {...anchorLoc}
//   obj.position.x=  Number.parseFloat( obj.position.x).toFixed(3)
//    obj.position.z=  Number.parseFloat( obj.position.z).toFixed(3)
//    obj.position.y = 0.02
//    console.log(obj.position)
//    const pos = {x:obj.position.x, y : obj.position.z}
//    //const anc1=anchorLoc[obj.name]
//    //anc1["x"]= obj.position.x
//    //anc1["y"]= -obj.position.z
//    console.log(obj.name)
//    const rangeObj = anchorRanging[obj.name]
//    console.log(rangeObj)
//    if(rangeObj)
//    {
//       for(const anc in rangeObj)
//       {
//           const other = scene.getObjectByName(anc)
//           const line = rangeObj[anc]["line"]
//           //const sprite = rangeObj[anc]["sprite"]
//           const x = (Number(obj.position.x) + Number(other.position.x))/2
//           const z = (Number(obj.position.z) + Number(other.position.z))/2
//           //sprite.position.setX(x)
//           //sprite.position.setZ(z)
//           const v1 = obj.position
//           const v2 = other.position
          
//        const spriteLoc = new THREE.Vector3(x,0.02,z )
//           line.geometry.setFromPoints([obj.position,other.position])
//           updateLineSprite(rangeObj[anc],v1.distanceTo(v2),spriteLoc)
         
//       }
//    }

//    //setAnchorLoc({...anchorLoc,[obj.name]:anc1 })


// },[cont])






// const showLinesOfSelectedAnchor = (selected)=>{

//    if(currentSelected !=="")
//    {
//       const prevObj = anchorRanging[currentSelected]
//       if(prevObj)
//       {
//         for(const anc in prevObj)
//          {
//           const line = prevObj[anc]["line"]
//           line.visible = false
//          }
//       }  
//    }

//    const rangeObj = anchorRanging[selected]

//    if(rangeObj)
//    {
//     for(const anc in rangeObj)
//     {
//      const line = rangeObj[anc]["line"]
//      line.visible = true
//     }
    
//    }

//    currentSelected = selected
// }

// 
// //This method updates anchor position after drag complete
// const handleAxisDragEnd = useCallback((event)=>{
 
// //const anchorList = anchorConfig["req"]["anchor"]
// const anchorObj = event.object
// const anchor = state.anchorLoc[anchorObj.name]
// anchor["x"] = anchorObj.position.x
// anchor["y"] =-anchorObj.position.z
// anchor["z"] = 0.0
//  console.log(anchorConfig)
//  //setAnchorLoc(loc)*/
// },[cont])

// const onClick=useCallback((event)=>{
//     event.preventDefault();
    
//     const mouseMove = new THREE.Vector2()
//     mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
//     mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    
//     clickRay.setFromCamera( mouseMove, camera );
//     var intersects = clickRay.intersectObjects(anchorList,true);
    
    
//     if(intersects.length>0)
//     {
//        let object = intersects[0].object
//        console.log(intersects[0])
//        //setCurrentAnc(object.name)
//         showLinesOfSelectedAnchor(object.name)
//         //setAnchors([object.name])
//         //setCurrentAnc(object.name)

//                 const  anc1 = state.currentAnc
//                 console.log("previous anchor",selectedAnc)
      
//                if(selectedAnc)
//                 {
//                  const ctx = anchorCanvasRef[selectedAnc]["ctx"]
//                  const texture = anchorCanvasRef[selectedAnc]["texture"]
//                  ctx.clearRect(0,105,100,14)
//                  texture.needsUpdate = true
//                 }


//                 const anc2= object.name
//                 const ctx1 = anchorCanvasRef[anc2]["ctx"]
//                 const texture1 = anchorCanvasRef[anc2]["texture"]
//                 ctx1.fillStyle = 'rgba( 255, 168, 38,0.90)';
//                 ctx1.fillRect(0,105,100,14)
//                 texture1.needsUpdate = true 
//                 selectedAnc = object.name       



        


//         setState((state)=>{return{...state,anchors:[object.name],currentAnc:object.name }})
        
//        /*if(dragGroup.childrens.includes(object)===true)
//        {
//            scene.attach(object)
//        }
//        else
//        {
//            dragGroup.attach(object)
//        }*/
//        console.log(object)
//        const draggableObject = axisControl.getObjects()
//        draggableObject.length =0

//        axisControl.transformGroup = true
//        draggableObject.push(object)

       
       
//     }

    


// },[cont])



// /// This method adds multilateration master for slave and secondary master
// const addMultiMaster = ()=>{
//   const anc = state.anchorLoc[state.currentAnc]
//   const aset = new Set(anc["masterAnchor"])
//   aset.add(state.currentMultiMaster)
//   anc["masterAnchor"] = [...aset]
//  // setAnchorLoc({...anchorLoc,[currentAnc]:anc}) 
//   //setShowMasterList(false)
//  setState((state)=>{return{...state, showMasterList:false}})


// }


// // This method select multilateration master
// const handleMultiMaster=(event)=>{
//   console.log(event.target.value)
//     //setCurrentMultiMaster(event.target.value)
//    setState((state)=>{return {...state, currentMultiMaster: event.target.value}})
// }

// const animate = (time)=>{
//     time*=0.001
//     if(cube)
//     {
//     //cube.rotation.x=time;
//     //cube.rotation.y =time;
//    // cube.rotation.z =time;
    
//     }
//     if(resizeRendererToDisplaySize(renderer))
//     {
//         const canvas = renderer.domElement
//         camera.aspect = canvas.clientWidth/canvas.clientHeight
//         camera.updateProjectionMatrix()
//     }

//     renderer.render(scene,camera)
//     //console.log(orbit.target)
//     orbit.update()
//     requestAnimationFrame(animate)
    

// }

// 
// 
// 
// const addSprite=(name,ancObj)=>{

//  let spriteCanvas = document.createElement("canvas");
//     let ctx = spriteCanvas.getContext("2d");
   

//      //ctx.fillStyle = "white";
//    // ctx.globalAlpha = 0;
//      //ctx.lineWidth = 5;
//     // ctx.strokeStyle = "black";
//     //ctx.stroke();
//     //ctx.fillRect(0, 0, 250, 60);
    
//    /* ctx.beginPath();
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = "red";
//     ctx.rect(1,1,249, 60);
//     ctx.stroke();
//     */
//     const fontSize = 40
//     ctx.globalAlpha = 1.0;
//     ctx.fillStyle = "black";
//     ctx.font = "bold "+fontSize+"px Georgia";
//     ctx.border = "1px"

//     ctx.fillText(name, 70, 40, 250);


//     let spriteTex = new THREE.Texture(spriteCanvas);
//     spriteTex.needsUpdate = true;

//     const material = new THREE.SpriteMaterial({ map: spriteTex, depthWrite: false, depthTest: true });
//     material.map.maxFilter = THREE.LinearFilter;
//     //const map = new THREE.TextureLoader().load( '/uploads/stamp/' + icon );
    
//    // const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );

//     const sprite = new THREE.Sprite(material);
//     sprite.name = name+ "-sprite";
//     sprite.position.set(0,0.265,0);
//    // sprite.rotateX(0.5 * Math.PI)
    
//     //sprite.position.y = .1;
//    sprite.scale.set(0.05 * fontSize, 0.025 * fontSize, 0.075*fontSize)
//     console.log(sprite)
//     ancObj.add(sprite);
//     spriteArray.push(sprite)

// }

// ///This method creates a line 
// const getLine=()=>{

//   const linegeo = new THREE.BufferGeometry()
//   const lineMat = new THREE.LineBasicMaterial({color: "#FF00FF"})
//   const line  = new THREE.Line(linegeo,lineMat)
//   return line

// }



// //This method creates a line sprite
// const addLineSprite=(lineInfo,lineLen,spriteLoc)=>{


//   let spriteCanvas = document.createElement("canvas");
//   let context1 = spriteCanvas.getContext("2d");
   

//      /*ctx.fillStyle = "white";
//     ctx.globalAlpha = 1;
//      ctx.lineWidth = 5;
//     ctx.strokeStyle = "black";
//     ctx.strokeStyle = "red";
//     ctx.rect(1,1,249, 249);
//     ctx.stroke()
//     */
//     //ctx.stroke();
//     //ctx.fillRect(0, 0, 250, 60);
   
//    /* ctx.beginPath();
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = "red";
//     ctx.rect(1,1,249, 60);
//     ctx.stroke();
//     */
//     /*const fontSize = 40
//     ctx.globalAlpha = 1.0;
//     ctx.fillStyle = "black";
//     ctx.font = "bold "+fontSize+"px Georgia";
//     ctx.border = "1px"

//     ctx.fillText("OM", 4,20,200);
//   */
    

       
// 				//texture1.needsUpdate = true;


// context1.font = "italic 30px Arial";
// //context1.clearRect(0,0,640,480);
// var message1 = "line length : " +    Number.parseFloat(lineLen).toFixed(3)  
//  var message2 = "twr_range : " + Number.parseFloat(lineInfo["range"]).toFixed(3)
// var metrics = context1.measureText(message1);
// var width = metrics.width;
// context1.fillStyle = "rgba(0,0,0,1)"; // text color
// context1.fillText( message1, 4,20 );
// context1.fillText( message2, 4,60 );
				  



    
//   console.log("add line sprite")
//   let spriteTex = new THREE.Texture(spriteCanvas);
//   spriteTex.needsUpdate = true;

//   const material = new THREE.SpriteMaterial({ map: spriteTex, transparent:true, depthWrite: false, depthTest: true });
//   material.map.maxFilter = THREE.LinearFilter;
//     //const map = new THREE.TextureLoader().load( '/uploads/stamp/' + icon );
    
//    // const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );

//   const sprite = new THREE.Sprite(material);
//   sprite.name = "line"+ "-sprite";
//   sprite.position.setX(spriteLoc.x)
//   sprite.position.setY(spriteLoc.y)
//   sprite.position.setZ(spriteLoc.z)
//    //sprite.rotateX(0.5 * Math.PI)
    
//    // sprite.position.y = (-0.1);
//     //sprite.scale.set(20, 10, 2)
//   sprite.scale.set(0.05 * 40, 0.025 * 40, 0.075*40)
//   sprite.visible=true
//   console.log(sprite)
//   console.log(spriteLoc)
//     //ancObj.add(sprite);
//     //spriteArray.push(sprite)
//   lineInfo["sprite"]= sprite
//   lineInfo["context"] = context1
//   lineInfo["texture"] = spriteTex
//   lineInfo["spriteCanvas"] = spriteCanvas
//     //lineInfo
//     //scene.add(sprite)
//   lineInfo["line"].add(sprite)
    

// }


// //This method updates line sprite
// const updateLineSprite=(lineInfo,lineLen,spriteLoc)=>{

//     const context1 = lineInfo["context"]
//     const spriteTex = lineInfo["texture"]

//     context1.clearRect(0,0,640,480);
//     var message1 = "line length : " +    Number.parseFloat(lineLen).toFixed(3)  
//     var message2 = "twr_range : " + Number.parseFloat(lineInfo["range"]).toFixed(3) 
//     var metrics = context1.measureText(message1);
//     var width = metrics.width;
//     context1.fillStyle = "rgba(0,0,0,1)"; // text color
//     context1.fillText( message1, 4,20 );
//     context1.fillText( message2, 4,60 );
    
//     if(spriteLoc)
//     {
//       lineInfo["sprite"].position.setX(spriteLoc.x)
//       lineInfo["sprite"].position.setY(spriteLoc.y)
//       lineInfo["sprite"].position.setZ(spriteLoc.z)
//     }
//     spriteTex.needsUpdate = true


   

// }




// /**This method updates the line sprite and range after two way ranging test  */
// useEffect(()=>{
// if(scene && state.calculatedRange!=={})
// {
//   //console.log(calculatedRange)
//   const anc1 = state.calculatedRange["anc1"]
//   const anc2 = state.calculatedRange["anc2"]
//   const distance = state.calculatedRange["distance"]
 
//   const obj1 = scene.getObjectByName(anc1)
//   const obj2 = scene.getObjectByName(anc2)
//   if(obj1 && obj2)
//   {
//   const v1 = obj1.position
//   const v2 = obj2.position
//   console.log(v1,v2)
//   const robj = anchorRanging[anc1][anc2]
//   robj["range"] = distance
//   updateLineSprite(robj,v1.distanceTo(v2))
//  // setCalculatedRange({})
//   }

// }


// },[state.calculatedRange])





// ///Activate rightclick context menu on anchor list

// useEffect(()=>{
//     const anchorListLoc = document.querySelector("#anchorList")
//     anchorListLoc.addEventListener("contextmenu",handleContextMenu,true)
// },[])






// ///Draw anchor on screen when anchor list available

// useEffect(()=>{
//   if(state.ancList.length>0)
//   {
  
 
   
  
//   //setCurrentAnc([ancList[0]])

//   drawAnchor()
//   //setState((state)=>{return{...state, currentAnc : state.ancList[0]}}) 
//   setCurrentAnc(state.ancList[0]) 
//   }
 
//   //console.log(state.ancList)
//   //console.log(anchorLoc)

// },[state.ancList])




// useEffect(()=>{
//     if(!state.loaded)
//     {
//     init3d()
    
//     //drawObject()
//     //drawBox()
//     //drawPlane()
//     //drawCylinder()
//     //drawfonts()
//     //addLight()
//    // addMultipleObject()
//     //drawLine()
  
    
//     //animate2()
//     animate()
//     //loaded = true
//     setState((prevState)=>{return {...prevState, loaded:true}})
//     }
//     //console.log("3D model loaded")
// })


// const handleTextChange=(event,value)=>{


//   if(event.target.value.match(/^-?\d*\.?\d*$/))
//   {
//   console.log(event.target.name)
//   const anchorName = event.target.name.split("-") 
//   const obj = scene.getObjectByName(anchorName[0])
//   console.log(obj)
//   //anchorLoc[anchorName[0]][anchorName[1]] = value
//   //obj.position[anchorName[1]]=value
//   const aobj = state.anchorLoc[anchorName[0]]
  
//   aobj[anchorName[1]]=   event.target.value

//   obj.position.x = aobj.x==="-"?0:aobj.x
//   obj.position.z = aobj.y==="-"?0:-aobj.y
  
//   /* setAnchorLoc((prevState)=> {
//        return{...prevState, [anchorName[0]]:anc }
//     })
//   */
//     const rangeObj = anchorRanging[anchorName[0]]
//     console.log(rangeObj)
//     if(rangeObj)
//     {
//        for(const anc in rangeObj)
//        {
//            const other = scene.getObjectByName(anc)
//            const line = rangeObj[anc]["line"]
//           // const sprite = rangeObj[anc]["sprite"]
//           const x = (Number(obj.position.x) + Number(other.position.x))/2
//           const z = (Number(obj.position.z) + Number(other.position.z))/2
//          // sprite.position.setX(x)
//           //sprite.position.setZ(z)
//           const v1 = obj.position
//           const v2 = other.position
//           const spriteLoc = new THREE.Vector3(x,0.02,z )
//           line.geometry.setFromPoints([obj.position,other.position])
//           updateLineSprite(rangeObj[anc],v1.distanceTo(v2),spriteLoc)
//            //line.geometry.setFromPoints([obj.position,other.position])
//        }
//     }


//     //setAnchorLoc({...anchorLoc,[anchorName[0]]:aobj})
//     setState((state)=>{return{...state, anchorLoc : {...state.anchorLoc, [anchorName[0]]:aobj}}})
//   }



// }

// const handleSelectedItem=(event)=>{
//  console.log(event.target.tabIndex)
//  //setCurrentAnc(state.ancList[event.target.tabIndex])
//  //setState((state)=>{return{...state, currentAnc :state.ancList[event.target.tabIndex] }})
//  setCurrentAnc(state.ancList[event.target.tabIndex])
// } 

// const handleContextMenu =  useCallback((event)=>{
//   event.preventDefault()
//   if(anchorList.length > 0)
//   {
//    /* setContextMenu(
//       contextMenu === null
//         ? {
//             mouseX: event.clientX - 2,
//             mouseY: event.clientY - 4,
//           }
//         : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
//           // Other native context menus might behave different.
//           // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
//           null,
//     );
//    */
//     setState((state)=>{return {...state, contextMenu : 
//                                      state.contextMenu === null?
//                                      {
//                                        mouseX : event.clientX - 2,
//                                        mouseY : event.clientY - 4,
//                                      }
//                                      :
//                                      null
//                                      }})


//   } 

// },[cont])

// const handleMenuClose=(event)=>{
//   console.log("Menu close")
//   setState((state)=>{return{...state, contextMenu : null, anchors : [state.anchors[0]]}})
//   //anchors.length=1
// }



// const handleRanging= useCallback((event)=>{
//   if(!state.confed)
//   {
//       dispatch(setAlerts("Some anchors yet to be configured. Can't perform two way ranging", "error",true))
//       setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
//       return
//   }

//   if(!comm.gatewayConnected)
//   {
//     dispatch(setAlerts("location gateway is not connected . Can't perform two way ranging", "error",true))
//       setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
//       return
//   }

//   if(comm.rtlsOn)
//   {
//     dispatch(setAlerts("Rtls is on. Can't perform two way ranging", "error",true))
//       setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
//       return
//   }
  
//   if(state.rangingOn)
//   {
//     dispatch(setAlerts("Can't start new ranging while another ranging operation in progress", "error",true))
//     setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}})
//     return
//   }

//   if(state.anchors.length===2)
//   {
//   if(anchorRanging==={} || !(state.anchors[0] in anchorRanging) || !(state.anchors[1] in anchorRanging[state.anchors[0]]))
//   {
//        const anc1 = scene.getObjectByName(state.anchors[0])
//        const anc2 = scene.getObjectByName(state.anchors[1])

//        //Call for two wy ranging of twr of two anchor


//        if(comm.socket && comm.gatewayConnected)
//        {
//          comm.socket.emit("gatewaycommand",{
//           command : {
//             "_declaration":{
//               "_attributes":{
//                 "version":"1.0",
//                 "encoding":"utf-8"
//               }
//             },
//              "req":{
//                   "_attributes":{
//                       "type":"range test",
//                       "num_ranges":"50"
//                   },
//                 "anchor":[{"_attributes":{"addr":state.anchors[0]}},{"_attributes":{"addr":state.anchors[1]}}]


//              }
    
    
//           }
//         })
//         setState((prevState)=>{return {...prevState, rangingOn:true}})

//        }


       
//        //Two way rangiing call invoked hare.
//        const pos1 = anc1.position
//        const pos2 = anc2.position 
//        const x = (Number(pos1.x) + Number(pos2.x))/2
//        const z =  (Number(pos1.z) + Number(pos2.z))/2
//        const spriteLoc = new THREE.Vector3(x,0.02,z )

//        const line=getLine()
//        line.geometry.setFromPoints([anc1.position,anc2.position])
             
//        const ref1 = {"line":line,"range":0}
       
//        const anc1Obj = {...anchorRanging[state.anchors[0]],[state.anchors[1]]:ref1}
//        const anc2Obj = {...anchorRanging[state.anchors[1]],[state.anchors[0]]:ref1}
//        const newObj = {...anchorRanging}
//        newObj[state.anchors[0]] = anc1Obj
//        newObj[state.anchors[1]] = anc2Obj
//        //console.log(newObj)
//        addLineSprite(ref1,pos1.distanceTo(pos2),spriteLoc)
//        lineObjects.push(line)
//        scene.add(line)
//       // scene.add(ref1["sprite"]) 
//        //setAnchorRanging({...anchorRanging,[anchors[0]]:anc1Obj,[anchors[1]]:anc2Obj})
//        anchorRanging = newObj
//        console.log(anchorRanging)



  
//   }
//   else if((state.anchors[0] in anchorRanging) && (state.anchors[1] in anchorRanging[state.anchors[0]]))
//   {
//     if(comm.socket && comm.gatewayConnected)
//     {
//       comm.socket.emit("gatewaycommand",{
//        command : {
//          "_declaration":{
//            "_attributes":{
//              "version":"1.0",
//              "encoding":"utf-8"
//            }
//          },
//           "req":{
//                "_attributes":{
//                    "type":"range test",
//                    "num_ranges":"50"
//                },
//              "anchor":[{"_attributes":{"addr":state.anchors[0]}},{"_attributes":{"addr":state.anchors[1]}}]


//           }
 
 
//        }
//      })
//     }

//   }
  
  
//   //anchors.length=1
  
//   //setContextMenu(null)
//   setState((state)=>{return {...state,contextMenu : null,anchors:[state.anchors[0]]}}) 
//   }
// },[cont])

// //// This function add multilateration master to follow

// const handleAddMaster = (event)=>{
//  // setCurrentMultiMaster('') 
//  // setShowMasterList(true) 

// setState((state)=>{return {...state, currentMultiMaster:"", showMasterList : true}})
  
// }

// const closeMasterList=()=>{
//   //setShowMasterList(false)
//   setState((state)=>{return{...state, showMasterList : false }})
// }


// // This function handles master selection
// const handleMasterselction=(event)=>{

//   console.log("event",event.target.value)
 
//     const anc = state.anchorLoc[state.currentAnc]
//     if(anc["type"]==="Secondary Master")
//     {
//       anc["masterToFollow"] = event.target.value
//       //setAnchorLoc({...anchorLoc,[currentAnc]:anc})
//     }


// }

// //This function clears master list
// const clearMMList = ()=>{
//   const anc = state.anchorLoc[state.currentAnc]
//   anc["masterAnchor"]=[]
//   // setAnchorLoc({...anchorLoc,[currentAnc]:anc})
//   setState((state)=>{return {...state,anchorLoc :{...state.anchorLoc, [state.currentAnc]:anc}}})
// }


// //This function 

// const handleAnchorType=(event)=>{
//     console.log("handle Anchor type",event.target.value)
//     console.log("Handle anchoe type",event.target.name)
//     const loc = state.anchorLoc
//     loc[event.target.name]["type"] = event.target.value
//     let mset
//     if(state.masterList)
//     {
//    mset = new Set(state.masterList.slice(1))
//     }
//     else{
//      mset = new Set()
//     }
//    ///Change anchor background color
//     updateCanvas(state.currentAnc,event.target.value)
//     if(event.target.value==="Primary Master" || event.target.value==="Secondary Master")
//     {
   
//     mset.add(event.target.name)
    
//       //setMasterList(["",...mset])
//     // setState((state)=>{return {...state, masterList : ["",...mset], anchorLoc:{...loc}}})
//     }
//     else if(mset.has(event.target.name)){
//        mset.delete(event.target.name)
//        //setMasterList(["",...mset])
       
//     }
//    //setAnchorLoc({...anchorLoc,[event.target.name] : ancInfo})
//    setState((state)=>{return{...state,masterList:["",...mset], anchorLoc : {...loc}}})
// }


// const handleConnect=(event)=>{

//   const gateway = {host:comm.hostName,port:comm.port}
//   console.log("floor Data",state.floorData)
//    if(comm.socket)
//     {

//        if(event.target.checked){
//         console.log("gateway connect")
//         //setNetComm(true)
        
//         comm.socket.emit("gatewayconnect",{
//         host:comm.hostName,
//         port:comm.port,
//         apiToken:apiToken,
//         // This code need to be updated. becuse it send floor information on every connect. wich is updated in backend 
//         floor: state.floorData.data.floor ,
//         demo: state.demoMode? "on" : "off",


//       })
//       setComm((comm)=>{return{...comm, netComm:true}})
//     }else if(!event.target.checked && comm.gatewayConnected)
//      {

       
//        comm.socket.emit("gatewaydisconnect",{
//         closegateway:true

//       }) 
//       setComm((comm)=>{return{...comm, netComm:true}})


//      /* socket.emit("gatewaycommand",{
//       command : {
//         "_declaration":{
//           "_attributes":{
//             "version":"1.0",
//             "encoding":"utf-8"
//           }
//         },
//          "req":{
//               "_attributes":{
//                   "type":"anchor list"
//               }
//          }


//       }
//     })
//      */
//     }
    

//   }
// }


// const handleDemoCheck = (e)=>{
// setState(prevState=>{return {...prevState, demoMode:e.target.checked}})
// }


// const handleGatewayChange=(event)=>{
//   let val = event.target.value
//   //setGateway(val)
// }



// const handleSelectAnchor = (event)=>{
//   const {options} = event.target  
//   if(options.selectedIndex!== -1)
//   {
//     const opt = []
//     const idx = []

//     let k = 0
    
//     //console.log(options.selectedIndex)
//     for (let i = 0, l = options.length; i < l && k <=2 ; i += 1) {
//         if (options[i].selected) {
//             k += 1
//           opt.push(options[i].value);
//           idx.push(i)
//         }
//       }
   
//       if(opt.length<=2)
//       {
//         //setCurrentAnc(ancList[idx[0]])
  
//        // setAnchors(opt)


//         setState((state)=>{return {...state,  anchors : [...opt]}}) 
//         setCurrentAnc(state.ancList[idx[0]]) 
//         if(axisControl && anchorList)
//         {
//         const draggableObject = axisControl.getObjects()
//         draggableObject.length =0
//         axisControl.transformGroup = true
//         draggableObject.push(anchorList[idx[0]])
//         showLinesOfSelectedAnchor(state.ancList[idx[0]])
//         } 


//         if(opt.length===2)
//         {

//         }

//       }
   
//       console.log(idx)
//   }  

// }




// const handleConfigure=()=>{
//  const anchorConfig = {
//     "_declaration":{
//       "_attributes":{
//         "version":"1.0",
//         "encoding":"utf-8"
//       }
//     },

//      "req" : {
//            "_attributes":{
//                "type":"anchor cfg"
//                  },

//            "anchor":[]

//      }
//   }

//   const configuredAnchor = Object.keys(state.anchorLoc)
  
//   if(configuredAnchor.length < 4)
//   {
//       dispatch(setAlerts("Atleast 4 anchors required for configuration","error",true))
//       return
//   }


//    let primaryMasterSet = false
//   let i=0
//  for( let anc of configuredAnchor){
//     //const anc = configuredAnchor[i]
//     const ancr = {"_attributes":{
//       "addr":anc,
//       "id": 0,

//     }}
//     i = i+1
//     ancr["_attributes"]["x"] = (state.anchorLoc[anc]["x"]).toString()
//     ancr["_attributes"]["y"] = (state.anchorLoc[anc]["y"]).toString()
//     ancr["_attributes"]["z"] = (state.anchorLoc[anc]["z"]).toString()
//     ancr["_attributes"]["master"] = "0"
//     ancr["_attributes"]["master_addr"]="0"
//     ancr["_attributes"]["master_lag_delay"]="0"
//     ancr["_attributes"]["ant_delay_rx"]="16454"
//     ancr["_attributes"]["ant_delay_tx"]="16454"


//       //"master":"0", "master_addr":"0", 
//       //"master_lag_delay":"0", 
//       //"ant_delay_rx":"16492",
//        //"ant_delay_tx":"16492",
       

       
//     //}}
    
   
    
//     if(state.anchorLoc[anc]["type"]==="Primary Master")
//     {
     
//       if(!primaryMasterSet)
//       {
//       ancr["_attributes"]["master"]="1"
//       primaryMasterSet = true
//       }
//       else{
//         dispatch(setAlerts("Configuraion Failed! Can't set multiple primary master","error",true))
//         return
//       }
//     }
//     else if(state.anchorLoc[anc]["type"]==="Secondary Master"){
//       console.log("Seconadry Master",state.anchorLoc[anc])
//       ancr["_attributes"]["master"] ="1"
//       if(state.anchorLoc[anc]["masterToFollow"])
//       {
//         ancr["_attributes"]["master_addr"] =state.anchorLoc[anc]["masterToFollow"]
//         ancr["_attributes"]["master_lag_delay"] = "2000"
//       }
//       else{
//         dispatch(setAlerts(`Can't configure! Secondary master ${anc} not following any master`,"error",true))
//         return
//       }
       
//       const clockM = state.anchorLoc[anc]["masterAnchor"]
//       if(clockM.length==1)
//       {
//         const obj = {}
//         obj["addr"] = clockM[0]
        
//         const rfdist = anchorRanging[anc][clockM[0]] && ("range" in anchorRanging[anc][clockM[0]] ) ?   anchorRanging[anc][clockM[0]]["range"] : 0
//         obj["rfdistance"] = rfdist.toString()

//         ancr["masteranchor"]={"_attributes": obj}
//       }
//       else if(clockM.length > 1)
//       {
//           const list =[]
//           clockM.forEach((master)=>{
//             const obj = {}
//             obj["addr"] = master
            
//             const rfdist = anchorRanging[anc][master] && ("range" in anchorRanging[anc][master] ) ?   anchorRanging[anc][master]["range"] : 0
//             obj["rfdistance"] = rfdist.toString()
//             list.push({"_attributes":obj})
//           })
//           ancr["masteranchor"] = list
//       }

//     }
//     else if(state.anchorLoc[anc]["type"]==="Slave")
//     {
       
//       ancr["_attributes"]["master"]="0"

//       const clockM = state.anchorLoc[anc]["masterAnchor"]
//       if(clockM.length===1)
//       {
//         const obj = {}
//         obj["addr"] = clockM[0]
        
//         const rfdist = anc in anchorRanging && clockM[0] in anchorRanging[anc] && ("range" in anchorRanging[anc][clockM[0]] ) ?   anchorRanging[anc][clockM[0]]["range"] : 0
//         obj["rfdistance"] = rfdist.toString()

//         ancr["masteranchor"]={"_attributes": obj}
//       }
//       else if(clockM.length > 1)
//       {
//           const list =[]
//           clockM.forEach((master)=>{
//             const obj = {}
//             obj["addr"] = master
            
//             const rfdist = anchorRanging[anc][master] && ("range" in anchorRanging[anc][master] ) ?   anchorRanging[anc][master]["range"] : 0
//             obj["rfdistance"] = rfdist.toString()
//             list.push({"_attributes":obj})
//           })
//           ancr["masteranchor"] = list
//       }
//       else{
//         dispatch(setAlerts(`Can't configure! Slave Anchor ${anc} not associated with any master`,"error",true))
//         return 
//       }

//     }
//     else{

//       dispatch(setAlerts(`Can't configure! Anchor ${anc} is not configured`,"error",true))
//       return

//     }


  

    
    
   
//   anchorConfig["req"]["anchor"].push(ancr)

//     }


//    console.log(anchorConfig)
// /*<rf chan="2" prf="64" rate="6810" code="9" plen="128" pac="8" nsfd="0"/>*/

//    const channelConfig = {
//     "_declaration":{
//       "_attributes":{
//         "version":"1.0",
//         "encoding":"utf-8"
//       }
//     },

//      "req" : {
//            "_attributes":{
//                "type":"rf cfg"
//                  },

//            "rf":{"_attributes" : {"chan":"2",
//                                   "prf":"64",
//                                   "rate":"6810",
//                                   "code" : "9",
//                                   "plen" : "128",
//                                   "pac": "8",
//                                   "nsfd":"0"

//            }}

//      }

//    }
//   console.log(channelConfig)

//    if(comm.socket)
//    {
//     comm.socket.emit("gatewaycommand",{
//       command : channelConfig
//     })
    
//     comm.socket.emit("gatewaycommand",{
//       command : anchorConfig
//     })

//     comm.socket.emit("gatewaycommand",{
//       command : {
//         "_declaration":{
//           "_attributes":{
//             "version":"1.0",
//             "encoding":"utf-8"
//           }
//         },
//          "req":{
//               "_attributes":{
//                   "type":"log stop"
//               }
//          }


//       }
//     })
//    }


//    const obj = {}
//   obj["hostname"] = comm.hostName
//   obj["port"] = comm.port
//   obj["floorplan"] = state.floorData.data._id
//   obj["configuration"]= JSON.stringify(anchorConfig)
  
//  //console.log("anchor length",state.confedAnchor.length)

//   if(state.confedAnchor && state.confedAnchor.length>0)
//   {
//        dispatch(editAnchor({formData:obj,id:state.confedAnchor[0]._id}))
//   }
//   else
//   {
//       dispatch(addAnchor(obj))
//   }
//   //setConfed(true)
//   setState((state)=>{return {...state, confed:true}})
// }



// 
// //This method activates and deactivates rtls
// const handleRtls =(event)=>{
//  const rtls = event.target.checked
//    const command = {
//     "_declaration":{
//       "_attributes":{
//         "version":"1.0",
//         "encoding":"utf-8"
//       }
//     },

//      "req" : {
//            "_attributes":{
//                "type":""
//                  }
//                 }
//               }
    
//   if(event.target.checked)
//   {
//     command["req"]["_attributes"]["type"]="rtls start"
//     //setRtlsOn(true)
//     setComm((comm)=>{return {...comm, rtlsOn : true}})

//   } 
//   else{
   
//     command["req"]["_attributes"]["type"]="rtls stop"
//     //setRtlsOn(false)
//     setComm((comm)=>{return{...comm, rtlsOn:false}})
//   }   
  


// const command2 = {
//   "_declaration":{
//     "_attributes":{
//       "version":"1.0",
//       "encoding":"utf-8"
//     }
//   },

//    "req" : {
//          "_attributes":{
//              "type":"motion filter",
//              "filter_type":"2",
//              "filter_length":"10"

//                }
//               }
//             }
  
//   if(comm.socket)
//   {
//     comm.socket.emit("gatewaycommand",{
//       command : command
//     })

//     if(rtls)
//     {
//       comm.socket.emit("gatewaycommand",{
//         command : command2
//       })
//     }


//   }


  
              


// }



// const handleAddressChange = (event)=>{


//   if(event.target.name === "hostName")
//   {
//     //setHostName(event.target.value)
//     //setState({...state, hostName : event.target.value})
//      setComm((comm)=>{return{...comm, hostName : event.target.value }})
//   }
//   else if(event.target.name==="port" && !isNaN(event.target.value)){
//    // setPort(event.taget.value)
//    setComm((comm)=>{return {...comm, port:event.target.value}})
//   }
// }


// const closeIp=(e,reason)=>{
  
//   //console.log("reason",reason)
//   if(reason ==="backdropClick")
//   {
//     e.preventDefault()
//   }else
//   {
//   setState((prevState)=>{return {...prevState, showIp:false}})
//   }
// }

// const openIp=()=>{
//   setState((prevState)=>{return {...prevState, showIp : true}})
// }

   
//     return <>
//    <IPTable
//    showIp ={state.showIp}
//    closeIp = {closeIp}
//    configureIP = {configureIp}
//    toFloorplan = {toFloorplan}
//    netComm = {comm.netComm}
//    >

//    </IPTable>
//     {/*console.log("GateWay Connected", state.ancList)*/}
//     <Dialog
//         open= {!matches}
//         fullScreen
//       >
//         <DialogContent>
         
        
//         <LinearProgress/>
//         <NoDisplay/>
        

//         </DialogContent>
     

//       </Dialog>
//     <Dialog
//     open={state.openAncList}
//     onClose={closeAnchorList}
    
//     >
//       <DialogTitle>Select Anchors For Multilateration</DialogTitle>
//         <DialogContent >
                          
//                           {/* <TextField 
//                              label="Gateway IP"
//                                    name="ipadress"
//                                    size="small"
//                                    value={gateway}
//                                    onChange={handleGatewayChange}
//                                    //helperText =  {`${Number.parseFloat(rotationAngle).toFixed(3)} °`}
//                                    InputLabelProps={{
//                                       shrink: true,
//                                       }}
//                                    inputProps={{type:"text"}}
//                                   sx={{mt:2,mr:1}}                             
//                                      />
//                       <Button  variant="contained"   
//                       onClick={handleConnect} 
//                      sx ={{mt:3,ml:1}}
//                       size="small"
//                                     disabled={socket?false:true}>Connect</Button>  */ }     
                    
//         <FormControl variant="standard" id="anchorList" sx= {{mt:2}} fullWidth>      
                       
                       
//                        <InputLabel shrink htmlFor="multiple-native">
//                               Discovered Anchors
//                        </InputLabel> 
                       
//                         <Select
//                           variant="standard"
//                           multiple
//                           native
//                           value={state.selectedAnc}
//                           onChange={handleDiscovedSelect}
//                           label="Discovered Anchor"
//                           //sx={{height:"100%"}}
//                           inputProps={{
//                           id: 'multiple-native',
//                           size:12
//                           }}>
                             

//                         {
//                             state.discoveredAnc && state.discoveredAnc.map((item,index)=>
                            
//                               <option key={item} value={item}>
//                                      {item}
//                               </option>
                              

//                             )
//                         } 
                        
//                        </Select>
//                      </FormControl>  
//         </DialogContent>
        
//         <DialogActions>
                      
//                      <Button variant="contained"  onClick={updateSelectedAnchorList} size="small" >Select</Button>
//                      <Button variant="contained"  onClick={closeAnchorList} size="small">Close</Button>
//         </DialogActions>
//     </Dialog> 

//     <Box sx = {{display:"grid",
//               gridTemplateRows:'0.35fr 9.65fr',
//               gridTemplateColumns:'0.35fr 9.65fr',
//               gridTemplateAreas : `" . floor"
//               ". floor"`
//               , 
//               height : "100%"
//              }} >
//     <Box sx={{
//          gridArea:"floor",
//         display:"grid",
//         gridTemplateColumns :"repeat(24,1fr)",
//         gridTemplateRows:"repeat(24,1fr)",
//         height:"100%"
    
//     }}>
//            {/**3D canvas */}
//            <Box   sx = {{bgcolor:panelColor[colIndex].p1,
//                 gridRow:"1/25", gridColumn:"1/25",p:0}}>    
              
//                      <Box component="canvas" sx = {{height:"99%", width:"100%"}} id="anchor"/>
//            </Box>       
//            {/**3D canvas ends */}     
//            <Box sx = {{gridRow : "23/24", gridColumn:"11/13",display:"flex",alignItems:"center", justifyItems:"center", gap:"2",pointerEvents : "none",userSelect:"none" }}>
//               <Tooltip title="Current mouse pointer position" arrow>                   
//                   <FormLabel sx={{border: "2px solid", textAlign:"center"}}>X:{Number.parseFloat(local.x).toFixed(3)} | Y:{Number.parseFloat(local.y).toFixed(3) } </FormLabel>
//                 </Tooltip>  
//            </Box>
//            <Box sx = {{gridRow : "23/24", gridColumn :"13/15",alignItems:"center", justifyItems:"center",display:"flex"}}>
//                   <Tooltip title="Center on coordinate" arrow>
//                      <IconButton onClick={resetLocation} size="large"><MyLocationRoundedIcon/></IconButton>
//                    </Tooltip> 

//                     <Tooltip title="Center on Floorplan" arrow>
//                      <IconButton onClick={centerOnFloorPlan} size="large"><MapRoundedIcon/></IconButton>
//                    </Tooltip>  
//             </Box>
//             {/**Master Selection Dialog */}
//             <Slide direction="up" in={state.showMasterList} mountOnEnter unmountOnExit>
                  

//                    <Paper elevation="6" sx = {{gridRow : "7/10",gridColumn:"9/12",
//                                display:"grid",
//                                gridTemplateColumns : 'repeat(12,1fr)',
//                                gridTemplateRows: 'repeat(6,1fr)' ,
                              
//                                borderRadius : "10px",
//                                 p:1
//                                }}>

                      
//                        <FormControl
//                          variant="standard"
//                          id="multipleMaster"
//                          sx={{ m: 1,gridRow :"2/4",gridColumn:"2/12"}}
//                          size="small">      
                       
                       
//                        <InputLabel shrink htmlFor="mutiple-master">
//                               Select Nearest Master
//                        </InputLabel> 
                       
//                         <Select
//                           variant="standard"
//                           //multiple
//                           native
//                           //value={currentMultiMaster}
//                           onClick = {handleMultiMaster}
//                           //onChange={handleMultiMaster}
//                           label="Select Nearest Master"
//                           //sx={{height:"100%"}}
//                           inputProps={{
//                           id: 'multiple-master',
                          
//                           }}>
                             

//                         {
//                             state.masterList.filter((item)=>item!==state.currentAnc).map((item,index)=>
                            
//                               <option key={item} value={item}>
//                                      {item}
//                               </option>
                              

//                             )
//                         } 
                        
//                        </Select>            
//                      </FormControl>
//                      <Button variant="contained" onClick={addMultiMaster} size="small" sx={{gridRow : "5/6", gridColumn:"6/9"}}>Add</Button>
//                      <Button variant="contained" onClick = {closeMasterList} size="small" sx = {{gridRow : "5/6", gridColumn : "9/12"}}>Close</Button>

//                   </Paper>
                    
//                 </Slide>
//                 {/**Master selection dialog ends */}

            
            
              
//               {/*Anchor List */}
//                     <Card sx={{gridRow :"3/12",gridColumn:"2/6"}}>  
//                     <CardContent> 
//                       <Box sx = {{border:"2px solid black",borderRadius: "5px",p:1}}>
//                         <Box sx= {{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff",fontSize:"small"}}>Anchor Set</Box>   
//                         <Box  sx = {{display:"grid",
//                                       gridTemplateRows : "repeat(15,1fr)",
//                                       gridTemplateColumns : "repeat(10,1fr)",}}>
//                        <FormControl
//                          variant="standard"
//                          id="anchorList"
//                          sx={{gridRow :"2/12",gridColumn:"1/11"}}
//                          size="small">      
                       
                      
//                        <Select
//                          variant="standard"
//                          multiple
//                          native
//                          value={state.anchors}
//                          onChange={handleSelectAnchor}
//                          label="Anchor List"
//                          inputProps={{
//                          id: 'select-multiple-native',
//                          size:7
//                          }}
//                          sx={{fontSize:"small"}}>
                            

//                        {
//                            state.ancList.map((item,index)=>
                           
//                              <option key={item} value={item}>
//                                     {item}
//                              </option>
                             

//                            )
//                        } 
                       
//                       </Select>
                      
//                       <Menu
//                        open={state.contextMenu!==null}
//                        onClose={handleMenuClose}
//                        anchorReference="anchorPosition"
//                        anchorPosition={
//                        state.contextMenu !== null
//                          ? { top: state.contextMenu.mouseY, left: state.contextMenu.mouseX }
//                              : undefined
//                                }
//                         >
//                                  <MenuItem onClick={handleRanging}>Two Way Ranging</MenuItem>
                                 
//                         </Menu>
//                      </FormControl>
//                      </Box>
//                         <Stack  direction ="row" spacing={3} alignItems="center" justifyContent={"space-around"}>
//                          <Button variant="contained" disabled ={!comm.gatewayConnected} onClick={showDiscoveredAnchorList} size="small" >Add</Button>
//                          <Button variant="contained"  disabled={state.currentAnc && state.ancList?false:true} 
//                                 onClick={removeCurrentAnchor}
//                                  size="small" 
//                                >Remove</Button>
//                          </Stack>      
//                      </Box>
//                      </CardContent>
//                      <CardActions sx={{display:"flex",mt:-1,alignItems:"center",justifyContent:"center"}}>
//                      <Button variant="contained"  
//                        disabled = {!comm.gatewayConnected || (comm.gatewayConnected && comm.rtlsOn)}
//                        size="small" 
//                         onClick={handleConfigure}>Configure</Button>
//                      </CardActions>
//                      </Card>         
//                     {/*Anchor List   ends*/}



//                     {/**Connection menu */}

//                       <Card sx={{gridRow :"3/11",gridColumn:"21/25"}}>
//                         <CardContent>
//                         <Box sx = {{  border:"2px solid black",borderRadius: "5px",p:1}}>
//                         <Box sx= {{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff",fontSize:"small"}}>Gateway Options</Box>
//                           <Stack direction="column" spacing={1} alignItems="center" sx={{mt:2}}>
//                           <TextField
//                             variant="standard"
//                             label="host"
//                             name="hostName"
//                             size="small"
//                             value= {comm.hostName}
//                             //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
//                             //sx={{gridRow : "2/4",gridColumn:"12/16"}}
//                             InputLabelProps={{
//                                shrink: true,
//                                }}
//                             onChange = {handleAddressChange}
//                             sx={{fontSize:"small"}}
//                             disabled />   
//                            <TextField
//                              variant="standard"
//                              label="port"
//                              name="port"
//                              size="small"
//                              value= {comm.port}
//                              InputLabelProps={{
//                                 shrink: true,
//                                 }}
//                              //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
//                              //sx={{gridRow : "2/4",gridColumn:"12/16"}}
//                              disabled
//                              onChange = {handleAddressChange}
//                              sx={{fontSize:"small"}} />             
//                             <FormControlLabel control={<Checkbox
//                             disabled
//                              checked ={state.demoMode}
//                              onChange={handleDemoCheck}
//                              size="small"/>} label="Demo" sx={{m:0, fontSize:"small"}} />
                          
//                           <Stack direction="row" spacing={1} alignItems="center" sx={{m:0}}>

//                             <Typography sx={{fontSize:"small"}}>Delinked</Typography>
//                             <IOSSwitch  disabled={(comm.hostName===""||comm.port===""|| comm.netComm || !comm.socket)} 
//                             checked={comm.gatewayConnected}
//                             onChange={handleConnect} />
//                             <Typography sx={{fontSize:"small"}}>Linked</Typography>
//                           </Stack>
//                           </Stack>
//                        </Box>  


//                       <Box sx = {{ border:"2px solid black",borderRadius: "5px", mt:3}}>
//                         <Box sx= {{height:"max-content",width:"max-content",mt:"-15px",ml:"10px",background:"#fff",fontSize:"small"}}>RTLS Status</Box>
//                           <Stack direction="row" sx={{mt:1,mb:1}}spacing={1} alignItems="center" justifyContent="space-around">

//                             <Typography fontSize="small">Off</Typography>
//                             <IOSSwitch  checked = {comm.rtlsOn}  disabled={!comm.gatewayConnected} onChange={handleRtls} />
//                             <Typography fontSize ="small">On</Typography>
//                           </Stack>
//                        </Box>
//                        </CardContent>
//                        </Card>
//                       {/*Connection menu ends*/}





                    
//                      {/*anchor position menu*/}
//                      <Card sx = {{gridRow :"12/24",gridColumn:"20/25",}}>
//                       <CardContent>
//                      <Box sx = {{
//                                   border:"2px solid black",borderRadius: "5px",p:1
//                                 }}>
//                           <Box   id="anchorList" sx={{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff",fontSize:"small" }}>Selected Anchor Settings </Box> 
                     
//                                <Box  sx = {{display:"grid",
//                                       gridTemplateRows : "repeat(12,1fr)",
//                                       gridTemplateColumns : "repeat(15,1fr)",}}>
//                                 <FormLabel  sx={{gridRow : "2/4", gridColumn : "2/6" }}><Typography variant='caption'>{state.currentAnc && state.currentAnc.length>0? state.currentAnc.slice(5):""}</Typography> </FormLabel>
//                                  <TextField
//                                    variant="standard"
//                                    label="X"
//                                    name={state.currentAnc + "-x"}
//                                    size="small"
//                                    value = {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc? state.anchorLoc[state.currentAnc].x:0}
//                                    InputLabelProps={{
//                                       shrink: true,
//                                       }}
//                                    //inputProps={{ pattern :"/^-?\d*\.?\d*$/", placeholder:anchorLoc[currentAnc].x }}
//                                    sx={{gridRow : "2/4",gridColumn:"7/11",fontSize:"small"}}
//                                    onChange = {handleTextChange} />


//                                 <TextField
//                                   variant="standard"
//                                   label="Y"
//                                   name={state.currentAnc + "-y"}
//                                   size="small"
//                                   value= {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc?state.anchorLoc[state.currentAnc].y:0}
//                                   InputLabelProps={{
//                                      shrink: true,
//                                      }}
//                                   //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
//                                   sx={{gridRow : "2/4",gridColumn:"12/16"}}
//                                   onChange = {handleTextChange} />    

                               
                       
                                   

//                                     <FormControl
//                                       variant="standard"
//                                       size="small"
//                                       sx={{gridRow : "4/9", gridColumn:"1/9", fontSize:"small"}}>
                                      
//                                      <RadioGroup 
                                        
//                                            name={state.currentAnc}
//                                            onChange = {handleAnchorType}
//                                            value = {state.currentAnc && state.anchorLoc && state.currentAnc in state.anchorLoc && state.anchorLoc[state.currentAnc]["type"]!==""? state.anchorLoc[state.currentAnc]["type"]:""}
//                                            defaultValue=""
//                                             sx={{fontSize:"small",p:0}}
                                            
//                                      >
//                                          <FormControlLabel 
//                                          disabled = {!state.currentAnc }
//                                          //value="Slave"
                             
//                                          value = "Primary Master" 
//                                          control={
//                                          <Radio  size="small"/>
//                                          }
//                                           //label="Slave" 
//                                           label = "Primary Master"
//                                           sx={{fontSize:"small"}} />
//                                          <FormControlLabel 
//                                          disabled = {!state.currentAnc}
//                                          //value="Primary Master" 
//                                          value = "Slave"
//                                          control={
//                                          <Radio   size="small"/>
//                                          } 
//                                          //label="Primary Master" 
//                                          label = "Slave"
//                                          sx={{fontSize:"small"}} />
//                                          <FormControlLabel 
//                                          disabled = {!state.currentAnc}
//                                          value="Secondary Master" control={
//                                          <Radio  size="small" />
//                                          } label="Secondary Master" sx={{fontSize:"small"}} />
 
//                                      </RadioGroup>
//                                     </FormControl>

//                                     <FormControl
//                                       variant="standard"
//                                       id="masterToFollow"
//                                       sx={{gridRow:"7/9",gridColumn:"9/16",fontSize:"small"}}
//                                       size="small">
//                                     <InputLabel  shrink  id="master-to-follow">Master to follow (Seconadry)</InputLabel>
//                                     <Select
//                                       variant="standard"
//                                       //labelId="demo-multiple-checkbox-label"

//                                       //multiple

//                                       onClick={handleMasterselction}
//                                       //input={<OutlinedInput label="Master to follow" />}
//                                       native
//                                       //renderValue={(selected) => selected}                 
//                                       //MenuProps={MenuProps}
//                                       label="Master to follow"
//                                       inputProps={{
//                                        id: 'master-to-follow',
//                                           }}
//                                       disabled = {state.currentAnc && 
//                                                    state.anchorLoc &&  
//                                                    state.currentAnc in 
//                                                    state.anchorLoc && 
//                                                    state.anchorLoc[state.currentAnc]["type"]==="Secondary Master"?false:true}
//                                       value={state.currentAnc && 
//                                              state.anchorLoc && 
//                                              state.currentAnc in 
//                                              state.anchorLoc && 
//                                              state.anchorLoc[state.currentAnc]["type"]==="Secondary Master" && 
//                                                                                           state.anchorLoc[state.currentAnc]["masterToFollow"]!==""? 
//                                                                                           state.anchorLoc[state.currentAnc]["masterToFollow"]: undefined}>
//                                      {/*masterList.map((master) => (
//                                       <MenuItem key={master} value={master}>
//                                       <Checkbox checked={selectedMaster.indexOf(master) > -1} />
//                                       <ListItemText primary={master} />
//                                       </MenuItem>                   
//                                      ))*/}

//                                      {
//                                         state.masterList.filter((item)=>item!==state.currentAnc).map((item,index)=>
                           
//                                         <option key={item} value={item}>
//                                                {item}
//                                         </option>
                                        
       
//                                       )
//                                      }
//                                      </Select>     
//                                      </FormControl>  
                                     
                                   
                                 
//                        <FormControl
//                          variant="standard"
//                          id="multilaterationMasterList"
//                          sx={{gridRow :"9/11",gridColumn:"3/14" , fontSize:"small"}}
//                          size="small">      
                       
                       
//                        <InputLabel shrink htmlFor="multi-master-list">
//                               Multilateration Master List
//                        </InputLabel> 
                       
//                         <Select
//                           variant="standard"
//                           multiple
//                           native
//                           //value={m}

//                           //onChange={handleSelectAnchor}
//                           label="Multilateration Master List"
//                           //sx={{height:"100%"}}
//                           inputProps={{
//                           id: 'multi-master-list',
//                           size:2
//                           }}>
                             

//                         {
//                            state.currentAnc && 
//                            state.anchorLoc && 
//                            state.currentAnc in state.anchorLoc &&  
//                            state.anchorLoc[state.currentAnc]["masterAnchor"] &&  
//                            state.anchorLoc[state.currentAnc]["masterAnchor"].map((item,index)=>
                            
//                               <option key={item} value={item}>
//                                      {item}
//                               </option>
                              

//                             )
//                         } 
                        
//                        </Select>   
//                       </FormControl>
//                       <Button variant="contained"
//                        disabled = {
//                         state.currentAnc && 
//                         state.anchorLoc &&  
//                         state.currentAnc in 
//                         state.anchorLoc && 
//                         state.anchorLoc[state.currentAnc]["type"]==="Primary Master"?true:false
//                       } 
//                        onClick ={handleAddMaster}
//                         size="small" sx={{gridRow : "12/13", gridColumn:"5/8"}}>Add</Button>
//                        <Button variant="contained" 
//                        onClick ={clearMMList} 
//                        disabled = {
//                         state.currentAnc && 
//                         state.anchorLoc &&  
//                         state.currentAnc in 
//                         state.anchorLoc && 
//                         state.anchorLoc[state.currentAnc]["type"]==="Primary Master"?true:false

//                        }
//                         size="small" sx = {{gridRow : "12/13", gridColumn : "9/12"}}>clear</Button>
//                         </Box>
//                        </Box>
//                        </CardContent></Card>
                    
//                        {/**Achor ettings ends*/}   


//                       {/*Configuration */}
                      
                    
                  
                     


              
//              </Box>
//             </Box>  
//              <Outlet/>
      
     
//     </>;
       
  
// }


// const mapStateToProps=(state)=>({
//     colorIndex:state.color.colorIndex,
//     configFloor : state.floorplan.configFloor,
//     anchors : state.anchor.anchor
     
//   })




// export default AnchorPlan