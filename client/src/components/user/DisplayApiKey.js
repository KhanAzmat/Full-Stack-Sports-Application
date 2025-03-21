


import React, { useEffect, useState } from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { connect , useDispatch,useSelector} from "react-redux";
import {addUser,getUsers} from "../../_actions/authAction";
import {Dialog, DialogContent, DialogActions} from "@mui/material"
import TextField from "@mui/material/TextField";

import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

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
    } ,
    actionRoot : {justifyContent: "center"}    
  }));



  const DisplayApiToken = (props) => {
    const apiToken = useSelector((state)=>state.apiKey.apiToken)
    const dispatch = useDispatch()
    const classes = useStyles();

    
  const handleBackDropClick=()=>{
    ///Do nothing
  }


  const copyToClipBoard=(e)=>{
    navigator.clipboard.writeText(apiToken.token)
    alert("Token copied to clipboard")
  }  
  
  const handleDialogClose = (event,reson)=>{
    if(reson==="escapeKeyDown" || reson==="backdropClick")
    {
      //Do nothing
      console.log("reson>>",reson)
    
    }
  }

    

   return(
      <>

       <Dialog
       open={props.open}
       onClose={handleDialogClose}
       aria-labelledby='form-dialog-title'
       fullWidth
       PaperProps = {{classes : {root: classes.paperRoot}}}
       >
          
           <form >
           <DialogContent>
            <Typography variant='body'>Please Copy This API key and store it into safe place. It cant be retrived again. </Typography>
            <br />
            
            <TextField
              margin='dense'
              label='API Key'
              type='text'
              name='projectName'
              multiline
               maxRows={4}
              value={apiToken.token}
              variant='outlined'
              InputLabelProps={{
                shrink: true,
                readOnly:true
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
              
              Close
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={copyToClipBoard}
              
            >
              
              Copy
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
   
  
    
  export default DisplayApiToken;