





import NoDisplay from '../UI/NoDisplay'
import * as THREE from 'three'
import {DragControls} from "three/examples/jsm/controls/DragControls"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { Outlet } from "react-router-dom"
import React from "react";
import { resetFloorGltf } from '../../feature/gltf/gltfSlice';

import { panelColor } from "../themeColor";

import { Box, Paper } from "@mui/material"
import {styled} from '@mui/material/styles'
import { useEffect } from 'react';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';

import { FormLabel } from '@mui/material';

//import { useDispatch } from 'react-redux';

import { useCallback } from 'react';
import { connect , useSelector, useDispatch } from 'react-redux';
import { Stepper,Step,StepLabel,StepContent } from '@mui/material'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Rotate90DegreesCwRoundedIcon from '@mui/icons-material/Rotate90DegreesCwRounded';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { XYCoordinateIcon } from '../UI/CustomIcon'
import { Slider } from '@mui/material'
import { OpacitySharp } from '@mui/icons-material'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import {Input} from "@mui/material"
import { themeColor } from "../themeColor"
import {editFloorplan} from '../../_actions/floorplanAction'
import { Typography } from '@mui/material';
import { FormControl,InputLabel ,FormControlLabel,Switch, Stack, Divider, AppBar, Toolbar} from '@mui/material';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { addGltf,getGltfOfFloor,editGltf,editGltfWithFile } from "../../feature/gltf/gltfThunk";
import { floorplanSlice, resetConfigFloor } from '../../feature/floorplan/floorplanSlice';
import { useMediaQuery } from '@mui/material';
import {Dialog,DialogContent,LinearProgress} from "@mui/material"
import { useTheme } from '@mui/material/styles';
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
let gltfModel = null
let ambiLight = null
let light2 = null
let gltfPlane = null
let gltfSettings = {}





const Image = styled('img')((theme)=>({
   
    maxWidth:"100%",
    borderRadius: "10px",
    maxHeight: "100%"
    
 }))










const UploadGltf = (props)=>{
  // const colorIndex =

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("xl"))
  const dispatch = useDispatch() 
  const configFloor = useSelector((state)=>state.floorplan.configFloor)
   const floorGltf = useSelector((state)=>state.gltf.floorGltf)
    const [loaded,setLoaded]= React.useState(false)
    const colIndex =  useSelector((state)=>state.color.colorIndex)
    const [floorPlanUri,setFloorPlanUri] = React.useState("")
    const [physicalDistance,setPhysicalDistance] = React.useState(0.0)
    let [drawLine,setDrawLine] = React.useState(false)
    const [enableRotate,setEnableRotate] =React.useState(0)
   // const angle = useSelector((state)=>state.floorPlanImage.angle)
    const [localX,setLocalX] = React.useState(1.0)
    const [localY,setLocalY] = React.useState(1.0)
    const [rotate,setRotate] = React.useState(false)
    const [move, setMove]  = React.useState(false)
 
    const [axis,setAxis] = React.useState(0) 
    //const [op,setOp] =React.useState(0.8) 
    const [opacity,setOpacity] = React.useState(0.8) 
    const [activeStep,setActiveStep] = React.useState(0)  
    
    const fileInput = React.useRef()
    const [lineLength, setLineLenght] = React.useState(0.001)
    const [angle,setAngle] = React.useState(0.0)
    const [lineDrawn, setLineDrawn] = React.useState(false)
    const [ambiIntensity,setAmbiIntensity] = React.useState(1.2)
  const [dirIntensity,setDirIntensity] = React.useState(1.2)
  const [scale,setScale]=React.useState(1)
  const [gltf,setGltf] = React.useState(null)
  const [floorData, setFloorData] = React.useState(null)
  const [gltfData, setGltfData] = React.useState(null)




    //const param = useParams()


///This function initializes threejs canvas for model display
    const init3d=()=>{
        canvas = document.querySelector("#three")
        //console.log(canvas)
        renderer =new THREE.WebGLRenderer({canvas})
        //renderer.setPixelRatio(devicePixelRatio)
        //console.log("height",canvas.offsetHeight)
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight,.1,1000)
        
       renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        //canvas.appendChild(renderer.domElement)
        scene.background = new THREE.Color(panelColor[colIndex].p1)
   
       /*const gui = new dat.GUI()
        const scale=gui.addFolder("scale")
        scale.add(control,"scaleX",0.1,3)
        scale.add(control,"scaleY",0.1,3)
        scale.add(control,"scaleZ",0.1,3)*/
        orbit = new OrbitControls(camera,renderer.domElement)
        //orbit.minDistance = 0;
        // controls.maxDistance = 20;
       orbit.maxPolarAngle = Math.PI / 2 * 115 / 120;
        //orbit.enableRotate= false
        //orbit.enableZoom=false
        //orbit.maxPolarAngle = 4* Math.PI 
   
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


        
       gltfPlane= new THREE.Object3D()
       
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
        setLocalY(point.z)    
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


///This mouse event takes two points from user

const documentMouseDown = useCallback((event)=>{
   console.log("mouse event")
    //let rayCaster = new THREE.Raycaster()
    const mousexy = new THREE.Vector2()
    mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
    mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
    rayCaster.setFromCamera( mousexy, camera );
    var intersects = rayCaster.intersectObjects([cube],false);
   console.log(intersects.point)
    if(intersects.length>0)
    {
        //console.log(intersects[0])
        const point =  intersects[0].point
        //point.z = 1
        points.push(point)

        const pointGeo = new THREE.BufferGeometry()

        pointGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( point.toArray(), 3 ) );
        const pointMat = new THREE.PointsMaterial({size:0.5,color:"#FF00FF"})
        const pointObj = new THREE.Points(pointGeo,pointMat)
        scene.add(pointObj)
        canvasPoints.push(pointObj)
   
         

    }

    if(points.length === 1)
    {
        setLineDrawn(false)
        canvas.addEventListener("mousemove",lineMOuseMove)
        const lineGeo = new THREE.BufferGeometry()
        const lineMat = new THREE.LineBasicMaterial({color : "#00FF00", linewidth: 3})
        line = new THREE.Line(lineGeo,lineMat)
        scene.add(line)
    }

    if(points.length ===2)
    {

        canvas.removeEventListener("mousemove",lineMOuseMove)
        
        
        setLineDrawn(true)
       
        
    }

    if(points.length==3)
    {
       setLineDrawn(false)
       points.shift()
       points.shift()
       scene.remove(canvasPoints[0])
       scene.remove(canvasPoints[1])
       scene.remove(line)
       canvasPoints.shift()
       canvasPoints.shift()

       canvas.addEventListener("mousemove",lineMOuseMove)
       const lineGeo = new THREE.BufferGeometry()
       const lineMat = new THREE.LineBasicMaterial({color : "#00FF00", linewidth: 3})
       line = new THREE.Line(lineGeo,lineMat)
       scene.add(line)


    }





},[floorPlanUri])



const deleteFloor=()=>{
  //console.log("GLTFMODEL-->",gltfModel);
  if(gltfModel){
    gltfPlane.remove(gltfModel);
    gltfModel=null
  }
}


const handleFileUpload=(event)=>{
   
  if(event.target)
  {
    
  const uploadedFile = event.target.files[0]
 const fileReader = new FileReader()
 console.log(event.target.files)
  fileReader.onload=()=>{
    deleteFloor()
    modelLoading(fileReader.result);
  } 
 //fileReader.readAsDataURL()
 if(uploadedFile.name.match(/\.(gltf)$/))
    { 
    fileReader.readAsText(uploadedFile);
    }
    else
    {
      fileReader.readAsArrayBuffer(uploadedFile);
    }
   setGltf(uploadedFile)
    
 }
  //console.log(event)
  

}

const  removePrevModel= ()=>{


    if(gltfModel)
    {  
      gltfPlane.remove(gltfModel)
      gltfModel.traverse(function (child) {
        if (child.isMesh) {
          child.geometry.dispose()
          child.material.dispose()
        }
      })
  
      gltfPlane.scale.setScalar(1)
      gltfPlane.position.setX(0)
      gltfPlane.position.setY(0)
      gltfPlane.position.setZ(0)
      

    }
}

const urlmodelLoader=(url,floorGltf)=>{

  let loader = new GLTFLoader();
  let dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("../draco/");
  loader.setDRACOLoader(dracoLoader);
  //let ktx2 = new KTX2Loader()
  //ktx2.setTranscoderPath("../basis/")
  //loader.setKTX2Loader(ktx2.detectSupport(renderer))
  //loader.setMeshoptDecoder(MeshoptDecoder)

  loader.load(url, (gltf)=>{
    //console.log("GLTF---->",gltf);
   
    let mesh = gltf.scene;
    const clips = gltf.animations || [];
    //this.setContent(mesh,clips)
    gltfModel=mesh
    gltfPlane.add(mesh)
    
    gltfPlane.position.setX(floorGltf.x)
    gltfPlane.position.setY(floorGltf.y)
    gltfPlane.position.setZ(floorGltf.z)
    gltfPlane.scale.setScalar(floorGltf.scale)
    gltfModel.rotateY(floorGltf.angle)
    scene.add(gltfPlane)


    gltfSettings["scale"] = floorGltf.scale
     gltfSettings["angle"] = floorGltf.angle
     gltfSettings["x"] = floorGltf.x
     gltfSettings["y"] =  floorGltf.y
     gltfSettings["z"] =  floorGltf.z


    
  },( xhr )=> {
     const total = parseInt(xhr.target.getResponseHeader('x-decompressed-content-length'), 10)
    if(total-xhr.loaded <0.00001)
    {
      //this.props.setBackdrop(false)
    }
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    console.log( total,"total");
    console.log(xhr)
    
  },(err)=>{
    console.log("file not found")
   // this.props.setBackdrop(false)
    //currentModel3D = {}
  }
  ); 

}


const modelLoading=(path)=> {
  // let scene = scene;
   //const MANAGER = new THREE.LoadingManager();
   removePrevModel()
   let loader = new GLTFLoader();
   let dracoLoader = new DRACOLoader();
   dracoLoader.setDecoderPath("../draco/");
   loader.setDRACOLoader(dracoLoader);
   //let ktx2 = new KTX2Loader(MANAGER)
   //ktx2.setTranscoderPath("three/examples/js/libs/basis/")
   //loader.setKTX2Loader(ktx2.detectSupport(renderer))
   loader.setMeshoptDecoder(MeshoptDecoder)

   loader.parse(path,'',(gltf)=>{
     //console.log("GLTF---->",gltf);
    
     let mesh = gltf.scene;
     const clips = gltf.animations || [];
     //setContent(mesh,clips)
    /* gltf.scene.traverse(function (child) {
       if (child.isMesh) {
       
         if (child.name === "Shadow") {
           child.visible = false;
           floorMesh = child;
         }
         //child.material.depthWrite = !child.material.transparent;
       }
     });*/
     gltfModel = mesh;
     gltfPlane.add(mesh);
     scene.add(gltfPlane)
     console.log(mesh)
     //setShowProgress(false)
     gltfSettings["scale"] = 1
     gltfSettings["angle"] = 0
     gltfSettings["x"] = 0
     gltfSettings["y"] = 0
     gltfSettings["z"] = 0



   }); 
   

 }


 const ambientLight=()=> {
  ambiLight = new THREE.AmbientLight(0xffffff, ambiIntensity);
 let light = new THREE.HemisphereLight(0xd1d1d1, 0x080820, 0.3);
 //let light = new THREE.HemisphereLight();
 light2  = new THREE.DirectionalLight(0xFFFFFF,dirIntensity * Math.PI);
 light2.position.set(0.5, 0, 0.866); // ~60º
 light2.name = 'main_light';
 camera.add( light2 );
 scene.add(light);
 scene.add(ambiLight);


}




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
    requestAnimationFrame(animate)
    

}



\


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
      cube.position.setY(0.01)
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
     gltfPlane.add(widthVector)
      
      
     
     




     const cubeCenter = new THREE.Vector3(width/2,height/2,0)
     
     
      
      
      
      cube.rotateX(-0.5 * Math.PI)
      
      //scene.add(cube)
       
      floorPlan = new THREE.Object3D()
      floorPlan.add(cube)
      //floorPlan.add(widthVector)
      floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
      
      if(configFloor.data["configured"])
      {
        cube.scale.setScalar(configFloor.data["scale"])
        cube.rotateZ(configFloor.data["angle"])
        cube.material.opacity =configFloor.data["opacity"]
        floorPlan.position.setX(configFloor.data["x"])
        floorPlan.position.setY(configFloor.data["y"])
        floorPlan.position.setZ(configFloor.data["z"])
        camera.position.y = configFloor.data["camera"]
        cameraPosition =  camera.position.y
      }
      else
      {
        cameraPosition = width*1.3
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
   
     const center = new THREE.Vector3(cube.geometry.parameters.width/2,cube.geometry.parameters.height/2,0)
     const midPoint = cube.localToWorld(center)
     //console.log(midPoint)
     camera.position.set(midPoint.x,cameraPosition,midPoint.z)
     orbit.target = midPoint
     orbit.update()
     //scene.add(floorPlan)

    })
    
    
    


}



const marksAmbi = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 0.5,
      label: '0.5',
    },
    {
      value: 1.0,
      label: '1.0',
    },
    {
      value: 1.5,
      label: '1.5',
    },
    {
      value: 2.0,
      label: '2.0',
    },
  ];


  const marksDir = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 1.0,
      label: '1.0',
    },
    {
      value: 2.0,
      label: '2.0',
    },
    {
      value: 3.0,
      label: '3.0',
    },
    {
      value: 4.0,
      label: '4.0',
    },
  ];  


  const scaleDir = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 1,
      label: '1.0',
    },
    {
      value: 2.5,
      label: '2.5',
    },
    {
      value: 4,
      label: '4.0',
    },
    {
      value: 5.0,
      label: '5.0',
    },
  ];  


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
  if(scene)
  {
  scene.background = new THREE.Color(panelColor[colIndex].p1)
  }
},[colIndex])

///This change the rotaton angle of floor plan
useEffect(()=>{

if(floorPlanUri && !isNaN(angle) && gltfModel)
{
    
    gltfModel.rotation.y = angle //(Math.PI /180) * angle
    //floorPlanProperty["angle"] = cube.rotation.z

    gltfSettings["angle"] = gltfModel.rotation.y
    if(circle!==null)
    {   
        const width = cube.geometry.parameters.width
        const x = Math.cos( angle) * width
        const y = Math.sin( angle) * width
       // circle.position.set(0,0,0)
        
       // circle.rotation.z=((Math.PI /180) * angle)  
      // circle.position.set(width,0,0)
    }
}


},[angle])



const handleAmbiChange=(e,nv)=>{
  ambiLight.intensity = nv
  setAmbiIntensity(nv)
  
}
const handleDirChange=(e,nv)=>{
  light2.intensity = nv
  setDirIntensity(nv)
 
}



// This event enables line drawing capability

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
  console.log("config floor", configFloor)
 return()=>{
   removePLane()
 }
 },[])


 useEffect(()=>{

  if(floorData)
  {
    const floorplanUri = `/uploads/${floorData.data.floorplan}`
    
    console.log("floorplanUri",floorplanUri)
      drawPlane(floorplanUri,floorData)
      setFloorPlanUri(floorplanUri)

  }

},[floorData])


///When cuurent floorplan object is updated it draws floor plan
useEffect(()=>{
  if(configFloor)
  {
   //const floorplanUri = `/uploads/${configFloor.data.floorplan}`
    //console.log("floorplanUri",floorplanUri)
    dispatch(getGltfOfFloor(configFloor.data._id))
    //setFloorPlanUri(floorplanUri)
    //drawPlane(floorplanUri,configFloor)
    setFloorData(configFloor)
    // dispatch(resetConfigFloor())
    

  }
  return()=>{
    //dispatch(resetConfigFloor())
    //removePLane()
  }

},[configFloor])





//load gltf of floorplan
useEffect(()=>{
  if(floorGltf)
  {
    removePrevModel()
    console.log(floorGltf)
    urlmodelLoader(`/uploads/${floorGltf.gltf}`,floorGltf)
    setGltf(floorGltf.gltf)
   setAmbiIntensity(floorGltf.ambiIntensity)
  setDirIntensity(floorGltf.dirIntensity)
    setScale(floorGltf.scale)
    setGltfData(floorGltf)
    dispatch(resetFloorGltf())

  }
  return ()=>{
     removePrevModel()
  }

},[floorGltf])




const drawRotationCircle = ()=>{

  if(gltfModel!==null)
  {
    
  

  if(circle==null)
  {
    /*const box  = new THREE.Box3().setFromObject(gltfModel)
    console.log(box)
    const size = new THREE.Vector3()
    box.getSize(size) 
    const width = size.x
    console.log(box)*/
  const width = cube.geometry.parameters.width 
  //const height =cube.geometry.parameters.height
  //const radius = 
  
  const circleGeo = new THREE.CircleBufferGeometry(0.3,32)
  const circleMaterial = new THREE.MeshBasicMaterial({color : "#FF00FF" })
  circle = new THREE.Mesh(circleGeo,circleMaterial)
  

  circle.rotateX(-Math.PI * 0.5)
  
 
     const x = Math.cos( angle*(Math.PI/180)) * width
     const y = Math.sin( angle *(Math.PI/180)) * width
      circle.position.set(x,0.25,-y)
     //circle.position.set(width,0,0)
      gltfPlane.add(circle)

  }
  else
  {
    circle.visible=true
  }
  controls = new DragControls([circle],camera,renderer.domElement)
  controls.transformGroup=false
  controls.addEventListener("dragstart",handleDragStart)
  controls.addEventListener("drag", handleDrag)
  controls.addEventListener("dragend",handleDragStop)
}
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

  /*if(Math.sign(newPos.z) > 0)
  {
      angleR=-angleR
  }*/
  if(Math.sign(newPos.z) > 0)
    {
        angleR=-angleR
    }
  //let angleD = angleR  * (180/Math.PI) 
  console.log(angleR)
  setAngle( angleR)
  //dispatch(setRotationAngle(angle * (180/Math.PI)))
 //console.log(circleMesh1)



},[floorPlanUri])




const handleDragStart=useCallback((event)=>{
  //console.log(event.object.position)
  orbit.enabled = false
  },[floorPlanUri])
  
  
const handleDragStop=useCallback((event)=>{
      orbit.enabled = true
  },[floorPlanUri])

















const  handleAxisDragStart = useCallback((event)=>{
  orbit.enabled = false


},[floorPlanUri])
const handleAxisDrag=useCallback((event)=>{

    console.log( event.object.position)
    event.object.position.y = 0.01
},[floorPlanUri])

const handleAxisDragStop =useCallback((event)=>{

event.object.position.setY(0.0)

const axpos = event.object.position
//const worldPos = event.object.getWorldPosition(axpos)
//axpos.setY(0)
//const prvx = floorPlan.position.x
//const prvz = floorPlan.position.z 
//floorPlan.position.setX(0)
//floorPlan.position.setZ(0)
//gltfPlane.position.set(axpos)
//gltfModel.position.set(new THREE.Vector3(0,0,0))
gltfSettings["x"] = axpos.x
gltfSettings["y"] = 0.01//axpos.y
gltfSettings["z"] = axpos.z

console.log(axpos)
orbit.enabled = true

},[floorPlanUri])





const setupMove= ()=>{


  if(gltfModel)
  {
  if(axisControl===null)
  {  
  axisControl = new DragControls([gltfPlane],camera,renderer.domElement)
  axisControl.transformGroup=true
  }
   else
   {
  axisControl.enabled=true
   }
  axisControl.addEventListener("dragstart",handleAxisDragStart)
  axisControl.addEventListener("drag", handleAxisDrag)
  axisControl.addEventListener("dragend",handleAxisDragStop)
  //floorPlan.position.set(0,0,0)
  
  
}
}





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
    ambientLight()
    animate()
    console.log("3D model loaded")
    setLoaded(true)
    }
    //console.log("3D model loaded")
})





 
 
 const handleScale = (e,nv)=>{

  if(gltfPlane)
  {
    gltfSettings["scale"]=nv
    gltfPlane.scale.setScalar(nv)
    setScale(nv)
  }
   
 }
 
 
 
  const handleNext=()=>{
      
      setActiveStep((prevActiveStep)=>prevActiveStep + 1)
      console.log("active Step",activeStep)
  }
 
  const handleBack=()=>{
     setActiveStep((prevActiveStep)=>prevActiveStep - 1)
     console.log("active Step",activeStep)
  }
 
  const handleRotateNext=()=>{
      
   setActiveStep((prevActiveStep)=>prevActiveStep + 1)
   console.log("active Step",activeStep)
   setEnableRotate(1)
 
 }
 
 const handleRotateCompleteNext=()=>{
      
   setActiveStep((prevActiveStep)=>prevActiveStep + 1)
   console.log("active Step",activeStep)
   setEnableRotate(2)
   setAxis(1)
 
 }
 
 const handleRotateBack=()=>{
   setActiveStep((prevActiveStep)=>prevActiveStep - 1)
   setEnableRotate(-1)   
   // dispatch(setRotationAngle(0.0))
   //setAngle(0.0)
   console.log("active Step",activeStep)
 }
 
 
 const handleAxisBack=()=>{
   setActiveStep((prevActiveStep)=>prevActiveStep - 1)
   console.log("active Step",activeStep)
   setAxis(2)
 }
  const handleDrawLine=()=>{
    setDrawLine(true)
  // canvas.addEventListener("",documentMouseDown,false)
  }
 

  


///This method enables rotation when switch changed  
const handleRotate=(event)=>{
   const  checked = event.target.checked

   if(checked)
   {
     drawRotationCircle()
   }
   else if(circle!==null)
   {
     circle.visible=false
     controls.removeEventListener("dragstart",handleDragStart)
     controls.removeEventListener("drag", handleDrag)
     controls.removeEventListener("dragstop",handleDragStop)

   }
  
   setRotate(checked)

  
  }
 

//this method enables movement
const handleMove = (event)=>{

  const checked = event.target.checked
  if(checked && gltfModel)
  {
    setupMove()
  }
  else if(gltfModel)
  {
    axisControl.enabled=false
    axisControl.removeEventListener("dragstart",handleAxisDragStart)
    axisControl.removeEventListener("drag", handleAxisDrag)
    axisControl.removeEventListener("dragend",handleAxisDragStop)
  }

setMove(checked)

}

const handleSubmit=(event)=>{
 event.preventDefault()
  if (gltf) {
    console.log(gltf,configFloor);
    const formData = new FormData();
    //formData.append("gltf", gltf);
    formData.append("floorplan", floorData.data.id);
    //formData.append("description", description);
    console.log(ambiIntensity)
    console.log(floorData.data.id)
    formData.append("ambiIntensity",ambiIntensity);
    
    formData.append("dirIntensity",dirIntensity);
    formData.append("scale",gltfSettings["scale"])
    formData.append("angle",gltfSettings["angle"])
    formData.append("x",gltfSettings["x"])
    formData.append("y",gltfSettings["y"])
    formData.append("z",gltfSettings["z"])
    console.log(formData.get("floorplan"))
    console.log(formData.get("dirIntensity"))
    console.log(formData.get("ambiIntensity"))
    console.log(formData.get("scale"))

    if(!gltfData)
    {
    formData.append("gltf", gltf) 
    dispatch(addGltf(formData));
    }
    else if(gltfData.gltf !== gltf)
    {
      formData.append("gltf", gltf)
      dispatch(editGltfWithFile({formData:formData,id: gltfData._id}))
    }else if(gltfData.gltf === gltf)
    {
      dispatch(editGltf({formData:formData,id:gltfData._id}))
    }
   
  } else {
    console.log("Please select a 3D file to add.");
  }

}



 const handleAngleChange = (event)=>{
   let val = event.target.value
    if(isNaN(val))
    {
        setAngle(0.0)
    }
    else{
    
       //val = Number.parseFloat(val).toFixed(3)
        setAngle(val)

    }
 }



   
    return <React.Fragment>
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

{/* <AppBar position="fixed" sx={{ width:'78.8%', borderRadius:'10px 0 0 10px', bgcolor:'gray'}}>
        <Toolbar>
          
        <ProgressBar/>

        </Toolbar>
      </AppBar> */}

    <Box
    component="form"
    onSubmit = {handleSubmit}
    sx={{
        display:"grid",
        gridTemplateColumns : "0.8fr 3fr",
        gridTemplateRows:"1fr",
        gap:"0px 5px",
        gridTemplateAreas : `
        "control map"`,
        height:"100%"
    
    }}>
          
           
           <Box   sx = {{gridArea : "map", bgcolor:panelColor[colIndex].p1,
                       display:"grid",
                       gridTemplateColumns : 'repeat(12,1fr)',
                       gridTemplateRows: 'repeat(12,1fr)'  
        }}>    
            <Box sx = {{gridRow:"1/13", gridColumn:"1/13"}}>   
                <Box component="canvas" sx = {{height:"99.95%", width:"99.95%"}} id="three">
                 </Box>   
                 
            </Box>  
              <Box sx = {{gridRow : "11", gridColumn:"2/4",alignItems:"center", justifyItems:"center", gap:"2" }}>
              <Tooltip title="Current mouse pointer position" arrow>                   
                  <FormLabel sx={{border: "2px solid"}}>X:{Number.parseFloat(localX).toFixed(3)} | Y:{Number.parseFloat(localY).toFixed(3) } </FormLabel>
                </Tooltip>  
              </Box>
              {/* <Box sx = {{gridRow : "12", gridColumn :"12/13"}}>
                  <Tooltip title="Center on coordinate" arrow>
                     <IconButton onClick={resetLocation} size="large"><MyLocationRoundedIcon/></IconButton>
                   </Tooltip> 

                    <Tooltip title="Center on Floorplan" arrow>
                     <IconButton size="large" onClick={centerOnFloorPlan}><MapRoundedIcon/></IconButton>
                   </Tooltip>  
              </Box>  */}

<Paper elevation={4} sx={{ borderRadius: '7px',gridRow : "12", gridColumn :"12/13", width:'54%',  height:'40%', ml:'20%'}}>     
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

        <Paper style={{position:'relative', right:'-93px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "12", gridColumn :"11/12", width:'28%', height:'40%'}}>                 
                <IconButton onClick={centerOnFloorPlan} disableRipple size='small'>
                    <MapRoundedIcon />
                </IconButton>
                </Paper>
          <Paper style={{position:'relative', right:'-40px'}} elevation={4} sx={{ borderRadius: '7px',gridRow : "12", gridColumn :"11/12", width:'28%', height:'40%'}}>                 
          <Tooltip title="Center on coordinate" arrow>
          <IconButton onClick={resetLocation} disableRipple size='small'>
              <MyLocationRoundedIcon />
          </IconButton>
          </Tooltip>
          </Paper>
            </Box> 
             {/* <Box  sx={{gridArea:"control",bgcolor:'transparent',
             borderRadius:'0 20px 20px 0',
                        display:"grid",
                        gridTemplateColumns : "0.5fr 5fr",
                        gridTemplateRows : "0.5fr 5fr",
                        gridTemplateAreas : `" . . "
                                             " . stepArea"`
             }}> */}
               
             <Paper elevation={8} sx = {{gridRow:"1/2",
                          gridColumn:'1/2',
                          display:"grid",
                          gridTemplateColumns : 'repeat(15,1fr)',
                          gridTemplateRows:"repeat(20,1fr)", borderRadius: "0 20px 20px 0",
                          bgcolor:'white',
                          alignContent:'center', pl:'10%', pr:'10%', pt:'14%'}}>
            
                      <Box sx ={{gridRow:"2/3",gridColumn:"2/13" }}>
                           <Input type="file"  ref={fileInput} onChange={handleFileUpload}/>
                      </Box>

               <FormControl
                 variant="standard"
                 id="ambiLight"
                 sx={{ m: 1,gridRow :"5/7",gridColumn:"1/15"}}
                 size="small">      
                <InputLabel shrink htmlFor="ambient-light">
                            Ambient Light
                 </InputLabel> 
               <Slider 
               sx={{
                '& .MuiSlider-rail': {
                  color: "#acc4e4"
              },
               }}
               value={ambiIntensity} 
               onChange={handleAmbiChange}
               id="ambient-light"
               valueLabelDisplay="auto"
               aria-labelledby="ambient-light"
               step={0.01}
               marks= {marksAmbi}
               min={0}
               max={2}
               />
               </FormControl>


              
               <FormControl
                 variant="standard"
                 id="dirLight"
                 sx={{ m: 1,gridRow :"7/9",gridColumn:"1/15"}}
                 size="small">      
                <InputLabel shrink htmlFor="direct-light">
                            Direct Light
                 </InputLabel>     
               <Slider 
               sx={{
                '& .MuiSlider-rail': {
                  color: "#acc4e4"
              },
               }}
               value={dirIntensity} 
                onChange={handleDirChange}
                id="direct-light"
                valueLabelDisplay="auto"
                aria-labelledby="direct-light"
                step={0.01}
                marks= {marksDir}
                min={0}
                max={4}
               />
               </FormControl>
        
               <FormControl
                 variant="standard"
                 id="mScale"
                 sx={{ m: 1,gridRow :"9/11",gridColumn:"1/15"}}
                 size="small">      
                <InputLabel shrink htmlFor="model-scale">
                            Model Scale
                 </InputLabel>     
               <Slider 
               sx={{
                '& .MuiSlider-rail': {
                  color: "#acc4e4"
              },
               }}
               value={scale} 
                onChange={handleScale}
                id="model-scale"
                valueLabelDisplay="auto"
                aria-labelledby="model-scale"
                step={0.001}
                marks= {scaleDir}
                min={0}
                max={5}
               />
               </FormControl>

               <FormControl variant="standard" sx={{ m: 1,gridRow :"12/14",gridColumn:"1/6"}}>
                <FormControlLabel
                  control={
                  <Switch 
                  checked={rotate} 
                  onChange={handleRotate} 
                  name="rotate" />
                     }
                 label="Rotate"
                />
               </FormControl>  
               
               <FormControl variant="standard" sx={{ m: 1,gridRow :"12/14",gridColumn:"7/15"}}>
                <FormControlLabel
                  control={
                  <Switch 
                  checked={move} 
                  onChange={handleMove} 
                  name="move" />
                     }
                 label="Move"
                />
               </FormControl>  
        
               <Button  variant="contained" type="submit"  
               sx = {{gridRow:"15/16", gridColumn:"7/10" }} 
               //onClick={handleSubmit}   
               >Save</Button>


               
              </Paper>
               
             {/* </Box>  */}
         <Outlet/>    
     </Box>
    </React.Fragment>;

}

const mapStateToProps=(state)=>({
  colorIndex:state.color.colorIndex,
  configFloor : state.floorplan.configFloor ,
  floorGltf : state.gltf.floorGltf
})



export default connect(mapStateToProps,{editFloorplan,addGltf,getGltfOfFloor,editGltf,editGltfWithFile})(UploadGltf)



// ------------------------------------------------Previous Code---------------------------------------------------------------------------------

// 
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
// import { resetFloorGltf } from '../../feature/gltf/gltfSlice';

// import { panelColor } from "../themeColor";

// import Box from "@mui/material/Box"
// import {styled} from '@mui/material/styles'
// import { useEffect } from 'react';
// import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
// import { IconButton } from '@mui/material';
// import { Tooltip } from '@mui/material';
// import MapRoundedIcon from '@mui/icons-material/MapRounded';

// import { FormLabel } from '@mui/material';

// //import { useDispatch } from 'react-redux';

// import { useCallback } from 'react';
// import { connect , useSelector, useDispatch } from 'react-redux';
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
// import { themeColor } from "../themeColor"
// import {editFloorplan} from '../../_actions/floorplanAction'
// import { Typography } from '@mui/material';
// import { FormControl,InputLabel ,FormControlLabel,Switch} from '@mui/material';
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
// import { addGltf,getGltfOfFloor,editGltf,editGltfWithFile } from "../../feature/gltf/gltfThunk";
// import { floorplanSlice, resetConfigFloor } from '../../feature/floorplan/floorplanSlice';
// import { useMediaQuery } from '@mui/material';
// import {Dialog,DialogContent,LinearProgress} from "@mui/material"
// import { useTheme } from '@mui/material/styles';

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
// let gltfModel = null
// let ambiLight = null
// let light2 = null
// let gltfPlane = null
// let gltfSettings = {}





// const Image = styled('img')((theme)=>({
   
//     maxWidth:"100%",
//     borderRadius: "10px",
//     maxHeight: "100%"
    
//  }))










// const UploadGltf = (props)=>{
//   // const colorIndex =

//   const theme = useTheme()
//   const matches = useMediaQuery(theme.breakpoints.up("xl"))
//   const dispatch = useDispatch() 
//   const configFloor = useSelector((state)=>state.floorplan.configFloor)
//    const floorGltf = useSelector((state)=>state.gltf.floorGltf)
//     const [loaded,setLoaded]= React.useState(false)
//     const colIndex =  useSelector((state)=>state.color.colorIndex)
//     const [floorPlanUri,setFloorPlanUri] = React.useState("")
//     const [physicalDistance,setPhysicalDistance] = React.useState(0.0)
//     let [drawLine,setDrawLine] = React.useState(false)
//     const [enableRotate,setEnableRotate] =React.useState(0)
//    // const angle = useSelector((state)=>state.floorPlanImage.angle)
//     const [localX,setLocalX] = React.useState(1.0)
//     const [localY,setLocalY] = React.useState(1.0)
//     const [rotate,setRotate] = React.useState(false)
//     const [move, setMove]  = React.useState(false)
 
//     const [axis,setAxis] = React.useState(0) 
//     //const [op,setOp] =React.useState(0.8) 
//     const [opacity,setOpacity] = React.useState(0.8) 
//     const [activeStep,setActiveStep] = React.useState(0)  
    
//     const fileInput = React.useRef()
//     const [lineLength, setLineLenght] = React.useState(0.001)
//     const [angle,setAngle] = React.useState(0.0)
//     const [lineDrawn, setLineDrawn] = React.useState(false)
//     const [ambiIntensity,setAmbiIntensity] = React.useState(1.2)
//   const [dirIntensity,setDirIntensity] = React.useState(1.2)
//   const [scale,setScale]=React.useState(1)
//   const [gltf,setGltf] = React.useState(null)
//   const [floorData, setFloorData] = React.useState(null)
//   const [gltfData, setGltfData] = React.useState(null)




//     //const param = useParams()


// ///This function initializes threejs canvas for model display
//     const init3d=()=>{
//         canvas = document.querySelector("#three")
//         //console.log(canvas)
//         renderer =new THREE.WebGLRenderer({canvas})
//         //renderer.setPixelRatio(devicePixelRatio)
//         //console.log("height",canvas.offsetHeight)
//         scene = new THREE.Scene()
//         camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight,.1,1000)
        
//        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
//         //canvas.appendChild(renderer.domElement)
//         scene.background = new THREE.Color(panelColor[colIndex].p1)
   
//        /*const gui = new dat.GUI()
//         const scale=gui.addFolder("scale")
//         scale.add(control,"scaleX",0.1,3)
//         scale.add(control,"scaleY",0.1,3)
//         scale.add(control,"scaleZ",0.1,3)*/
//         orbit = new OrbitControls(camera,renderer.domElement)
//         //orbit.minDistance = 0;
//         // controls.maxDistance = 20;
//        orbit.maxPolarAngle = Math.PI / 2 * 115 / 120;
//         //orbit.enableRotate= false
//         //orbit.enableZoom=false
//         //orbit.maxPolarAngle = 4* Math.PI 
   
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


        
//        gltfPlane= new THREE.Object3D()
       
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
//         setLocalY(point.z)    
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


// ///This mouse event takes two points from user

// const documentMouseDown = useCallback((event)=>{
//    console.log("mouse event")
//     //let rayCaster = new THREE.Raycaster()
//     const mousexy = new THREE.Vector2()
//     mousexy.x = ( (event.clientX  - canvas.offsetLeft)/ renderer.domElement.width) * 2 - 1;
//     mousexy.y = - ( (event.clientY-  canvas.offsetTop)/ renderer.domElement.height) * 2 + 1
//     rayCaster.setFromCamera( mousexy, camera );
//     var intersects = rayCaster.intersectObjects([cube],false);
//    console.log(intersects.point)
//     if(intersects.length>0)
//     {
//         //console.log(intersects[0])
//         const point =  intersects[0].point
//         //point.z = 1
//         points.push(point)

//         const pointGeo = new THREE.BufferGeometry()

//         pointGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( point.toArray(), 3 ) );
//         const pointMat = new THREE.PointsMaterial({size:0.5,color:"#FF00FF"})
//         const pointObj = new THREE.Points(pointGeo,pointMat)
//         scene.add(pointObj)
//         canvasPoints.push(pointObj)
   
         

//     }

//     if(points.length === 1)
//     {
//         setLineDrawn(false)
//         canvas.addEventListener("mousemove",lineMOuseMove)
//         const lineGeo = new THREE.BufferGeometry()
//         const lineMat = new THREE.LineBasicMaterial({color : "#00FF00", linewidth: 3})
//         line = new THREE.Line(lineGeo,lineMat)
//         scene.add(line)
//     }

//     if(points.length ===2)
//     {

//         canvas.removeEventListener("mousemove",lineMOuseMove)
        
        
//         setLineDrawn(true)
       
        
//     }

//     if(points.length==3)
//     {
//        setLineDrawn(false)
//        points.shift()
//        points.shift()
//        scene.remove(canvasPoints[0])
//        scene.remove(canvasPoints[1])
//        scene.remove(line)
//        canvasPoints.shift()
//        canvasPoints.shift()

//        canvas.addEventListener("mousemove",lineMOuseMove)
//        const lineGeo = new THREE.BufferGeometry()
//        const lineMat = new THREE.LineBasicMaterial({color : "#00FF00", linewidth: 3})
//        line = new THREE.Line(lineGeo,lineMat)
//        scene.add(line)


//     }





// },[floorPlanUri])



// const deleteFloor=()=>{
//   //console.log("GLTFMODEL-->",gltfModel);
//   if(gltfModel){
//     gltfPlane.remove(gltfModel);
//     gltfModel=null
//   }
// }


// const handleFileUpload=(event)=>{
   
//   if(event.target)
//   {
    
//   const uploadedFile = event.target.files[0]
//  const fileReader = new FileReader()
//  console.log(event.target.files)
//   fileReader.onload=()=>{
//     deleteFloor()
//     modelLoading(fileReader.result);
//   } 
//  //fileReader.readAsDataURL()
//  if(uploadedFile.name.match(/\.(gltf)$/))
//     { 
//     fileReader.readAsText(uploadedFile);
//     }
//     else
//     {
//       fileReader.readAsArrayBuffer(uploadedFile);
//     }
//    setGltf(uploadedFile)
    
//  }
//   //console.log(event)
  

// }

// const  removePrevModel= ()=>{


//     if(gltfModel)
//     {  
//       gltfPlane.remove(gltfModel)
//       gltfModel.traverse(function (child) {
//         if (child.isMesh) {
//           child.geometry.dispose()
//           child.material.dispose()
//         }
//       })
  
//       gltfPlane.scale.setScalar(1)
//       gltfPlane.position.setX(0)
//       gltfPlane.position.setY(0)
//       gltfPlane.position.setZ(0)
      

//     }
// }

// const urlmodelLoader=(url,floorGltf)=>{

//   let loader = new GLTFLoader();
//   let dracoLoader = new DRACOLoader();
//   dracoLoader.setDecoderPath("../draco/");
//   loader.setDRACOLoader(dracoLoader);
//   //let ktx2 = new KTX2Loader()
//   //ktx2.setTranscoderPath("../basis/")
//   //loader.setKTX2Loader(ktx2.detectSupport(renderer))
//   //loader.setMeshoptDecoder(MeshoptDecoder)

//   loader.load(url, (gltf)=>{
//     //console.log("GLTF---->",gltf);
   
//     let mesh = gltf.scene;
//     const clips = gltf.animations || [];
//     //this.setContent(mesh,clips)
//     gltfModel=mesh
//     gltfPlane.add(mesh)
    
//     gltfPlane.position.setX(floorGltf.x)
//     gltfPlane.position.setY(floorGltf.y)
//     gltfPlane.position.setZ(floorGltf.z)
//     gltfPlane.scale.setScalar(floorGltf.scale)
//     gltfModel.rotateY(floorGltf.angle)
//     scene.add(gltfPlane)


//     gltfSettings["scale"] = floorGltf.scale
//      gltfSettings["angle"] = floorGltf.angle
//      gltfSettings["x"] = floorGltf.x
//      gltfSettings["y"] =  floorGltf.y
//      gltfSettings["z"] =  floorGltf.z


    
//   },( xhr )=> {
//      const total = parseInt(xhr.target.getResponseHeader('x-decompressed-content-length'), 10)
//     if(total-xhr.loaded <0.00001)
//     {
//       //this.props.setBackdrop(false)
//     }
//     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
//     console.log( total,"total");
//     console.log(xhr)
    
//   },(err)=>{
//     console.log("file not found")
//    // this.props.setBackdrop(false)
//     //currentModel3D = {}
//   }
//   ); 

// }


// const modelLoading=(path)=> {
//   // let scene = scene;
//    //const MANAGER = new THREE.LoadingManager();
//    removePrevModel()
//    let loader = new GLTFLoader();
//    let dracoLoader = new DRACOLoader();
//    dracoLoader.setDecoderPath("../draco/");
//    loader.setDRACOLoader(dracoLoader);
//    //let ktx2 = new KTX2Loader(MANAGER)
//    //ktx2.setTranscoderPath("three/examples/js/libs/basis/")
//    //loader.setKTX2Loader(ktx2.detectSupport(renderer))
//    loader.setMeshoptDecoder(MeshoptDecoder)

//    loader.parse(path,'',(gltf)=>{
//      //console.log("GLTF---->",gltf);
    
//      let mesh = gltf.scene;
//      const clips = gltf.animations || [];
//      //setContent(mesh,clips)
//     /* gltf.scene.traverse(function (child) {
//        if (child.isMesh) {
       
//          if (child.name === "Shadow") {
//            child.visible = false;
//            floorMesh = child;
//          }
//          //child.material.depthWrite = !child.material.transparent;
//        }
//      });*/
//      gltfModel = mesh;
//      gltfPlane.add(mesh);
//      scene.add(gltfPlane)
//      console.log(mesh)
//      //setShowProgress(false)
//      gltfSettings["scale"] = 1
//      gltfSettings["angle"] = 0
//      gltfSettings["x"] = 0
//      gltfSettings["y"] = 0
//      gltfSettings["z"] = 0



//    }); 
   

//  }


//  const ambientLight=()=> {
//   ambiLight = new THREE.AmbientLight(0xffffff, ambiIntensity);
//  let light = new THREE.HemisphereLight(0xd1d1d1, 0x080820, 0.3);
//  //let light = new THREE.HemisphereLight();
//  light2  = new THREE.DirectionalLight(0xFFFFFF,dirIntensity * Math.PI);
//  light2.position.set(0.5, 0, 0.866); // ~60º
//  light2.name = 'main_light';
//  camera.add( light2 );
//  scene.add(light);
//  scene.add(ambiLight);


// }




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
      
//         line.geometry.setFromPoints([points[0],point]) 
//     }
//     console.log(points[0])   
//     console.log(line)


// }












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




// const animate = (time)=>{
//     time*=0.001
//     if(cube)
//     {
   
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

// \
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
//       cube.position.setY(0.01)
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
//      gltfPlane.add(widthVector)
      
      
     
     




//      const cubeCenter = new THREE.Vector3(width/2,height/2,0)
     
     
      
      
      
//       cube.rotateX(-0.5 * Math.PI)
      
//       //scene.add(cube)
       
//       floorPlan = new THREE.Object3D()
//       floorPlan.add(cube)
//       //floorPlan.add(widthVector)
//       floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
      
//       if(configFloor.data["configured"])
//       {
//         cube.scale.setScalar(configFloor.data["scale"])
//         cube.rotateZ(configFloor.data["angle"])
//         cube.material.opacity =configFloor.data["opacity"]
//         floorPlan.position.setX(configFloor.data["x"])
//         floorPlan.position.setY(configFloor.data["y"])
//         floorPlan.position.setZ(configFloor.data["z"])
//         camera.position.y = configFloor.data["camera"]
//         cameraPosition =  camera.position.y
//       }
//       else
//       {
//         cameraPosition = width*1.3
//         camera.position.y = cameraPosition      
//       }
     


     
//       scene.add(floorPlan)
    
//      floorPlanProperty["scale"] = cube.scale.x
//      floorPlanProperty["angle"] = cube.rotation.z
//      floorPlanProperty["x"] = floorPlan.position.x
//      floorPlanProperty["y"] = floorPlan.position.y
//      floorPlanProperty["z"] = floorPlan.position.z
//      floorPlanProperty["opacity"]=cube.material.opacity
//      floorPlanProperty["camera"] = camera.position.y
   
//      const center = new THREE.Vector3(cube.geometry.parameters.width/2,cube.geometry.parameters.height/2,0)
//      const midPoint = cube.localToWorld(center)
//      //console.log(midPoint)
//      camera.position.set(midPoint.x,cameraPosition,midPoint.z)
//      orbit.target = midPoint
//      orbit.update()
//      //scene.add(floorPlan)

//     })
    
    
    


// }



// const marksAmbi = [
//     {
//       value: 0,
//       label: '0',
//     },
//     {
//       value: 0.5,
//       label: '0.5',
//     },
//     {
//       value: 1.0,
//       label: '1.0',
//     },
//     {
//       value: 1.5,
//       label: '1.5',
//     },
//     {
//       value: 2.0,
//       label: '2.0',
//     },
//   ];


//   const marksDir = [
//     {
//       value: 0,
//       label: '0',
//     },
//     {
//       value: 1.0,
//       label: '1.0',
//     },
//     {
//       value: 2.0,
//       label: '2.0',
//     },
//     {
//       value: 3.0,
//       label: '3.0',
//     },
//     {
//       value: 4.0,
//       label: '4.0',
//     },
//   ];  


//   const scaleDir = [
//     {
//       value: 0,
//       label: '0',
//     },
//     {
//       value: 1,
//       label: '1.0',
//     },
//     {
//       value: 2.5,
//       label: '2.5',
//     },
//     {
//       value: 4,
//       label: '4.0',
//     },
//     {
//       value: 5.0,
//       label: '5.0',
//     },
//   ];  


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
//   if(scene)
//   {
//   scene.background = new THREE.Color(panelColor[colIndex].p1)
//   }
// },[colIndex])

// ///This change the rotaton angle of floor plan
// useEffect(()=>{

// if(floorPlanUri && !isNaN(angle) && gltfModel)
// {
    
//     gltfModel.rotation.y = angle //(Math.PI /180) * angle
//     //floorPlanProperty["angle"] = cube.rotation.z

//     gltfSettings["angle"] = gltfModel.rotation.y
//     if(circle!==null)
//     {   
//         const width = cube.geometry.parameters.width
//         const x = Math.cos( angle) * width
//         const y = Math.sin( angle) * width
//        // circle.position.set(0,0,0)
        
//        // circle.rotation.z=((Math.PI /180) * angle)  
//       // circle.position.set(width,0,0)
//     }
// }


// },[angle])



// const handleAmbiChange=(e,nv)=>{
//   ambiLight.intensity = nv
//   setAmbiIntensity(nv)
  
// }
// const handleDirChange=(e,nv)=>{
//   light2.intensity = nv
//   setDirIntensity(nv)
 
// }



// // This event enables line drawing capability
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



// 
// useEffect(()=>{
//   console.log("config floor", configFloor)
//  return()=>{
//    removePLane()
//  }
//  },[])


//  useEffect(()=>{

//   if(floorData)
//   {
//     const floorplanUri = `/uploads/${floorData.data.floorplan}`
    
//     console.log("floorplanUri",floorplanUri)
//       drawPlane(floorplanUri,floorData)
//       setFloorPlanUri(floorplanUri)

//   }

// },[floorData])


// ///When cuurent floorplan object is updated it draws floor plan
// useEffect(()=>{
//   if(configFloor)
//   {
//    //const floorplanUri = `/uploads/${configFloor.data.floorplan}`
//     //console.log("floorplanUri",floorplanUri)
//     dispatch(getGltfOfFloor(configFloor.data._id))
//     //setFloorPlanUri(floorplanUri)
//     //drawPlane(floorplanUri,configFloor)
//     setFloorData(configFloor)
//     dispatch(resetConfigFloor())
    

//   }
//   return()=>{
//     //dispatch(resetConfigFloor())
//     //removePLane()
//   }

// },[configFloor])




// 
// //load gltf of floorplan
// useEffect(()=>{
//   if(floorGltf)
//   {
//     removePrevModel()
//     console.log(floorGltf)
//     urlmodelLoader(`/uploads/${floorGltf.gltf}`,floorGltf)
//     setGltf(floorGltf.gltf)
//    setAmbiIntensity(floorGltf.ambiIntensity)
//   setDirIntensity(floorGltf.dirIntensity)
//     setScale(floorGltf.scale)
//     setGltfData(floorGltf)
//     dispatch(resetFloorGltf())

//   }
//   return ()=>{
//      removePrevModel()
//   }

// },[floorGltf])



// 
// const drawRotationCircle = ()=>{

//   if(gltfModel!==null)
//   {
    
  

//   if(circle==null)
//   {
//     /*const box  = new THREE.Box3().setFromObject(gltfModel)
//     console.log(box)
//     const size = new THREE.Vector3()
//     box.getSize(size) 
//     const width = size.x
//     console.log(box)*/
//   const width = cube.geometry.parameters.width 
//   //const height =cube.geometry.parameters.height
//   //const radius = 
  
//   const circleGeo = new THREE.CircleBufferGeometry(0.3,32)
//   const circleMaterial = new THREE.MeshBasicMaterial({color : "#FF00FF" })
//   circle = new THREE.Mesh(circleGeo,circleMaterial)
  

//   circle.rotateX(-Math.PI * 0.5)
  
 
//      const x = Math.cos( angle*(Math.PI/180)) * width
//      const y = Math.sin( angle *(Math.PI/180)) * width
//       circle.position.set(x,0.25,-y)
//      //circle.position.set(width,0,0)
//       gltfPlane.add(circle)

//   }
//   else
//   {
//     circle.visible=true
//   }
//   controls = new DragControls([circle],camera,renderer.domElement)
//   controls.transformGroup=false
//   controls.addEventListener("dragstart",handleDragStart)
//   controls.addEventListener("drag", handleDrag)
//   controls.addEventListener("dragend",handleDragStop)
// }
// }






// const handleDrag = useCallback((event)=>{
//   //cube.position.set(0,0,0)
//   //const mouseMove = new THREE.Vector2()
//   //mouseMove.x = ( (event.clientX   - canvas.offsetLeft) / renderer.domElement.width) * 2 - 1;
//   //mouseMove.y = - ( (event.clientY -  canvas.offsetTop) /renderer.domElement.height ) * 2 + 1
  
  
//   //dragRay.setFromCamera(mouseMove,camera)
  
//  //dragRay.ray.intersectPlane(intersectionPlane,target)
//   //console.log("Drag Target",target)
//   const height = cube.geometry.parameters.height 
//   const width = cube.geometry.parameters.width 
 
//   //const rad = Math.sqrt((height*height) + (width * width)) 
//  //const z = event.object.position.z
 
//  const posVector= event.object.position
//  const newPos=posVector.normalize().multiplyScalar(width)
//  //event.object.position.y=0
    

//   let angleR = widthVector.angleTo(newPos)

//   /*if(Math.sign(newPos.z) > 0)
//   {
//       angleR=-angleR
//   }*/
//   if(Math.sign(newPos.z) > 0)
//     {
//         angleR=-angleR
//     }
//   //let angleD = angleR  * (180/Math.PI) 
//   console.log(angleR)
//   setAngle( angleR)
//   //dispatch(setRotationAngle(angle * (180/Math.PI)))
//  //console.log(circleMesh1)



// },[floorPlanUri])




// const handleDragStart=useCallback((event)=>{
//   //console.log(event.object.position)
//   orbit.enabled = false
//   },[floorPlanUri])
  
  
// const handleDragStop=useCallback((event)=>{
//       orbit.enabled = true
//   },[floorPlanUri])
















// 
// const  handleAxisDragStart = useCallback((event)=>{
//   orbit.enabled = false


// },[floorPlanUri])
// const handleAxisDrag=useCallback((event)=>{

//     console.log( event.object.position)
//     event.object.position.y = 0.01
// },[floorPlanUri])

// const handleAxisDragStop =useCallback((event)=>{

// event.object.position.setY(0.0)

// const axpos = event.object.position
// //const worldPos = event.object.getWorldPosition(axpos)
// //axpos.setY(0)
// //const prvx = floorPlan.position.x
// //const prvz = floorPlan.position.z 
// //floorPlan.position.setX(0)
// //floorPlan.position.setZ(0)
// //gltfPlane.position.set(axpos)
// //gltfModel.position.set(new THREE.Vector3(0,0,0))
// gltfSettings["x"] = axpos.x
// gltfSettings["y"] = 0.01//axpos.y
// gltfSettings["z"] = axpos.z

// console.log(axpos)
// orbit.enabled = true

// },[floorPlanUri])





// const setupMove= ()=>{


//   if(gltfModel)
//   {
//   if(axisControl===null)
//   {  
//   axisControl = new DragControls([gltfPlane],camera,renderer.domElement)
//   axisControl.transformGroup=true
//   }
//    else
//    {
//   axisControl.enabled=true
//    }
//   axisControl.addEventListener("dragstart",handleAxisDragStart)
//   axisControl.addEventListener("drag", handleAxisDrag)
//   axisControl.addEventListener("dragend",handleAxisDragStop)
//   //floorPlan.position.set(0,0,0)
  
  
// }
// }





// useEffect(()=>{
//     if(!loaded)
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
//     ambientLight()
//     animate()
//     console.log("3D model loaded")
//     setLoaded(true)
//     }
//     //console.log("3D model loaded")
// })





 
 
//  const handleScale = (e,nv)=>{

//   if(gltfPlane)
//   {
//     gltfSettings["scale"]=nv
//     gltfPlane.scale.setScalar(nv)
//     setScale(nv)
//   }
   
//  }
 
 
 
//   const handleNext=()=>{
      
//       setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//       console.log("active Step",activeStep)
//   }
 
//   const handleBack=()=>{
//      setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//      console.log("active Step",activeStep)
//   }
 
//   const handleRotateNext=()=>{
      
//    setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//    console.log("active Step",activeStep)
//    setEnableRotate(1)
 
//  }
 
//  const handleRotateCompleteNext=()=>{
      
//    setActiveStep((prevActiveStep)=>prevActiveStep + 1)
//    console.log("active Step",activeStep)
//    setEnableRotate(2)
//    setAxis(1)
 
//  }
 
//  const handleRotateBack=()=>{
//    setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//    setEnableRotate(-1)   
//    // dispatch(setRotationAngle(0.0))
//    //setAngle(0.0)
//    console.log("active Step",activeStep)
//  }
 
 
//  const handleAxisBack=()=>{
//    setActiveStep((prevActiveStep)=>prevActiveStep - 1)
//    console.log("active Step",activeStep)
//    setAxis(2)
//  }
//   const handleDrawLine=()=>{
//     setDrawLine(true)
//   // canvas.addEventListener("",documentMouseDown,false)
//   }
 

  

// 
// ///This method enables rotation when switch changed  
// const handleRotate=(event)=>{
//    const  checked = event.target.checked

//    if(checked)
//    {
//      drawRotationCircle()
//    }
//    else if(circle!==null)
//    {
//      circle.visible=false
//      controls.removeEventListener("dragstart",handleDragStart)
//      controls.removeEventListener("drag", handleDrag)
//      controls.removeEventListener("dragstop",handleDragStop)

//    }
  
//    setRotate(checked)

  
//   }
 

// //this method enables movement
// const handleMove = (event)=>{

//   const checked = event.target.checked
//   if(checked && gltfModel)
//   {
//     setupMove()
//   }
//   else if(gltfModel)
//   {
//     axisControl.enabled=false
//     axisControl.removeEventListener("dragstart",handleAxisDragStart)
//     axisControl.removeEventListener("drag", handleAxisDrag)
//     axisControl.removeEventListener("dragend",handleAxisDragStop)
//   }

// setMove(checked)

// }

// const handleSubmit=(event)=>{
//  event.preventDefault()
//   if (gltf) {
//     console.log(gltf,configFloor);
//     const formData = new FormData();
//     //formData.append("gltf", gltf);
//     formData.append("floorplan", floorData.data.id);
//     //formData.append("description", description);
//     console.log(ambiIntensity)
//     console.log(floorData.data.id)
//     formData.append("ambiIntensity",ambiIntensity);
    
//     formData.append("dirIntensity",dirIntensity);
//     formData.append("scale",gltfSettings["scale"])
//     formData.append("angle",gltfSettings["angle"])
//     formData.append("x",gltfSettings["x"])
//     formData.append("y",gltfSettings["y"])
//     formData.append("z",gltfSettings["z"])
//     console.log(formData.get("floorplan"))
//     console.log(formData.get("dirIntensity"))
//     console.log(formData.get("ambiIntensity"))
//     console.log(formData.get("scale"))

//     if(!gltfData)
//     {
//     formData.append("gltf", gltf) 
//     dispatch(addGltf(formData));
//     }
//     else if(gltfData.gltf !== gltf)
//     {
//       formData.append("gltf", gltf)
//       dispatch(editGltfWithFile({formData:formData,id: gltfData._id}))
//     }else if(gltfData.gltf === gltf)
//     {
//       dispatch(editGltf({formData:formData,id:gltfData._id}))
//     }
   
//   } else {
//     console.log("Please select a 3D file to add.");
//   }

// }



//  const handleAngleChange = (event)=>{
//    let val = event.target.value
//     if(isNaN(val))
//     {
//         setAngle(0.0)
//     }
//     else{
    
//        //val = Number.parseFloat(val).toFixed(3)
//         setAngle(val)

//     }
//  }



   
//     return <>
//      <Dialog
//         open= {!matches}
//         fullScreen
//       >
//         <DialogContent>
         
        
//         <LinearProgress/>
//         <NoDisplay/>
        

//         </DialogContent>
     

//       </Dialog>

//     <Box
//     component="form"
//     onSubmit = {handleSubmit}
//     sx={{
//         display:"grid",
//         gridTemplateColumns : "3fr 1fr",
//         gridTemplateRows:"1fr",
//         gap:"0px 5px",
//         gridTemplateAreas : `
//         "map control"`,
//         height:"100%"
    
//     }}>
          
           
//            <Box   sx = {{gridArea : "map", bgcolor:panelColor[colIndex].p1,
//                        display:"grid",
//                        gridTemplateColumns : 'repeat(12,1fr)',
//                        gridTemplateRows: 'repeat(12,1fr)'  
//         }}>    
//             <Box sx = {{gridRow:"1/13", gridColumn:"1/13"}}>   
//                 <Box component="canvas" sx = {{height:"99.95%", width:"99.95%"}} id="three">
//                  </Box>   
                 
//             </Box>  
//               <Box sx = {{gridRow : "11", gridColumn:"2/4",alignItems:"center", justifyItems:"center", gap:"2" }}>
//               <Tooltip title="Current mouse pointer position" arrow>                   
//                   <FormLabel sx={{border: "2px solid"}}>X:{Number.parseFloat(localX).toFixed(3)} | Y:{Number.parseFloat(localY).toFixed(3) } </FormLabel>
//                 </Tooltip>  
//               </Box>
//               <Box sx = {{gridRow : "11", gridColumn :"11/12"}}>
//                   <Tooltip title="Center on coordinate" arrow>
//                      <IconButton onClick={resetLocation} size="large"><MyLocationRoundedIcon/></IconButton>
//                    </Tooltip> 

//                     <Tooltip title="Center on Floorplan" arrow>
//                      <IconButton size="large" onClick={centerOnFloorPlan}><MapRoundedIcon/></IconButton>
//                    </Tooltip>  
//               </Box> 
//             </Box> 
//              <Box  sx={{gridArea:"control",bgcolor:panelColor[colIndex].p2,
//                         display:"grid",
//                         gridTemplateColumns : "0.5fr 5fr",
//                         gridTemplateRows : "0.5fr 5fr",
//                         gridTemplateAreas : `" . . "
//                                              " . stepArea"`
//              }}>
               
//              <Box sx = {{gridArea:"stepArea",
//                           display:"grid",
//                           gridTemplateColumns : 'repeat(15,1fr)',
//                           gridTemplateRows:"repeat(20,1fr)"}}>
            
//                       <Box sx ={{gridRow:"2/3",gridColumn:"3/12" }}>
//                            <Input type="file"  ref={fileInput} onChange={handleFileUpload}/>
//                       </Box>

//                <FormControl
//                  variant="standard"
//                  id="ambiLight"
//                  sx={{ m: 1,gridRow :"5/7",gridColumn:"1/15"}}
//                  size="small">      
//                 <InputLabel shrink htmlFor="ambient-light">
//                             Ambient Light
//                  </InputLabel> 
//                <Slider 
//                value={ambiIntensity} 
//                onChange={handleAmbiChange}
//                id="ambient-light"
//                valueLabelDisplay="auto"
//                aria-labelledby="ambient-light"
//                step={0.01}
//                marks= {marksAmbi}
//                min={0}
//                max={2}
//                />
//                </FormControl>


              
//                <FormControl
//                  variant="standard"
//                  id="dirLight"
//                  sx={{ m: 1,gridRow :"8/10",gridColumn:"1/15"}}
//                  size="small">      
//                 <InputLabel shrink htmlFor="direct-light">
//                             Direct Light
//                  </InputLabel>     
//                <Slider 
//                value={dirIntensity} 
//                 onChange={handleDirChange}
//                 id="direct-light"
//                 valueLabelDisplay="auto"
//                 aria-labelledby="direct-light"
//                 step={0.01}
//                 marks= {marksDir}
//                 min={0}
//                 max={4}
//                />
//                </FormControl>
        
//                <FormControl
//                  variant="standard"
//                  id="mScale"
//                  sx={{ m: 1,gridRow :"10/12",gridColumn:"1/15"}}
//                  size="small">      
//                 <InputLabel shrink htmlFor="model-scale">
//                             Model Scale
//                  </InputLabel>     
//                <Slider 
//                value={scale} 
//                 onChange={handleScale}
//                 id="model-scale"
//                 valueLabelDisplay="auto"
//                 aria-labelledby="model-scale"
//                 step={0.001}
//                 marks= {scaleDir}
//                 min={0}
//                 max={5}
//                />
//                </FormControl>

//                <FormControl variant="standard" sx={{ m: 1,gridRow :"13/15",gridColumn:"1/6"}}>
//                 <FormControlLabel
//                   control={
//                   <Switch 
//                   checked={rotate} 
//                   onChange={handleRotate} 
//                   name="rotate" />
//                      }
//                  label="Rotate"
//                 />
//                </FormControl>  
               
//                <FormControl variant="standard" sx={{ m: 1,gridRow :"13/15",gridColumn:"7/15"}}>
//                 <FormControlLabel
//                   control={
//                   <Switch 
//                   checked={move} 
//                   onChange={handleMove} 
//                   name="move" />
//                      }
//                  label="Move"
//                 />
//                </FormControl>  
        
//                <Button  variant="contained" type="submit"  
//                sx = {{gridRow:"15/16", gridColumn:"7/10" }} 
//                //onClick={handleSubmit}   
//                >Save</Button>


               
//               </Box>
               
//              </Box> 
//          <Outlet/>    
//      </Box>
//     </>;

// }

// const mapStateToProps=(state)=>({
//   colorIndex:state.color.colorIndex,
//   configFloor : state.floorplan.configFloor ,
//   floorGltf : state.gltf.floorGltf
// })



// export default connect(mapStateToProps,{editFloorplan,addGltf,getGltfOfFloor,editGltf,editGltfWithFile})(UploadGltf)

