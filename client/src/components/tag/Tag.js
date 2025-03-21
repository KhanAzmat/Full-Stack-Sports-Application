

import React, { useEffect, useState,useCallback } from "react";
import { getTags, setCurrentTag, deleteTag } from "../../feature/tag/tagThunk";
import AddTag from "./AddTag";
import Confirm from "../UI/Confirm";
import AuthAppBar from "../UI/AuthAppBar";
// import FilterTag from "./FilterTag";
import { getFloorplans } from "../../feature/floorplan/floorplanThunk";
//import { resetDisplayFloor } from "../../feature/floorplan/floorplanSlice";
import { getAnchorsOfFloor } from "../../feature/anchor/anchorThunk";
import { resetDisplayFloor } from "../../feature/floorplan/floorplanSlice";
import { resetAnchor } from "../../feature/anchor/anchorSlice";
import { TagIcon } from "../UI/CustomIcon";
import SearchIcon from '@mui/icons-material/Search';

import {
  // EditOutlined,
  LocalOfferOutlined,
  Add,
  DeleteOutlined,
} from "@mui/icons-material";
import {
// Typography,
Fab, Tooltip, Grid, LinearProgress, Button,Paper,Box, Typography
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from "prop-types";
import NewTagTable from "./NewTagTable";
import { connect, useDispatch,useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Moment from "react-moment";
import NotAvailable from "../UI/NotAvailable";
import {Link, Redirect} from 'react-router-dom'
import TagTable from "./TagTable";
import {Stack} from "@mui/material"
import { setAlerts } from "../../_actions/alertAction";
import { addTags } from "../../feature/tag/tagThunk";
import {Backdrop,CircularProgress} from "@mui/material"


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
  },
  table: {
    minWidth: 650,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  spinner: {
    width: "50%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  paperRoot : {
    borderRadius : '30px',
    maxHeight: 700,
    
  }  
}));

let tagSet = null
let newTag = null

const Tag = (props) => {
  //const [addTagForm, setAddTagForm] = useState(false);
  const tags = useSelector((state)=>state.tag.tags)
  const role = useSelector((state)=>state.auth.role)
  const [state,setState] = React.useState({client:null, floor:null , addTagForm:false, tagSet:null, newTag:null,showBackdrop: false})
  const configFloor = useSelector((state)=>state.floorplan.displayFloor)
  
  const mqttToken = useSelector((state)=>state.auth.token)
  const [cont,setCont] = React.useState("om")
  const dispatch = useDispatch()
  const anchorConfig = useSelector((state)=>state.anchor.anchor)
  
  useEffect(() => {
    dispatch(resetDisplayFloor())
    dispatch(getTags());
    
    //eslint-disable-next-line
   
    //load background worker

    // console.log("script id>>>>>>>",x)
    let ipurl = window.location.href;
    //var ip = window.location.host//
    var ip=ipurl.substring(ipurl.indexOf("/") + 2, ipurl.lastIndexOf(":"));
    const axios = document.getElementById("axios").src 
    let mqtt= document.getElementById("mqttLib").src
    let sio = document.getElementById("sio").src
    console.log("script id2>>>>>>>",mqtt) 
    const port = window.location.port   
const dataClient = new Worker("/static/mqttWorker.js");


let module = {type:"load-lib",mqtt : mqtt,axios: axios, sio:sio,host:ip,port:port}
dataClient.postMessage(JSON.stringify(module))
//dispatch(getFloorplans())
setState(prevState=>{return {...prevState,client:dataClient}})
tagSet = new Set()
newTag = new Set()


//const msg = {type:"post-connect"}
//mqttClient.postMessage(JSON.stringify(msg))



return ()=>{
  
  ///mqtt connection cleanup
  if(dataClient)
  {
    const msg = {type:"close"}   
    dataClient.postMessage(JSON.stringify(msg))
    dataClient.terminate()
  }
  dispatch(resetDisplayFloor())
  dispatch(resetAnchor())
  tagSet=null
  newTag = null
}


  }, []);
  


useEffect(()=>{
  tagSet = new Set()
     newTag  = new Set()
     
  if(tags && tags.length > 0)
  {
    console.log(tags)
     //tagSet = new Set()
     //newTag  = new Set()
     const tlist = tags.map(obj=>obj.tagId)
     console.log("Tlist",tlist)
      
     //console.log("Tlist",tset)

     //setState(prevState=>{return {...prevState, tagSet : new Set(tlist)}})
     tlist.forEach(obj=>{tagSet.add(obj)})
    
  }


},[tags])



  useEffect(()=>{

    console.log(configFloor)
    if(state.client && state.floor)
      {
        let msg = {type:"unsubscribe"}
      
      state.client.postMessage(JSON.stringify(msg))
      state.client.removeEventListener("message",processMessage)
  
      }
  
    if(configFloor)
    {
     
     // setFloorPlanUri(floorplanUri)
      dispatch(getAnchorsOfFloor(configFloor.data._id))
     // drawPlane(floorplanUri)
      if(state.client)
      {
        //const  msg = {type:"subscribe", floor :configFloor.data.floor} 
        //state.client.postMessage(JSON.stringify(msg))
        //state.client.addEventListener("message",processMessage)
  
      }
      setState(prevState=>{return {...prevState, floor:configFloor.data.floor}})
       
  dispatch(resetDisplayFloor())
      //tagMap= {}
    }
  
  },[configFloor])

  const processMessage = async(event)=>{

    //console.log(state.tagSet)
    const data = event.data
    if(data["type"]==="error")
  {
    dispatch(setAlerts(data.msg,"success",true))
    handleHideBackdrop()
    return
  }
  if(data["type"]==="info")
  {

    return 
  }

  

  if(tagSet && tagSet.has(data.id.toUpperCase())){
    console.log(tagSet)
      return
  }

  //console.log(newTag)
  if (newTag && newTag.has(data.id.toUpperCase()))
  {
    //console.log(newTag)
    return
  }
  //console.log(d
  
  if(data && data.id)
  {

  newTag.add(data.id.toUpperCase())
  setState(prevState=>{return {...prevState, newTag:new Set(prevState.newTag?[...prevState.newTag,data.id.toUpperCase()]: [data.id.toUpperCase()])}})
  }



  }




  useEffect(()=>{
     console.log("anchor config",anchorConfig)
    if(anchorConfig && anchorConfig.length > 0 && state.client)
    {
      const data = anchorConfig[0]
      const hostname = data["hostname"]
      const host = window.location.hostname
      let conn = {type:"subscribe",hostname:hostname, port:48080, username: "tag" , password:mqttToken, floor:state.floor}
      state.client.postMessage(JSON.stringify(conn))
      state.client.addEventListener("message",processMessage)
      //setState(prevState=>{return {...prevState, addTagForm:false}})
      //console.log
      
      handleClose()
      handleShowBackdrop()
      dispatch(resetAnchor())
      setTimeout(() => {
        let msg = {type:"unsubscribe"}
      
      state.client.postMessage(JSON.stringify(msg))
      state.client.removeEventListener("message",processMessage)
      handleHideBackdrop()
      if(newTag && newTag.size==0)
      {
        dispatch(setAlerts("No new tag found! Plese search again","info",true))
      }
      }, 10000);
      
    }
  
  
  
  },[anchorConfig])
  




  const classes = useStyles();
  const handleClickOpen = () => {
    //setAddTagForm(true);
    dispatch(getFloorplans())
    setState(prevState=>{return{...prevState, addTagForm:true}})
  };

const handleShowBackdrop = ()=>{

setState((prevState=>{return {...prevState, showBackdrop:true}}))

};


const handleClear=()=>{
  newTag.clear()
  setState(prevState=>{return {...prevState, newTag:new Set()}})
}

const handleHideBackdrop = ()=>{

  setState((prevState=>{return {...prevState, showBackdrop:false}}))
  
  };

  const handleClose = () => {
    //setAddTagForm(false);
    setState(prevState=>{return{...prevState, addTagForm:false}})
  };

const handleAddTags=()=>{

    if(newTag && newTag.size > 0){
       
        const formData = {tagList:[...newTag]}
        dispatch(addTags(formData))
        dispatch(getTags())
        newTag.clear()
    }
    else{
      dispatch(setAlerts("Nothing to add! Plese search again","info",true))    
    }


}



 
 

  const titleIcon = <TagIcon color='primary' />;

  


  return (
    <React.Fragment>
      
     


      {state.addTagForm && (
        <AddTag handleClose={handleClose} open={state.addTagForm} getTags={getTags} />
      )}
      
      {/*<Dialog
        open={props.open}
         onClose={props.handleClose}
         fullWidth
         PaperProps = {{classes : {root: classes.paperRoot}}}
         maxWidth = "md"
        >
          <AuthAppBar title='Tag Management' icon={titleIcon} />
      <DialogContent>*/}
     
<Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={state.showBackdrop}
  
>
  <CircularProgress color="inherit" />
</Backdrop>
     
     <Box sx = {{display:"grid",
                  gridTemplateRows: '1fr 9fr',
                  gridTemplateColumns:'0.5fr 9fr 0.5fr',
                  gridTemplateAreas : `" . . ."
                  ". floor ."`, 
                  height : "100%"
                 }} >

     <Paper elevation={3} sx ={{gridArea:"floor", height : "95%", borderRadius: "10px",p:3}} >
     <AuthAppBar title='Tag Management' icon={titleIcon} />
     <Stack direction="row" alignItems="center" spacing={1} justifyContent = "space-around" >
      <Card>
        <CardHeader title="Existing Tags"/>
        <CardContent>
     
       
        <TagTable />
      
      </CardContent>
      </Card>

      <Card>
        <CardHeader title="New Tags"/>
        <CardContent>
          <NewTagTable t={newTag && newTag.size>0 ? [...newTag]:[]}/>
        </CardContent>
        <CardActions>
             <Button type="contained" size="small" 
             disabled={newTag===null || (newTag && newTag.size <= 0)}
              onClick={handleAddTags}>Add</Button>
             <Button type="contained" 
             size="small"
             onClick={handleClear}
             >Clear</Button>
        </CardActions>
  
      </Card>
      

      
      </Stack>
     {/* </DialogContent>
      <DialogActions>*/}
      <Tooltip title='Search new tag'>
        <Fab
         sx = {{position : "fixed",
         bottom : 55,
        right : 100,
        background: (theme)=>`linear-gradient(60deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color:"#fff"}}
          
          aria-label='add'
          onClick={handleClickOpen}
          size='large'
          
        >
          <SearchIcon fontSize="large"/>
        </Fab>
      </Tooltip>

        {/*</DialogActions>
     </Dialog>*/} 
     </Paper>
    </Box> 
    </React.Fragment>
  );
};

Tag.propTypes = {
  tags: PropTypes.array.isRequired,
  getTags: PropTypes.func.isRequired,
  setCurrentTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tags: state.tag.tags,
  role: state.auth.role
});





export default (Tag);
