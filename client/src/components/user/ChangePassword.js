

import React, { useEffect, useState } from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { connect, useDispatch, useSelector } from "react-redux";

import {Dialog, DialogContent, DialogActions} from "@mui/material"
import TextField from "@mui/material/TextField";

import { Button,InputAdornment,IconButton } from "@mui/material";
import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { FogExp2 } from "three";
import {removeToken } from "../../feature/apiKey/apiKeySlice";
import { generateApiKey } from "../../feature/apiKey/apiKeyThunk";
import DisplayApiKey from "./DisplayApiKey";
import { Visibility,VisibilityOff } from "@mui/icons-material";
import { updatePassword } from "../../feature/auth/authThunk";
import { setAlerts } from "../../_actions/alertAction";
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
    actionRoot : {justifyContent: "center"}  
  }));



  const ChangePassword = (props) => {

    //const apiToken= useSelector((state)=>state.apiKey.apiToken)
    const dispatch = useDispatch()
    const classes = useStyles();
    const [showCurrentPassword,setShowCurrentPassword] = useState(false) 
    const [showNewPassword,setShowNewPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        passwordCurrent:"",
        password:"",
        passwordConfirm:"",

      });
      //const { projectName } = formData;

    const onChangeHandler = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };  
   

      const handleAPiKeyClose = (e)=>{
          dispatch(removeToken())
          props.handleClose()

      }

      const onSubmitHandler = (e) => {
        e.preventDefault();
        if(!formData.passwordCurrent)
        {
       // dispatch(generateApiKey(formData))
         dispatch(setAlerts("Please enter existing password", "error",true)) 
         return
       
        } 
        if(formData.password===formData.passwordConfirm)
        {
            const data = {...formData, _id:props.userId}
            dispatch(updatePassword(data))
            props.handleClose()
        }
        else{
          dispatch(setAlerts("New password and confirm password mismatch!!", "error",true)) 

        }
      };
    
      const handleClickShowCurrentPassword =(e)=>{
            setShowCurrentPassword(show=>!show)

      }

      const handleClickShowNewPassword =(e)=>{
        setShowNewPassword(show=>!show)
       }


  

      const handleMouseDownPassword=(e)=>{
        e.preventDefault()
      }

   return(
      <>
        {console.log("change password",props.userId)}
     
       <Dialog
       open={props.open}
       onClose={props.handleClose}
       aria-labelledby='form-dialog-title'
       fullWidth
       PaperProps = {{classes : {root: classes.paperRoot}}}
       >
          
           <form >
           <DialogContent>
            <Typography variant='h6'>Change Password</Typography>
            <br />
            
            <TextField
              onChange={(e) => onChangeHandler(e)}
              placeholder='Enter current password'
              margin='dense'
              label='Existing password'
              type={showCurrentPassword?"text":"password"}
              name='passwordCurrent'
              value={formData.passwordCurrent}
              variant='outlined'
              //helperText = "Name of client software/system that will access api"
              InputLabelProps={{
                shrink: true,
                
              }}

              InputProps={{
                endAdornment:(  <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowCurrentPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>)
              }}
              
              required={true}
              fullWidth
            />
            <TextField
              onChange={(e) => onChangeHandler(e)}
              placeholder='Enter new password'
              margin='dense'
              label='New password'
              type={showNewPassword?"text":"password"}
              name='password'
              value={formData.password}
              variant='outlined'
              //helperText = {}
             InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment:(  <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>)
              }}
              required={true}
              fullWidth
            />
            <TextField
              onChange={(e) => onChangeHandler(e)}
              placeholder='confirm new  password'
              margin='dense'
              label='confirm  password'
              type="password"
              name='passwordConfirm'
              value={formData.passwordConfirm}
              variant='outlined'
              helperText = {formData.passwordConfirm!=="" && formData.password!==formData.passwordConfirm?
              "New password and confirm password mismatch":""}
              InputLabelProps={{
                shrink: true,
              }}

              
              required={true}
              fullWidth
            />
           
       </DialogContent>
       <DialogActions classes = {{root : classes.actionRoot }}>
            
            <Button
              color='primary'
              variant='contained'
              onClick={props.handleClose}
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
            </DialogActions>  
          </form>
         
         
        
       </Dialog>     



      </>
    

   )

  }
  const mapStateToProps = (state) => ({
   apiToken : state.apiKey.apiToken
  });

  export default ChangePassword;