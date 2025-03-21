import * as THREE from 'three'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import {DragControls} from "three/examples/jsm/controls/DragControls"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { Outlet } from "react-router-dom"
import React from "react";
import { AddCircleOutlineTwoTone, CloseOutlined, LeaderboardOutlined, RemoveCircleOutlineTwoTone, RouteTwoTone} from '@mui/icons-material';

import { panelColor } from "../themeColor";
import * as geometry from 'geometric'
import Box from "@mui/material/Box"
import {styled} from '@mui/material/styles'
import { useEffect } from 'react';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';

import { FormLabel ,keyframes} from '@mui/material';


import { useCallback } from 'react';
import { connect,useDispatch, useSelector } from 'react-redux';
import { Stepper,Step,StepLabel,StepContent } from '@mui/material'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Rotate90DegreesCwRoundedIcon from '@mui/icons-material/Rotate90DegreesCwRounded';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { MoveIcon,AddGeofenceIcon, MoveGeofenceIcon } from '../UI/CustomIcon'
import { Slider ,Fab, Slide} from '@mui/material'
import { OpacitySharp } from '@mui/icons-material'
import { FormControlLabel,Button,Checkbox } from '@mui/material'
import { TextField,Typography } from '@mui/material'
import {Input} from "@mui/material"
import { themeColor } from "../themeColor"
import {editFloorplan} from '../../_actions/floorplanAction'
import {Dialog,DialogActions,DialogContent,DialogTitle,DialogContentText,LinearProgress, Divider, AppBar, Toolbar} from '@mui/material'
import { Brush,FormatListNumberedRounded } from '@mui/icons-material'

import NoDisplay from '../UI/NoDisplay'
import { useTheme } from '@mui/material/styles';
import { useMediaQuery ,Card,CardContent} from '@mui/material';
import {Table,TableContainer,TableBody,TableHead, TableRow, TableCell, Paper, Stack} from  '@mui/material' 
import { addGeofence,getGeofencesByFloor,deleteGeoDB } from '../../feature/geofence/geofenceThunk'
import {setGeofenceAddStatus} from "../../feature/geofence/geofenceSlice"
import { setAlerts } from '../../_actions/alertAction'
import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice'
import ZoomInIcon from '@mui/icons-material/ZoomIn'; 
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ProgressBar from './ProgressBar'

const PanelBox = {}

let widthVector = null
let scene, camera, renderer,cube
//let loaded = false
let box = null
let projector
let mousexy = null
let mouseMove = null
let pnts=[]
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
let floorPlanProperty = {}
let rayCaster
let pointObj = []  
let firstPoint = null
let lineObj = []
let lineToPoint={}
let pointToLine={}
let prevX = 0.0
let prevZ = 0.0
let animateRef
let currentGeofence = null
let geoControl = null
let geoFenceGroup = null
let geofenceObj = []
let selectedGeofence = null
let intersectArray =[]
let anchorImage = null
let frustumSize = 20
let aspect = 0.0


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



/*const Image = styled('img')((theme)=>({
   
    maxWidth:"100%",
    borderRadius: "10px",
    maxHeight: "100%"
    
 }))
*/

 const ToolButton = styled((props)=>(<Button {...props}/>))((theme)=>({
  minHeight: "30px",
  minWidth:"30px",
  height : "40px",
  width : "40px",
  padding : "5px"
  


 }))
 


const DrawGeofence = (props)=>{
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("xl"))
  const colIndex = useSelector((state)=>state.color.colorIndex)
  const configFloor = useSelector((state)=>state.floorplan.configFloor)
  const floorGeofence = useSelector((state)=>state.geofence.floorGeofence)
  const addStatus = useSelector((state)=> state.geofence.addStatus)
  const dispatch = useDispatch()
    const [loaded,setLoaded]= React.useState(false)
    //const colIndex = props.colorIndex
    const [floorPlanUri,setFloorPlanUri] = React.useState("")
   // const angle = useSelector((state)=>state.floorPlanImage.angle)
    //const [localX,setLocalX] = React.useState(1.0)
    //const [localY,setLocalY] = React.useState(1.0)
    const [local, setLocal] = React.useState({x:1.0,y:1.0})
    


    const [state,setState] = React.useState({
        newGeofence : false,
        geofenceName : "",
        description : "",
        checkedD : false,
        checkedW : false,
        dangerZone : 0.0,
        warningZone : 0.0,
        geofenceColor : '0000FF',
        geofenceType : "Monitoring",
        enableNew : true,
        fenceReady : false,
        selectedRow : -1,
        selectedGeofenceId: "",
        activeButton : 0,
        floorData : null,
        showTable:true,
        showMenu : true,

    })

    //const [newGeofence, setNewGeofence] = React.useState(false)
    //const [geofence,setGeofence] = React.useState({})
    //const [geofenceName, setGeofenceName] = React.useState("")
    //const [description, setDescription] = React.useState("")
    //const [checkedD , setCheckedD] = React.useState(false)
    //const [checkedW, setCheckedW] =React.useState(false) 
    //const [dangerZone, setDangerZone] = React.useState(0.0)
    //const [warningZone,setWarningZone] = React.useState(0.0)
    //const [geofenceColor, setGeofenceColor] = React.useState('0000FF')
    //const [enableNew, setEnableNew] = React.useState(true)
    //const [ebableMoveGeo, setEnableMoveGeo] = React.useState(false)
    //const [enablePointMove, setEnablePointMove] = React.useState(false)
    //const [enableAddPoint, setEnableAddPoint] = React.useState(false)
    const [points,setPoints] = React.useState([])
    //const [slops,setSlopes] = React.useState([])
    //const [fenceReady,setFenceReady] =React.useState(false)
    const [pointCount,setPointCount]= React.useState(0)
    const [lineCount,setLineCount] =React.useState(0)
    //const [selectedRow, setSelectedRow] = React.useState(-1)
   // const [selectedGeofenceId,setSelectedGeofenceId] = React.useState("")
   // const [activeButton, setActiveButton] = React.useState(0)
    //const [op,setOp] =React.useState(0.8) 
  
    //const param = useParams()


///This function initializes threejs canvas for model display
    const init3d=()=>{
      anchorImage = new Image()
      anchorImage.src = '/point12.svg'
        pnts=[]
        canvas = document.querySelector("#three")
        //console.log(canvas)
        renderer =new THREE.WebGLRenderer({canvas})
        //renderer.setPixelRatio(devicePixelRatio)
        //console.log("height",canvas.offsetHeight)
        scene = new THREE.Scene()
        //camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight,.1,1000)
        const frustumSize = 20
        aspect = canvas.clientWidth/ canvas.clientHeight
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
        //orbit.enableZoom=false
        orbit.minDistance = 60
        orbit.maxDistance = 800
   
        
         
        
        gridHelper = new THREE.GridHelper(10000,10000)
        gridHelper.material.transparent=true
        gridHelper.material.opacity=0.25
        scene.add(gridHelper)
        cameraPosition=10
        camera.position.y= cameraPosition
        camera.lookAt(0,0,0)
   
   
        
        moveRay = new THREE.Raycaster()
        rayCaster = new THREE.Raycaster()
        
       // floorPlan = new THREE.Object3D()
       // scene.add(floorPlan)
       const ambiLight = new THREE.AmbientLight(0xffffff, 1.2);
       scene.add(ambiLight)
   
       
       canvas.addEventListener("mousemove",documentMouseMove,false)
       controls = new DragControls([],camera,renderer.domElement)
       controls.addEventListener("dragstart",handleDragStart)
       controls.addEventListener("drag", handleDrag)
       controls.addEventListener("dragend",handleDragStop)


       geoControl = new DragControls([],camera,renderer.domElement)
       geoControl.addEventListener("dragstart",geoDragStart)
       geoControl.addEventListener("drag",geoDrag)
       geoControl.addEventListener("dragend",geoDragStop)

       geoFenceGroup = new THREE.Group()
       scene.add(geoFenceGroup)


   
   }

   const mark = [
    {
      value: 0.1,
      label: '0.1',
    },
    {
      value: 0.25,
      label: '0.25',
    },
    {
      value: 0.5,
      label: '0.5',
    },
    {
      value: 0.75,
      label: '0.75',
    },
    {
      value: 1,
      label: '1',
    },
  ]

  








   ///This mouse event records the mouse pointer movement of three js canvas

   const documentMouseMove=(event)=>{
    const mouseMove = new THREE.Vector2()
    mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
    mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    //mouseMove.z =1
    //console.log("Vector",mouseMove)
    //console.log("mouse Move",mouseMove)
    //console.log(canvas.offsetLeft,canvas.offsetTop)
    //var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
    //var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([points[0],mouseMove]), 60, 0.1);
    moveRay.setFromCamera( mouseMove, camera );
    var intersects = moveRay.intersectObjects(scene.children,false);
   // console.log(intersects)
    if(intersects.length>0)
    {
        //console.log(intersects[0])
        const point =  intersects[0].point
        //console.log(point)
        //setLocalX(point.x)
        //setLocalY(-point.z)
        setLocal({...local, x:point.x, y:-point.z})    
        //point.z = 1
        //.line.geometry.setFromPoints([points[0],point])
        //line.position.x=points[0].x
        //line.position.y=(points[0].y)
       // points.push(point)
       //movePoint.position.x = point.x
       //movePoint.position.y = point.y
    }
    
     
    //line = new THREE.Mesh(tubeGeometry,mat)
   // line = new THREE.Line(lineGeo,lineMat)
   // 
    //line.position.z = 1
   // line.geometry.computeBoundingBox()
   // line.geometry.center(points[0])
    //console.log(points[0])   
    //console.log(line)

}

const intersect=(x1, y1, x2, y2, x3, y3, x4, y4)=> {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

	return {x, y}
}





const expand = keyframes`
from {
  transform: scale(0.9);
}
to {
  transform: scale(1.25);
}`;

/// This method checks whether boudary line crosses with other boundary line

const isInstersect=(realIndex,p1,p2,p3)=>{

  if(p3)
  {
    if(realIndex===pointObj.length-1)
    {
       
           for(let i = 0;i<pointObj.length-2;++i)
           {
            const p4 = pointObj[i].position
            const p5 = pointObj[(i+1)].position
            
              console.log(intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))

            if(intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))
            {
             console.log("Intersects", i)
              return true
            }
           
            console.log("Last point Condition",intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))
           if(p3&& i!==0 && intersect(p1.x,p1.z,p3.x,p3.z,p4.x,p4.z,p5.x,p5.z) )
           {
             console.log("Intersects", i)
             return true
           }
           }



    }
    else if(realIndex!==pointObj.length-1)
    {
        for(let i =0;i<pointObj.length-1;++i)
        {
          if(i === realIndex || i + 1 === realIndex )
          {
            continue
          }
          
          else{
              
             const p4 = pointObj[i].position
             const p5 = pointObj[(i+1)].position
             
               console.log(realIndex,intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))

             if( intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))
             {
              console.log("Intersects", i)
               return true
             }
            
            
            if(p3 && i!==realIndex +1 && intersect(p1.x,p1.z,p3.x,p3.z,p4.x,p4.z,p5.x,p5.z) )
            {
              console.log("Intersects", i)
              return true
            }

            }

          }
   
    
     
            if(currentGeofence && realIndex!== 0 && realIndex!== pointObj.length-1)
             {
             const p4 = pointObj[pointObj.length-1].position
             const p5 = pointObj[0].position

            if(realIndex - 1 !==0  &&  intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))
            {
              console.log("Intersects")
              return true
            }

             else if(p3 && pointObj.length-1 !== realIndex+1  && intersect(p1.x,p1.z,p3.x,p3.z,p4.x,p4.z,p5.x,p5.z) )
             {
             console.log("Intersects")
              return true
              }
              else
              {
               return false
              }


             }  
        }     
        return false     
   
  }
  else{
    for(let i =0;i<pointObj.length-1;++i)
    {
      if(i === realIndex || i+1===realIndex)
      {
        continue
      }
      else{
          
         const p4 = pointObj[i].position
         const p5 = pointObj[i+1].position
         
         if( ((realIndex === 0 && i !== 1) || (realIndex===pointObj.length-1 && i!== pointObj.length-3)) && intersect(p1.x,p1.z,p2.x,p2.z,p4.x,p4.z,p5.x,p5.z))
         {
          console.log("Intersects", i)
           return true
         }
        
        
  
        }

      }

      return false 

  }

  

}



//drag codes
const handleDragStart = useCallback((event)=>{



},[floorPlanUri])



const handleDrag = useCallback((event)=>{

//console.log(event.object.position)
const point = event.object
point.position.setY(0.002)

let idx = 0
for(let i =0;i<pointObj.length;++i)
{
   if(point.createIndex === pointObj[i].createIndex)
   {
     idx = i
   }
}
let p1=null
let p2=null
let p1Idx
if(idx === 0 && currentGeofence)
{
   p1 = pointObj[pointObj.length-1]
   p1Idx = pointObj.length-1
   p2 = pointObj[1]
}
else if(idx === pointObj.length-1 && currentGeofence)
{
    p1 = pointObj[pointObj.length-2]
    p1Idx = pointObj.length-2
    p2 = pointObj[0]
}
else if(idx === 0 && !currentGeofence)
{
    p1 = pointObj[1]
    p1Idx = 1
}
else if(idx===pointObj.length-1 && !currentGeofence)
{
    p1 = pointObj[pointObj.length-2]
    p1Idx = pointObj.length-2
}
else
{
    p1 = pointObj[idx-1]
    p1Idx = idx-1
    p2 = pointObj[idx+1]
}
console.log(p2)

if(currentGeofence===null && idx ===0 && isInstersect(idx,point.position, p1.position))
{
     point.position.setX(prevX)
     point.position.setZ(prevZ)
}
else if(currentGeofence===null && idx === pointObj.length-1 && isInstersect(idx,point.position, p1.position))
{
  point.position.setX(prevX)
  point.position.setZ(prevZ)

}
else if( p2!==null && isInstersect(idx,point.position,p1.position,p2.position))
{
  point.position.setX(prevX)
  point.position.setZ(prevZ)
  console.log("Intersect check")
}
else
    {

      prevX = point.position.x
      prevZ = point.position.z
      
      const [l1,l2] = pointToLine[point.createIndex]


      if(!currentGeofence && idx === 0) 
      {
       l1.geometry.setPoints([point.position,p1.position])
       }
      else if(!currentGeofence && idx === pointObj.length-1)
      {
         l1.geometry.setPoints([p1.position,point.position])
      }
      else 
      {
       if(l1)
       {
         l1.geometry.setPoints([p1.position,point.position]) 
        }

        if(l2)
        {
          l2.geometry.setPoints([point.position,p2.position])

         }
       }
      }

},[floorPlanUri])



const handleDragStop = useCallback((event)=>{

const point = event.object

let idx
for(let i =0 ;i < pointObj.length;++i)
{
   if(point.createIndex === pointObj[i].createIndex)
   {
     idx=i
   }
}


const pos  = [point.position.x,-point.position.z]
pnts.splice(idx,1,pos)
setPoints((points)=>{
   const l = [...points]
   l.splice(idx,1,pos)
   return l
})

if(currentGeofence!==null)
{
  //setFenceReady((fenceReady)=>true)
  //setState((fenceReady)=>{return {...state, fenceReady:true}})
  setState((prevState)=>{return {...prevState, fenceReady:true}})
}

},[floorPlanUri])

//select drag object
const onClickSelectPoint = useCallback((event)=>{


  console.log("mouse event")
   let isInstersect = false
    //let rayCaster = new THREE.Raycaster()
    const mousexy = new THREE.Vector2()
    mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
    mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
    rayCaster.setFromCamera( mousexy, camera );
    const intersects=rayCaster.intersectObjects(pointObj,false)

    if(intersects.length>0)
    {
      const point = intersects[0].object
      
     const dobj = controls.getObjects()
     controls.transformGroup = false
     dobj.length = 0
     dobj.push(point)
     controls.activate()


    }







},[floorPlanUri])




///These methods enables drag of whole geofence


const geoDragStart = useCallback((event)=>{

},[floorPlanUri])

const geoDrag = useCallback((event)=>{

},[floorPlanUri])

const geoDragStop = useCallback((event)=>{

  const realPos = []
 for(let i=0;i < pointObj.length;++i)   
 {
  const v = new THREE.Vector3()
  v.copy(pointObj[i].position)     
  const pos = geoFenceGroup.localToWorld(v)
        realPos.push([pos.x, -pos.z])
 }
   //pnts = realPos

console.log("real position shift",realPos)

 /*  setPoints((points)=>{
    return realPos
  })
*/

},[floorPlanUri])



const onClickSelectGeofence = useCallback((event)=>{


  const mousexy = new THREE.Vector2()
  mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
  mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
  rayCaster.setFromCamera( mousexy, camera );
  const geoObj = [currentGeofence,...pointObj,...lineObj]
  const intersects=rayCaster.intersectObjects(geoObj,false)

  if(intersects.length>0)
  {
    const obj = intersects[0].object

 
   const dobj = geoControl.getObjects()
   dobj.length = 0
   dobj.push(geoFenceGroup)
   geoControl.transformGroup= true
   geoControl.activate()


  }


},[floorPlanUri])


const createCanvas = ()=>{
  var canvas = document.createElement("canvas")
  canvas.height=100
  canvas.width =100
  var ctx = canvas.getContext("2d");

//ctx.font = "20px Arial"
//ctx.fillText(ancName,1,20)
ctx.drawImage(anchorImage,0,0,100,100)

// Create gradient
//ctx.clearRect(0,0,640,480);
ctx.fillStyle = 'rgba(0, 0, 200, 0.05)';
ctx.beginPath();
ctx.arc(45, 65, 29, 0, 2 * Math.PI);
ctx.fill()
//ctx.clearRect
//anchorCanvasRef[ancName] = {ctx:ctx}
return canvas
}


///This method creates a point
const getPoint=()=>{

  const texture = new THREE.CanvasTexture(createCanvas())
 
  let plane = new THREE.CircleGeometry( 0.125, 32 );
  let planeMat = new THREE.MeshBasicMaterial({map:texture ,transparent:true, opacity:0.9 })
 
  
  const point = new THREE.Mesh(plane,planeMat)

  //point.position.setY(-0.01)
 //widthVector = new THREE.Vector3(width,0,0)
  
  point.rotateX(-0.5 * Math.PI)

  return point




}
























///This function creates a mesh line object

const getLine =(points)=>{
     
  const lineGeo = new MeshLine()
  lineGeo.setPoints(points)
  const material = new MeshLineMaterial({transparent : true, opacity : 0.5, lineWidth:0.05 * cube.scale.x, color : 0x0000ff  })
  const line = new THREE.Mesh(lineGeo,material)
  //line.raycast(rayCaster,[])
 // line.raycast(rayCaster,intersectArray)
  line.meshType = "Line"
  
  return line


  
}


///This mouse event takes two points from user

const documentMouseDown = useCallback((event)=>{
   console.log("mouse event")
   intersectArray.length=0
   let isInstersect = false
    //let rayCaster = new THREE.Raycaster()
    const mousexy = new THREE.Vector2()
    mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
    mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
    rayCaster.setFromCamera( mousexy, camera );

    var intersects =intersectArray
    console.log("first point",firstPoint)
    let rayObjs = []
    if(lineObj.length>0)
    {
      rayObjs = [...lineObj]
     //  lineObj.map((line)=>line.raycast=MeshLineRaycast)
    }

    if(firstPoint)
    {
       rayObjs.push(firstPoint)
    }
    if(currentGeofence===null)
    {
    rayObjs.push(cube)
    }
    rayCaster.intersectObjects(rayObjs,false,intersects)
    console.log(intersects)
    
    if(intersects.length>0)
    {
        console.log(intersects.length)
     if(intersects[0].object===firstPoint)
     {
        
      
      const p1 = pointObj[pointObj.length-1]
      const p2 = pointObj[0]


      /*const lineGeo = new THREE.BufferGeometry()
      const material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth:3
              });
              
      const line = new THREE.Line( lineGeo, material );
      
      line.geometry.setFromPoints([p1.position,p2.position])
      */

     
      const line = getLine([p1.position,p2.position])
      setLineCount((lineCount)=>{
        line.createIndex = lineCount
        return lineCount + 1
      })
      

      lineToPoint[line.createIndex] = [p1,p2]
      pointToLine[p1.createIndex].splice(1,0,line)
      pointToLine[p2.createIndex].splice(0,0,line)
      lineObj.push(line)



      //setFenceReady(true)
      //setState({...state, fenceReady : true})
      setState((prevState)=>{return {...prevState, fenceReady:true}})
      geoFenceGroup.add(line)


   


     }
     else if("meshType"in intersects[0].object && intersects[0].object.meshType === "Line")
     {
            const line =  intersects[0].object
            const point = intersects[0].point

            point.y = 0.002
            
           const pos = geoFenceGroup.worldToLocal(point)
            const newPoint = [point.x, -point.z]
            
            /*const geometry = new THREE.SphereGeometry( 0.1,22,22  );
            const material = new THREE.MeshPhongMaterial({
                 color: 0x00b330,
                 //wireframe:true,
                 combine: THREE.MixOperation,
                 side: THREE.DoubleSide,
                 depthWrite: true,
                 // depthTest: false
             });
           */
             //movePoint = new THREE.Mesh(geometry,material)
           
             movePoint = getPoint()
             movePoint.scale.setScalar(cube.scale.x)
             movePoint.position.setX(pos.x)
             movePoint.position.setZ(pos.z)
             movePoint.position.setY(0.002)
             //movePoint.createIndex = pointCount
             console.log(movePoint)

             setPointCount((pointCount)=>
                {
                  movePoint.createIndex = pointCount
                  return pointCount + 1
                })

                const [p1,p2] = lineToPoint[line.createIndex]
                
                console.log(line,p1,p2)

                geoFenceGroup.add(movePoint)
                
                pointToLine[movePoint.createIndex] =[] 
                let index = -1
                for(let i =0;i<pointObj.length;++i)
                {
                     if(p1.createIndex === pointObj[i].createIndex)
                     {
                        index=i
                        break
                     }

                }
               
                
                 
                pointObj.splice(index+1,0,movePoint)
                pnts.splice(index+1,0,newPoint)
                setPoints((points)=>{
                 
                  const pnt = [...points]
                  console.log(pnt)
                  pnt.splice(index+1,0,newPoint)
                  return pnt
                })
                


               /* const lineGeo1 = new THREE.BufferGeometry()

                const material1 = new THREE.LineBasicMaterial({
                  color: 0x0000ff,
                  linewidth:3
                });

                const line1 = new THREE.Line( lineGeo1, material1 );

                console.log("new line position",p1.position,movePoint.position,p2.position)
                
                line1.geometry.setFromPoints([p1.position,movePoint.position])
                
                */
              
     
      const line1 = getLine([p1.position,movePoint.position])
     

                setLineCount((lineCount)=>{
                  line1.createIndex = lineCount
                  return lineCount + 1
                })
                   
               /* const lineGeo2 = new THREE.BufferGeometry()
                const material2 = new THREE.LineBasicMaterial({
                  color: 0x0000ff,
                  linewidth:3
                });
                const line2 = new THREE.Line( lineGeo2, material2 );
                line2.geometry.setFromPoints([movePoint.position,p2.position])
                */
               
                 const line2 = getLine([movePoint.position,p2.position])
                
                

                setLineCount((lineCount)=>{
                  line2.createIndex = lineCount
                  return lineCount + 1
                })
                geoFenceGroup.remove(line)
               
                console.log("Line 1",line1)
                console.log("Line 2",line2)

                
              lineToPoint[line1.createIndex] = [] 
              lineToPoint[line1.createIndex].push(p1) 
              lineToPoint[line1.createIndex].push(movePoint)

              lineToPoint[line2.createIndex] = [] 
              lineToPoint[line2.createIndex].push(movePoint) 
              lineToPoint[line2.createIndex].push(p2)

              pointToLine[movePoint.createIndex].push(line1)
              pointToLine[movePoint.createIndex].push(line2)
              pointToLine[p1.createIndex].splice(1,1,line1)
              pointToLine[p2.createIndex].splice(0,1,line2)
              
              delete lineToPoint[line.createIndex]

              let lineIdx = -1
              for(let i=0; i < lineObj.length ;++i)
              {
                    if(line.createIndex === lineObj[i].createIndex)
                    {
                          lineIdx = i
                    }
              }

              lineObj.splice(lineIdx,1,line1,line2)
              geoFenceGroup.add(line1)
              geoFenceGroup.add(line2)

                 
                 




     }
     else{
        const point =  intersects[0].point
        point.y =0.002
        //point.z = 1
        //points.push(point)

        //const pointGeo = new THREE.BufferGeometry()

        /*pointGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( point.toArray(), 3 ) );
        const pointMat = new THREE.PointsMaterial({size:0.5,color:"#FF00FF"})
        const pointObj = new THREE.Points(pointGeo,pointMat)
        scene.add(pointObj)
        canvasPoints.push(pointObj)
       */
        //const pnts = getPoints()
        const newPoint = [point.x, -point.z]
        let m = 0
       // console.log("points",pnts)
        if(pnts.length <3)
        {
              isInstersect = false
        }
        else
        {
             // const p1 = pnts[0]
              const p2 = pnts[pnts.length-1]
             

              
            
               
              for(let i=1;i<pnts.length-1;++i)
              {
                 const p3 = pnts[i-1]
                 const p4 = pnts[i]
                 
                 if(intersect(p2[0],p2[1],newPoint[0],newPoint[1],p3[0],p3[1],p4[0],p4[1]))
                 {
                  console.log("Intersection found") 
                  isInstersect = true
                   break;
                   
                 }
                   


              }
             
         }

          console.log("Is instersects", isInstersect )  

           if(!isInstersect)
           {
          /* const geometry = new THREE.SphereGeometry( 0.1,22,22  );
           const material = new THREE.MeshPhongMaterial({
          color: 0x00b330,
          //wireframe:true,
          combine: THREE.MixOperation,
          side: THREE.DoubleSide,
           depthWrite: true,
          // depthTest: false
            });
           */
            //movePoint = new THREE.Mesh(geometry,material)
           movePoint = getPoint()
            movePoint.scale.setScalar(cube.scale.x)
            movePoint.position.setX(point.x)
            movePoint.position.setZ(point.z)
            movePoint.position.setY(0.002)
            //movePoint.createIndex = pointCount
            console.log(movePoint)
            setPointCount((pointCount)=>
               {
                 movePoint.createIndex = pointCount
                 return pointCount + 1
               })
            pointObj.push(movePoint)
          
            console.log("point array length",pnts.length)
            if(pnts.length===0)
            {
             firstPoint = movePoint
             //firstPoint.name = "FirstPoint"
            } 
       
            pnts = [...pnts,newPoint]
            //p.push(newPoint)
            setPoints((points)=>[...points,newPoint])
            geoFenceGroup.add(movePoint)
            pointToLine[movePoint.createIndex] =[] 

             if(pointObj.length > 1)
             {
              /*const lineGeo = new THREE.BufferGeometry()
              const material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth:3
              });
              const line = new THREE.Line( lineGeo, material );
              line.geometry.setFromPoints([pointObj[pointObj.length-1].position,pointObj[pointObj.length-2].position])
            //  line.scale.setScalar(floorPlanProperty["scale"])
              */
           
             const line = getLine([pointObj[pointObj.length-1].position,pointObj[pointObj.length-2].position])
              setLineCount((lineCount)=>{
                line.createIndex = lineCount
                return lineCount + 1
              })
              geoFenceGroup.add( line )
              lineToPoint[line.createIndex] = [] 
              lineToPoint[line.createIndex].push(pointObj[pointObj.length-2]) 
              lineToPoint[line.createIndex].push(pointObj[pointObj.length-1])
              pointToLine[pointObj[pointObj.length-2].createIndex].push(line)
              pointToLine[pointObj[pointObj.length-1].createIndex].push(line)
              lineObj.push(line)
              console.log(line)
              



             }

            
        
       }

        

         

    }
  }
    



},[floorPlanUri])





const lineMOuseMove=(event)=>{
    mouseMove = new THREE.Vector2()
    mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
    mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
   
    let ray = new THREE.Raycaster()
    ray.setFromCamera( mouseMove, camera );
    var intersects = ray.intersectObjects([cube],false);
    
    if(intersects.length>0)
    {
        console.log(intersects[0])
        const point =  intersects[0].point
      
        line.geometry.setFromPoints([points[0],point]) 
    }
    console.log(points[0])   
    console.log(line)


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




const animate = (time)=>{
    time*=0.001
    if(cube)
    {
   
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



const onClickDelete = useCallback((event)=>{

    console.log("mouse event")
    let isInstersect = false
    //let rayCaster = new THREE.Raycaster()
    const mousexy = new THREE.Vector2()
    mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
    mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
    rayCaster.setFromCamera( mousexy, camera );
    
    
    let intersects = rayCaster.intersectObjects(pointObj,false) 
    console.log(intersects)
    if(intersects.length>0)
    {
        const p = intersects[0].object
        geoFenceGroup.remove(intersects[0].object)
        const [l1,l2] = pointToLine[intersects[0].object.createIndex]
        geoFenceGroup.remove(l1)
        geoFenceGroup.remove(l2)




         let p1
         let p2
        const removeId = intersects[0].object.createIndex
        let realIndex=-1
        for(let i=0;i<pointObj.length;++i)
        {
            if(pointObj[i].createIndex=== removeId)
            {
              realIndex = i
              break; 
            }
        }
   
       if(realIndex > -1)
       {
   
         
        if(realIndex ===  0  && currentGeofence === null)
        {
              firstPoint = pointObj[1]
              p1 = pointObj[1]
              pointToLine[p1.createIndex].splice(0,1)

        }
        else if(realIndex === pointObj.length-1 && currentGeofence === null)
        {
                   p1 = pointObj[pointObj.length-2]
                   pointToLine[p1.createIndex].splice(1,1)           
        }
        else 
        {
             if(realIndex === 0)
             {
                p1 = pointObj[pointObj.length-1]
                p2  = pointObj[1]
             }
             else if(realIndex === pointObj.length-1)
             {
                   p1 = pointObj[pointObj.length-2]
                   p2 = pointObj[0]
             }
             else{
                p1 = pointObj[realIndex-1]
                p2= pointObj[realIndex +1]

             }
            /* const lineGeo = new THREE.BufferGeometry()
             const material = new THREE.LineBasicMaterial({
               color: 0x0000ff,
               linewidth:3
             });
             const line = new THREE.Line( lineGeo, material );
             line.geometry.setFromPoints([p1.position,p2.position])
            
             */

             const line = getLine([p1.position,p2.position])
             setLineCount((lineCount)=>{
              line.createIndex = lineCount
              return lineCount + 1
            })

            geoFenceGroup.add(line)

            lineToPoint[line.createIndex] = []
            lineToPoint[line.createIndex].push(p1)
            lineToPoint[line.createIndex].push(p2)
            if(realIndex === 1 && currentGeofence ===null)
            {
            pointToLine[p1.createIndex].splice(0,1,line)
            }
            else
            {
              pointToLine[p1.createIndex].splice(1,1,line)
            }
            
            pointToLine[p2.createIndex].splice(0,1,line)
            lineObj.push(line)
            

        
        }
            console.log(l1,l2)

             delete pointToLine[p.createIndex]
             if(l1)
             {
             delete lineToPoint[l1.createIndex]
             }
             if(l2)
             {
             delete lineToPoint[l2.createIndex]
             } 

             pointObj.splice(realIndex,1) 
             pnts.splice(realIndex,1)
             setPoints((points)=>{
             const mod = [...points]
             console.log(mod)
             mod.splice(realIndex,1)
             return mod
            })
            //let lineIndex1 = -1
           if(l1) 
           {
            for(let i =0; i< lineObj.length ;++i)
            {
                if(l1.createIndex === lineObj[i].createIndex)
                {
                    lineObj.splice(i,1)
                    break;
                }     
            }
          } 

          if(l2)
          {
            for(let i =0; i< lineObj.length ;++i)
            {
                if(l2.createIndex === lineObj[i].createIndex)
                {
                    lineObj.splice(i,1)
                    break;
                }     
            }


          }



             console.log(pnts)
          
             if(pnts.length===0)
              {
             if(currentGeofence)
              {
               geoFenceGroup.remove(currentGeofence)
                currentGeofence=null
              }
             }

             if(currentGeofence!==null)
              {
            //setFenceReady(true)
            //setState({...state, fenceReady : true})
            setState((prevState)=>{return {...prevState, fenceReady:true}})
            //setState((fenceReady)=>{return {...state, fenceReady:true}})
            
           }

          
        
      }  




    }
    




},[floorPlanUri])



const drawPlane = (uri, configFloor)=>{

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
      
     /* const geometry1 = new THREE.BoxGeometry(0.3,0.3,0.001);
      const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      corner1 = new THREE.Mesh(geometry1,material1)
      const geometry2 = new THREE.BoxGeometry(0.3,0.3,0.001);
      const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      corner2 = new THREE.Mesh(geometry2,material2)
      const geometry3 = new THREE.BoxGeometry(0.3,0.3,0.001);
      const material3 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      corner3 = new THREE.Mesh(geometry3,material3)
      corner1.rotateX(0.5 * Math.PI)
      corner2.rotateX(0.5 * Math.PI)
      corner3.rotateX(0.5 * Math.PI)
     
      corner1.position.set(0,0,height)
      corner2.position.set(width,0,height)
      corner3.position.set(width,0,0)

     // scene.add(corner1)
      //scene.add(corner2)
      //scene.add(corner3)
     */widthVector = new THREE.Vector3(width,0,0)
      
      
     
     




     const cubeCenter = new THREE.Vector3(width/2,height/2,0)
     
     
      
      
      
      cube.rotateX(-0.5 * Math.PI)
      
      //scene.add(cube)
       
      floorPlan = new THREE.Object3D()
      floorPlan.add(cube)
      floorPlan.add(widthVector)
      floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
      
      if(configFloor.data["configured"])
      {
        cube.scale.setScalar(configFloor.data["scale"])
        cube.rotateZ(configFloor.data["angle"])
        cube.material.opacity = configFloor.data["opacity"]
        floorPlan.position.setX(configFloor.data["x"])
        floorPlan.position.setY(configFloor.data["y"])
        floorPlan.position.setZ(configFloor.data["z"])
        camera.position.y = configFloor.data["camera"]
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
        cameraPosition = width*1.1
        camera.position.y = cameraPosition      
      }
     


     
      scene.add(floorPlan)
    
     floorPlanProperty["scale"] = cube.scale.x
     floorPlanProperty["angle"] = cube.rotation.z
     floorPlanProperty["x"] = floorPlan.position.x
     floorPlanProperty["y"] = floorPlan.position.y
     floorPlanProperty["z"] = floorPlan.position.z
     floorPlanProperty["opacity"]=cube.material.opacity
     floorPlanProperty["camera"] = camera.position.y
     gridHelper.scale.setScalar(cube.scale.x)
     scene.add(floorPlan)

    })
    
    
    


}




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

const resetLocation=()=>{

    
    orbit.target=new THREE.Vector3(0,0,0)
    camera.position.set(0,cameraPosition,0)
    coordinateCentered = true
    orbit.update()
    
    
    
}


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

useEffect(()=>{

  if(state.floorData)
  {
    const floorplanUri = `/uploads/${state.floorData.data.floorplan}`
    
    console.log("floorplanUri",floorplanUri)
      drawPlane(floorplanUri,state.floorData)
      setFloorPlanUri(floorplanUri)

  }

},[state.floorData])
///When cuurent floorplan object is updated it draws floor plan
useEffect(()=>{
  if(configFloor)
  {
   //const floorplanUri = `/uploads/${configFloor.data.floorplan}`
    //console.log("floorplanUri",floorplanUri)
   
    //drawPlane(floorplanUri,configFloor)
    dispatch(getGeofencesByFloor(configFloor.data._id))
    setState((prevState)=>{return {...prevState, floorData : configFloor}})
    dispatch(resetConfigFloor())
  }
  return  ()=>{
    //dispatch(resetConfigFloor())
    //removePLane()
  }


},[configFloor])




useEffect(()=>{

  if(state.fenceReady && points)
  {
     console.log(points)
    if(currentGeofence)
    {
        geoFenceGroup.remove(currentGeofence)
        currentGeofence = null
    }
    //let _D = data.location.coordinates[0];
    let shape = new THREE.Shape();
    shape.moveTo(points[0][0],points[0][1]);
   // shape.lineTo(_D[1][0], _D[1][1]);
    //shape.lineTo(_D[2][0], _D[2][1]);
    //shape.lineTo(_D[3][0], _D[3][1]);
    //shape.lineTo(_D[0][0], _D[0][1]);
     for(let i =1; i < points.length ; ++i)
     {
         shape.lineTo(points[i][0], points[i][1])
     }

     shape.lineTo(points[0][0],points[0][1])
   
   
   
    var extrudeSettings = {
      steps: 1,
      depth:1,
      bevelEnabled: false,
    };
   
   
   
   
   // var extrudeGeom = new THREE.ExtrudeBufferGeometry(shape,extrudeSettings);
   var extrudeGeom = new THREE.ShapeGeometry(shape)
   


   extrudeGeom.rotateX(-Math.PI / 2);
    var geoFenceMesh = new THREE.Mesh(
      extrudeGeom,
      new THREE.MeshLambertMaterial({
        // color: 0x972bf0,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        depthTest: true
      })
    );
    
    //{geofenceName,description,dangerZone,warningZone,geofenceColor}
    geoFenceMesh.material.color.setHex(`0x${state.geofenceColor}`);
    //geoFenceMesh.name = geofence.geofenceName
    //geoFenceMesh.deleteId = data.secondId;
    geoFenceMesh.info = "geoFence";
    //geoFenceMesh.fenceColor = `0x${geofence.geofenceColor}`
    geoFenceMesh.position.setY(0.002)
    
    currentGeofence = geoFenceMesh
    console.log(currentGeofence)
    geoFenceGroup.add(geoFenceMesh);
    //canvas.removeEventListener("click",documentMouseDown,false)
    //setFenceReady(false)

    setState((state)=>{return{...state, fenceReady : false}})
    console.log("Polygon Area....",geometry.polygonArea(points))
    firstPoint =null
   // pnts=[]
   // setPoints([])
   

  }
//setFenceReady(false)
setState((state)=>{return{...state,fenceReady : false}})
console.log(points)

},[state.fenceReady])




const geofenceCleanup = ()=>{

  if(geofenceObj.length>0)
  {
    geofenceObj.map((obj)=>{
       scene.remove(obj)
    })
  }
  geofenceObj.length=0
}


///This methods draws geofence







useEffect(()=>{

 console.log("New geofence created......") 
console.log(floorGeofence)

geofenceCleanup()
if( scene &&   floorGeofence.length > 0)
{
      
      for(let i=0;i<floorGeofence.length;++i)
      {
        const geofence = floorGeofence[i]
        const geoPoints = geofence.location.coordinates[0]
        console.log("geoPoints",geoPoints)
        let shape = new THREE.Shape();
        shape.moveTo(geoPoints[0][0],geoPoints[0][1]);
     
         for(let i =1; i < geoPoints.length ; ++i)
         {
             shape.lineTo(geoPoints[i][0], geoPoints[i][1])
         }
    
         shape.lineTo(geoPoints[0][0],geoPoints[0][1])
       
       
       
        var extrudeSettings = {
          steps: 1,
          depth:1,
          bevelEnabled: false,
        };
       
       
       
       
       // var extrudeGeom = new THREE.ExtrudeBufferGeometry(shape,extrudeSettings);
       var extrudeGeom = new THREE.ShapeGeometry(shape)
       
    
    
       extrudeGeom.rotateX(-Math.PI / 2);
        var geoFenceMesh = new THREE.Mesh(
          extrudeGeom,
          new THREE.MeshLambertMaterial({
            // color: 0x972bf0,
            transparent: true,
            opacity: geofence.geofenceType=="Location"? 0.1 : 0.3,
            depthWrite: false,
            depthTest: true
          })
        );
        
        //{geofenceName,description,dangerZone,warningZone,geofenceColor}
        geoFenceMesh.material.color.setHex(`0x${geofence.color}`);
        //geoFenceMesh.name = geofence.geofenceName
        //geoFenceMesh.deleteId = data.secondId;
        geoFenceMesh.info = "geoFence";
        //geoFenceMesh.fenceColor = `0x${geofence.geofenceColor}`
       // geoFenceMesh.position.z = 0.5
        geoFenceMesh.position.setY(0.002)
        geoFenceMesh.originalColor = geofence.color
       
        geofenceObj.push(geoFenceMesh)
        scene.add(geoFenceMesh);



      }  


}



},[floorGeofence])





useEffect(()=>{
return()=>{
    
     console.log(scene)
     if(scene)
     {
      scene.children.lenght = 0
     }
    console.log(scene)
    removePLane()
    cancelAnimationFrame(animateRef)
}

},[])



useEffect(()=>{
    if(!loaded)
    {


   /* if(scene)
    {
      scene.dispose()
      camera.dispose()
      renderer.dispose()
    }*/  
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
    console.log("3D model loaded")
    setLoaded(true)
    }
    //console.log("3D model loaded")
})

///after add operation

useEffect(()=>{
  console.log("Geofence add status", addStatus)
   if(addStatus ===1)
   {
    console.log("Geofence Added")
     cleanup()
     canvas.removeEventListener("click",documentMouseDown,false)
     canvas.removeEventListener("click",onClickDelete,false)
     canvas.removeEventListener("click",onClickSelectGeofence,false)
     canvas.removeEventListener("click",onClickSelectPoint,false)
     controls.deactivate()
     geoControl.deactivate()
     //setGeofenceName("")
   
     //setDescription("")
     ///setGeofenceColor("0000FF")
     //setWarningZone(0.0)
     //setDangerZone(0.0)
     //setEnableNew(true)
     dispatch(getGeofencesByFloor(state.floorData.data._id))
     dispatch(setGeofenceAddStatus(0))
     setState((state)=>{return{...state, geofenceName : "" ,checkedD:false, checkedW:false, description : "", geofenceColor : "0000FF", warningZone : 0.0, dangerZone : 0.0, enableNew : true}})
   }
   else if(addStatus ===3)
   {
    dispatch(getGeofencesByFloor(state.floorData.data._id))
    dispatch(setGeofenceAddStatus(0))
   }

},[addStatus])

//////Threejs object cleanup methods////////


const cleanup = ()=>{

  geoFenceGroup.clear()
  pnts.length=0
  lineObj.length=0
  pointObj.length=0
  setPoints([])
  lineToPoint ={}
  pointToLine ={}
  setPointCount(0)
  setLineCount(0)
  currentGeofence = null

}




/////Form event methods//////////////////////////////////////

const handleWaringZoneLength=(e,nv)=>{
  
  //setWarningZone(nv)
  setState((state)=>{return{...state,warningZone : nv}}) 

 }

 const handleDangerZoneLength=(e,nv)=>{
   //setDangerZone(nv)
   setState((state)=>{return{...state,dangerZone : nv}}) 
 }


 const handleWaringZone=(e)=>{
  //setCheckedW(e.target.checked)
  //setState({...state, checkedW : e.target.checked})
  if(!e.target.checked)
  {
    //setWarningZone(0.0)
    setState((state)=>{return{...state,warningZone : 0.0, checkedW : e.target.checked}})

  }
  else if(e.target.checked)
  {
    //setWarningZone(0.1)
    setState((state)=>{return{...state, warningZone : 0.1,checkedW : e.target.checked}})
  }
 }

 const handleDangerZone = (e)=>{
   console.log(e.target.checked)
   //setCheckedD(e.target.checked)
   //setState({...state,})
   if(!e.target.checked)
  {
    //setDangerZone(0)
    //setWarningZone(0)
    //setCheckedW(false)
    setState((state)=>{return{...state, checkedD : e.target.checked, checkedW : false, dangerZone : 0.0, warningZone : 0.0}})

  }
  else if(e.target.checked)
  {
    //setDangerZone(0.1)
    setState((state)=>{return{...state,  checkedD : e.target.checked, dangerZone : 0.1}})
  }
 }

const  handleDraw=()=>{

  //setNewGeofence(true)
  setState((state)=>{return{...state, newGeofence : true}})
}



const enableDraw=()=>{ 

  if(state.geofenceName.trim())
  {

  const obj = {geofenceName : state.geofenceName, description : state.description ,dangerZone:state.dangerZone,warningZone : state.warningZone,
    geofenceColor : state.geofenceColor}
  console.log(obj)
  //setGeofence(obj)
  //setNewGeofence(false)
  setState((state)=>{return{...state, newGeofence : false, enableNew: false, activeButton : 2}})
  //setEnableNew(false)

  canvas.removeEventListener("click",onClickSelectPoint,false)
  canvas.removeEventListener("click",onClickDelete,false)
  canvas.removeEventListener("click",onClickSelectGeofence,false)
  canvas.addEventListener("click",documentMouseDown,false)
 
  controls.deactivate()
  geoControl.deactivate()
  //setActiveButton(2)
  }
  else{
   setAlerts("Geofence name cant be blank","error",true)

    
  } 
  

}

const handleColor=(e)=> {
  //setGeofenceColor( e.target.value );
  setState((state)=>{return{...state, geofenceColor : e.target.value}})
}

const handleFenceType=(e)=> {
  //setGeofenceColor( e.target.value );
  setState((state)=>{return{...state, geofenceType: e.target.value}})
}

const handleGeofenceName=(event)=>{

 // setGeofenceName(event.target.value)
 setState((state)=>{return{...state,geofenceName : event.target.value}})
}

const handleDescription = (event)=>{

  //setDescription(event.target.value)
  setState((state)=>{return{...state , description : event.target.value}})  
}



const handleGeoMove = ()=>{
  
  if(currentGeofence!==null)
  {
  canvas.removeEventListener("click",onClickSelectPoint,false)
  canvas.removeEventListener("click",onClickDelete,false)
  canvas.removeEventListener("click",documentMouseDown,false)
  canvas.addEventListener("click",onClickSelectGeofence,false)
  controls.deactivate()
  geoControl.deactivate()
  //setActiveButton(1)
  setState((state)=>{return{...state,activeButton : 1}})
  }
  


}


const handleAddPoint=()=>{
  
  //canvas.removeEventListener("click",onClickDelete,false)
  canvas.removeEventListener("click",onClickSelectPoint,false)
  canvas.removeEventListener("click",onClickDelete,false)
  canvas.removeEventListener("click",onClickSelectGeofence,false)
  canvas.addEventListener("click",documentMouseDown,false)
 
  controls.deactivate()
  geoControl.deactivate()
 // setActiveButton(2)\
 setState((state)=>{return{...state,activeButton : 2}})
}

const handleRemovePoint=()=>{
  canvas.removeEventListener("click",onClickSelectPoint,false)
  canvas.removeEventListener("click",documentMouseDown,false)
  canvas.removeEventListener("click",onClickSelectGeofence,false)
  canvas.addEventListener("click",onClickDelete,false)
  controls.deactivate()
  geoControl.deactivate()
  //setActiveButton(3)
  setState((state)=>{return{...state,activeButton : 3}})
}

const handlePointMove = (e)=>{
  canvas.removeEventListener("click",documentMouseDown,false)
  canvas.removeEventListener("click",onClickDelete,false)
  canvas.removeEventListener("click",onClickSelectGeofence,false)
  canvas.addEventListener("click",onClickSelectPoint,false)

  controls.deactivate()
  geoControl.deactivate()
  //setActiveButton(4)
  setState((state)=>{return{...state,activeButton : 4}})

}


/// This method saves new geofence in database
 const handleSave= ()=>{

    if(currentGeofence!==null)
    {
      const realPos = []
      for(let i=0;i < pointObj.length;++i)   
      {
       const v = new THREE.Vector3()
       v.copy(pointObj[i].position)     
       const pos = geoFenceGroup.localToWorld(v)
             realPos.push([pos.x, -pos.z])
      }
        //pnts = realPos
     
     console.log("real position shift",realPos)

      realPos.push(realPos[0])

     const data = {   
      name: state.geofenceName,
      coordinates: realPos,
      description:state.description ,
      geofenceType:state.geofenceType,
      color: state.geofenceColor,
      floorplan:state.floorData.data._id,
      secondId: 0,
      warningZone : state.warningZone,
      dangerZone : state.dangerZone
     }

      dispatch(addGeofence(data))
     // setActiveButton(0)
     
      


  }
  else{
    dispatch(setAlerts("Cant Create:Geofence boudary is not complete","error",true))
  }
 }

 
 
 const handleCancel=()=>{
      //setEnableNew(true)
      //setState({...state, enableNew : true})
      if(currentGeofence)
      {
       // scene.remove(geoFenceMesh)
        geoFenceGroup.remove(currentGeofence)
        currentGeofence = null
      }
      
      if(pointObj)
      {
          pointObj.forEach((point)=>geoFenceGroup.remove(point))
          pointObj=[]
      }
     

      if(lineObj)
      {
        lineObj.forEach((line)=>geoFenceGroup.remove(line))
        lineObj=[]
      }

      
      setPointCount(0)
      setLineCount(0)
      //setGeofenceName("")

      //setDescription("")
      //setGeofenceColor("0000FF")
      //setWarningZone(0.0)
      //setDangerZone(0.0)
      setState ((state)=>{return{...state,geofenceName: "",checkedD:false, checkedW :false ,description: "" , geofenceColor :"0000FF", warningZone : 0.0, dangerZone : 0.0,enableNew : true,activeButton:0}})
      cleanup()
      canvas.removeEventListener("click",documentMouseDown,false)
      canvas.removeEventListener("click",onClickDelete,false)
      canvas.removeEventListener("click",onClickSelectPoint,false)
      canvas.removeEventListener("click",onClickSelectGeofence,false)
     // setActiveButton(0)
     //setState({...state,activeButton : 0})
  
      

 }



 const handleRowClick = (event,row,id)=>{
    
    if(floorGeofence)
    {
      console.log(row)
     // const row = event.target.name
     //setSelectedGeofenceId(id)
      //setSelectedRow(row)
      
      if(selectedGeofence)
      {
        selectedGeofence.material.color.setHex(`0x${selectedGeofence.originalColor}`);
      }

      selectedGeofence = geofenceObj[row]
      selectedGeofence.material.color.setHex(`0x${'000000'}`)
      setState((state)=>{return {...state, selectedRow : row,selectedGeofenceId : id}})

    }

 }

const handleDeleteGeo =()=>{
  if(state.selectedGeofenceId)
  {
    dispatch(deleteGeoDB(state.selectedGeofenceId))

  }  
}

const handleShowMenu=()=>{
  setState(prevState=>{return{...prevState,showMenu:!prevState.showMenu}})
}



const handleCancelGeo = ()=>{
  if(selectedGeofence)
  {
    selectedGeofence.material.color.setHex(`0x${selectedGeofence.originalColor}`);
    selectedGeofence = null
  } 
  //setSelectedRow(-1)
  setState((state)=>{return{...state, selectedRow: -1,selectedGeofenceId : ""}})
  //setSelectedGeofenceId("")
}

 const isSelected = (i)=>{
   return state.selectedRow===i
 }


 const handleShowTable =()=>{
  setState(prevState=>{return {...prevState, showTable : ! prevState.showTable}})
 }


   
    return(
       <React.Fragment>
        {!matches && (
          <Dialog
          open= {!matches}
          fullScreen
        >
          <DialogContent>
           
          
          <LinearProgress/>
          <NoDisplay/>
          

          </DialogContent>
       

        </Dialog>

        )}
 
          {state.newGeofence && (
            <Dialog
            open={state.newGeofence}
            onClose={()=>{ setState({...state, newGeofence : false})}}
            aria-labelledby='form-dialog-title'
            //PaperProps = {{classes: {root :this.props.classes.paperRoot}}}
            PaperProps= {{
              borderRadius : '30px'
            }}
          >
            <DialogTitle id='form-dialog-title'>Geofence Details</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter Geofence Details here</DialogContentText>
              <input
                autoFocus
                className='form-control'
                type='text'
                id='geofenceName'
                placeholder='Geofence name'
                name="geofenceName"
                value = {state.geofenceName}
                onChange = {handleGeofenceName}
                
              />
              <br />
              <input
                id='geoDescription'
                label='Description'
                type='text'
                name="description"
                value={state.description}
                onChange = {handleDescription}
                placeholder='Description'
                className='form-control'
              />
              <br />
              <label id='fenceType'>Fence Type</label>
              <select
                className='form-control'
                label='Fence Type'
                name='fenceType'
               value={state.geofenceType}
                onChange={handleFenceType}
                //required={true}
              >
                <option value='Monitoring' >
                  Monitoring
                </option>
                <option value='Location'>
                  Location
                </option>


              </select>



              <br/>
              <label id='projectLabel'>Color</label>
              <select
                className='form-control'
                label='Color'
                name='color'
               value={state.geofenceColor}
                onChange={handleColor}
                //required={true}
              >
                <option value='0000FF' style={{ color: "#0000FF" }}>
                  {" "}
                  Blue
                </option>
                <option value='00FF00' style={{ color: "#00FF00" }}>
                  Green
                </option>
                <option value='FF0000' style={{ color: "#FF0000" }}>
                  Red
                </option>
              </select>


              <FormControlLabel
                control={
                   <Checkbox
                    checked={state.checkedD}
                    onChange={handleDangerZone}
                    name="checkedD"
                    color="primary"
                    disabled = {state.geofenceType!=="Monitoring"}
                     />
                   }
                label="Danger Zone"
                id = "danger-zone"
            />

               <Slider  
                    valueLabelDisplay="auto"
                    aria-labelledby="danger-zone"
                    step={0.01}
                    min = {0.1}
                    max = {1}
                    disabled={!state.checkedD}
                    marks = {mark}
                    onChange = {handleDangerZoneLength}
                    value={state.dangerZone}
                   />      
              <FormControlLabel
                control={
                   <Checkbox
                    checked={state.checkedW}
                    onChange={handleWaringZone}
                    //name="checkedW"
                    color="primary"
                    disabled = {!state.checkedD}
                     />
                   }
                label="Warning Zone"
                id = "warning-zone"
            />

               <Slider  
                    valueLabelDisplay="auto"
                    aria-labelledby="warning-zone"
                    step={0.01}
                    min = {0.1}
                    max = {1}
                    disabled={!state.checkedW}
                    marks = {mark}
                    onChange = {handleWaringZoneLength}
                    value={state.warningZone}
                   />



             



            </DialogContent>
            <DialogActions  >
              <Button
              variant="contained" 
              //color = "primary"
                onClick={() => { setState((state)=>{return{...state, enableNew : true, newGeofence : false}})}}
                
              >
                Cancel
              </Button>
              <Button 
              variant="contained" 
              //color = "primary"
              onClick={enableDraw} 
              >
                Draw
              </Button>
            </DialogActions>
          </Dialog>
          )}


{/* <AppBar position="fixed" sx={{ width:'79.2%', borderRadius:'10px 0 0 10px', bgcolor:'gray'}}>
        <Toolbar>
          
        <ProgressBar/>

        </Toolbar>
      </AppBar> */}

        <Box bgcolor='transparent' sx={{
           display:"grid",
           gridTemplateRows:'1fr 9.65fr',
           gridTemplateColumns:'2.5fr 9.65fr',
           gridTemplateAreas : `" . floor"
           ". floor"`
           , 
           height : "100%"
          
        
        }}>
              

              {/* Alternate Drawer */}
              <Paper elevation={8} sx={{ 
  gridRow:'1/3',
  gridColumn:'1/2',
  display:"grid",
  gridTemplateColumns : "0.5fr 8fr 0.5fr ",
  gridTemplateRows : "1fr 4fr 0.3fr 5fr 1fr",
  gridTemplateAreas : `" . . ."
                        " . create ."
                        ". . . 
                        ". manage ."
                        ". . ."`, 
                      borderRadius: "0 20px 20px 0",
                      bgcolor:'white',
                      alignContent:'center'
                          }}>
                             <Card elevation={5} sx={{gridRow:'2/3', gridColumn:'2/3', height:'53%'}}>
                    <CardContent>
                   <Box sx = {{ borderRadius: "5px", border:"2px solid black",p:1}}>  
                  <Box sx= {{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff"}}>Create Geofence</Box>
                  <Box sx = {{display:"grid",
                              gridTemplateRows : "repeat(6,1fr)",
                              gridTemplateColumns : "repeat(15,1fr)"}}>            
                                  
                  <Box sx={{gridRow:"1/3", gridColumn : "1/3"}}>
                  <Tooltip title="Draw Geofence" arrow > 
                   <ToolButton 
                    variant="contained"
                    onClick={handleDraw}
                    disabled={!state.enableNew}
                    > 
                    <AddGeofenceIcon fontSize = "large"/>
                    </ToolButton>
                   </Tooltip>
                  </Box>
                  
                  

                  <Box  sx={{gridRow :"1/3", gridColumn : "5/7"}} >
                   <Tooltip title="Move geofence" arrow>
                    <ToolButton 
                    variant={state.activeButton===1? "contained" : "outlined"}
                    disabled={state.enableNew}
                    onClick = {handleGeoMove}
                    > 
                    <MoveGeofenceIcon fontSize="small"/>
                    </ToolButton>
                   </Tooltip> 
                   </Box>
                  
                  
                  <Box sx={{gridRow:"1/3", gridColumn : "9/12"}}>
                  <Tooltip title="Add point" arrow  > 
                   <ToolButton 
                    variant={state.activeButton===2? "contained" : "outlined"}
                    onClick = {handleAddPoint}
                    disabled={state.enableNew}
                    > 
                    <AddCircleOutlineTwoTone fontSize="small"/>
                    </ToolButton>
                   </Tooltip>
                   </Box>

                   <Box sx={{gridRow :"1/3", gridColumn : "12/14"}}>
                   <Tooltip title="Remove Point" arrow >
                   <ToolButton 
                    variant={state.activeButton===3? "contained" : "outlined"}
                    onClick = {handleRemovePoint}
                    disabled={state.enableNew}> 
                    <RemoveCircleOutlineTwoTone fontSize="small" />
                    </ToolButton>
                   </Tooltip>
                    </Box>


                   <Box  sx={{gridRow :"1/3", gridColumn : "14/16"}} >
                   <Tooltip title="Move Point" arrow>
                    <ToolButton 
                    variant={state.activeButton===4? "contained" : "outlined"}
                    onClick = {handlePointMove}
                    disabled={state.enableNew}> 
                    <MoveIcon fontSize="small"/>
                    </ToolButton>
                   </Tooltip> 
                   </Box>
                   
                    <Button variant = "contained"  size="small" 
                    disabled = {state.enableNew}
                    onClick = {handleSave} 
                    
                    sx = {{gridRow :"5/7", gridColumn : "3/7"}}>
                     
                     Create
                     
                     
                     </Button>

                     { /*<Box sx = {{gridRow :"4/7",gridColumn : "5/12" ,bgcolor : "#fff",borderRadius:"5px",textAlign : "center"}}>
                          {geofenceName? `Creating geofence ${geofenceName}`:""}
                      </Box>
                      */}
                    <Button variant = "contained" 
                    size="small" 
                    disabled = {state.enableNew}
                    sx = {{gridRow :"5/7", gridColumn : "10/14"} }
                    onClick = {handleCancel}>
                      Remove
                    </Button>


                   </Box>
                  </Box>
                  </CardContent>
                  </Card>


                  <Card elevation={5} sx = {{gridRow :"4/5",gridColumn:"2/3",}}>
                    <CardContent>
                    
                     
                  <Box sx = {{  border:"2px solid black",borderRadius: "5px",p:1}}>
                  <Box sx= {{height:"max-content",width:"max-content",mt:"-18px",ml:"10px",background:"#fff"}}>Manage Geofence</Box>
                  <Box sx = {{display:"grid",
                              gridTemplateRows : "repeat(11,1fr)",
                              gridTemplateColumns : "repeat(15,1fr)"}}> 
                    
                  <TableContainer sx={{bgcolor:"#fff",gridRow:"1/10",gridColumn:"1/16",borderRadius: "5px", overflowY: "auto",height : 275}} >
                  
                   <Table   
                     size = "small"
                     //padding = "none"
                     stickyHeader
                   
                   > 
                   <TableHead>
                     
                     <TableRow>
                       <TableCell
                       variant = "head"
                       >Name</TableCell>
                        <TableCell
                        variant = "head">Type</TableCell>
                       <TableCell
                        variant = "head">Area(sqmt)</TableCell>
                       <TableCell
                        variant = "head">D Zone</TableCell>
                       <TableCell
                        variant = "head">W Zone</TableCell>

                       </TableRow>
                     </TableHead>  
                   <TableBody >
                     { floorGeofence && floorGeofence.map((obj,index)=>{
                         

                         const isItemSelected = isSelected(index)
                       return(
                       <TableRow
                       selected= {isItemSelected}
                       hover
                       key = {index}
                       id = {obj._id}
                       name = {index}
                       
                       
                        onClick = {(e)=>{handleRowClick(e, index,obj._id)}}
                       
                       >
                         <TableCell>{obj.name}</TableCell>
                         <TableCell>{obj.geofenceType=="Location"? "LOC":"MTR"}</TableCell>
                         <TableCell>{Number.parseFloat(geometry.polygonArea(obj.location.coordinates[0]).toFixed(3))}</TableCell>
                         <TableCell>{obj.geofenceType==="Location"?"--":obj.warningZone}</TableCell>
                         <TableCell>{obj.geofenceType==="Location"?"--":obj.dangerZone}</TableCell>
                       </TableRow>
                     )})}

                   </TableBody>  
                   
                   </Table>  

                   

                   </TableContainer>

                   <Button variant = "contained"  size="small" onClick={handleDeleteGeo} sx={{gridRow:"11/12", gridColumn:"3/6"}}>
                     
                     Delete
                     
                     
                     </Button>
                    <Button variant = "contained" 
                    size="small" 
                    sx={{gridRow:"11/12", gridColumn:"11/14"}}
                   onClick = {handleCancelGeo}
                    >
                      Cancel
                    </Button>
                    </Box>
                   </Box>
                   </CardContent>
                   </Card>

                          </Paper>

        <Box   sx = {{ gridArea:"floor",
            display:"grid",
            gridTemplateColumns :"repeat(24,1fr)",
            gridTemplateRows:"repeat(24,1fr)",
            height:"100%"
        }}>    
                   <Box sx = {{bgcolor:panelColor[colIndex].p1,
                          gridRow:"1/25", gridColumn:"1/25",p:0}}>   
                   
                          <Box component="canvas" sx = {{height:"99%", width:"99%"}} id="three"/>
                   </Box>  
                   <Box sx = {{gridRow : "23/24", gridColumn:"2/4",alignItems:"center", justifyItems:"center", gap:"2" }}>
                       <Tooltip title="Current mouse pointer position" arrow>                   
                                 <FormLabel sx={{border: "2px solid"}}>X:{Number.parseFloat(local.x).toFixed(3)} | Y:{Number.parseFloat(local.y).toFixed(3) } </FormLabel>
                        </Tooltip>  
                  </Box>
                  {/* <Box sx = {{gridRow : "23/24", gridColumn :"22/24"}}>
                      <Tooltip title="Center on coordinate" arrow>
                         <IconButton onClick={resetLocation} size="large"><MyLocationRoundedIcon/></IconButton>
                       </Tooltip> 

                        <Tooltip title="Center on Floorplan" arrow>
                         <IconButton size="large" onClick={centerOnFloorPlan}><MapRoundedIcon/></IconButton>
                       </Tooltip>  
                  </Box>  */}

<Paper elevation={4} sx={{ borderRadius: '7px',gridRow : "23", gridColumn:'23/24',
// gridColumn :"24/25", width:'84%',  height:'80%'
width:'3.3vw', height:'3.5vh'
}}>     
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

        <Paper style={{position:'relative', right:'-73px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "23", gridColumn :"21/22", 
        // 
        width:'1.8vw', height:'3.5vh'
        }}>                 
        <Tooltip title="Center on Floorplan" arrow>
                <IconButton onClick={centerOnFloorPlan} disableRipple size='small'>
                    <MapRoundedIcon />
                </IconButton>
                </Tooltip>  
                </Paper>
                
          <Paper style={{position:'relative', right:'-20px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "23", gridColumn :"21/22", 
          // width:'48%', height:'80%'
          width:'1.8vw', height:'3.5vh'}}>                 
          <Tooltip title="Center on coordinate" arrow>
          <IconButton onClick={resetLocation} disableRipple size='small'>
              <MyLocationRoundedIcon />
          </IconButton>
          </Tooltip>
          </Paper>
                 

             <Outlet/>    
         </Box>
         </Box>
         </React.Fragment>
       
    )

}

const mapStateToProps=(state)=>({
  colorIndex:state.color.colorIndex,
  configFloor : state.floorplan.configFloor ,
  floorGeofence : state.geofence.floorGeofence,
  addStatus : state.geofence.addStatus
})




export default DrawGeofence

