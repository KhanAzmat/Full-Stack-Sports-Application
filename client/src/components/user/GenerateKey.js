

import React, { useEffect, useState } from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { connect, useDispatch, useSelector } from "react-redux";

import {Dialog, DialogContent, DialogActions} from "@mui/material"
import TextField from "@mui/material/TextField";

import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { FogExp2 } from "three";
import {removeToken } from "../../feature/apiKey/apiKeySlice";
import { generateApiKey } from "../../feature/apiKey/apiKeyThunk";
import DisplayApiKey from "./DisplayApiKey";
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



  const GenerateApiKey = (props) => {

    const apiToken= useSelector((state)=>state.apiKey.apiToken)
    const dispatch = useDispatch()
    const classes = useStyles();
    const [formData, setFormData] = useState({
        projectName :""
      });
      const { projectName } = formData;

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
        if(formData.projectName)
        {
        dispatch(generateApiKey(formData))
       
        }
        else
        {
         alert("Plese enter Project Name")
        }
      };
    

   return(
      <>

      {apiToken && <DisplayApiKey
      open = {apiToken}
      handleClose = {handleAPiKeyClose}
      />}

       <Dialog
       open={props.open}
       onClose={props.handleClose}
       aria-labelledby='form-dialog-title'
       fullWidth
       PaperProps = {{classes : {root: classes.paperRoot}}}
       >
          
           <form >
           <DialogContent>
            <Typography variant='h6'>Generate Api key</Typography>
            <br />
            
            <TextField
              onChange={(e) => onChangeHandler(e)}
              placeholder='Enter project name'
              margin='dense'
              label='Project Name'
              type='text'
              name='projectName'
              value={projectName}
              variant='outlined'
              helperText = "Name of client software/system that will access api"
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
              onClick={(e) => onSubmitHandler(e)}
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

  export default GenerateApiKey;