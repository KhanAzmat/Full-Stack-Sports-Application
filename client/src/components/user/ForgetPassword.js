

import React, { useEffect, useState } from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { connect, useDispatch, useSelector } from "react-redux";

import {Dialog, DialogContent, DialogActions} from "@mui/material"
import {Card, CardActions, CardContent, CardHeader,Stack} from "@mui/material"
import TextField from "@mui/material/TextField";

import { Button,InputAdornment,IconButton } from "@mui/material";
import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { FogExp2 } from "three";
import {removeToken } from "../../feature/apiKey/apiKeySlice";
import { generateApiKey } from "../../feature/apiKey/apiKeyThunk";
import DisplayApiKey from "./DisplayApiKey";
import { Visibility,VisibilityOff } from "@mui/icons-material";
import { forgotPassword } from "../../feature/auth/authThunk";
import { setAlerts } from "../../_actions/alertAction";

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';



const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};



const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      paddingTop: "30px",
      paddingLeft: "30px",
      paddingRight: "30px",
    },
    paperRoot : {
      borderRadius : '30px'
    },
    actionRoot : {justifyContent: "center", marginTop:1}  
  }));



  const ForgetPassword = (props) => {

    //const apiToken= useSelector((state)=>state.apiKey.apiToken)
    const dispatch = useDispatch()
    const classes = useStyles();
    const [showCurrentPassword,setShowCurrentPassword] = useState(false) 
    const [showNewPassword,setShowNewPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        email:""

      });
      //const { projectName } = formData;

    const onChangeHandler = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };  
   


      const onSubmitHandler = (e) => {
        e.preventDefault();
        if(formData.email!=="" && validateEmail(formData.email))
        {
          dispatch(forgotPassword(formData))
        }
        else{
          dispatch(setAlerts("Invalid email","error",true))
        }
        
      };
    
      

   return(
      <>
        <Stack
        direction="row"
  justifyContent="space-around"
  alignItems="center"
  
  spacing={2}
  sx={{width:"100%",height:"100vh"}}

  >
       <Card
         sx={{maxWidth:500,minWidth:350}}
       >
          
           
           <CardContent>
            <Typography variant='h6'>Reset Password</Typography>
           
            
            <TextField
              onChange={(e) => onChangeHandler(e)}
              placeholder='Enter registered email'
              margin='dense'  
              label='email'
              type="text"
              name='email'
              value={formData.email}
              variant='outlined'
              helperText = {formData.email!=="" && (! validateEmail(formData.email))?"Invalid Email Id": ""}
              InputLabelProps={{
                shrink: true,
                
              }}

              InputProps={{
                startAdornment:(  <InputAdornment position="start">
                <IconButton
                  aria-label="toggle password visibility"
                  //onClick={handleClickShowCurrentPassword}
                  //onMouseDown={handleMouseDownPassword}
                  edge="start"
                >
                  <EmailRoundedIcon/>
                </IconButton>
              </InputAdornment>)
              }}
              
              required={true}
              fullWidth
            />
            
       </CardContent>
       <CardActions classes = {{root : classes.actionRoot }}>
            
            <Button
              color='primary'
              variant='contained'
              //onClick={props.handleClose}
            >
              
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
            onClick={ onSubmitHandler}
            >
              
              Submit{" "}
            </Button>
            </CardActions>  
          
         
         
        
       </Card>     

    </Stack>

      </>
    

   )

  }  
  const mapStateToProps = (state) => ({
   apiToken : state.apiKey.apiToken
  });

  export default ForgetPassword;