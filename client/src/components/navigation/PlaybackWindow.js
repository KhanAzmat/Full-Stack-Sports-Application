import React, { useCallback, useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { CloseRounded } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Container,
  duration,
  Fab,
  FormControlLabel,
  keyframes,
  Stack,
  Typography,
} from "@mui/material";
import * as THREE from "three";
import ObjectInfoCard from "../UI/InfoCard.js";
//import { tagPos } from "../../_actions/tagPosAction";
import { withStyles } from "@mui/styles";
import {
  hideGeofenceCard,
  showGeofenceInfo,
} from "../../feature/geofence/geofenceSlice.js";
import { hideInfoCard } from "../../feature/linkedTag/linkedTagSlice.js";
import { getLinkedTagbyTag } from "../../feature/linkedTag/linkedTagThunk.js";
import { clearLapList, removeTagPicked, setDisplayCharts, setTagDetails } from "../../feature/linkedTagPlayer/linkedTagPlayerSlice.js"; 

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DragControls } from "three/examples/jsm/controls/DragControls";

import { TweenMax } from "three/examples/jsm/tweenMax";

import { FloorMenu } from "../UI/Menu.js";


import axios from "axios";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import GeofenceInfoCard from "../UI/geoFenceInfo.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import Close from "@mui/icons-material/Close";
import { resetAnchor } from "../../feature/anchor/anchorSlice.js";import SearchIcon from "@mui/icons-material/Search";
import { Slide, Drawer, Slider, Box, Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import {
  hideFloorMenu,
  resetDisplayFloor,
} from "../../feature/floorplan/floorplanSlice.js";
import { SelectionSwitch } from "../UI/SelectionSwith.js";
import { IOSSwitch } from "../UI/Switch.js";

//import { Collapse } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Backdrop, CircularProgress } from "@mui/material";
import { setLoaded3D } from "../../feature/auth/authSlice.js";
import { getFloorplans } from "../../feature/floorplan/floorplanThunk.js";
import MenuIcon from '@mui/icons-material/Menu';
import { getGeofencesByFloor } from "../../feature/geofence/geofenceThunk.js";
import {
  resetDisplayFloorGtltf,
  setBackdrop,
} from "../../feature/gltf/gltfSlice.js";
import { getGltfOfDisplayFloor } from "../../feature/gltf/gltfThunk.js";
import { setAddingTag, setTagData } from "../../feature/tag/tagSlice.js";
import { addTag as dbAddTag } from "../../feature/tag/tagThunk.js";
import { panelColor, themeColor } from "../themeColor.js";
import { environments } from "../three/environment/index";
import { createBackground } from "../three/three-vignette.js";
import LayersFab from "./LayersFab.js";
import LayersDrawer from "./LayersDrawer.js";

import {getAnchorsOfFloor} from "../../feature/anchor/anchorThunk.js"
import { setAlerts } from "../../_actions/alertAction.js"; 
import TagCard from "./tagCard.js";
import { getAllLaps, savePlaybackData } from "../../feature/linkedTagPlayer/linkedTagPlayerThunk.js";
import LapList from "./LapList.js";
import CancelIcon from '@mui/icons-material/Cancel';
import { useHistory, useNavigate } from 'react-router-dom';
import {setCurrentFloorIndex ,getFloorplansForCurrentBuilding,setCurrentFloorPlanId } from '../../feature/floorplan/floorplanSlice'
import { getDisplayFloorplan } from '../../feature/floorplan/floorplanThunk';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DatePickers from "./DatePickers.js";
import { toggleView } from "../../feature/layerSlice.js";


let checkAnim = 0

const style = (theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },

  icon: {
    position: "absolute",
    right: "5px",
    top: "2px",
  },
  paper: {
    padding: "2px 5px",
    display: "flex",
    alignItems: "center",
    width: 400,
    borderRadius: "30px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 4,
  },
  divider: {
    height: 35,
    marginRight: "1px",
    marginLeft: "1px",
    width: 4,
  },
  searchDiv: {
    height: 28,
    margin: 4,
    width: 4,
  },

  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(0),
    fill: theme.palette.primary.contrastText,
  },
  menuPaper: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(6),
    height: 55,

    borderRadius: "21px",
    opacity: "75%",
  },
  menuContainer: {
    display: "flex",
  },
  alert: {
    height: 70,
    width: 500,
    borderRadius: "30px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  
});


const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

let currentModel3D = {};
let IS_IOS;
let ambiLight = null;
let light2 = null;
var canvasLoaded = false;
let convertData, forDataGet;
var scene,
  container,
  perspCamera,
  renderer,
  controls,
  dragControls,
  gridHelper,
  measureGrid,
  topCam,
  currentCamera;
var pmremGenerator = null;
var vignette = null;
var axesDiv = null;
var axesCamera, axesRenderer, axesScene, axesCorner;

let labelRenderer;
let anchorStore = [];
let targetMesh,
  floorMesh = "",
  gltfModel = null;
let fov = 70,
  startPosition = new THREE.Vector3(25, 50, 25);
let storeTag = [];
let storeTagObj = [];
///Change geofence store to an object. key willbe geofence id and value will be geofenceid
let geoFenceStore = {};
let raycaster = new THREE.Raycaster(),
  mouse = new THREE.Vector2(),
  SELECTED;
let previousTagSelected, _Detect;
let content = null;
let prevColorIdx =0
let controlsTop =null
let camAspect = null
let gltfPlane = null
let floorPlan = null
let cube = null
let cameraPosition = 0.0
let widthVector=null
let floorPlanCenter= null
let geofenceTrack = {}
let frustumSize = null
let aspect =null
let anchorImage
let tagRef=null
let tagMap = {}
let tagTexture = null
let turn =0
let zAxis = true
let configFloor = null
let animateRef


const MAP_NAMES = [
  "map",
  "aoMap",
  "emissiveMap",
  "glossinessMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap",
  "specularMap",
];


const PlaybackWindow = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [cont, setCont] = React.useState("om");
  const [state, setState] = React.useState({
    tagData: "",
    geoFenceData: null,
    zValToggle: true,
    gridVisbile: true,
    isGeofenceSelected: false,
    selectedGeofenceDescription: "",
    selectedGeofenceName: "",
    gltfPath: "",

    floorId: "",
    floor: "",
    client: null,
    showCard: null,
    expanded: true,
    view3d: true,
    showMenu: false,
    alertType: "",
    alertMessage: "",
    backdrop: false,
    bgColor1: "#ffffff",
    bgColor2: "#353535",
    environment: environments[1].name,

    openDrawer: true,
    //
    px: 0,
    py: 0,
    chrt : null,
    chrt_bar : null,
    chrt_bar_jump : null
  });


const mqttToken = useSelector((state)=>state.auth.token)
const showCard = useSelector((state)=>state.linkedTag.showCard)
const showGeofenceCard = useSelector((state)=>state.geofence.showGeofenceCard)
const floorMenu = useSelector((state)=>state.floorplan.floorMenu)
const user = useSelector((state)=>state.auth.user && state.auth.user.data && state.auth.user.data.name)
const role = useSelector((state)=>state.auth.user && state.auth.user.data && state.auth.user.data.role)
const showBackdrop = useSelector((state)=>state.gltf.showBackdrop)
const loaded3D = useSelector((state)=>state.auth.loaded3D)
const colorIndex = useSelector((state)=>state.color.colorIndex)
const currentFloor = useSelector((state)=>state.floorplan.displayFloor)
const floorGeofence = useSelector((state)=>state.geofence.floorGeofence)
const floorGltf = useSelector((state)=>state.gltf.displayFloorGltf)
const addingTag = useSelector((state)=>state.tag.addingTag)
const anchorConfig = useSelector((state)=>state.anchor.anchor)

const zValToggle = useSelector(state=>state.layer.zValToggle)
const view3d = useSelector(state=>state.layer.view3d)
// const view3d = false
const gridVisible = useSelector(state=>state.layer.gridVisible)

const tagPicked = useSelector(state=>state.linkedTagPlayer.tagPicked)
const tagDetails = useSelector(state=>state.linkedTagPlayer.tagDetails)
const saveTagData = useSelector(state=>state.linkedTagPlayer.saveTagData)
const linkedPlayers = useSelector(state=>state.linkedTagPlayer.linkedTagPlayers)
const time_start = useSelector(state=>state.linkedTagPlayer.time_start)
const allLaps = useSelector(state=>state.linkedTagPlayer.laps)
const playbackData = useSelector(state=>state.linkedTagPlayer.playbackData)
const floorPlans = useSelector((state)=>state.floorplan.floorplans)
const floorIndex = useSelector((state)=>state.floorplan.floorPlanIdx) 
const playersForPlayback = useSelector(state=>state.linkedTagPlayer.playersForPlayback)
const displayCharts = useSelector(state=>state.linkedTagPlayer.displayCharts)
const [count, setCount] = useState(1)
const [tagPosition, setTagPosition] = React.useState({})
const [sportsCard, setSportsCard] = React.useState(false)
const [tagCardDetails, setTagCardDetails] = React.useState({})
const [linkedTags, setLinkedTags] = React.useState([])
const [dataArr, setDataArr] = React.useState([]);
const [showLapList,setShowLapList] = React.useState(false)
const [counter, setCounter] = React.useState(0)
const [isDisabled, setIsDisabled] = React.useState(true)
const [duration, setDuration] = React.useState(0)
const [value, setValue] = React.useState(0)
const [stopPlayback, setStopPlayback] = React.useState(false)
const [timeOutIds, setTimeOutIds] = React.useState([])
const [minTs, setMinTs] = React.useState(0)
const [play, setPlay] = React.useState(true)
const [pause, setpause] = React.useState(false)
const [playPause, setPlayPause] = React.useState(true)
const [minValue, setMinValue] = useState(0)
const width = useSelector(state=>state.dimension.width)
const height = useSelector(state=>state.dimension.height)
useEffect(()=>{
  if(playbackData && playbackData.length>0){
    console.log('Playback Data', playbackData)
    // setValue(playbackData[0].ts)
    setMinValue(playbackData[0].ts)
  }
    
},
[playbackData])

useEffect(()=>{
  if(allLaps.length>0){
    setShowLapList(true)
  }
  else setShowLapList(false)
}
,[allLaps])

useEffect(()=>{
  if(tagPicked && (Date.now() - time_start) > 5000){
    dispatch(removeTagPicked())
    setTagCardDetails({})
    setSportsCard(false)
  }
  if(Object.keys(tagPosition).length > 0 && tagPosition.id.toUpperCase() === tagPicked){
    setTagCardDetails({posX: tagPosition.x, posY:tagPosition.y, stepCount : tagPosition.step_count, jumpCount : tagPosition.jump_count, speed : tagPosition.speed})
    if(!sportsCard)
      setSportsCard(true)
  }
},
[tagPosition, tagPicked])

useEffect(()=>{
  const tags = linkedPlayers.map(el=>el.tag.tagId.toLowerCase())
  setLinkedTags(tags)
}, [linkedPlayers])

useEffect(()=>{
  if(saveTagData && linkedTags.length>0){
    if(linkedTags.includes(tagPosition.id)){
      const player = linkedPlayers.find(el=>el.tag.tagId.toLowerCase()===tagPosition.id)
      let data = [
        player.player.name,
        player.player.initials,
        tagPosition.ox,
        tagPosition.oy,
        tagPosition.oz,
        tagPosition.step_count, 
        tagPosition.jump_count,
        tagPosition.speed,
        tagPosition.ts
      ]
      setDataArr(prev=>[...prev, data])
    }
  }
  
},
[saveTagData, tagPosition, linkedTags])

useEffect(()=>{
  if(saveTagData === false && dataArr.length>0){
    dispatch(savePlaybackData(dataArr))
    setDataArr([])
  }
},
[saveTagData])


//Linking DrawerCard to old methods:
useEffect(()=>{
  handleZAxis()
},[zValToggle])

useEffect(()=>{
  if(controls)
  handleView()
},[view3d])

useEffect(()=>{
  if(gridHelper)
  gridChange()
},[gridVisible])

  
useEffect(()=>{
  if(currentFloor)
  {


    // if(state.client && storeTagObj && state.floor)
    // {
    //   let msg = {type:"unsubscribe"}
    
    // state.client.postMessage(JSON.stringify(msg))
    // state.client.removeEventListener("message",processMessage)

    // }
    console.log(currentFloor)
    deleteFloorandTags()
   const floorplanUri = `/uploads/${currentFloor.data.floorplan}`
    console.log("floorplanUri",floorplanUri)
    dispatch(getGltfOfDisplayFloor(currentFloor.data._id))
    dispatch(getGeofencesByFloor(currentFloor.data._id))
    dispatch(getAnchorsOfFloor(currentFloor.data._id))
    drawPlane(floorplanUri)
    configFloor = currentFloor
    dispatch(resetDisplayFloor())
    
    setState(prevState=>{return {...prevState, floor:configFloor.data.floor,floorId:configFloor.data._id}})

    tagMap= {}
  }
  return ()=>{
     dispatch(resetDisplayFloor())
  }

},[currentFloor])



// useEffect(()=>{

//   if(anchorConfig && anchorConfig.length > 0)
//   {
//     const data = anchorConfig[0]
//     const hostname = data["hostname"]
//     const host = window.location.hostname
//     console.log(window.location)
//     let conn = {type:"subscribe", host:host, hostname:hostname,port:48080, username: "tag" , password:mqttToken, floor:state.floor, floorId : state.floorId}
//     state.client.postMessage(JSON.stringify(conn))
//     state.client.addEventListener("message",processMessage)
//     dispatch(resetAnchor())
//   }



// },[anchorConfig])


//load gltf of floorplan
useEffect(()=>{
  if(floorGltf)
  {
  modelLoading(`/uploads/${floorGltf.gltf}`)
  }

},[floorGltf])






  ////This method Loads geofences of selected floor
  // useEffect(() => {
  //   console.log("New geofence created......");
  //   console.log(floorGeofence);

  //   //geofenceCleanup()
  //   if (floorGeofence.length > 0) {
  //     for (let i = 0; i < floorGeofence.length; ++i) {
  //       addGeoFence(floorGeofence[i]);
  //     }
  //   }
  // }, [floorGeofence]);


  const onClose = ()=>{
    // dispatch(setTagDetails({}))
    dispatch(removeTagPicked())
  }

  const gridChange = () => {
    setState({
      ...state,
      gridVisbile: gridVisible,
    });
    if (state.gridVisbile) {
      gridHelper.visible = false;
      //measureGrid.visible = false;
      //floorMesh.visible = true;
    } else {
      gridHelper.visible = true;
      //measureGrid.visible = true;
      // floorMesh.visible = false;
    }
  };

  const setAlert = (alertType, message) => {
    setState({ alertType: alertType, alertMessage: message });
  };

 


  const init3D = () => {
    console.log('Inside init3D()')
    anchorImage = new Image();
    anchorImage.src = "/circle_arrow.svg";
    //anchorImage.src="/point.svg"
    container = document.getElementById("three");
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
    scene = new THREE.Scene();
    camAspect = container.offsetWidth / container.offsetHeight;

    perspCamera = new THREE.PerspectiveCamera(
      fov,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    perspCamera.position.set(startPosition.x, startPosition.y, startPosition.z);

    frustumSize = 20;
    aspect = container.clientWidth / container.clientHeight;
    topCam = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    );
    //renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    topCam.position.set(0, 10, 0);
    controlsTop = new OrbitControls(topCam, renderer.domElement);
    controlsTop.enableRotate = false;
    //orbit.enableZoom=false
    controlsTop.minDistance = 60;
    controlsTop.maxDistance = 800;

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xcccccc);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    renderer.toneMappingExposure = 1.0;
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    vignette = createBackground({
      aspect: perspCamera.aspect,
      grainScale: IS_IOS ? 0 : 0.001, // mattdesl/three-vignette-background#1
      colors: [panelColor[colorIndex].p1, panelColor[colorIndex].p2],
    });

    vignette.name = "Vignette";
    vignette.renderOrder = -1;

    renderer.domElement.addEventListener(
      "pointerdown",
      pickTag.bind(this),
      true
    );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);

    //this.addAxesHelper()
    scene.add(vignette);

    controls = new OrbitControls(perspCamera, renderer.domElement);

    controls.maxPolarAngle = ((Math.PI / 2) * 115) / 120;
    controls.update();
    //this.gridPlane();

    gridHelper = new THREE.GridHelper(10000, 10000);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25;
    scene.add(gridHelper);
    scene.add(perspCamera);

    dragControls = new DragControls(
      anchorStore,
      perspCamera,
      renderer.domElement
    );

    gltfPlane = new THREE.Object3D();
    scene.add(gltfPlane);

    floorPlan = new THREE.Object3D();
    scene.add(floorPlan);

    // currentCamera = perspCamera;
    // controls.enabled = true;
    // controlsTop.enabled = false;
    currentCamera = topCam;
    controls.enabled = false;
    controlsTop.enabled = true;
  };


  ///This method tracks theme color change

  useEffect(() => {
    if (vignette) {
      vignette.style({
        colors: [panelColor[colorIndex].p1, panelColor[colorIndex].p2],
      });
    }
  }, [colorIndex]);

  const pickTag = (event) => {
    event.preventDefault();
    console.log("Pick tag called");
    scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.info === "geoFence") {
          child.material.opacity = child.fenceType=="Location"? 0.05 : 0.3;
          child.material.wireframe = false;
        }
      }
    });
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, currentCamera);
    let intersects = raycaster.intersectObjects(storeTagObj, true);
    console.log(intersects);
    if (intersects.length > 0) {
      dispatch(hideInfoCard());
      dispatch(hideGeofenceCard());
      if (previousTagSelected) {
        previousTagSelected.children[1].visible = false;
      }
      SELECTED = intersects[0].object;
      console.log(">>>>>>>>Children", SELECTED.type);

      if (SELECTED.info === "Tag") {
        console.log("tag Name>> ", SELECTED.name);
        //SELECTED.children[0].visible=false

        SELECTED.children[1].visible = true;
        console.log(SELECTED.name.toUpperCase())
        dispatch(getLinkedTagbyTag(SELECTED.name.toUpperCase()));

        previousTagSelected = SELECTED;
        // this.setState({...this.state, tagInfo: true });
      } else if (SELECTED.type === "Sprite") {
        console.log(SELECTED.parent.name);
        //SELECTED.visible =false

        dispatch(getLinkedTagbyTag(SELECTED.parent.name.toUpperCase()));

        SELECTED.parent.children[1].visible = true;
        previousTagSelected = SELECTED.parent;
        //this.setState({ ...this.state,tagInfo: true });
      }


      else if (SELECTED.type === "Mesh") {
        if (SELECTED.info === "geoFence") {
          SELECTED.material.wireframe = true;

          const obj = {
            selectedGeofenceName: SELECTED.name,
            selectedGeofenceDescription: SELECTED.description,
          };
          dispatch(showGeofenceInfo(obj));
        }

      }
    }
  };

  const resizeRendererToDisplaySize = () => {
    const canvas = renderer.domElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      console.log('need resize')
      renderer.setSize(width, height, false);
    }
    return needResize;
  };

  const ambientLight = () => {
    ambiLight = new THREE.AmbientLight(0xffffff, 0.3);
    let light = new THREE.HemisphereLight();
    //let light = new THREE.HemisphereLight();
    light2 = new THREE.DirectionalLight(0xffffff, 1.9);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = "main_light";
    perspCamera.add(light2);
    //scene.add(light);
    scene.add(ambiLight);
  };


  const createCanvas = () => {
    var canvas = document.createElement("canvas");
    canvas.height = 112;
    canvas.width = 112;
    var ctx = canvas.getContext("2d");

    console.log(anchorImage);
    ctx.drawImage(anchorImage, 13, 12, 84, 88);
    return canvas;
  };

const expand = keyframes`
from {
  transform: scale(0.9);
}
to {
  transform: scale(1.1);
}`;


  ///This method creates a point
  const getCilcle = () => {
    const texture = new THREE.CanvasTexture(
      tagTexture ? tagTexture : createCanvas()
    );

    let plane = new THREE.CircleGeometry(0.2, 32);
    let planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
    });

    const point = new THREE.Mesh(plane, planeMat);

    //point.position.setY(-0.01)
    //widthVector = new THREE.Vector3(width,0,0)

    point.rotateX(-0.5 * Math.PI);
    point.rotateZ(-0.25 * Math.PI);

    return point;
  };

  const addTag = (x, y, z, tag) => {
    let RAD = 0.1;
    let sphereGeo = new THREE.SphereGeometry(RAD, 32, 32);
    let sphereMat = new THREE.MeshPhongMaterial({
      color: 0x00b330,
      //wireframe:true,
      combine: THREE.MixOperation,
      side: THREE.DoubleSide,
    });
    let tagObj = new THREE.Mesh(sphereGeo, sphereMat);
    tagObj.name = tag.player;
    tagObj.info = "Tag";
    if (tag.name) {
      tagObj.assetName = tag.name;
    }
    //  scene.add(tagObj);
    tagObj.position.set(y, z, x);
    console.log('Tag Position : ',x,'\t',y,'\t','z')

    if ("yaw" in tag) {
      tagObj.rotation.y = 2 * Math.PI * (tag["yaw"] / 360);
    }
    const boundCircle = getCilcle();

    tagObj.add(boundCircle);
    //scene.add(boundCircle)
    let selectCircleGeo = new THREE.CircleGeometry(0.3, 18);
    let selectCircleMat = new THREE.MeshBasicMaterial({
      color: 0x61faa4,
      transparent: true,
      opacity: 0.5,
      combine: THREE.MixOperation,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
    });
    let selectCircleMesh = new THREE.Mesh(selectCircleGeo, selectCircleMat);
    selectCircleMesh.name = tag.player + "-selectCircle";
    selectCircleMesh.rotation.x = Math.PI / 2;
    selectCircleMesh.visible = false;
    tagObj.add(selectCircleMesh);

    // Display "geoFenceCircleMesh" while entering GEOFENCE
    let geoFenceCircleGeo = new THREE.CircleGeometry(0.4, 18);
    let geoFenceCircleMat = new THREE.MeshBasicMaterial({
      color: 0xfc0303,
      transparent: true,
      opacity: 0.25,
      combine: THREE.MixOperation,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
    });
    let geoFenceCircleMesh = new THREE.Mesh(
      geoFenceCircleGeo,
      geoFenceCircleMat
    );
    geoFenceCircleMesh.name = tag.player + "-geoFenceCircle";
    geoFenceCircleMesh.rotation.x = Math.PI / 2;
    tagObj.add(geoFenceCircleMesh);
    // tagObj.scale.setScalar(cube.scale.x * 0.75);
    geoFenceCircleMesh.visible = false;
    storeTagObj.push(tagObj);
    tagRef = tagObj;

    return tagObj;
  };


  // BUILDING LOAD 3D

  const modelLoading = (path) => {

    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("../draco/");
    loader.setDRACOLoader(dracoLoader);

    dispatch(setBackdrop(true));
    loader.load(
      `${path}`,
      (gltf) => {
        //console.log("GLTF---->",gltf);

        let mesh = gltf.scene;
        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            if (child.name === "Shadow") {
              child.visible = false;
              // floorMesh = child;
            }
          }
        });
        console.log(mesh);
        const clips = gltf.animations || [];
        setContent(mesh, clips);
        ambiLight.intensity = 3.05; //props.floorGltf.ambiIntensity
        light2.intensity = 1.03; //props.floorGltf.dirIntensity
        //console.log(this.props.configFloor, this.props.floorGltf)
        dispatch(setBackdrop(false));
      },
      (xhr) => {
        const total = parseInt(
          xhr.target.getResponseHeader("x-decompressed-content-length"),
          10
        );
        if (total - xhr.loaded < 0.00001) {
          //this.props.setBackdrop(false)
        }
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        console.log(total, "total");
        console.log(xhr);
      },
      (err) => {
        console.log("file not found");
        dispatch(setBackdrop(false));
        currentModel3D = {};
      }
    );
  };

  const setContent = (object, clips) => {
    clear();

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    controls.reset();

    controls.maxDistance = size * 10;
    perspCamera.near = size / 100;
    perspCamera.far = size * 100;
    perspCamera.updateProjectionMatrix();

    perspCamera.position.copy(center);
    perspCamera.position.x += size / 2.0;
    perspCamera.position.y += size / 2.0;
    perspCamera.position.z += size / 2.0;
    perspCamera.lookAt(center);

    currentModel3D["near"] = perspCamera.near;
    currentModel3D["far"] = perspCamera.far;
    currentModel3D["maxDistance"] = controls.maxDistance;
    currentModel3D["x"] = perspCamera.position.x;
    currentModel3D["y"] = perspCamera.position.y;
    currentModel3D["z"] = perspCamera.position.z;
    currentModel3D["center"] = center;

    controls.saveState();
    gltfModel = object;
    gltfPlane.add(object);
    //scene.add(mesh);

    if (floorGltf) {
      object.rotateY(floorGltf.angle);
      gltfPlane.scale.setScalar(floorGltf.scale);
      gltfPlane.position.setX(floorGltf.x);
      gltfPlane.position.setY(floorGltf.y);
      gltfPlane.position.setZ(floorGltf.z);
    }
    //scene.add(object);
    content = object;

    //this.state.addLights = true;

    content.traverse((node) => {
      if (node.isLight) {

      } else if (node.isMesh) {
        // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
        node.material.depthWrite = !node.material.transparent;
      }
    });


  };


  //This function animates tag updates tag position using TweenMax
  const tagAnim = (tag, xVal, yVal, zVal) => {
    TweenMax.to(tag.position,1, {
      x: xVal,
      y: zVal,
      z: yVal,
      onUpdate: function () {      
      },
    });
  };


  const topView = () => {
    currentCamera = topCam;
    controls.enabled = false;
    controlsTop.enabled = true;
    console.log('Inside Top View')
  };

  const perspView = () => {
    console.log('Inside Persview')
    currentCamera = perspCamera;
    controls.enabled = true;
    controlsTop.enabled = false;

  };


//UPDATING THE TAG -
const updateTag=(tagData)=> {

  if (tagData === "" || tagData === "undefined") {
    console.log("No data");
  } else {  
    convertData = JSON.parse(JSON.stringify(tagData));
    forDataGet = convertData;
  //  dispatch(setTagDetails(forDataGet))
    
    var employeeObject = scene.getObjectByName(forDataGet.player);
    // console.log(employeeObject); 
    
    if (employeeObject) {
      // var width = window.innerWidth, height = window.innerHeight;
      // var widthHalf = width / 2, heightHalf = height / 2;
      
      // var pos = employeeObject.position.clone();
      // pos.project(currentCamera);
      // pos.x = ( pos.x * widthHalf ) + widthHalf;
      // pos.y = - ( pos.y * heightHalf ) + heightHalf;

      // if('step_count' in forDataGet && 'jump_count' in forDataGet)
      // {

      //   setTagPosition({x : pos.x, y: pos.y,  id : forDataGet.id, step_count : forDataGet.step_count, jump_count : forDataGet.jump_count, speed : forDataGet.speed, ox : forDataGet.x, oy : forDataGet.y, oz : forDataGet.z, ts : forDataGet.ts})
      // }

          if("yaw" in forDataGet)
           {
             let angleToRad=0
             turn = (turn +1) %10
             if(turn % 2 ===0 )    
             {
              angleToRad = 2*Math.PI *(15/360)
             }
             else{
                angleToRad = 2*Math.PI *(355/360)
               }

           }

          if (
              forDataGet.y == NaN ||
              forDataGet.y == undefined ||
              forDataGet.z == NaN ||
              forDataGet.z == undefined ||
              forDataGet.x == NaN ||
              forDataGet.x == undefined
            ) {

           } else {
        (!zAxis) ? tagAnim(employeeObject, forDataGet.x, -forDataGet.y, 1.75) : tagAnim(employeeObject, forDataGet.x, -forDataGet.y, forDataGet.z
          );
        //FOR GROFENCE
          //      if (forDataGet.level === 3) {
          //             employeeObject.children[2].visible = true;
          //      } else{
          //             employeeObject.children[2].visible = false;
          //     } //NEW GROFENCE
        
          //     if(forDataGet.geofenceid !=="null")
          //      {
          //        if(forDataGet.zones===2)
          //      { 
          //        if(forDataGet.geofenceid in geofenceTrack)
          //       {
          //           if(forDataGet.level === 0)
          //           {
                   
          //          ///Check tag is returning back from warning zone
          //          if(geofenceTrack[forDataGet.geofenceid]["l1"].has(forDataGet.id))
          //          {
          //           geofenceTrack[forDataGet.geofenceid]["l1"].delete(forDataGet.id)
          //          }
          //          }
          //          else if(forDataGet.level === 1)
          //          {
                
          //           if(!geofenceTrack[forDataGet.geofenceid]["l1"].has(forDataGet.id))
          //            {
          //               geofenceTrack[forDataGet.geofenceid]["l1"].add(forDataGet.id)
          //             }///Check whether tag is returning back from denger zone
          //             else if(geofenceTrack[forDataGet.geofenceid]["l2"].has(forDataGet.id))
          //             {
          //               geofenceTrack[forDataGet.geofenceid]["l2"].delete(forDataGet.id)
          //               }
          //           }
          //          else if(forDataGet.level === 2)
          //           {

          //            if(!geofenceTrack[forDataGet.geofenceid]["l2"].has(forDataGet.id))
          //             {
          //               geofenceTrack[forDataGet.geofenceid]["l2"].add(forDataGet.id)

          //             } //chek tag is returning from geofence
          //            else if(geofenceTrack[forDataGet.geofenceid]["l3"].has(forDataGet.id))
          //             {
          //               geofenceTrack[forDataGet.geofenceid]["l3"].delete(forDataGet.id)
          //             }
          //           }
          //           else if(forDataGet.level ===3)
          //           {
          //           if(!geofenceTrack[forDataGet.geofenceid]["l3"].has(forDataGet.id))
          //           {
          //            geofenceTrack[forDataGet.geofenceid]["l3"].add(forDataGet.id)
          //           }
          //          }
          //        }
          //       else{
              
          //          if(forDataGet.level === 1)
          //          {
          //           geofenceTrack[forDataGet.geofenceid] ={"l1":new Set([forDataGet.id]),"l2":new Set(),"l3":new Set()}
          //          }
          //         else if(forDataGet.level === 2)
          //         {
          //          geofenceTrack[forDataGet.geofenceid] = {"l1": new Set([forDataGet.id]),
          //                                                   "l2" : new Set([forDataGet.id]),
          //                                                   "l3":new Set()}
          //         }
          //        else if(forDataGet.level ===3)
          //         {
          //          geofenceTrack[forDataGet.geofenceid] = {"l1": new Set([forDataGet.id]),
          //                                                   "l2" : new Set([forDataGet.id]),
          //                                                   "l3":new Set([forDataGet.id])}
          //         }

          //       }
          //        }
          //        else if(forDataGet.zones ===1)
          //        {
          //        if(forDataGet.geofenceid in geofenceTrack)
          //        {
          //        if(forDataGet.level === 0)
          //         {
          //          ///Check tag is returning back from warning zone
          //          if(geofenceTrack[forDataGet.geofenceid]["l2"].has(forDataGet.id))
          //          {
          //           geofenceTrack[forDataGet.geofenceid]["l2"].delete(forDataGet.id)
          //          }
          //         }
          //         else if(forDataGet.level === 2)
          //        {

          //            if(!geofenceTrack[forDataGet.geofenceid]["l2"].has(forDataGet.id))
          //            {
          //             geofenceTrack[forDataGet.geofenceid]["l2"].add(forDataGet.id)

          //            } //chek tag is returuseEffe
          //       else{   
          //             if(forDataGet.level === 2)
          //            {
          //             geofenceTrack[forDataGet.geofenceid] = {"l2" : new Set([forDataGet.id]),
          //                                                 "l3":new Set()}
          //             }
          //              else if(forDataGet.level ===3)
          //             {
          //             geofenceTrack[forDataGet.geofenceid] = {"l2" : new Set([forDataGet.id]),
          //                                                 "l3":new Set([forDataGet.id])}
          //             }
          //          }useEffe
          //        geoFenceStore[forDataGet.geofenceid].children[0].visible = true
          //         }
          //       else{
          //        geoFenceStore[forDataGet.geofenceid].children[0].visible = false
          //       }

          //       if(geofenceTrack[forDataGet.geofenceid]["l2"].size > 0)
          //         {
          //           geoFenceStore[forDataGet.geofenceid].children[1].visible = true
          //         }
          //         else{
          //           geoFenceStore[forDataGet.geofenceid].children[1].visible = false
          //         }
          //     }
          //    else
          //     {

          //      if(forDataGet.zones===1 &&geofenceTrack[forDataGet.geofenceid]["l2"].size > 0)
          //       {
          //          geoFenceStore[forDataGet.geofenceid].children[0].visible = true
          //       }
          //       else{
          //          geoFenceStore[forDataGet.geofenceid].children[0].visible = false
          //       }
          //     }
          //  }
          }
        } else {
             if (
               forDataGet.y == NaN ||
               forDataGet.y == undefined ||
               forDataGet.z == NaN ||
               forDataGet.z == undefined ||
               forDataGet.x == NaN ||
              forDataGet.x == undefined
              ) {

            } else {
       
        console.log(forDataGet)
        scene.add(
          addTag(
            forDataGet.x,
            forDataGet.z,
            -forDataGet.y,
            forDataGet
          )
        );
      }
    }
  }
}

  const positionCard = () => {
    const tempV = new THREE.Vector3();
    SELECTED.updateWorldMatrix();
    tempV.setFromMatrixPosition(SELECTED.matrixWorld);
    tempV.project(currentCamera);


const x = Math.round((0.5 + tempV.x / 2) * (container.clientWidth / window.devicePixelRatio));
const y = Math.round((0.5 - tempV.y / 2) * (container.clientHeight/ window.devicePixelRatio));
//console.log("Position", x,y,tempV)
setState(prevState=>{return{...prevState, px:x, py:y}})
  }
  const animate = (time) => {
     checkAnim = checkAnim +1
     if (checkAnim >  100)
     {
      console.log("Navigate Animation Still runing")  
      checkAnim =1

     }

    if(resizeRendererToDisplaySize)
    {
      const canvas = renderer.domElement
      camAspect = canvas.offsetWidth / canvas.offsetHeight;
      perspCamera.aspect = camAspect;
      perspCamera.updateProjectionMatrix();
    }
    renderer.render(scene, currentCamera);

    if (SELECTED) {
      positionCard();
    }

    animateRef = requestAnimationFrame(animate);

  };


  const deleteFloorGltf = () => {
    console.log("GLTFMODEL-->", gltfModel);
    if (gltfModel) {
      gltfModel.traverse(function (child) {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });

      gltfPlane.remove(gltfModel);
      gltfPlane.position.x = 0;
      gltfPlane.position.y = 0;
      gltfPlane.position.z = 0;
      gltfPlane.scale.setScalar(1);
      gltfModel = null;
    }
  };

  const removeFloorPlan = () => {
    if (floorPlan) {
      floorPlan.children.length = 0;
      //floorPlan.remove(cube)
      floorPlan.position.x = 0;
      floorPlan.position.y = 0;
      floorPlan.position.z = 0;
      floorPlan.scale.setScalar(1);
      cube = null;
    }
  };

  const clear = () => {
    if (!content) return;

    scene.remove(content);

    // dispose geometry
    content.traverse((node) => {
      if (!node.isMesh) return;

      node.geometry.dispose();
    });

    // dispose textures
    const traverseMaterials =
      (content,
      (material) => {
        MAP_NAMES.forEach((map) => {
          if (material[map]) material[map].dispose();
        });
      });
  };

  const deleteFloorandTags = () => {
    deleteFloorGltf();
    removeFloorPlan();
    if (storeTagObj.length > 0) {
      for (let i = 0; i < storeTagObj.length; i++) {
        console.log("STOREOBJECT--->", storeTagObj);
        storeTagObj[i].geometry.dispose();
        storeTagObj[i].material.dispose();
        scene.remove(storeTagObj[i]);
      }
    }
    //remove geo fences from hare
    storeTagObj.length = 0;
    for (const key in geoFenceStore) {
      //console.log("STOREOBJECT--->",geoFenceStore);
      scene.remove(geoFenceStore[key]);
    }

  };


  const drawPlane = (uri) => {
    const loader = new THREE.TextureLoader();
    const width = 10;

    loader.load(uri, (texture) => {
      console.log("txture>>", texture);
      const height = width * (texture.image.height / texture.image.width);
      let plane = new THREE.PlaneGeometry(width, height);

      let planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
      });
      console.log("txture>>", texture);

      cube = new THREE.Mesh(plane, planeMat);
      /// cube.position.setX(width/2)
      //cube.position.setZ(height/2)
      cube.position.setY(0.01);
      cube.geometry.translate(width / 2, height / 2, 0);

      const diag = Math.sqrt(width * width + height * height);


  widthVector = new THREE.Vector3(width,0,0)

   const cubeCenter = new THREE.Vector3(width/2,height/2,0)
    cube.rotateX(-0.5 * Math.PI)
    cube.position.y = -0.1
    
    //scene.add(cube)
     
    
    floorPlan.add(cube)
    //floorPlan.add(widthVector)
    floorPlanCenter = new THREE.Vector3(width/2,0,height/2)
    
    if(configFloor)
    {
      cube.scale.setScalar(configFloor.data["scale"])
      cube.rotateZ(configFloor.data["angle"])
      cube.material.opacity = configFloor.data["opacity"]
      floorPlan.position.setX(configFloor.data["x"])
      floorPlan.position.setY(configFloor.data["y"])
      floorPlan.position.setZ(configFloor.data["z"])
      perspCamera.position.y = configFloor.data["camera"]
      cameraPosition =  perspCamera.position.y
      perspCamera.updateProjectionMatrix();
    }
    else
    {
      cameraPosition = width*1.3
      perspCamera.position.y = cameraPosition  
      perspCamera.updateProjectionMatrix();    
    }

  tagTexture = createCanvas()
  })
  
  
  


}

  const render3d = () => {
    console.log("Render3d called", canvasLoaded);
    //console.log("path->>>>>>"+this.state.gltfPath)

    ///// Initial 3D model load ///////
    if (!loaded3D) {
      init3D();
      ambientLight();

      //console.log(this.props.tagPosData)

      animate();

      //canvasLoaded =true;
      dispatch(setLoaded3D(true));
    }
    //this.props.getGeofences();
  };


  ///Process tag Message


useEffect(()=>{
  console.log('Floorplans',floorPlans)
  if(loaded3D && floorPlans.length>0){
    dispatch(setCurrentFloorIndex(0))
        const info ={id: floorPlans[0]._id, floor: floorPlans[0].floor, 
        }
        dispatch(setCurrentFloorPlanId(info))
        dispatch(getDisplayFloorplan(floorPlans[0]._id))
  }
},
[loaded3D, floorPlans])


useEffect(()=>{
  console.log('Inside useEffect')
  if(displayCharts){
    setPlay(prev=>!prev)
    render3d();
  dispatch(getFloorplans())
  
  state.chrt = new Chart(
    document.getElementById('chart'),
    {
      type: 'line',
      data: {
        datasets: []
      },
      options:{
        scales:{
            x:{
                type:'time',
                time:{
                  unit:'second'
                }
            }
        },
      }
    }
  );

  state.chrt_bar = new Chart(
    document.getElementById('chart_bar'),
    {
      type: 'bar',
      data: {
        datasets: []
      },
      options:{
        // indexAxis: 'y',
        scales:{
            x:{
                type:'category',
                // barThickness : 5,
            }
        },
      }
    }
  );

  state.chrt_bar_jump = new Chart(
    document.getElementById('chart_bar_jump'),
    {
      type: 'bar',
      data: {
        datasets: []
      },
      options:{
        // indexAxis: 'y',
        scales:{
            x:{
                type:'category',
                // barThickness : 5,
            }
        },
      }
    }
  );

  }

  // return ()=>{
  //   dispatch(resetDisplayFloor())
  //   dispatch(resetDisplayFloorGtltf())
  //   dispatch(setLoaded3D(false))
  //   dispatch(resetAnchor())
  //   deleteFloorandTags()
  //   // dispatch(setDisplayCharts(false))
  //   console.log("Floor paln and tags removed from scene. disposing page")
  //   cancelAnimationFrame(animateRef)
  //   console.log("Animation stopped")
  //   }
},
[displayCharts])

useEffect(() => {
  console.log('dimension')
  console.log(width)
  console.log(height)
  document.body.style = 'background: black;';
  // render3d();
  // // dispatch(toggleView())
  // dispatch(getFloorplans())

// return ()=>{
// dispatch(resetDisplayFloor())
// dispatch(resetDisplayFloorGtltf())
// dispatch(setLoaded3D(false))
// dispatch(resetAnchor())
// deleteFloorandTags()
// console.log("Floor paln and tags removed from scene. disposing page")
// cancelAnimationFrame(animateRef)
// console.log("Animation stopped")
// }
return ()=>{
  dispatch(resetDisplayFloor())
  dispatch(resetDisplayFloorGtltf())
  dispatch(setLoaded3D(false))
  dispatch(resetAnchor())
  deleteFloorandTags()
  dispatch(setDisplayCharts(false))
  dispatch(clearLapList())
  console.log("Floor paln and tags removed from scene. disposing page")
  cancelAnimationFrame(animateRef)
  console.log("Animation stopped")
  }
},[])

  const handleZAxis = (e) => {
    zAxis = zValToggle;
    setState({ ...state, zValToggle: zValToggle });
    console.log(state);
  };


  const handleView = (e) => {
    //e.preventDefault()
    setState({ ...state, view3d: view3d});
    console.log("view3d>>", state.view3d);

    if (state.view3d) {
      topView();
    } else {
      perspView();
    }
  };


  const handleClick = ()=>{
    clearAllTimeout()
    setValue(0)
    setCount(prev=>prev+1)
    setIsDisabled(prev=>true)
    setPlayPause(prev=> true)
    setPlay(prev=>true)
    deleteFloorandTags()
    
    dispatch(resetDisplayFloor())
  dispatch(resetDisplayFloorGtltf())
  dispatch(setLoaded3D(false))
  dispatch(resetAnchor())
  
  dispatch(setDisplayCharts(false))
  dispatch(clearLapList())
  
  // console.log("Floor paln and tags removed from scene. disposing page")
  // cancelAnimationFrame(animateRef)
  // console.log("Animation stopped")
    // dispatch(setLoaded3D(false))
    // dispatch(setDisplayCharts(false))
    // setPlay(prev=>!prev)
    // deleteFloorandTags()
    navigate('/playback')
  }

  const handlePause = ()=>{
    if(!stopPlayback)
    setStopPlayback(true)

    setPlayPause(true)
    setMinTs(value)    
    clearAllTimeout()
  }

  const handlePlay = ()=>{
    let interval = 200
    let dataArr = []
    console.log(minTs)
    if(playbackData && playbackData.length>0){
      setPlayPause(false)
      if(minTs !== 0){
        let min = playbackData[0].ts+minTs
        console.log(min)
        dataArr = playbackData.filter(data=>data.ts >= min)
        console.log(dataArr)
      }
      else dataArr = playbackData
      console.log('Playback Data', playbackData)
      // console.log('Start', playbackData[0].ts)
      // console.log('Stop', playbackData[playbackData.length -1].ts)
      setIsDisabled(false)
      let span = playbackData[playbackData.length -1].ts - playbackData[0].ts
      let min = Math.floor(span/60)
      let sec = span - min*60
      // console.log(span)
      // console.log(min)
      // console.log(sec)
      console.time()
      setDuration(span)
      dataArr.forEach((data, index)=>{
        // console.log(stopPlayback);
        // console.log('Data: ', data, playersForPlayback)
        // setCounter(prev=>prev+1)
        // if(!stopPlayback){
        //  const id =  setTimeout(function(){
        //     setValue(data.ts - playbackData[0].ts)
        //     updateTag(data)
        // }, index*interval);
        // setTimeOutIds(prev=>[...prev,id])
        // }
        // else return
        const id =  setTimeout(function(){
          let idx = state.chrt.data.datasets.findIndex(dataset=> dataset.label === data.player)
          let idx_bar = state.chrt_bar.data.datasets.findIndex(obj=>obj.x === data.player)
          console.log('Type', data.ts*1000)
          if(index === dataArr.length-1)
          setPlayPause(true)

          setValue(data.ts - playbackData[0].ts)
          updateTag(data)
          // updateChart(idx, data)
          
          if(idx === -1){
            state.chrt.data.datasets.push(
              {
                  label : data.player,
                  data : [
                      { x:data.ts*1000, y:data.speed }
                  ],
                  borderColor: 'rgb(254, 166, 0)'
              }) 

            state.chrt_bar.data.datasets.push(
              {
                  label : data.player,
                  data : [
                      { x:data.player, y:data.stepCount }
                  ],
                  backgroundColor: 'rgb(254, 166, 0)',
                  barThickness : 10,
                  
              })

            state.chrt_bar_jump.data.datasets.push({
              label:data.player,
              data : [
                { x:data.player, y:data.jumpCount }
              ],
              backgroundColor:'rgb(254, 166, 0)',
              barThickness:10,
            })
          }
                   
        else{
          state.chrt.data.datasets[idx].data.push({x:data.ts*1000, y:data.speed})
          state.chrt_bar.data.datasets[idx].data = [{ x:data.player, y:data.stepCount }]
          state.chrt_bar_jump.data.datasets[idx].data = [{ x:data.player, y:data.jumpCount }]
        }
        state.chrt.update()
        state.chrt_bar.update()
        state.chrt_bar_jump.update()

        // if(idx_bar === -1)
        // state.chrt_bar.data.datasets.push(
        //   {
        //       label : data.player,
        //       data : [
        //           { x:data.player, y:data.stepCount }
        //       ],
        //       borderColor: 'rgb(254, 166, 0)'
        //   })
        //   else
        //   state.chrt.data.datasets[idx].data = [{ x:data.player, y:data.stepCount }]
        //   state.chrt_bar.update()
      }, index*interval);
      setTimeOutIds(prev=>[...prev,id])
      })
      console.timeEnd()
    }
  }

const updateChart = (idx, data)=>{
        if(idx === -1)
        state.chrt.data.datasets.push(
            {
                label : data.player,
                data : [
                    { x:data.ts, y:data.speed }
                ]
            })
        else
        state.chrt.data.datasets[idx].data.push({x:data.ts, y:data.speed})
        state.chrt.update()
}

  const clearAllTimeout = () => {
    //clear all timeouts
    while(timeOutIds.length){
      clearTimeout(timeOutIds.pop());
    }
  }

  const handleChange = (event, value)=>{
    // console.log('Test',test)
    setPlayPause(true)
    if(!stopPlayback)
    setStopPlayback(true)
    
    clearAllTimeout()

    console.log('value', playbackData[0].ts+value)
    let data = playbackData.find(el=>el.ts >= playbackData[0].ts+value)
    console.log(data)
    updateTag(data)
    setValue(value)
  }

  const handleCommit = (event, value) =>{
    console.log('Inside handleCommit')
    console.log(event)
    console.log(value)
    setMinTs(value)
    setStopPlayback(false)
  }

  const formatDuration = (value) => {
    const minute = Math.floor(value / 60);
    let secondLeft = value - minute * 60;
    secondLeft = secondLeft<1 ? 0 : Math.floor(secondLeft)
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

    return( <>
    
    {/* {showLapList && <LapList records={allLaps}/>} */}
{/* {!isDisabled &&  */}
<Box sx={{zIndex:'drawer', ml:'25%',width:'50vw',position:'absolute', top:height/1.29,}}>
<Slider
        key={count}
        disabled={isDisabled}
        value={value}
        min={0}
        step={0.000000001}
        max={duration}
        // scale={calculateValue}
        // getAriaValueText={valueLabelFormat}
        // valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        onChangeCommitted={handleCommit}
        size='small'
        sx={{          
          color: 'rgba(0,0,0,0.87)',
          // width:1400,
          height: 4,
          '& .MuiSlider-thumb': {
            width: 8,
            height: 8,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&::before': {
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
            },
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px ${
                'rgb(0 0 0 / 16%)'
              }`,
            },
            '&.Mui-active': {
              width: 20,
              height: 20,
            },
          },
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
        }}
      />
      <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(value)}</TinyText>
          <TinyText>-{formatDuration(duration - value)}</TinyText>
        </Box>
        </Box>
{/* } */}

{/* <DatePickers label='From [Start Date]' />
<DatePickers label='To [End Date]' /> */}


    <Fab sx={{position:'absolute', top:0, right:0, zIndex:'tooltip'}} onClick={handleClick}>
  <CancelIcon fontSize="large" />
      </Fab>  

      {playPause && 
      <Fab 
      disabled={play}
      sx={{position:'relative', top:height/1.2, left:width/2}} 
      onClick={handlePlay}>
  <PlayArrowIcon fontSize="large" />
      </Fab> } 
      {!playPause && 
      <Fab 
      sx={{position:'relative', top:height/1.2, left:width/2}}  
      onClick={handlePause}>
  <PauseIcon fontSize="large" />
      </Fab> }
      {sportsCard && <TagCard lft={tagCardDetails.posX+10} tp={tagCardDetails.posY+10} pickedTag='Test ID' posX='Test Pos' close={onClose} stepCount={tagCardDetails.stepCount} jumpCount={tagCardDetails.jumpCount} speed={tagCardDetails.speed}/>}

     
       <canvas className = "canvas" id='three' 
       style = {{position: "fixed",top:0,left:0, width:displayCharts?'50%' : '100%', backgroundColor:!displayCharts?'lightgray':null}}/>
       
       {displayCharts && <>
      <Box sx={{width:'50%', height:'100%', position:'fixed', top:0, right:0,  overflow:'auto'}}>
        <Grid container  flexDirection='column' 
        // overflow='auto' 
        // sx={{width:'49.5%', height:'100%', position:'fixed', top:0, right:0}}
        >
          <Grid item sx={{m:2}}>  
          <canvas id='chart'
      style = {{backgroundColor:'lightgray', borderRadius:5}}/>
          </Grid>

          <Grid item sx={{m:2}}>
          <canvas id='chart_bar'
      style = {{backgroundColor:'lightgray', borderRadius:5}}
      />
          </Grid>
        
        <Grid item sx={{m:2}}>
          <canvas id='chart_bar_jump' style={{backgroundColor:'lightgray', borderRadius:5}}/>
        </Grid>

      </Grid>
</Box>
</>
      }

          <Backdrop className={props.classes.backdrop} open={showBackdrop} >
        <CircularProgress color="primary" />
         </Backdrop>    

    <Slide direction="up" in={state.alertType} mountOnEnter unmountOnExit>
      <div
        className="container"
        style={{
          position: "absolute",
          bottom: "70px",
          right: "520px",
          opacity: 0.75,
          display: "flex",
        }}
      >
        <Alert
          severity={state.alertType}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert("", "");
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          className={props.classes.alert}
        >
          <AlertTitle>{state.alertType}</AlertTitle>
          {state.alertMessage}
        </Alert>
      </div>
    </Slide>
</>)
  }




function traverseMaterials (object, callback) {
  object.traverse((node) => {
    if (!node.isMesh) return;
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    materials.forEach(callback);
  });
}




export default (withStyles(style)((PlaybackWindow)))
