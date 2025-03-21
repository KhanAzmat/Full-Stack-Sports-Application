






import NoDisplay from '../UI/NoDisplay'
import * as THREE from 'three'
import {DragControls} from "three/examples/jsm/controls/DragControls"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { Outlet } from "react-router-dom"
import React from "react";
import { useNavigate } from 'react-router-dom'

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import { panelColor } from "../../components/themeColor";

import Box from "@mui/material/Box"
import {styled} from '@mui/material/styles'
import { useEffect } from 'react';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import { IconButton, Typography, AppBar, Toolbar, Fab } from '@mui/material';
import { Tooltip } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


import { FormLabel } from '@mui/material';

//import { useDispatch } from 'react-redux';

import { useCallback } from 'react';
import { connect, useDispatch,useSelector } from 'react-redux';
import { Stepper,Step,StepLabel,StepContent, Stack, Divider } from '@mui/material'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Rotate90DegreesCwRoundedIcon from '@mui/icons-material/Rotate90DegreesCwRounded';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { XYCoordinateIcon } from '../UI/CustomIcon';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ZoomInIcon from '@mui/icons-material/ZoomIn'; 
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Slider } from '@mui/material'
import { OpacitySharp } from '@mui/icons-material'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import {Input} from "@mui/material"
import { themeColor } from "../../components/themeColor"
import {editFloorplan} from '../../feature/floorplan/floorplanThunk'
import { addGltf } from "../../_actions/gltfAction";
import { setAlert } from '../../_actions/alertAction';
import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice';

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import {Dialog,DialogContent,LinearProgress, Paper} from "@mui/material"
import AuthAppBar from '../UI/AuthAppBar'
import ProgressBar from './ProgressBar'



const PanelBox = {}


let widthVector = null
let scene, camera, renderer,cube
//let loaded = false
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
let floorPlanProperty = {}
let rayCaster
let aspect= 0.0
let frustumSize = 20
let anchorImage = null
let animateRef = null





/*const Image = styled('img')((theme)=>({
   
    maxWidth:"100%",
    borderRadius: "10px",
    maxHeight: "100%"
    
 }))*/


 const ColorlibStepIconRoot = styled('div')(({ theme, ownerState,color }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      background:'#F39200',
      
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      // backgroundImage:
      // `linear-gradient( 136deg,${theme.palette.primary.dark},${color.c1})`,
      background:'#F39200',
    }),
  }));
  


  function ColorlibStepIco(props) {
    const { active, completed, className } = props;
    const colorIndex = useSelector((state)=>state.color.colorIndex)
  
    const icons = {
      
      1: <AspectRatioIcon />,
      2: <Rotate90DegreesCwRoundedIcon/>,
      3: <XYCoordinateIcon/>,
      4: <OpacitySharp/>
    };
  
    return (
      <>
      {/*console.log("color Index",colorIndex)*/}
      <ColorlibStepIconRoot ownerState={{ completed, active }} color={{c1:themeColor[colorIndex][1]}} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
      </>
    );
  } 

const ColorlibStepIcon = (ColorlibStepIco)  







const ConfigureFloorPlan = (props)=>{
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("xl"))
    const [loaded,setLoaded]= React.useState(false)
    //const colIndex = props.colorIndex
    const [floorPlanUri,setFloorPlanUri] = React.useState("")
    const [physicalDistance,setPhysicalDistance] = React.useState(0.0)
    let [drawLine,setDrawLine] = React.useState(false)
    const [enableRotate,setEnableRotate] =React.useState(0)
   // const angle = useSelector((state)=>state.floorPlanImage.angle)
    const [localX,setLocalX] = React.useState(1.0)
    const [localY,setLocalY] = React.useState(1.0)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [axis,setAxis] = React.useState(0) 
    //const [op,setOp] =React.useState(0.8) 
    const [opacity,setOpacity] = React.useState(0.8) 
    const [activeStep,setActiveStep] = React.useState(0)  
    const [imageSrc,setImageSrc] = React.useState("")
    const [previewAvailable,setPreviewAvilable] = React.useState(false)
    const fileInput = React.useRef()
    const [lineLength, setLineLenght] = React.useState(0.001)
    const [angle,setAngle] = React.useState(0.0)
    const [lineDrawn, setLineDrawn] = React.useState(false)
    const [scaled,setScaled] =React.useState(false)
    //const param = useParams()
    const colIndex = useSelector((state)=>state.color.colorIndex)
    const configFloor = useSelector((state)=>state.floorplan.configFloor )

    //const dispatch = useDispatch()
    
   const [state,setState] = React.useState({
         loaded : false,
         floorPlanUri : "",
         physicalDistance : 0.0,
         drawLine : false,
         enableRotate : 0,
         axis:0,
         opacity : 0.8,
         activeStep : 0,
         lineLength : 0.5,
         ///Angle is stored in degrees 
         //Backend angle is stored in radians
         angle : 0.0,
         lineDrawn:false,
         scaled : false,
         floorData : null


  

   }) 


///Creates a line
const getLine =(points)=>{
     
  const lineGeo = new MeshLine()
  if(points)
  {
  lineGeo.setPoints(points)
  }
  const material = new MeshLineMaterial({transparent : true, opacity : 0.5, lineWidth:0.05 * floorPlan.scale.x , color : 0x0000ff  })
  const line = new THREE.Mesh(lineGeo,material)
  //line.raycast(rayCaster,[])
 // line.raycast(rayCaster,intersectArray)
  line.meshType = "Line"
  
  return line


  
}


///This function initializes threejs canvas for model display
    const init3d=()=>{
      anchorImage = new Image()
      anchorImage.src = '/point12.svg'
        canvas = document.querySelector("#three")
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
        rayCaster = new THREE.Raycaster()
        
       // floorPlan = new THREE.Object3D()
       // scene.add(floorPlan)

    
        
   
       
       canvas.addEventListener("mousemove",documentMouseMove,false)
       

   
   }





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
        setLocalX(point.x)
        setLocalY(-point.z)    
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






////Draw point canvas
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
 
  let plane = new THREE.CircleGeometry( 0.14, 32 );
  let planeMat = new THREE.MeshBasicMaterial({map:texture ,transparent:true, opacity:0.9 })
 
  
  const point = new THREE.Mesh(plane,planeMat)

  //point.position.setY(-0.01)
 //widthVector = new THREE.Vector3(width,0,0)
  
  point.rotateX(-0.5 * Math.PI)

  return point




}







///This mouse event takes two points from user

const documentMouseDown = useCallback((event)=>{
   console.log("mouse event")
    //let rayCaster = new THREE.Raycaster()
    const mousexy = new THREE.Vector2()
    mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
    mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
    rayCaster.setFromCamera( mousexy, camera );
    var intersects = rayCaster.intersectObjects([cube],false);
   console.log(intersects)
    if(intersects.length>0)
    {
        //console.log(intersects[0])
        const point =  intersects[0].point
        //point.z = 1
        points.push(point)

        
        ///Draw point Hare
        //const pointGeo = new THREE.BufferGeometry()

        //pointGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( point.toArray(), 3 ) );
        //const pointMat = new THREE.PointsMaterial({size:0.5,color:"#FF00FF"})
        //const pointObj = new THREE.Points(pointGeo,pointMat)
        
        const pointObj=getPoint()
             pointObj.scale.setScalar(floorPlan.scale.x)
             pointObj.position.setX(point.x)
             pointObj.position.setZ(point.z)
             pointObj.position.setY(0.002)
        
        scene.add(pointObj)
        canvasPoints.push(pointObj)
   
         

    

    if(points.length === 1)
    {
        //setLineDrawn(false)
        canvas.addEventListener("mousemove",lineMOuseMove)
      // const lineGeo = new THREE.BufferGeometry()
       // const lineMat = new THREE.LineBasicMaterial({color : "#000000", linewidth: 3})
        //line = new THREE.Line(lineGeo,lineMat)
        line =getLine()
        
        scene.add(line)
        setState((state)=>{return{...state, lineDrawn : false}})
    }

    if(points.length ===2)
    {

        canvas.removeEventListener("mousemove",lineMOuseMove)
        
        
        //setLineDrawn(true)
        setState((state)=>{return{...state, lineDrawn : true}})
      
       
        
    }

    if(points.length===3)
    {
      // setLineDrawn(false)
       points.shift()
       points.shift()
       scene.remove(canvasPoints[0])
       scene.remove(canvasPoints[1])
       scene.remove(line)
       canvasPoints.shift()
       canvasPoints.shift()

       canvas.addEventListener("mousemove",lineMOuseMove)
       //const lineGeo = new THREE.BufferGeometry()
       //const lineMat = new THREE.LineBasicMaterial({color : "#000000", linewidth: 3})
       //line = new THREE.Line(lineGeo,lineMat)
       line= getLine()
       scene.add(line)
       setState((state)=>{return{...state, lineDrawn : false}})

    }


  }


},[state.floorPlanUri])





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
      
        line.geometry.setPoints([points[0],point]) 
    }
    console.log(points[0])   
    console.log(line)


}


const handleDrag = useCallback((event)=>{
    //cube.position.set(0,0,0)
    //const mouseMove = new THREE.Vector2()
    //mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
    //mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    
    
    //dragRay.setFromCamera(mouseMove,camera)
    
   //dragRay.ray.intersectPlane(intersectionPlane,target)
    //console.log("Drag Target",target)
    const height = cube.geometry.parameters.height 
    const width = cube.geometry.parameters.width 
   
    //const rad = Math.sqrt((height*height) + (width * width)) 
   //const z = event.object.position.z
   
   const posVector= event.object.position
   const newPos=posVector.normalize().multiplyScalar(width)
   //event.object.position.y=0
      

    let angleR = widthVector.angleTo(newPos)

    if(Math.sign(newPos.z) > 0)
    {
        angleR=-angleR
    }
   let angleD = Number.parseFloat(angleR  * (180/Math.PI)).toFixed(3) 
    console.log(angleD)
    //setAngle( angleR )
    //dispatch(setRotationAngle(angle * (180/Math.PI)))
   //console.log(circleMesh1)
 setState ((state)=>{return {...state, angle:angleD}})


},[state.floorPlanUri])




const handleDragStart=useCallback((event)=>{
    console.log(event.object.position)
    },[state.floorPlanUri])
    
    
const handleDragStop=useCallback((event)=>{
        console.log(event.object.position)
    },[state.floorPlanUri])





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
   /* if(resizeRendererToDisplaySize(renderer))
    {
        const canvas = renderer.domElement
        //camera.aspect = canvas.clientWidth/canvas.clientHeight
        camera.left= frustumSize * aspect /-2
        camera.right = frustumSize * aspect / 2
        camera.
        camera.updateProjectionMatrix()
    }*/

    renderer.render(scene,camera)
    //console.log(orbit.target)
    orbit.update()
    animateRef =requestAnimationFrame(animate)
    

}



const drawRotationCircle = ()=>{

    const width = cube.geometry.parameters.width  * cube.scale.x
    const height =cube.geometry.parameters.height
    
    //const radius = 
    
    const circleGeo = new THREE.CircleBufferGeometry(0.3,32)
    const circleMaterial = new THREE.MeshBasicMaterial({color : "#FF00FF" })
    circle = new THREE.Mesh(circleGeo,circleMaterial)
    
    circle.scale.setScalar(cube.scale.x)
    circle.rotateX(-Math.PI * 0.5)
    
   
       const x = Math.cos( state.angle*(Math.PI/180)) * width
       const y = Math.sin( state.angle *(Math.PI/180)) * width
        circle.position.set(x,0,-y)
    //circle.position.set(width,0,0)
    floorPlan.add(circle)

    controls = new DragControls([circle],camera,renderer.domElement)
    controls.transformGroup=false
    controls.addEventListener("dragstart",handleDragStart)
    controls.addEventListener("drag", handleDrag)
    controls.addEventListener("dragstop",handleDragStop)
    

     
      




}



const removePLane = ()=>{

  if(cube)
  {
    floorPlan.remove(cube)
    cube.geometry.dispose()
    cube.material.map.dispose()
    cube.material.dispose()
    scene.remove(floorPlan)
    cube=null
    floorPlan = null

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
        floorPlan.scale.setScalar(floorPlanProperty["scale"])
        console.log("Stored Angle",floorPlanProperty["angle"])
        cube.rotation.z = floorPlanProperty["angle"]
        
        cube.material.opacity = floorPlanProperty["opacity"]
        floorPlan.position.setX(floorPlanProperty["x"])
        floorPlan.position.setY(floorPlanProperty["y"])
        floorPlan.position.setZ(floorPlanProperty["z"])
        camera.position.y =floorPlanProperty["camera"]
        cameraPosition =  camera.position.y
        frustumSize = 20 * cube.scale.x
        camera.left = (frustumSize * aspect  / -2) 
        camera.right = (frustumSize * aspect / 2)
        camera.top =  (frustumSize  / 2)
        camera.bottom = (frustumSize  / -2)  
        
        cameraPosition =  camera.position.y
        camera.updateProjectionMatrix()
        //setAngle(Number.parseFloat( configFloor.data["angle"] * (180/Math.PI)).toFixed(3))

        setState((state)=>{return{...state,
          angle :  Number.parseFloat( floorPlanProperty["angle"] * (180/Math.PI)).toFixed(3),
        }})
      }
      else
      {

        cameraPosition = width*1.1
        camera.position.y = cameraPosition
        floorPlanProperty["scale"] = cube.scale.x  
        floorPlanProperty["angle"] = cube.rotation.z
        floorPlanProperty["x"] = floorPlan.position.x
        floorPlanProperty["y"] = floorPlan.position.y
        floorPlanProperty["z"] = floorPlan.position.z
        floorPlanProperty["opacity"]=cube.material.opacity
        floorPlanProperty["camera"] = camera.position.y      
      }
     


     
      //scene.add(floorPlan)
    
     //floorPlanProperty["scale"] = cube.scale.x
     //floorPlanProperty["angle"] = cube.rotation.z
     //floorPlanProperty["x"] = floorPlan.position.x
     //floorPlanProperty["y"] = floorPlan.position.y
     //floorPlanProperty["z"] = floorPlan.position.z
     //floorPlanProperty["opacity"]=cube.material.opacity
     //floorPlanProperty["camera"] = camera.position.y
     gridHelper.scale.setScalar(floorPlan.scale.x)
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


useEffect(()=>{
 console.log("config floor", configFloor)
return()=>{
  removePLane()
  cancelAnimationFrame(animateRef)
}
},[])


useEffect(()=>{
  if(scene)
  {
  scene.background = new THREE.Color(panelColor[colIndex].p1)
  }
},[colIndex])

///This change the rotaton angle of floor plan
useEffect(()=>{

if(state.floorPlanUri && !isNaN(state.angle))
{
    
    cube.rotation.z = (Math.PI /180) * state.angle
    floorPlanProperty["angle"] = cube.rotation.z
    if(circle!==null)
    {   
        const width = cube.geometry.parameters.width
        const x = Math.cos( state.angle*(Math.PI/180)) * width
        const y = Math.sin( state.angle *(Math.PI/180)) * width
       // circle.position.set(0,0,0)
        
       // circle.rotation.z=((Math.PI /180) * angle)  
       //circle.position.set(x,0,y)
    }
}


},[state.angle])



// This event enables line drawing capability
useEffect(()=>{

    if(state.drawLine)
    {
        //cube.rotation.z = 0
        if(floorPlan.scale.x <0.99999 || floorPlan.scale.y > 1.00001 )
        {
            /*floorPlan.scale.setScalar(1)
            gridHelper.scale.setScalar(1)
            const width = cube.geometry.parameters.width
            const height = cube.geometry.parameters.height

            cameraPosition = -width*1.3
            cube.position.setX(width/2)
            cube.position.setZ(height/2)
            floorPlanCenter.x = width/2
            floorPlanCenter.z = height/2
            if(coordinateCentered)
            {
                
                camera.position.y = cameraPosition
            }
            else{
                camera.position.set(floorPlanCenter.x,cameraPosition,floorPlanCenter.z)
            }*/
        }
        console.log("Draw Line",state.drawLine)
        canvas.addEventListener("click",documentMouseDown,false)
       //setDrawLine(false)
       setState((state)=>{return {...state, drawLine : false}})
    }
        //console.log("Draw Line",drawLine)
},[state.drawLine])



/// Load floor plan in canvas



///When cuurent floorplan object is updated it draws floor plan
useEffect(()=>{
 
  console.log("configFloor",configFloor)
  if(configFloor)
  {
    //removePLane()
   const uri = `/uploads/${configFloor.data.floorplan}`
    console.log("floorplanUri",uri)
    //setFloorPlanUri(floorplanUri)
    floorPlanProperty["scale"] = configFloor.data["scale"] 
    floorPlanProperty["angle"] = configFloor.data["angle"]
    floorPlanProperty["x"] = configFloor.data["x"]
    floorPlanProperty["y"] = configFloor.data["y"]
    floorPlanProperty["z"] = configFloor.data["z"]
    floorPlanProperty["opacity"]=configFloor.data["opacity"]
    floorPlanProperty["camera"] = configFloor.data["camera"]
    console.log("Config floor",configFloor, floorPlanProperty)
    drawPlane(uri,configFloor)
    dispatch(resetConfigFloor())
    setState((state)=>{return {...state, floorPlanUri : uri, floorData : configFloor}})
    
  }


  return ()=>{
    console.log("config floor reset")
     //dispatch(resetConfigFloor())
     //removePLane()
  }


},[configFloor])





/// Whenever physical distance changes scale map to accurate length
useEffect(()=>{



if(points.length===2 && state.physicalDistance > 2)
{

 
        const x = floorPlan.position.x
        const z = floorPlan.position.z
        const oldScale = floorPlan.scale.x
        console.log("physicalDistance",state.physicalDistance)
        let screenDistance =  (points[0].distanceTo(points[1])) / oldScale

        console.log(state.physicalDistance/screenDistance)
        let s= state.physicalDistance/screenDistance
        
        floorPlan.scale.setScalar(s)
        //cube.position.setX((cube.geometry.parameters.width * s)/2)
        //cube.position.setZ((cube.geometry.parameters.height * s) /2)
        floorPlanCenter.x = (cube.geometry.parameters.width * s)/2
        floorPlanCenter.z = -(cube.geometry.parameters.height* s)/2
        gridHelper.scale.setScalar(s)
        floorPlan.position.setX((x /oldScale) * floorPlan.scale.x)
        floorPlan.position.setZ((z /oldScale) * floorPlan.scale.z)


        console.log(cube)
        cameraPosition = cube.geometry.parameters.width*1.5 * s
        floorPlanProperty["scale"] = floorPlan.scale.x
        floorPlanProperty["camera"] = cameraPosition 
        //gridHelper.scale.setScalar(floorPlan.scale.x)
        
        if(coordinateCentered)
        {
          const canvas = renderer.domElement 
         // camera.position.y= cameraPosition
            frustumSize = 20 *s
            //aspect = canvas.clientWidth / canvas.clientHeight
            camera.left = (frustumSize * aspect  / -2) 
            camera.right = (frustumSize * aspect / 2)
            camera.top =  (frustumSize  / 2)
            camera.bottom = (frustumSize  / -2)  
            //camera.near =1
            //camera.far =1000*/
            camera.position.y= cameraPosition
            //renderer.setSize(canvas.clientWidth, canvas.clientHeight)
           
            
         
            camera.updateProjectionMatrix()

        }
        else
        {
            //camera.position.set(floorPlanCenter.x,cameraPosition,floorPlanCenter.z)
        }
        console.log(cube)
        
        points=[]
        if(canvasPoints)
        {
        scene.remove(canvasPoints[0])
        scene.remove(canvasPoints[1])
        canvasPoints=[]
        }
        scene.remove(line)
        //setLineDrawn(false)
        //setScaled(true)
        setState((state)=>{return{...state, lineDrawn : false, scaled : true}})
        canvas.removeEventListener("click",documentMouseDown,false)

        //drawRotationCircle()
        
    }
},[state.physicalDistance])


useEffect(()=>{

    if(state.floorPlanUri && state.enableRotate===1)
    {
          drawRotationCircle()
    }
    else if(state.floorPlanUri && state.enableRotate=== -1)
    {

        
        if(circle!=null)
        {
        floorPlan.remove(circle)
        circle=null
       
        controls.removeEventListener("dragstart",handleDragStart)
        controls.removeEventListener("drag", handleDrag)
        controls.removeEventListener("dragstop",handleDragStop)
        }

    }
    else if(state.floorPlanUri && state.enableRotate===2 && circle!=null)
    {
        floorPlan.remove(circle)
        circle=null
        controls.removeEventListener("dragstart",handleDragStart)
        controls.removeEventListener("drag", handleDrag)
        controls.removeEventListener("dragstop",handleDragStop)
        
    }
 


},[state.enableRotate])




useEffect(()=>{
    console.log("opacity",state.opacity)
    if(cube!= null)
    {
        cube.material.opacity = state.opacity
        floorPlanProperty["opacity"] = state.opacity
    }
},[state.opacity])



useEffect(()=>{

   if(state.floorPlanUri && state.axis === 1)
   {
    drawAxis()
   }
   else if(floorPlan && state.axis === 2)
   {
    if(ring!=null)
    {
    scene.remove(ring)
    ring=null
   
    axisControl.removeEventListener("dragstart",handleAxisDragStart)
    axisControl.removeEventListener("drag", handleAxisDrag)
    axisControl.removeEventListener("dragend",handleAxisDragStop)
    axisControl=null
    
    }
   }

},[state.axis])



const  handleAxisDragStart = useCallback((event)=>{},[state.floorPlanUri])
const handleAxisDrag=useCallback((event)=>{

    console.log( event.object.position)
},[state.floorPlanUri])

const handleAxisDragStop =useCallback((event)=>{
const axpos = event.object.position
//const prvx = floorPlan.position.x
//const prvz = floorPlan.position.z 
//floorPlan.position.setX(0)
//floorPlan.position.setZ(0)

floorPlan.position.setX(floorPlan.position.x - axpos.x)
floorPlan.position.setY(0)
floorPlan.position.setZ(floorPlan.position.z-axpos.z)
console.log("Drag Stop",floorPlan.position)
axpos.set(0,0,0)

floorPlanProperty["x"] = floorPlan.position.x
floorPlanProperty["y"] = floorPlan.position.y
floorPlanProperty["z"] = floorPlan.position.z


},[state.floorPlanUri])





const drawAxis = ()=>{
    ring  = new THREE.Object3D() 
    const lineXGeo = new THREE.CylinderBufferGeometry(0.05,0.05,3)
  const lineXmat = new THREE.MeshBasicMaterial({color:"#FF0000",transparent:true,opacity:0.3})
  const lineX = new THREE.Mesh(lineXGeo,lineXmat)
  lineX.rotation.z = -Math.PI*0.5 
  

  const lineYGeo = new THREE.CylinderBufferGeometry(0.05,0.05,3)
  const lineYmat = new THREE.MeshBasicMaterial({color:"#00FF00", transparent:true, opacity:0.3})
  const lineY = new THREE.Mesh(lineYGeo,lineYmat)

 
  ring.add(lineX)
  ring.add(lineY)
  ring.rotateX(0.5 * Math.PI)
  ring.scale.setScalar(cube.scale.x)
  scene.add(ring)
  axisControl = new DragControls([ring],camera,renderer.domElement)
  axisControl.transformGroup=true
  axisControl.addEventListener("dragstart",handleAxisDragStart)
  axisControl.addEventListener("drag", handleAxisDrag)
  axisControl.addEventListener("dragend",handleAxisDragStop)
  //floorPlan.position.set(0,0,0)
  
}






useEffect(()=>{
    if(!state.loaded && matches)
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
    //setLoaded(true)
    setState((state)=>{return {...state, loaded:true}})
    }
    //console.log("3D model loaded")
})




const hadleFileUpload=(event)=>{
   
    if(event.target)
    {
   const fileReader = new FileReader()
   console.log(event.target.files)
    fileReader.onload=()=>{
      setImageSrc(fileReader.result)
      setPreviewAvilable(true)
     //dispatch(setFloorPlanImage(fileReader.result))
     //setFloorPlanUri(fileReader.result)
     setState((state)=>{return {...state, floorPlanUri : fileReader.result}})
      
    } 
   fileReader.readAsDataURL(event.target.files[0])
   }
    //console.log(event)
 
  }
 
 
 const handleScale = ()=>{
   //setPhysicalDistance(lineLength)
   setState((state)=>{return {...state, physicalDistance : state.lineLength}})
 }
 
 
 
  const handleNext=()=>{
      
     // setActiveStep((prevActiveStep)=>prevActiveStep + 1)
      console.log("active Step",state.activeStep)
      setState((state)=>{return{...state, activeStep : state.activeStep + 1}})
  }
 
  const handleBack=()=>{
     //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
     console.log("active Step",state.activeStep)
     setState((state)=>{return {...state, activeStep : state.activeStep -1}})
  }
 
  const handleRotateNext=()=>{
      
   //setActiveStep((prevActiveStep)=>prevActiveStep + 1)
   console.log("active Step",state.activeStep)
   //setEnableRotate(1)
   setState((state)=>{return {...state, enableRotate:1,activeStep:state.activeStep +1}})
 }
 
 const handleRotateCompleteNext=()=>{
      
   //setActiveStep((prevActiveStep)=>prevActiveStep + 1)
   console.log("active Step",state.activeStep)
  // setEnableRotate(2)
   //setAxis(1)
   setState((state)=>{return{...state, enableRotate : 2, axis : 1, activeStep:state.activeStep + 1}})
 
 }
 
 const handleRotateBack=()=>{
   //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
  // setEnableRotate(-1)   
   // dispatch(setRotationAngle(0.0))
   //setAngle(0.0)
   console.log("active Step",state.activeStep)
   setState((state)=>{return {...state, enableRotate : -1, activeStep : state.activeStep-1}})
 }
 
 
 const handleAxisBack=()=>{
   //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
   console.log("active Step",state.activeStep)
   //setAxis(2)
   //setEnableRotate(1)
   setState((state)=>{return {...state,enableRotate:1, axis:2, activeStep : state.activeStep -1}})
 }
  const handleDrawLine=()=>{
   // setDrawLine(true)
    //setScaled(false)
  // canvas.addEventListener("",documentMouseDown,false)
  console.log('Clicked')
  setState((state)=>{return {...state, drawLine : true, scaled : false}})
  }
 
 
  const handleRotate=()=>{
  // dispatch(setRotationAngle(angle))
  }

  const handleAxisComplete=()=>{
      
    //setActiveStep((prevActiveStep)=>prevActiveStep + 1)
    console.log("active Step",state.activeStep)
    //setEnableRotate(2)
    
     //setAxis(2)
      setState((state)=>{return{...state,axis:2, activeStep : state.activeStep +1 }})
  }
 
  const handleSlideChange=(event,value)=>{   
       //setCurrentOpacity(value)
       console.log(state.opacity)
       //setOpacity(value)
 
       //console.log("opacity",value)
       setState((state)=>{return {...state, opacity : value }})
       
       
 }


 const handleOpacityBack=()=>{
  //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
 // console.log("active Step",activeStep)
  
 
  //setAxis(1)
  setState((state)=>{return {...state, axis:1, activeStep:state.activeStep -1}})
}

 const handleAngleChange = (event)=>{
   let val = event.target.value
    if(isNaN(val))
    {
        //setAngle(0.0)
        setState((state)=>{return{...state,angle : 0.0 }})
    }
    else{
    
       //val = Number.parseFloat(val).toFixed(3)
        //setAngle(val)
        setState((state)=>{return{...state,angle : val }})

    }
 }


 const handleSave= ()=>{
  console.log(floorPlanProperty)
  floorPlanProperty["configured"]=true
  console.log("Config Floor", configFloor)
  dispatch(editFloorplan({formData:floorPlanProperty,id:state.floorData.data["id"],alertMsg:"Floorplan configured!!!"}))
 }

   
    return (<React.Fragment>
      {!matches && (
        <Dialog
        open={true}
        fullScreen
      >
        <DialogContent>
         
        
        <LinearProgress/>
        <NoDisplay/>
        
  
        </DialogContent>
     
  
      </Dialog>
      )}

{matches && (
    <Box sx={{
      display:"grid",
      gridTemplateColumns : "0.6fr 3fr",
      gridTemplateRows:"1fr",
      gap:"0px 5px",
      gridTemplateAreas : `
      "control map"`,
      height:"100%"
  
  }}>
        {/* <AppBar position="fixed" sx={{ width:'83%', borderRadius:'10px 0 0 10px', bgcolor:'transparent', boxShadow:0}}>
        <Toolbar >
          
        <ProgressBar/>

        </Toolbar>
      </AppBar> */}
         
         <Box   sx = {{gridArea : "map", bgcolor:panelColor[colIndex].p1,
                     display:"grid",
                     gridTemplateColumns : 'repeat(12,1fr)',
                     gridTemplateRows: 'repeat(12,1fr)'  
      }}>    
          <Box sx = {{gridRow:"1/13", gridColumn:"1/13",p:0}}>   
              <Box component="canvas" sx = {{height:"99%", width:"99%"}} id="three">
               </Box>   
               
          </Box>  
            <Box sx = {{gridRow : "11", gridColumn:"2/4",alignItems:"center", justifyItems:"center", gap:"2" }}>
            <Tooltip title="Current mouse pointer position" arrow>                   
                <FormLabel sx={{border: "2px solid"}}>X:{Number.parseFloat(localX).toFixed(3)} | Y:{Number.parseFloat(localY).toFixed(3) } </FormLabel>
              </Tooltip>  
            </Box>

            <Paper elevation={4} sx={{ borderRadius: '7px',gridRow : "12", gridColumn :"12/13", width:'55%', height:'43%'}}>     
        <Stack direction='row' spacing={0}
         justifyContent='center'
         alignItems='center' alignSelf='center'
         
         divider={<Divider orientation="vertical" flexItem />}>
                <IconButton  disableRipple size='small'>
                    <ZoomInIcon />
                </IconButton>
                <IconButton disableRipple size='small'>
                    <ZoomOutIcon />
                </IconButton>
            </Stack>   
        </Paper>  
        <Paper style={{position:'relative', right:'-74px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "12", gridColumn :"11/12", width:'28%', height:'43%'}}>                 
                <IconButton onClick={centerOnFloorPlan} disableRipple size='small'>
                    <MapRoundedIcon />
                </IconButton>
                </Paper>
          <Paper style={{position:'relative', right:'-22px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "12", gridColumn :"11/12", width:'28%', height:'43%'}}>                 
          <Tooltip title="Center on coordinate" arrow>
          <IconButton onClick={resetLocation} disableRipple size='small'>
              <MyLocationRoundedIcon />
          </IconButton>
          </Tooltip>
          </Paper>
          </Box> 

          
           {/* <Box  sx={{gridArea:"control",bgcolor:panelColor[colIndex].p2,
                      display:"grid",
                      gridTemplateColumns : "0.5fr 4fr 1fr ",
                      gridTemplateRows : "0.5fr 5fr",
                      gridTemplateAreas : `" . . ."
                                           " . stepArea ."`
           }}>   */}

<Paper elevation={8} sx={{ 
  gridArea:'control',
  display:"grid",
  gridTemplateColumns : "0.5fr 3fr 1fr ",
  gridTemplateRows : "0.5fr 5fr",
  gridTemplateAreas : `" . . ."
                        " . stepArea ."`, 
                      borderRadius: "0 20px 20px 0",
                      bgcolor:'white',
                          }}>


             <Box sx = {{gridArea:"stepArea"}}>
             
             {/* <AuthAppBar title='Floorplan' icon={AspectRatioIcon} /> */}
     <Stepper activeStep= {state.activeStep}  orientation="vertical" color="secondary" 
    //  sx={{marginTop:'10px', marginLeft:'15px'}}
    >
         
          <Step >
              <StepLabel StepIconComponent ={ColorlibStepIcon}>Scale Map</StepLabel>
              <StepContent>
              <Box sx= {{display:"Grid",
                          gridTemplateColumns:'repeat(8,1fr)',
                          gridTemplateRows: 'repeat(5,1fr)',
                          }}>

                    <Button variant="contained"  style={{width:'118px', height:'40px'}} 
                       disabled = {state.floorPlanUri ? false : true}           
                       onClick = {handleDrawLine} 
                       sx={{gridRow : "1",gridColumn:"2/5"}}>
                        <Stack direction='row' spacing={1} sx={{width:'100%', height:'100%' , alignItems:'center', ml:'-12%', mr:'-12%' }}>
                        <BorderColorIcon sx={{fontSize:'15px'}}/>
                      <Typography sx={{fontSize:'12px', fontWeight:550}}>Draw Line</Typography>
                        </Stack>
                      </Button>
              
                       <TextField
                        variant="standard"
                        label="Line length"
                        name="length"
                        size="small"
                        value={state.lineLength}
                        onChange={(event)=>{setState((state)=>{return{...state, lineLength : event.target.value}})}}
                        InputLabelProps={{
                           shrink: true,
                           }}
                        inputProps={{ type:'number', min:0.001, max:200, step:0.001 }}
                        sx={{gridRow : "3",gridColumn:"1/4"}}
                        disabled={!state.lineDrawn} />
                    <Button variant="contained"  style={{width:'50px', height:'30px'}} disabled ={!state.lineDrawn} onClick={handleScale} 
                    sx={{gridRow : "3",gridColumn:"4/6", position:'relative', top:'25%', right:'-10%'}}>
                      <Typography sx={{fontSize:'12px', fontWeight:550}}>Scale</Typography></Button>
                      
                    
                    <Button variant="contained" style={{width:'50px', height:'30px'}} disabled={!state.scaled} onClick={handleRotateNext} sx = {{gridRow:"5", gridColumn:"5/7" }}><Typography sx={{fontSize:'12px', fontWeight:550}}>Next</Typography></Button>
                    <Button variant="outlined" style={{width:'50px', height:'30px'}} disabled onClick={handleBack} sx = {{gridRow:"5", gridColumn:"1/3" }}><Typography sx={{fontSize:'12px', fontWeight:550}}>Back</Typography></Button>
                    
                       
              </Box>
              </StepContent>
          </Step>
          <Step >
              <StepLabel StepIconComponent ={ColorlibStepIcon}>Rotate</StepLabel>
              <StepContent>
              <Box sx= {{display:"Grid",
                          gridTemplateColumns:'repeat(8,1fr)',
                          gridTemplateRows: 'repeat(3,1fr)',
                          }}>

                   
              
                       <TextField
                        variant="standard"
                        label="degree &deg;"
                        name="degree"
                        size="small"
                        value={state.angle}
                        onChange={handleAngleChange}
                        //helperText =  {`${Number.parseFloat(rotationAngle).toFixed(3)} °`}
                        InputLabelProps={{
                           shrink: true,
                           }}
                        inputProps={{ type:'number', min:0.0, max:360, step:0.01 }}
                        sx={{gridRow : "1",gridColumn:"1/4"}}
                        disabled={!state.floorPlanUri} />

                              
                    
              <Button  variant="contained" style={{width:'50px', height:'30px'}} sx = {{gridRow:"3", gridColumn:"5/7" }} onClick={handleRotateCompleteNext}><Typography sx={{fontSize:'12px', fontWeight:550}}>Next</Typography></Button>
              <Button variant="outlined" style={{width:'50px', height:'30px'}} sx = {{gridRow:"3", gridColumn:"1/3" }} onClick={handleRotateBack}><Typography sx={{fontSize:'12px', fontWeight:550}}>Back</Typography></Button>
              </Box>
              </StepContent>
              </Step>
              <Step >
              <StepLabel StepIconComponent ={ColorlibStepIcon}>Set Axis location</StepLabel>
              <StepContent>
              <Box sx= {{display:"Grid",
                          gridTemplateColumns:'repeat(8,1fr)',
                          gridTemplateRows: 'repeat(3,1fr)',
                          }}>

                   
              
              
                                          
                    
              <Button  variant="contained" style={{width:'50px', height:'30px'}} sx = {{gridRow:"3", gridColumn:"5/7" }} onClick={handleAxisComplete}><Typography sx={{fontSize:'12px', fontWeight:550}}>Next</Typography></Button>
              <Button variant="outlined" style={{width:'50px', height:'30px'}} sx = {{gridRow:"3", gridColumn:"1/3" }} onClick={handleAxisBack}><Typography sx={{fontSize:'12px', fontWeight:550}}>Back</Typography></Button>
              </Box>
              </StepContent> 
              </Step> 
              <Step >
              <StepLabel StepIconComponent ={ColorlibStepIcon}>Opacity</StepLabel>

              <StepContent>
              
              <Box sx= {{display:"Grid",
                          gridTemplateColumns:'repeat(8,1fr)',
                          gridTemplateRows: 'repeat(4,1fr)',
                          }}>

                       <Slider
                         aria-label="Small steps"
                         //defaultValue={}
                         step = {0.001}
                          
                         value = {state.opacity}
                         onChange= {handleSlideChange}
                         min={0.0}
                         max={1.0}
                         valueLabelDisplay="auto"
                         sx= {{gridRow:"1/2", gridColumn : "1/8" }}
                         />
              
                                          
                    
              <Button  variant="contained"  style={{width:'50px', height:'30px'}} sx = {{gridRow:"4", gridColumn:"5/7" }} onClick={handleSave}><Typography sx={{fontSize:'12px', fontWeight:550}}>Save</Typography></Button>
              <Button variant="outlined"  style={{width:'50px', height:'30px'}} sx = {{gridRow:"4", gridColumn:"1/3" }} onClick={handleOpacityBack}><Typography sx={{fontSize:'12px', fontWeight:550}}>Back</Typography></Button>
              </Box>
              </StepContent> 
              </Step> 
     </Stepper> 

              </Box>  
              </Paper> 
           {/* </Box>  */}
       <Outlet/>    
   </Box>)}
</React.Fragment>)

const mapStateToProps=(state)=>({
  colorIndex:state.color.colorIndex,
  configFloor : state.floorplan.configFloor 
})
}



export default (ConfigureFloorPlan)



// ---------------------------------------------------------Previous Code------------------------------------------------------------------------------

// 
// 
// 
// 
// 
// import NoDisplay from '../UI/NoDisplay'
// import * as THREE from 'three'
// import {DragControls} from "three/examples/jsm/controls/DragControls"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
// import { Outlet } from "react-router-dom"
// import React from "react";

// import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
// import { panelColor } from "../../components/themeColor";

// import Box from "@mui/material/Box"
// import {styled} from '@mui/material/styles'
// import { useEffect } from 'react';
// import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
// import { IconButton, Typography } from '@mui/material';
// import { Tooltip } from '@mui/material';
// import MapRoundedIcon from '@mui/icons-material/MapRounded';

// import { FormLabel } from '@mui/material';

// //import { useDispatch } from 'react-redux';

// import { useCallback } from 'react';
// import { connect, useDispatch,useSelector } from 'react-redux';
// import { Stepper,Step,StepLabel,StepContent } from '@mui/material'
// import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
// import Rotate90DegreesCwRoundedIcon from '@mui/icons-material/Rotate90DegreesCwRounded';
// import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
// import { XYCoordinateIcon } from '../UI/CustomIcon'
// import { Slider } from '@mui/material'
// import { OpacitySharp } from '@mui/icons-material'
// import { Button } from '@mui/material'
// import { TextField } from '@mui/material'
// import {Input} from "@mui/material"
// import { themeColor } from "../../components/themeColor"
// import {editFloorplan} from '../../feature/floorplan/floorplanThunk'
// import { addGltf } from "../../_actions/gltfAction";
// import { setAlert } from '../../_actions/alertAction';
// import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice';

// import { useTheme } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';
// import {Dialog,DialogContent,LinearProgress} from "@mui/material"



// const PanelBox = {}
// 
// 
// let widthVector = null
// let scene, camera, renderer,cube
// //let loaded = false
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
// let floorPlanProperty = {}
// let rayCaster
// let aspect= 0.0
// let frustumSize = 20
// let anchorImage = null





// /*const Image = styled('img')((theme)=>({
   
//     maxWidth:"100%",
//     borderRadius: "10px",
//     maxHeight: "100%"
    
//  }))*/


//  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState,color }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
//     zIndex: 1,
//     color: '#fff',
//     width: 50,
//     height: 50,
//     display: 'flex',
//     borderRadius: '50%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...(ownerState.active && {
//       backgroundImage:
//         `linear-gradient( 136deg,${theme.palette.primary.dark},${color.c1})`,
//       boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//     }),
//     ...(ownerState.completed && {
//       backgroundImage:
//       `linear-gradient( 136deg,${theme.palette.primary.dark},${color.c1})`,
//     }),
//   }));
  


//   function ColorlibStepIco(props) {
//     const { active, completed, className } = props;
//     const colorIndex = useSelector((state)=>state.color.colorIndex)
  
//     const icons = {
      
//       1: <StraightenOutlinedIcon/>,
//       2: <Rotate90DegreesCwRoundedIcon/>,
//       3: <XYCoordinateIcon/>,
//       4: <OpacitySharp/>
//     };
  
//     return (
//       <>
//       {/*console.log("color Index",colorIndex)*/}
//       <ColorlibStepIconRoot ownerState={{ completed, active }} color={{c1:themeColor[colorIndex][0]}} className={className}>
//         {icons[String(props.icon)]}
//       </ColorlibStepIconRoot>
//       </>
//     );
//   } 

// const ColorlibStepIcon = (ColorlibStepIco)  







// const ConfigureFloorPlan = (props)=>{
//   const theme = useTheme()
//   const matches = useMediaQuery(theme.breakpoints.up("xl"))
//     const [loaded,setLoaded]= React.useState(false)
//     //const colIndex = props.colorIndex
//     const [floorPlanUri,setFloorPlanUri] = React.useState("")
//     const [physicalDistance,setPhysicalDistance] = React.useState(0.0)
//     let [drawLine,setDrawLine] = React.useState(false)
//     const [enableRotate,setEnableRotate] =React.useState(0)
//    // const angle = useSelector((state)=>state.floorPlanImage.angle)
//     const [localX,setLocalX] = React.useState(1.0)
//     const [localY,setLocalY] = React.useState(1.0)
//     const dispatch = useDispatch()
    
//     const [axis,setAxis] = React.useState(0) 
//     //const [op,setOp] =React.useState(0.8) 
//     const [opacity,setOpacity] = React.useState(0.8) 
//     const [activeStep,setActiveStep] = React.useState(0)  
//     const [imageSrc,setImageSrc] = React.useState("")
//     const [previewAvailable,setPreviewAvilable] = React.useState(false)
//     const fileInput = React.useRef()
//     const [lineLength, setLineLenght] = React.useState(0.001)
//     const [angle,setAngle] = React.useState(0.0)
//     const [lineDrawn, setLineDrawn] = React.useState(false)
//     const [scaled,setScaled] =React.useState(false)
//     //const param = useParams()
//     const colIndex = useSelector((state)=>state.color.colorIndex)
//     const configFloor = useSelector((state)=>state.floorplan.configFloor )

//     //const dispatch = useDispatch()
    
//    const [state,setState] = React.useState({
//          loaded : false,
//          floorPlanUri : "",
//          physicalDistance : 0.0,
//          drawLine : false,
//          enableRotate : 0,
//          axis:0,
//          opacity : 0.8,
//          activeStep : 0,
//          lineLength : 0.5,
//          ///Angle is stored in degrees 
//          //Backend angle is stored in radians
//          angle : 0.0,
//          lineDrawn:false,
//          scaled : false,
//          floorData : null


  

//    }) 


// ///Creates a line
// const getLine =(points)=>{
     
//   const lineGeo = new MeshLine()
//   if(points)
//   {
//   lineGeo.setPoints(points)
//   }
//   const material = new MeshLineMaterial({transparent : true, opacity : 0.5, lineWidth:0.05 * floorPlan.scale.x , color : 0x0000ff  })
//   const line = new THREE.Mesh(lineGeo,material)
//   //line.raycast(rayCaster,[])
//  // line.raycast(rayCaster,intersectArray)
//   line.meshType = "Line"
  
//   return line


  
// }


// ///This function initializes threejs canvas for model display
//     const init3d=()=>{
//       anchorImage = new Image()
//       anchorImage.src = '/point12.svg'
//         canvas = document.querySelector("#three")
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
//         rayCaster = new THREE.Raycaster()
        
//        // floorPlan = new THREE.Object3D()
//        // scene.add(floorPlan)

    
        
   
       
//        canvas.addEventListener("mousemove",documentMouseMove,false)
       

   
//    }





//    ///This mouse event records the mouse pointer movement of three js canvas

//    const documentMouseMove=(event)=>{
//     const mouseMove = new THREE.Vector2()
//     mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
//     mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
//     //mouseMove.z =1
//     //console.log("Vector",mouseMove)
//     //console.log("mouse Move",mouseMove)
//     //console.log(canvas.offsetLeft,canvas.offsetTop)
//     //var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
//     //var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([points[0],mouseMove]), 60, 0.1);
//     moveRay.setFromCamera( mouseMove, camera );
//     var intersects = moveRay.intersectObjects(scene.children,false);
//    // console.log(intersects)
//     if(intersects.length>0)
//     {
//         //console.log(intersects[0])
//         const point =  intersects[0].point
//         //console.log(point)
//         setLocalX(point.x)
//         setLocalY(-point.z)    
//         //point.z = 1
//         //.line.geometry.setFromPoints([points[0],point])
//         //line.position.x=points[0].x
//         //line.position.y=(points[0].y)
//        // points.push(point)
//        //movePoint.position.x = point.x
//        //movePoint.position.y = point.y
//     }
    
     
//     //line = new THREE.Mesh(tubeGeometry,mat)
//    // line = new THREE.Line(lineGeo,lineMat)
//    // 
//     //line.position.z = 1
//    // line.geometry.computeBoundingBox()
//    // line.geometry.center(points[0])
//     //console.log(points[0])   
//     //console.log(line)

// }




// 

// ////Draw point canvas
// const createCanvas = ()=>{
//   var canvas = document.createElement("canvas")
//   canvas.height=100
//   canvas.width =100
//   var ctx = canvas.getContext("2d");

// //ctx.font = "20px Arial"
// //ctx.fillText(ancName,1,20)
// ctx.drawImage(anchorImage,0,0,100,100)

// // Create gradient
// //ctx.clearRect(0,0,640,480);
// ctx.fillStyle = 'rgba(0, 0, 200, 0.05)';
// ctx.beginPath();
// ctx.arc(45, 65, 29, 0, 2 * Math.PI);
// ctx.fill()
// //ctx.clearRect
// //anchorCanvasRef[ancName] = {ctx:ctx}
// return canvas
// }


// ///This method creates a point
// const getPoint=()=>{

//   const texture = new THREE.CanvasTexture(createCanvas())
 
//   let plane = new THREE.CircleGeometry( 0.14, 32 );
//   let planeMat = new THREE.MeshBasicMaterial({map:texture ,transparent:true, opacity:0.9 })
 
  
//   const point = new THREE.Mesh(plane,planeMat)

//   //point.position.setY(-0.01)
//  //widthVector = new THREE.Vector3(width,0,0)
  
//   point.rotateX(-0.5 * Math.PI)

//   return point




// }







// ///This mouse event takes two points from user

// const documentMouseDown = useCallback((event)=>{
//    console.log("mouse event")
//     //let rayCaster = new THREE.Raycaster()
//     const mousexy = new THREE.Vector2()
//     mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
//     mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
//     rayCaster.setFromCamera( mousexy, camera );
//     var intersects = rayCaster.intersectObjects([cube],false);
//    console.log(intersects)
//     if(intersects.length>0)
//     {
//         //console.log(intersects[0])
//         const point =  intersects[0].point
//         //point.z = 1
//         points.push(point)

        
//         ///Draw point Hare
//         //const pointGeo = new THREE.BufferGeometry()

//         //pointGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( point.toArray(), 3 ) );
//         //const pointMat = new THREE.PointsMaterial({size:0.5,color:"#FF00FF"})
//         //const pointObj = new THREE.Points(pointGeo,pointMat)
        
//         const pointObj=getPoint()
//              pointObj.scale.setScalar(floorPlan.scale.x)
//              pointObj.position.setX(point.x)
//              pointObj.position.setZ(point.z)
//              pointObj.position.setY(0.002)
        
//         scene.add(pointObj)
//         canvasPoints.push(pointObj)
   
         

    

//     if(points.length === 1)
//     {
//         //setLineDrawn(false)
//         canvas.addEventListener("mousemove",lineMOuseMove)
//       // const lineGeo = new THREE.BufferGeometry()
//        // const lineMat = new THREE.LineBasicMaterial({color : "#000000", linewidth: 3})
//         //line = new THREE.Line(lineGeo,lineMat)
//         line =getLine()
        
//         scene.add(line)
//         setState((state)=>{return{...state, lineDrawn : false}})
//     }

//     if(points.length ===2)
//     {

//         canvas.removeEventListener("mousemove",lineMOuseMove)
        
        
//         //setLineDrawn(true)
//         setState((state)=>{return{...state, lineDrawn : true}})
      
       
        
//     }

//     if(points.length===3)
//     {
//       // setLineDrawn(false)
//        points.shift()
//        points.shift()
//        scene.remove(canvasPoints[0])
//        scene.remove(canvasPoints[1])
//        scene.remove(line)
//        canvasPoints.shift()
//        canvasPoints.shift()

//        canvas.addEventListener("mousemove",lineMOuseMove)
//        //const lineGeo = new THREE.BufferGeometry()
//        //const lineMat = new THREE.LineBasicMaterial({color : "#000000", linewidth: 3})
//        //line = new THREE.Line(lineGeo,lineMat)
//        line= getLine()
//        scene.add(line)
//        setState((state)=>{return{...state, lineDrawn : false}})

//     }


//   }


// },[state.floorPlanUri])





// const lineMOuseMove=(event)=>{
//     mouseMove = new THREE.Vector2()
//     mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
//     mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
   
//     let ray = new THREE.Raycaster()
//     ray.setFromCamera( mouseMove, camera );
//     var intersects = ray.intersectObjects([cube],false);
    
//     if(intersects.length>0)
//     {
//         console.log(intersects[0])
//         const point =  intersects[0].point
      
//         line.geometry.setPoints([points[0],point]) 
//     }
//     console.log(points[0])   
//     console.log(line)


// }


// const handleDrag = useCallback((event)=>{
//     //cube.position.set(0,0,0)
//     //const mouseMove = new THREE.Vector2()
//     //mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
//     //mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
    
    
//     //dragRay.setFromCamera(mouseMove,camera)
    
//    //dragRay.ray.intersectPlane(intersectionPlane,target)
//     //console.log("Drag Target",target)
//     const height = cube.geometry.parameters.height 
//     const width = cube.geometry.parameters.width 
   
//     //const rad = Math.sqrt((height*height) + (width * width)) 
//    //const z = event.object.position.z
   
//    const posVector= event.object.position
//    const newPos=posVector.normalize().multiplyScalar(width)
//    //event.object.position.y=0
      

//     let angleR = widthVector.angleTo(newPos)

//     if(Math.sign(newPos.z) > 0)
//     {
//         angleR=-angleR
//     }
//    let angleD = Number.parseFloat(angleR  * (180/Math.PI)).toFixed(3) 
//     console.log(angleD)
//     //setAngle( angleR )
//     //dispatch(setRotationAngle(angle * (180/Math.PI)))
//    //console.log(circleMesh1)
//  setState ((state)=>{return {...state, angle:angleD}})


// },[state.floorPlanUri])




// const handleDragStart=useCallback((event)=>{
//     console.log(event.object.position)
//     },[state.floorPlanUri])
    
    
// const handleDragStop=useCallback((event)=>{
//         console.log(event.object.position)
//     },[state.floorPlanUri])





//    const resizeRendererToDisplaySize=(renderer)=>{
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

// const animate = (time)=>{
//     time*=0.001
//     if(cube)
//     {
   
//     }
//    /* if(resizeRendererToDisplaySize(renderer))
//     {
//         const canvas = renderer.domElement
//         //camera.aspect = canvas.clientWidth/canvas.clientHeight
//         camera.left= frustumSize * aspect /-2
//         camera.right = frustumSize * aspect / 2
//         camera.
//         camera.updateProjectionMatrix()
//     }*/

//     renderer.render(scene,camera)
//     //console.log(orbit.target)
//     orbit.update()
//     requestAnimationFrame(animate)
    

// }



// const drawRotationCircle = ()=>{

//     const width = cube.geometry.parameters.width  * cube.scale.x
//     const height =cube.geometry.parameters.height
    
//     //const radius = 
    
//     const circleGeo = new THREE.CircleBufferGeometry(0.3,32)
//     const circleMaterial = new THREE.MeshBasicMaterial({color : "#FF00FF" })
//     circle = new THREE.Mesh(circleGeo,circleMaterial)
    
//     circle.scale.setScalar(cube.scale.x)
//     circle.rotateX(-Math.PI * 0.5)
    
   
//        const x = Math.cos( state.angle*(Math.PI/180)) * width
//        const y = Math.sin( state.angle *(Math.PI/180)) * width
//         circle.position.set(x,0,-y)
//     //circle.position.set(width,0,0)
//     floorPlan.add(circle)

//     controls = new DragControls([circle],camera,renderer.domElement)
//     controls.transformGroup=false
//     controls.addEventListener("dragstart",handleDragStart)
//     controls.addEventListener("drag", handleDrag)
//     controls.addEventListener("dragstop",handleDragStop)
    

     
      




// }

// 

// const removePLane = ()=>{

//   if(cube)
//   {
//     floorPlan.remove(cube)
//     cube.geometry.dispose()
//     cube.material.map.dispose()
//     cube.material.dispose()
//     scene.remove(floorPlan)
//     cube=null
//     floorPlan = null

//   }

// }


// 

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
      
//      /* const geometry1 = new THREE.BoxGeometry(0.3,0.3,0.001);
//       const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//       corner1 = new THREE.Mesh(geometry1,material1)
//       const geometry2 = new THREE.BoxGeometry(0.3,0.3,0.001);
//       const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//       corner2 = new THREE.Mesh(geometry2,material2)
//       const geometry3 = new THREE.BoxGeometry(0.3,0.3,0.001);
//       const material3 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//       corner3 = new THREE.Mesh(geometry3,material3)
//       corner1.rotateX(0.5 * Math.PI)
//       corner2.rotateX(0.5 * Math.PI)
//       corner3.rotateX(0.5 * Math.PI)
     
//       corner1.position.set(0,0,height)
//       corner2.position.set(width,0,height)
//       corner3.position.set(width,0,0)

//      // scene.add(corner1)
//       //scene.add(corner2)
//       //scene.add(corner3)
//      */widthVector = new THREE.Vector3(width,0,0)
      
      
     
     




//      const cubeCenter = new THREE.Vector3(width/2,height/2,0)
     
     
      
      
      
//       cube.rotateX(-0.5 * Math.PI)
      
//       //scene.add(cube)
       
//       floorPlan = new THREE.Object3D()
//       floorPlan.add(cube)
//       floorPlan.add(widthVector)
//       floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
      
//       if(configFloor.data["configured"])
//       {
//         floorPlan.scale.setScalar(floorPlanProperty["scale"])
//         console.log("Stored Angle",floorPlanProperty["angle"])
//         cube.rotation.z = floorPlanProperty["angle"]
        
//         cube.material.opacity = floorPlanProperty["opacity"]
//         floorPlan.position.setX(floorPlanProperty["x"])
//         floorPlan.position.setY(floorPlanProperty["y"])
//         floorPlan.position.setZ(floorPlanProperty["z"])
//         camera.position.y =floorPlanProperty["camera"]
//         cameraPosition =  camera.position.y
//         frustumSize = 20 * cube.scale.x
//         camera.left = (frustumSize * aspect  / -2) 
//         camera.right = (frustumSize * aspect / 2)
//         camera.top =  (frustumSize  / 2)
//         camera.bottom = (frustumSize  / -2)  
        
//         cameraPosition =  camera.position.y
//         camera.updateProjectionMatrix()
//         //setAngle(Number.parseFloat( configFloor.data["angle"] * (180/Math.PI)).toFixed(3))

//         setState((state)=>{return{...state,
//           angle :  Number.parseFloat( floorPlanProperty["angle"] * (180/Math.PI)).toFixed(3),
//         }})
//       }
//       else
//       {

//         cameraPosition = width*1.1
//         camera.position.y = cameraPosition
//         floorPlanProperty["scale"] = cube.scale.x  
//         floorPlanProperty["angle"] = cube.rotation.z
//         floorPlanProperty["x"] = floorPlan.position.x
//         floorPlanProperty["y"] = floorPlan.position.y
//         floorPlanProperty["z"] = floorPlan.position.z
//         floorPlanProperty["opacity"]=cube.material.opacity
//         floorPlanProperty["camera"] = camera.position.y      
//       }
     


     
//       //scene.add(floorPlan)
    
//      //floorPlanProperty["scale"] = cube.scale.x
//      //floorPlanProperty["angle"] = cube.rotation.z
//      //floorPlanProperty["x"] = floorPlan.position.x
//      //floorPlanProperty["y"] = floorPlan.position.y
//      //floorPlanProperty["z"] = floorPlan.position.z
//      //floorPlanProperty["opacity"]=cube.material.opacity
//      //floorPlanProperty["camera"] = camera.position.y
//      gridHelper.scale.setScalar(floorPlan.scale.x)
//      scene.add(floorPlan)

//     })
    
    
    


// }




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

// const resetLocation=()=>{

    
//     orbit.target=new THREE.Vector3(0,0,0)
//     camera.position.set(0,cameraPosition,0)
//     coordinateCentered = true
//     orbit.update()
    
    
    
// }


// useEffect(()=>{
//  console.log("config floor", configFloor)
// return()=>{
//   removePLane()
// }
// },[])


// useEffect(()=>{
//   if(scene)
//   {
//   scene.background = new THREE.Color(panelColor[colIndex].p1)
//   }
// },[colIndex])

// ///This change the rotaton angle of floor plan
// useEffect(()=>{

// if(state.floorPlanUri && !isNaN(state.angle))
// {
    
//     cube.rotation.z = (Math.PI /180) * state.angle
//     floorPlanProperty["angle"] = cube.rotation.z
//     if(circle!==null)
//     {   
//         const width = cube.geometry.parameters.width
//         const x = Math.cos( state.angle*(Math.PI/180)) * width
//         const y = Math.sin( state.angle *(Math.PI/180)) * width
//        // circle.position.set(0,0,0)
        
//        // circle.rotation.z=((Math.PI /180) * angle)  
//        //circle.position.set(x,0,y)
//     }
// }


// },[state.angle])



// // This event enables line drawing capability
// useEffect(()=>{

//     if(state.drawLine)
//     {
//         //cube.rotation.z = 0
//         if(floorPlan.scale.x <0.99999 || floorPlan.scale.y > 1.00001 )
//         {
//             /*floorPlan.scale.setScalar(1)
//             gridHelper.scale.setScalar(1)
//             const width = cube.geometry.parameters.width
//             const height = cube.geometry.parameters.height

//             cameraPosition = -width*1.3
//             cube.position.setX(width/2)
//             cube.position.setZ(height/2)
//             floorPlanCenter.x = width/2
//             floorPlanCenter.z = height/2
//             if(coordinateCentered)
//             {
                
//                 camera.position.y = cameraPosition
//             }
//             else{
//                 camera.position.set(floorPlanCenter.x,cameraPosition,floorPlanCenter.z)
//             }*/
//         }
//         console.log("Draw Line",state.drawLine)
//         canvas.addEventListener("click",documentMouseDown,false)
//        //setDrawLine(false)
//        setState((state)=>{return {...state, drawLine : false}})
//     }
//         //console.log("Draw Line",drawLine)
// },[state.drawLine])



// /// Load floor plan in canvas


// 
// ///When cuurent floorplan object is updated it draws floor plan
// useEffect(()=>{
 
//   console.log("configFloor",configFloor)
//   if(configFloor)
//   {
//     //removePLane()
//    const uri = `/uploads/${configFloor.data.floorplan}`
//     console.log("floorplanUri",uri)
//     //setFloorPlanUri(floorplanUri)
//     floorPlanProperty["scale"] = configFloor.data["scale"] 
//     floorPlanProperty["angle"] = configFloor.data["angle"]
//     floorPlanProperty["x"] = configFloor.data["x"]
//     floorPlanProperty["y"] = configFloor.data["y"]
//     floorPlanProperty["z"] = configFloor.data["z"]
//     floorPlanProperty["opacity"]=configFloor.data["opacity"]
//     floorPlanProperty["camera"] = configFloor.data["camera"]
//     console.log("Config floor",configFloor, floorPlanProperty)
//     drawPlane(uri,configFloor)
//     dispatch(resetConfigFloor())
//     setState((state)=>{return {...state, floorPlanUri : uri, floorData : configFloor}})
    
//   }


//   return ()=>{
//     console.log("config floor reset")
//      //dispatch(resetConfigFloor())
//      //removePLane()
//   }


// },[configFloor])




// 
// /// Whenever physical distance changes scale map to accurate length
// useEffect(()=>{



// if(points.length===2 && state.physicalDistance > 2)
// {

 
//         const x = floorPlan.position.x
//         const z = floorPlan.position.z
//         const oldScale = floorPlan.scale.x
//         console.log("physicalDistance",state.physicalDistance)
//         let screenDistance =  (points[0].distanceTo(points[1])) / oldScale

//         console.log(state.physicalDistance/screenDistance)
//         let s= state.physicalDistance/screenDistance
        
//         floorPlan.scale.setScalar(s)
//         //cube.position.setX((cube.geometry.parameters.width * s)/2)
//         //cube.position.setZ((cube.geometry.parameters.height * s) /2)
//         floorPlanCenter.x = (cube.geometry.parameters.width * s)/2
//         floorPlanCenter.z = -(cube.geometry.parameters.height* s)/2
//         gridHelper.scale.setScalar(s)
//         floorPlan.position.setX((x /oldScale) * floorPlan.scale.x)
//         floorPlan.position.setZ((z /oldScale) * floorPlan.scale.z)


//         console.log(cube)
//         cameraPosition = cube.geometry.parameters.width*1.5 * s
//         floorPlanProperty["scale"] = floorPlan.scale.x
//         floorPlanProperty["camera"] = cameraPosition 
//         //gridHelper.scale.setScalar(floorPlan.scale.x)
        
//         if(coordinateCentered)
//         {
//           const canvas = renderer.domElement 
//          // camera.position.y= cameraPosition
//             frustumSize = 20 *s
//             //aspect = canvas.clientWidth / canvas.clientHeight
//             camera.left = (frustumSize * aspect  / -2) 
//             camera.right = (frustumSize * aspect / 2)
//             camera.top =  (frustumSize  / 2)
//             camera.bottom = (frustumSize  / -2)  
//             //camera.near =1
//             //camera.far =1000*/
//             camera.position.y= cameraPosition
//             //renderer.setSize(canvas.clientWidth, canvas.clientHeight)
           
            
         
//             camera.updateProjectionMatrix()

//         }
//         else
//         {
//             //camera.position.set(floorPlanCenter.x,cameraPosition,floorPlanCenter.z)
//         }
//         console.log(cube)
        
//         points=[]
//         if(canvasPoints)
//         {
//         scene.remove(canvasPoints[0])
//         scene.remove(canvasPoints[1])
//         canvasPoints=[]
//         }
//         scene.remove(line)
//         //setLineDrawn(false)
//         //setScaled(true)
//         setState((state)=>{return{...state, lineDrawn : false, scaled : true}})
//         canvas.removeEventListener("click",documentMouseDown,false)

//         //drawRotationCircle()
        
//     }
// },[state.physicalDistance])


// useEffect(()=>{

//     if(state.floorPlanUri && state.enableRotate===1)
//     {
//           drawRotationCircle()
//     }
//     else if(state.floorPlanUri && state.enableRotate=== -1)
//     {

        
//         if(circle!=null)
//         {
//         floorPlan.remove(circle)
//         circle=null
       
//         controls.removeEventListener("dragstart",handleDragStart)
//         controls.removeEventListener("drag", handleDrag)
//         controls.removeEventListener("dragstop",handleDragStop)
//         }

//     }
//     else if(state.floorPlanUri && state.enableRotate===2 && circle!=null)
//     {
//         floorPlan.remove(circle)
//         circle=null
//         controls.removeEventListener("dragstart",handleDragStart)
//         controls.removeEventListener("drag", handleDrag)
//         controls.removeEventListener("dragstop",handleDragStop)
        
//     }
 


// },[state.enableRotate])




// useEffect(()=>{
//     console.log("opacity",state.opacity)
//     if(cube!= null)
//     {
//         cube.material.opacity = state.opacity
//         floorPlanProperty["opacity"] = state.opacity
//     }
// },[state.opacity])



// useEffect(()=>{

//    if(state.floorPlanUri && state.axis === 1)
//    {
//     drawAxis()
//    }
//    else if(floorPlan && state.axis === 2)
//    {
//     if(ring!=null)
//     {
//     scene.remove(ring)
//     ring=null
   
//     axisControl.removeEventListener("dragstart",handleAxisDragStart)
//     axisControl.removeEventListener("drag", handleAxisDrag)
//     axisControl.removeEventListener("dragend",handleAxisDragStop)
//     axisControl=null
    
//     }
//    }

// },[state.axis])


// 
// const  handleAxisDragStart = useCallback((event)=>{},[state.floorPlanUri])
// const handleAxisDrag=useCallback((event)=>{

//     console.log( event.object.position)
// },[state.floorPlanUri])

// const handleAxisDragStop =useCallback((event)=>{
// const axpos = event.object.position
// //const prvx = floorPlan.position.x
// //const prvz = floorPlan.position.z 
// //floorPlan.position.setX(0)
// //floorPlan.position.setZ(0)

// floorPlan.position.setX(floorPlan.position.x - axpos.x)
// floorPlan.position.setY(0)
// floorPlan.position.setZ(floorPlan.position.z-axpos.z)
// console.log("Drag Stop",floorPlan.position)
// axpos.set(0,0,0)

// floorPlanProperty["x"] = floorPlan.position.x
// floorPlanProperty["y"] = floorPlan.position.y
// floorPlanProperty["z"] = floorPlan.position.z


// },[state.floorPlanUri])





// const drawAxis = ()=>{
//     ring  = new THREE.Object3D() 
//     const lineXGeo = new THREE.CylinderBufferGeometry(0.05,0.05,3)
//   const lineXmat = new THREE.MeshBasicMaterial({color:"#FF0000",transparent:true,opacity:0.3})
//   const lineX = new THREE.Mesh(lineXGeo,lineXmat)
//   lineX.rotation.z = -Math.PI*0.5 
  

//   const lineYGeo = new THREE.CylinderBufferGeometry(0.05,0.05,3)
//   const lineYmat = new THREE.MeshBasicMaterial({color:"#00FF00", transparent:true, opacity:0.3})
//   const lineY = new THREE.Mesh(lineYGeo,lineYmat)

 
//   ring.add(lineX)
//   ring.add(lineY)
//   ring.rotateX(0.5 * Math.PI)
//   ring.scale.setScalar(cube.scale.x)
//   scene.add(ring)
//   axisControl = new DragControls([ring],camera,renderer.domElement)
//   axisControl.transformGroup=true
//   axisControl.addEventListener("dragstart",handleAxisDragStart)
//   axisControl.addEventListener("drag", handleAxisDrag)
//   axisControl.addEventListener("dragend",handleAxisDragStop)
//   //floorPlan.position.set(0,0,0)
  
// }






// useEffect(()=>{
//     if(!state.loaded && matches)
//     {


//    /* if(scene)
//     {
//       scene.dispose()
//       camera.dispose()
//       renderer.dispose()
//     }*/  
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
//     console.log("3D model loaded")
//     //setLoaded(true)
//     setState((state)=>{return {...state, loaded:true}})
//     }
//     //console.log("3D model loaded")
// })




// const hadleFileUpload=(event)=>{
   
//     if(event.target)
//     {
//    const fileReader = new FileReader()
//    console.log(event.target.files)
//     fileReader.onload=()=>{
//       setImageSrc(fileReader.result)
//       setPreviewAvilable(true)
//      //dispatch(setFloorPlanImage(fileReader.result))
//      //setFloorPlanUri(fileReader.result)
//      setState((state)=>{return {...state, floorPlanUri : fileReader.result}})
      
//     } 
//    fileReader.readAsDataURL(event.target.files[0])
//    }
//     //console.log(event)
 
//   }
 
 
//  const handleScale = ()=>{
//    //setPhysicalDistance(lineLength)
//    setState((state)=>{return {...state, physicalDistance : state.lineLength}})
//  }
 
 
 
//   const handleNext=()=>{
      
//      // setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//       console.log("active Step",state.activeStep)
//       setState((state)=>{return{...state, activeStep : state.activeStep + 1}})
//   }
 
//   const handleBack=()=>{
//      //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//      console.log("active Step",state.activeStep)
//      setState((state)=>{return {...state, activeStep : state.activeStep -1}})
//   }
 
//   const handleRotateNext=()=>{
      
//    //setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//    console.log("active Step",state.activeStep)
//    //setEnableRotate(1)
//    setState((state)=>{return {...state, enableRotate:1,activeStep:state.activeStep +1}})
//  }
 
//  const handleRotateCompleteNext=()=>{
      
//    //setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//    console.log("active Step",state.activeStep)
//   // setEnableRotate(2)
//    //setAxis(1)
//    setState((state)=>{return{...state, enableRotate : 2, axis : 1, activeStep:state.activeStep + 1}})
 
//  }
 
//  const handleRotateBack=()=>{
//    //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//   // setEnableRotate(-1)   
//    // dispatch(setRotationAngle(0.0))
//    //setAngle(0.0)
//    console.log("active Step",state.activeStep)
//    setState((state)=>{return {...state, enableRotate : -1, activeStep : state.activeStep-1}})
//  }
 
 
//  const handleAxisBack=()=>{
//    //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//    console.log("active Step",state.activeStep)
//    //setAxis(2)
//    //setEnableRotate(1)
//    setState((state)=>{return {...state,enableRotate:1, axis:2, activeStep : state.activeStep -1}})
//  }
//   const handleDrawLine=()=>{
//    // setDrawLine(true)
//     //setScaled(false)
//   // canvas.addEventListener("",documentMouseDown,false)
//   setState((state)=>{return {...state, drawLine : true, scaled : false}})
//   }
 
 
//   const handleRotate=()=>{
//   // dispatch(setRotationAngle(angle))
//   }

//   const handleAxisComplete=()=>{
      
//     //setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//     console.log("active Step",state.activeStep)
//     //setEnableRotate(2)
    
//      //setAxis(2)
//       setState((state)=>{return{...state,axis:2, activeStep : state.activeStep +1 }})
//   }
 
//   const handleSlideChange=(event,value)=>{   
//        //setCurrentOpacity(value)
//        console.log(state.opacity)
//        //setOpacity(value)
 
//        //console.log("opacity",value)
//        setState((state)=>{return {...state, opacity : value }})
       
       
//  }


//  const handleOpacityBack=()=>{
//   //setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//  // console.log("active Step",activeStep)
  
 
//   //setAxis(1)
//   setState((state)=>{return {...state, axis:1, activeStep:state.activeStep -1}})
// }

//  const handleAngleChange = (event)=>{
//    let val = event.target.value
//     if(isNaN(val))
//     {
//         //setAngle(0.0)
//         setState((state)=>{return{...state,angle : 0.0 }})
//     }
//     else{
    
//        //val = Number.parseFloat(val).toFixed(3)
//         //setAngle(val)
//         setState((state)=>{return{...state,angle : val }})

//     }
//  }


//  const handleSave= ()=>{
//   console.log(floorPlanProperty)
//   floorPlanProperty["configured"]=true
//   console.log("Config Floor", configFloor)
//   dispatch(editFloorplan({formData:floorPlanProperty,id:state.floorData.data["id"],alertMsg:"Floorplan configured!!!"}))
//  }

   
//     return <>
//     <Dialog
//       open= {!matches}
//       fullScreen
//     >
//       <DialogContent>
       
      
//       <LinearProgress/>
//       <NoDisplay/>
      

//       </DialogContent>
   

//     </Dialog>

//   <Box sx={{
//       display:"grid",
//       gridTemplateColumns : "3fr 1fr",
//       gridTemplateRows:"1fr",
//       gap:"0px 5px",
//       gridTemplateAreas : `
//       "map control"`,
//       height:"100%"
  
//   }}>
        
         
//          <Box   sx = {{gridArea : "map", bgcolor:panelColor[colIndex].p1,
//                      display:"grid",
//                      gridTemplateColumns : 'repeat(12,1fr)',
//                      gridTemplateRows: 'repeat(12,1fr)'  
//       }}>    
//           <Box sx = {{gridRow:"1/13", gridColumn:"1/13",p:0}}>   
//               <Box component="canvas" sx = {{height:"99%", width:"99%"}} id="three">
//                </Box>   
               
//           </Box>  
//             <Box sx = {{gridRow : "11", gridColumn:"2/4",alignItems:"center", justifyItems:"center", gap:"2" }}>
//             <Tooltip title="Current mouse pointer position" arrow>                   
//                 <FormLabel sx={{border: "2px solid"}}>X:{Number.parseFloat(localX).toFixed(3)} | Y:{Number.parseFloat(localY).toFixed(3) } </FormLabel>
//               </Tooltip>  
//             </Box>
//             <Box sx = {{gridRow : "11", gridColumn :"11/12"}}>
//                 <Tooltip title="Center on coordinate" arrow>
//                    <IconButton onClick={resetLocation} size="large"><MyLocationRoundedIcon/></IconButton>
//                  </Tooltip> 

//                   <Tooltip title="Center on Floorplan" arrow>
//                    <IconButton size="large" onClick={centerOnFloorPlan}><MapRoundedIcon/></IconButton>
//                  </Tooltip>  
//             </Box> 
//           </Box> 
//            <Box  sx={{gridArea:"control",bgcolor:panelColor[colIndex].p2,
//                       display:"grid",
//                       gridTemplateColumns : "0.5fr 4fr 1fr ",
//                       gridTemplateRows : "0.5fr 5fr",
//                       gridTemplateAreas : `" . . ."
//                                            " . stepArea ."`
//            }}>  
//              <Box sx = {{gridArea:"stepArea"}}>
             
             
//      <Stepper activeStep= {state.activeStep}  orientation="vertical" color="secondary">
         
//           <Step >
//               <StepLabel StepIconComponent ={ColorlibStepIcon}>Scale Map</StepLabel>
//               <StepContent>
//               <Box sx= {{display:"Grid",
//                           gridTemplateColumns:'repeat(8,1fr)',
//                           gridTemplateRows: 'repeat(5,1fr)',
//                           }}>

//                     <Button variant="contained"  
//                        disabled = {state.floorPlanUri ? false : true}           
//                        onClick = {handleDrawLine} 
//                        sx={{gridRow : "1",gridColumn:"2/6"}}>
//                       Draw Line
//                       </Button>
              
//                        <TextField
//                         variant="standard"
//                         label="Line length"
//                         name="length"
//                         size="small"
//                         value={state.lineLength}
//                         onChange={(event)=>{setState((state)=>{return{...state, lineLength : event.target.value}})}}
//                         InputLabelProps={{
//                            shrink: true,
//                            }}
//                         inputProps={{ type:'number', min:0.001, max:200, step:0.001 }}
//                         sx={{gridRow : "3",gridColumn:"1/4"}}
//                         disabled={!state.lineDrawn} />
//                     <Button variant="contained"  disabled ={!state.lineDrawn} onClick={handleScale} sx={{gridRow : "3",gridColumn:"5/7"}}>Scale</Button>
                      
                    
//                     <Button variant="contained" disabled={!state.scaled} onClick={handleRotateNext} sx = {{gridRow:"5", gridColumn:"1/3" }}>Next</Button>
//                     {/*<MyButton onClick={handleNext}>Next</MyButton>*/}
                  
                 
//                     <Button variant="outlined" disabled onClick={handleBack} sx = {{gridRow:"5", gridColumn:"5/7" }}>Back</Button>
                    
                       
//               </Box>
//               </StepContent>
//           </Step>
//           <Step >
//               <StepLabel StepIconComponent ={ColorlibStepIcon}>Rotate</StepLabel>
//               <StepContent>
//               <Box sx= {{display:"Grid",
//                           gridTemplateColumns:'repeat(8,1fr)',
//                           gridTemplateRows: 'repeat(3,1fr)',
//                           }}>

                   
              
//                        <TextField
//                         variant="standard"
//                         label="degree &deg;"
//                         name="degree"
//                         size="small"
//                         value={state.angle}
//                         onChange={handleAngleChange}
//                         //helperText =  {`${Number.parseFloat(rotationAngle).toFixed(3)} °`}
//                         InputLabelProps={{
//                            shrink: true,
//                            }}
//                         inputProps={{ type:'number', min:0.0, max:360, step:0.01 }}
//                         sx={{gridRow : "1",gridColumn:"1/4"}}
//                         disabled={!state.floorPlanUri} />

                              
                    
//               <Button  variant="contained" sx = {{gridRow:"3", gridColumn:"1/3" }} onClick={handleRotateCompleteNext}>Next</Button>
//               <Button variant="outlined" sx = {{gridRow:"3", gridColumn:"5/7" }} onClick={handleRotateBack}>Back</Button>
//               </Box>
//               </StepContent>
//               </Step>
//               <Step >
//               <StepLabel StepIconComponent ={ColorlibStepIcon}>Set Axis location</StepLabel>
//               <StepContent>
//               <Box sx= {{display:"Grid",
//                           gridTemplateColumns:'repeat(8,1fr)',
//                           gridTemplateRows: 'repeat(3,1fr)',
//                           }}>

                   
              
              
                                          
                    
//               <Button  variant="contained" sx = {{gridRow:"3", gridColumn:"1/3" }} onClick={handleAxisComplete}>Next</Button>
//               <Button variant="outlined" sx = {{gridRow:"3", gridColumn:"5/7" }} onClick={handleAxisBack}>Back</Button>
//               </Box>
//               </StepContent> 
//               </Step> 
//               <Step >
//               <StepLabel StepIconComponent ={ColorlibStepIcon}>Opacity</StepLabel>

//               <StepContent>
              
//               <Box sx= {{display:"Grid",
//                           gridTemplateColumns:'repeat(8,1fr)',
//                           gridTemplateRows: 'repeat(4,1fr)',
//                           }}>

//                        <Slider
//                          aria-label="Small steps"
//                          //defaultValue={}
//                          step = {0.001}
                          
//                          value = {state.opacity}
//                          onChange= {handleSlideChange}
//                          min={0.0}
//                          max={1.0}
//                          valueLabelDisplay="auto"
//                          sx= {{gridRow:"1/2", gridColumn : "2/7" }}
//                          />
              
                                          
                    
//               <Button  variant="contained"  sx = {{gridRow:"4", gridColumn:"1/3" }} onClick={handleSave}>Save</Button>
//               <Button variant="outlined"  sx = {{gridRow:"4", gridColumn:"5/7" }} onClick={handleOpacityBack}>Back</Button>
//               </Box>
//               </StepContent> 
//               </Step> 
//      </Stepper> 

//               </Box>   
//            </Box> 
//        <Outlet/>    
//    </Box>
//  </>; 

// }

// const mapStateToProps=(state)=>({
//   colorIndex:state.color.colorIndex,
//   configFloor : state.floorplan.configFloor 
// })




// export default (ConfigureFloorPlan)

