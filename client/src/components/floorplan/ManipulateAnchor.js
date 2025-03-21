

import { useEffect, useState } from 'react';

import {  useSelector,useDispatch } from "react-redux";
//import { useState } from 'react-redux';import { with } from '@mui/styles/withStyles';

import { makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { Paper } from '@mui/material';
import {Table,TableBody,TableHead, TableRow,TableCell,TableContainer} from '@mui/material'
import {Stack,Box,Backdrop} from "@mui/material"
import {Grow,Typography,Button,Checkbox} from "@mui/material"
import { CircularProgress } from "@mui/material";
import AuthAppBar from "../UI/AuthAppBar";
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import io from 'socket.io-client'
import { setAlerts } from "../../_actions/alertAction"; 
import { getAnchorsOfFloor } from '../../feature/anchor/anchorThunk';
import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice';
import { Outlet } from "react-router-dom"




const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/



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
      
      minwidth: 400,
      height : 600,
    } 
  });

function IPTable(props) {

    //const tags = useSelector((state)=>state.tag.tags)
    
    const dispatch = useDispatch()
    const classes = useStyles();
    const apiToken = useSelector((state)=>state.auth.token) 
    const colorIndex = useSelector((state)=>state.color.colorIndex)
    const configFloor = useSelector((state)=>state.floorplan.configFloor)
    const storedAnchors = useSelector((state)=>state.anchor.anchor)
  
    //const navigate = useNavigate()
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [delId, setDelId] = useState("");
    const [iPList, setIPList] = useState(null)
    
    const [state,setState] = useState({socket:null,
                                       ipList:[],
                                      floorData:null,
                                      hostname:"localhost",

                                      showBackdrop:true,
                                      port:9009})





    useEffect(()=>{

      const soc = io(`http://${window.location.hostname}:5000`)
      /*const soc = io(`http://localhost:9000`,{
                        extraHeaders :{
                         Authorization : apiToken
                 }}) */  
   
      //setSocket(soc)
      //setState({...state, socket : soc})
      //setComm((comm)=>{return {...comm, socket : soc}})
      setState((prevState)=>{return {...prevState, socket:soc}}) 
      return ()=> {
        
       console.log("Disconnecting existing socket")
       soc.disconnect()
     
       soc.close()
       //removePLane()
     }
   
   
     },[])








     useEffect(()=>{
      if(configFloor)
      {
       console.log("config floor",configFloor)
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

           const message = {command:"findanc"}
     
        
      state.socket.emit("findanc",message)
        
      
     
    dispatch(setAlerts("GateWay connected","success",true))
    //setNetComm(false)
    //setGetwayConnected(true)
    //setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : true}})
  }
  /*else if(message["code"]===200 && message["message"]==="Disconnected")
  {
    dispatch(setAlerts("GateWay Disconnected","success",true))
    setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : false}})
  }*/

  
  }   

 ///This fiction is invoked after network auto dicovery
  const onFindAnc=(msg)=>{
    console.log("recived message", msg)
    let flist = null
    if(msg["response"]==="anc list" && msg["code"]===200)
    {
      flist = msg["data"]
      flist = flist.map((obj)=>{
        obj["add"] = true
        return obj  
        })

    }
   

    setState((prevState)=>{return {...prevState,ipList:flist, showBackdrop:false}})

  }


  const onGatewayConfig = (msg)=>{
      console.log("received message", msg)
      if(msg["code"] === 404 && msg["message"]==="dns config missing")
      {
         //setState((prevState)=>{return {...prevState, showIp:true}})
          //setComm((comm)=>{return {...comm, netComm:false, gatewayConnected:true}})
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
        
        dispatch(setAlerts("Anchor DNS configuration stored sucessfully!!","success",true))

        /*if(comm.socket)
        {
          comm.socket.emit("gatewaydisconnect",{
            closegateway:true
    
          }) 
        } 
        */
        setState((prevState)=>{return {...prevState,showBackdrop:false}})
        //setComm((comm)=>{return {...comm, gatewayConnected:false}})
      }
      if(msg["code"]===102)
      {
        dispatch(setAlerts("please wait processing your request","info",true))
      }
     

      if(msg["code"]!==102)
      {
        //setComm((comm)=>{return{...comm,netComm:false}})
      }
      //console.log(comm)
  }

 


  const onGatewayError =(message)=>{
    console.log("gatewayerror",message)
    if(message["code"]===500)
    {
    dispatch(setAlerts("Gateway connection error, Host not reachable", "error",true))
    //setGetwayConnected(false)
    //setComm((comm)=>{return{...comm,netComm:false,gatewayConnected : false}})
    }
    else if(message["code"]===400 && message["message"] =="Wrong command")
    {
      dispatch(setAlerts("Command format error!!", "error",true))
    }
    else if(message["code"]===400 && message["message"] =="Anchor not found")
    {
      dispatch(setAlerts("Cant configure!!! Anchor" + message["ancId"] +"not reachable", "error",true))
    }
    setState(prevState=>{return {...prevState,showBackdrop:false}})
  }

  
  const onGatewayclose=(message)=>{
    console.log("gatewayClose",message)
    if(message["status"]==="closed")
    {
      dispatch(setAlerts("Gateway connection closed", "success",true))
      //setNetComm(false)
      //setGetwayConnected(false)
      //setComm((comm)=>{return{...comm, netComm : false, gatewayConnected : false}})

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
        // setState((state)=>{return {...state, ipList : [...anchorss]}})
    break;

    /** Renge test response */

   



    
   // break; 

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
        //console.log("State", comm)
       // setComm((comm)=>{return{...comm,rtlsOn : true}})
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


  if(state.socket)
  {
 state.socket.on("serverresponse",onConnect)
state.socket.on("gatewayresponse",onGatewayResponse)
state.socket.on("gatewayerror",onGatewayError)
state.socket.on("gatewaydata",onGatewaydata)
  state.socket.on("gatewayclose",onGatewayclose)
  state.socket.on("gatewayconfig", onGatewayConfig)
  state.socket.on("findanc", onFindAnc)
  }
 return ()=>{
        if(state.socket)
        {
    
          state.socket.off("serverresponse",onConnect)
          state.socket.off("gatewayresponse",onGatewayResponse)
          state.socket.off("gatewayerror",onGatewayError)
        state.socket.off("gatewaydata",onGatewaydata)
          state.socket.off("gatewayclose",onGatewayclose)
          state.socket.off("findanc", onFindAnc)
        }

 }

},[state.socket])




const handleDemoCheck = (e)=>{
  //setState(prevState=>{return {...prevState, demoMode:e.target.checked}})
  
  const message = {command:"findanc"}
  if(state.socket)
    {
       state.socket.emit("findanc",message)
       setState(prevState=>{return {...prevState, showBackdrop:true}})
    }
  
  }


   
  
useEffect(()=>{

  console.log(storedAnchors)
  if(storedAnchors && storedAnchors.length> 0)
  {


    ///anchorRanging = {}
    //removeLines()
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
      //loc[addr] = obj
    })
    
  // console.log(anchorRanging)
     //console.log(mlist)
     //drawLinesAfterConfig(anchorRanging,loc)
     //setHostName(data["hostname"])
     //setPort(data["port"])
    //setMasterList(["",...mlist])
   
    //setAnchorLoc(loc)
   
    //setAncList(list)
    
   //setState((state)=>{return{...state, masterList :["",...mlist], anchorLoc:loc,ancList:list,confed:true, confedAnchor:storedAnchors}})
   setState((comm)=>{return{...comm, hostname : data["hostname"], port:data["port"]}}) 
   //dispatch(resetAnchor())
   
  }


},[storedAnchors])
  


useEffect(()=>{

  if(state.floorData)
  {
    
    console.log("details floor data",state.floorData)
    
    state.socket.emit("gatewayconnect",{
      host:state.hostname,
      port:state.port,
      apiToken:apiToken,
      // This code need to be updated. becuse it send floor information on every connect. wich is updated in backend 
      floor: state.floorData.data.floor ,
      demo:  "on" ,
  
  
    })
    
  }
},[state.floorData])


  
  
  
  
    const onDeleteHandler = () => {
      //dispatch(deleteTag(delId));
      onDeleteClose();
      //dispatch(getTags())
    };
  
    const onDeleteOpen = (id) => {
      //setConfirmDelete(true);
      //setDelId(id);
    };
  
    const onDeleteClose = () => {
      //setConfirmDelete(false);
    };
  
  
    
  
  
  

    ////sends ip address for configuration
const configureIp=()=>{
  
  const anclist = state.ipList.filter((obj)=> obj.add===true )
  console.log("After filter",anclist)
  if(anclist && anclist.length > 3)
  { 
 
  
  const message = {message:"dns config", iplist:anclist}

console.log("Message", message)
 

  if(state.socket)
  {
     state.socket.emit("gatewayconfig",message)
     setState((prevState)=>{return{...prevState, showBackdrop:true }})
  }
}
else{
  dispatch(setAlerts("Atleast three anchor needed! Can't Update list","error",true))
}
}








    const handleDelete = (e)=>{
     // console.log("delete Index",idx, e.target.checked)
       setState((prevState)=>{
        //prevState.ipList[e.target.tabIndex]["add"] = false
        console.log(prevState.ipList)
        let newList = prevState.ipList.map((obj,index)=>
          (index===e.target.tabIndex )? {...obj, add:e.target.checked} : obj
        )
       
        console.log("New List Afeter splice", newList)
        return {...prevState, ipList:newList}
       }
        )       
  
    }
  
    const checkIp = (idx)=>{
      //console.log(iPList[idx])
      if(iPList[idx]["ip"]==="")
      { 
        return false
      }
      else 
      {
        return !iPList[idx]["ip"].match(ipformat)
      }
    
    
    }
  
    return <>
     <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={state.showBackdrop}
        //onClick={handleClose}
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
      
  
  <Paper elevation={6} sx ={{gridArea:"floor", height : "95%", borderRadius: "10px",p:3}} >
  <Stack direction={"column"} spacing={3} >

  <AuthAppBar title='Add or Remove anchor' icon={<HubRoundedIcon />} />
        
      
      
     <TableContainer component={Paper} className={classes.container}>
       <Table stickyHeader  aria-label="customized table" size = "small">
         <TableHead >
           <TableRow>
            
           <StyledTableCell align="center">Anchor ID</StyledTableCell>
             <StyledTableCell align="center">IP Address</StyledTableCell>
             <StyledTableCell align="center">Port</StyledTableCell>
  
             <StyledTableCell align="center">Include</StyledTableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {state.ipList && state.ipList.map((item,index) => (
              <Grow
              in={true}
              key={index}
              {...(true? { timeout: 1000 } : {})}
            >
             <StyledTableRow key={index}>
             <StyledTableCell align="center">{item.id}</StyledTableCell>
              
               
               <StyledTableCell align="center">{item.ip}</StyledTableCell>
              
               <StyledTableCell align="center">{item.port}</StyledTableCell>
  
              <StyledTableCell align="center">
                    
                    <Checkbox tabIndex={index} checked = {item.add} onChange={handleDelete}/>
  
               </StyledTableCell>
             </StyledTableRow>
             </Grow>
           ))}
         </TableBody>
       </Table>
     
     </TableContainer>


     <Stack direction={"row"} spacing={3} justifyContent={"flex-end"}> 
 <Button variant="contained" 
 size="small"
 onClick={handleDemoCheck}
 >
    Search
 </Button>   
     
     <Button variant = "contained" size="small"
     onClick={configureIp}
      //disabled={props.netComm}
      >Update </Button>
  <Button variant='contained' size="small"
  //onClick={props.closeIp}
  >Floor Plan</Button>

</Stack>  
     </Stack>
 
 </Paper>
 <Outlet/>
 </Box>    
    </>;
}
  

export {IPTable}