import React, { useEffect, useState } from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { GroupOutlined, DeleteOutlined, Password } from "@mui/icons-material";
import PropTypes from "prop-types";
import { connect,useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUsers, addUser, deleteUser } from "../../feature/auth/authThunk";
import Confirm from "../UI/Confirm";
import AddUser from "./AddUser";
import PasswordIcon from '@mui/icons-material/Password';
import {Fab, ListItemButton} from "@mui/material"
import {Tooltip,IconButton,Paper} from "@mui/material"
import {Add} from "@mui/icons-material"
import { Button } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {Dialog,
  DialogActions,
  DialogContent,
  Stack, 
  TextField, 
  FormControlLabel, 
  Checkbox,
 InputAdornment} from "@mui/material"
 import { Visibility,VisibilityOff } from "@mui/icons-material";
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ApiKey } from "../UI/CustomIcon";
import { Box } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getApiKeys, deleteApiKey } from "../../feature/apiKey/apiKeyThunk";
import { ApiKey2 } from "../UI/CustomIcon";
import GenerateKey from "./GenerateKey";
import withStyles from '@mui/styles/withStyles';
import { addUDP,editUDP,deleteUDP,getUDP } from "../../feature/udp/udpThunk";
import {addMQTT, editMQTT, deleteMQTT, getMQTT} from "../../feature/mqtt/mqttThunk"
//import { setAlert } from "../../feature/alert/alertSlice";
import { setAlerts } from "../../_actions/alertAction";
import { MQTTIcon } from "../UI/CustomIcon";
import ChangePassword from "./ChangePassword";
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


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    
  },
  title: {
    paddingTop: "30px",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  tabRoot :{
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius : '30px',
  },
  paperRoot : {
    borderRadius : '30px',
    maxHeight : 700
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
  tableProp:{
    marginBottom : theme.spacing(4)
  }
}));

////Tab selection 

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}








const User = (props) => {
  const users = useSelector((state)=>state.auth.users)
const userRole = useSelector((state)=>state.auth.role)
const apiKeys = useSelector((state)=>state.apiKey.apiKeys)
const udp  = useSelector((state)=>state.udp.udp)
const mqtt = useSelector((state)=>state.mqtt.mqtt)
  const dispatch = useDispatch()
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmKeyDelete,setConfirmKeyDelete] = useState(false)
  const [generateApiKey,setGenerateApiKey] = useState(false);
  const [delKeyId,setDelKeyId] = useState("");
  const [delId, setDelId] = useState("");
  const [addUserDialog,setAddUserDialog] = useState(false)
  const [value, setValue] = React.useState(0);
  const [changePassword, setChangePassword] = useState(false)
  //const [udpChecked,setUdpChecked] = React.useState(false)
  const [udpState, setUdpState] = React.useState({host:"", port:"",udpChecked:false})
  const [mqttState, setMqttState] = React.useState({host:"",port:"",username:"", password:"",mqttChecked:false})
  const [userId, setUserId]=useState("")
  //const [udpValu]
  const classes = useStyles();
  useEffect(() => {
    dispatch(getUsers());
    dispatch(getUDP())
    dispatch(getMQTT())
    //eslint-disable-next-line
  }, []);
  


  const handleGenerateKeyOpen=() =>{
    setGenerateApiKey(true)
  }

  const handleGenerateKeyClose=()=>{
    setGenerateApiKey(false)
  }


  const handleChangePasswordOpen=(e, _id) =>{
    setUserId(_id)
    setChangePassword(true)
  }

  const handleCahangePasswordClose=()=>{
    setChangePassword(false)
  }

  useEffect(()=>{
   if(udp)
   {
      console.log("The udp is",udp)
      setUdpState((prevState)=>{
        return {...prevState,host:udp.hostname, port:udp.port,udpChecked:true}
      })


   }
   else{
    setUdpState((prevState)=>{
      return {...prevState,host:'', port:"",udpChecked:false}
    })
   }
    

  },[udp])

  useEffect(()=>{
    if(mqtt)
    {
       console.log("The mqtt is",mqtt)
       setMqttState((prevState)=>{
         return {...prevState,host:mqtt.hostname, port:mqtt.port,mqttChecked:true, username:mqtt.username, password:mqtt.password  }
       })
 
 
    }
    else{
     setMqttState((prevState)=>{
       return {...prevState,host:'', port:"",username:"", password:"",udpChecked:false}
     })
    }
     
 
   },[mqtt])




  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 
   const handleAddUserOpen=() =>{
     setAddUserDialog(true)
   }

   const handleAddUserClose=()=>{
     setAddUserDialog(false)
   }


   const onKeyDeleteOpen = (id) => {
    setConfirmKeyDelete(true);
    setDelKeyId(id);
  };

  const onKeyDeleteClose = () => {
    setConfirmKeyDelete(false);
  };
  const onKeyDeleteHandler = () => {
    dispatch(deleteApiKey(delKeyId));
    onKeyDeleteClose();
    

  };

   ///User account delete

  const onDeleteOpen = (id) => {
    setConfirmDelete(true);
    setDelId(id);
  };

  const onDeleteClose = () => {
    setConfirmDelete(false);
  };
  const onDeleteHandler = () => {
    dispatch(deleteUser(delId));
    onDeleteClose();
    dispatch(getUsers());

  };

const onUdpChange=(e)=>{
  
  setUdpState((prevState)=>{return{...prevState, udpChecked:e.target.checked}})

}


const onMqttChange=(e)=>{
  
  setMqttState((prevState)=>{return{...prevState, mqttChecked:e.target.checked}})

}
 
const onUdpTextChange=(e)=>{

   if(e.target.name ==="ip")
   {
      setUdpState((prevState)=>{return {...prevState, host: e.target.value}})

   }
   else if(e.target.name==="port")
   { 
    setUdpState((prevState)=>{return {...prevState, port: e.target.value}})
   }

}
 

const onMqttTextChange=(e)=>{
  console.log(e.target.name)

  /*if(e.target.name ==="host")
  {
     setMqttState((prevState)=>{return {...prevState, host: e.target.value}})

  }
  else if(e.target.name==="port")
  { 
   setMqttState((prevState)=>{return {...prevState, port: e.target.value}})
  }

  else if(e.taget.name ==="username")
  {
    setMqttState((prevState)=>{return {...prevState, username: e.target.value}})
  }

  else if(e.taget.name ==="password")
  {
    setMqttState((prevState)=>{return {...prevState, password: e.target.value}})
  }*/
  setMqttState((prevState)=>{return {...prevState,[e.target.name]:e.target.value }})
}

const handleUdpClear =()=>{

  setUdpState((prevState)=>{return {...prevState, port:"", host:""}})
}

const handleMqttClear=()=>{
  setMqttState((prevState)=>{return {...prevState, port:"", host:"", username:"", password:""}})
}


const handleMQttSave =()=>{
  if(mqttState.mqttChecked)
  {     
    if(mqtt)
   {
       const formData = {...mqttState}
       console.log("ip format match",formData.host.match(ipformat))
       if(formData.host && formData.host.match(ipformat) && !isNaN(formData.port))
        {
          formData.port = Number(formData.port)
          const data= {formData:formData, id:mqtt._id}
         dispatch(editMQTT(data))
        }
        else{
          dispatch(setAlerts("Plese check host and port ","error",true))
         }
   }
   else
   {
    const formData = {...mqttState}
    console.log("ip format match",formData.host.match(ipformat),isNaN(formData.port))
    if(formData.host && formData.host.match(ipformat) && !isNaN(formData.port))
     {
      formData.port = Number(formData.port)
      dispatch(addMQTT(formData))
     }
     else{
       dispatch(setAlerts("Plese check host and port ","error",true))
      }
   }

  }
  else{
    if(mqtt)
    {
      dispatch(deleteMQTT(mqtt._id))
    }
  }

}

const handleUdpSave =()=>{
    if(udpState.udpChecked)
    {     
      if(udp)
     {
         const formData = {...udpState}
         console.log("ip format match",formData.host.match(ipformat))
         if(formData.host && formData.host.match(ipformat) && !isNaN(formData.port))
          {
            formData.port = Number(formData.port)
            const data= {formData:formData, id:udp._id}
           dispatch(editUDP(data))
          }
          else{
            dispatch(setAlerts("Plese check host and port ","error",true))
           }
     }
     else
     {
      const formData = {...udpState}
      console.log("ip format match",formData.host.match(ipformat),isNaN(formData.port))
      if(formData.host && formData.host.match(ipformat) && !isNaN(formData.port))
       {
        formData.port = Number(formData.port)
        dispatch(addUDP(formData))
       }
       else{
         dispatch(setAlerts("Plese check host and port ","error",true))
        }
     }

    }
    else{
      if(udp)
      {
        dispatch(deleteUDP(udp._id))
      }
    }
 

}

  return <>
 
    
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

     {confirmKeyDelete&& (
      <Confirm
        open={confirmKeyDelete}
        onClose={onKeyDeleteClose}
        onConfirm={onKeyDeleteHandler}
        title='Confirm Delete Api Key?'
        content='Warning! Delete cannot be reversed.'
        handleOpen={onKeyDeleteOpen}
      />
    )}

  
    {addUserDialog&& (<AddUser
       handleClose={handleAddUserClose}
       open={addUserDialog}
      />)}

      {changePassword&& (<ChangePassword
       handleClose={handleCahangePasswordClose}
       open={changePassword}
       userId = {userId}
      />)}
      
      

  <Dialog

  open={props.open}
  onClose={props.handleClose}
  fullWidth
  PaperProps = {{classes : {root: classes.paperRoot}}}
  maxWidth = "md"
  >
     <div className={classes.tabRoot}>
    <DialogContent>
    <AppBar position="static" color="default">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
        allowScrollButtonsMobile>
        <Tab label="User Management" icon={<GroupOutlined  />} {...a11yProps(0)} />
        <Tab label="UDP" icon={<ApiKey/>} {...a11yProps(1)} />
        <Tab label="MQTT" icon={<MQTTIcon/>} {...a11yProps(2)}/>
        
      </Tabs>
    </AppBar>
    <TabPanel value={value} index={0}>
    <div className='text-center'>
     
        <div className={classes.root}>
         {console.log("users", users)}
          {users &&
            users.map((user) => (
            <List component='nav' aria-label='main mailbox folders' key="user._id">
                <ListItem>
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon
                      color={user.role === "admin" ? "secondary" : "primary"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    color='primary'
                  />
                  { <ListItemButton alignItems={"center"}
                  onClick={(e)=>{handleChangePasswordOpen(e,user._id)}}
                   >
                    <PasswordIcon
                      //color={user.role === "admin" ? "secondary" : "primary"}
                    />
                    <ListItemText sx ={{ml:2}}

                    primary = {"Change Password"}/>
                    </ListItemButton>
                 }  
                </ListItem>
              </List>
            ))}
        </div>
      
    </div>
     {/*
    <Tooltip title='Add User'>
      <Fab
        color='primary'
        aria-label='add'
        onClick={handleAddUserOpen}
        className = {classes.fab}
        size='large'
      >
        <Add />
      </Fab>
    </Tooltip>
     */} 
    </TabPanel>
    <TabPanel value={value} index={1}>
         <Stack direction="column" spacing={2} useFlexGap sx={{ml:5,mr:5}}>
         <FormControlLabel control={<Checkbox checked = {udpState.udpChecked} onChange={onUdpChange}/>} label="Enable" />
         
          <TextField 
                                       
                                       label="IP address"
                                       size="small"
                                      name="ip"
                                       InputLabelProps={{
                                          shrink: true,
                                          }}

                                       value={udpState.host}   
                                       //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                       
                                       onChange = {onUdpTextChange}
                                         />   
        
          <TextField 
                                       name="port"
                                       label="Port"
                                       size="small"
                                       value={udpState.port}                 
                                       InputLabelProps={{
                                          shrink: true,
                                          }}
                                       //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                       
                                       onChange = {onUdpTextChange}
                                         /> 
           <Stack direction={"row"} spacing={3}  justifyContent="flex-end">
           <Button variant="contained"
                         
                           onClick ={handleUdpClear}
                            size="small" >Clear</Button>
             <Button variant="contained"
                         
                         onClick ={handleUdpSave}
                          size="small" >Save</Button>                
            </Stack>                                
         
         </Stack>



        {/*<TableContainer component={Paper} className ={classes.tableProp}>
          <Table stickyHeader size="small"> 
          <TableHead>
        <TableRow>
          <StyledTableCell>Project Name</StyledTableCell>
          <StyledTableCell align="right">Delete</StyledTableCell>
          
        </TableRow>
      </TableHead>
      <TableBody>
            {apiKeys && apiKeys.map((el)=>(
              <TableRow key= {el._id}>
                   <TableCell>{el.projectName}</TableCell>
                   <TableCell align="right"> 
                   <Tooltip title='Delete this ApiKey'>
                   <IconButton aria-label='delete' onClick={() => onKeyDeleteOpen(el._id)} size="large">
                    {
                     
                        <DeleteOutlined color='secondary' />
                      
                    }
                  </IconButton>
                  </Tooltip>
                  </TableCell>
                </TableRow>
            ))}
        </TableBody> 
           </Table>
          </TableContainer>
          <Tooltip title='Generate ApiKey'>
          <Fab
        color='primary'
        aria-label='add'
        className = {classes.fab}
        onClick={handleGenerateKeyOpen}
        size='large'
      >
        <ApiKey2/>
      </Fab>
                  </Tooltip>*/}
    </TabPanel>
    <TabPanel value={value} index={2}>
    <Stack direction="column" spacing={2} useFlexGap sx={{ml:5,mr:5}}>
         <FormControlLabel control={<Checkbox checked ={mqttState.mqttChecked} 
         onChange={onMqttChange} 
         />} label="Enable" />
         
          <TextField 
                                       
                                       label="IP address"
                                       size="small"
                                      name="host"
                                       InputLabelProps={{
                                          shrink: true,
                                          }}
                                       //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                       value={mqttState.host}
                                       onChange = {onMqttTextChange}
                                         />   
        
          <TextField 
                                       name="port"
                                       label="Port"
                                       size="small"
                                       //size="small"
                                       InputLabelProps={{
                                          shrink: true,
                                          }}
                                       //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                       value = {mqttState.port}
                                       onChange = {onMqttTextChange}
                                         /> 
            <TextField 
                                       name="username"
                                       label="username"
                                       size="small"
                                       value = {mqttState.username}
                                       InputLabelProps={{
                                          shrink: true,
                                          }}
                                       //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                       
                                       onChange = {onMqttTextChange}
                                         /> 
            <TextField 
                                       name="password"
                                       label="password"
                                       size="small"
                                       type="password"
                                       InputLabelProps={{
                                          shrink: true,
                                          }}
                                       //inputProps={{ pattern :"/^-?\d*\.?\d*$/" , placeholder : anchorLoc[currentAnc].y  }}
                                       value ={mqttState.password}
                                       onChange = {onMqttTextChange}
                                         />                                                           
           <Stack direction={"row"} spacing={3}  justifyContent="flex-end">
           <Button variant="contained"
                         
                           onClick ={handleMqttClear}
                            size="small" >Clear</Button>
             <Button variant="contained"
                         
                         //onClick ={handleAddMaster}
                         onClick={handleMQttSave}
                          size="small" >Save</Button>                
            </Stack>                                
         
         </Stack>


    </TabPanel>
    </DialogContent>
    </div>
    </Dialog>
 
  
  </>;
};



const mapStateToProps = (state) => ({
  users: state.auth.users,
  userRole: state.auth.role,
  apiKeys: state.apiKey.apiKeys
});



export default User;
