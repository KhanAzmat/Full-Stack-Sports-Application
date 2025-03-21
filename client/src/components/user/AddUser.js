

import React, { useEffect, useState } from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { connect, useDispatch,useSelector } from "react-redux";
import {addUser,getUsers} from "../../feature/auth/authThunk";
import {Dialog, DialogContent, DialogActions} from "@mui/material" 
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined"

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



  const AddUser = (props) => {
    const dispatch = useDispatch()
    const classes = useStyles();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "",
      });
      const { name, email, password, passwordConfirm, role } = formData;

    const onChangeHandler = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };  
   

      const onSubmitHandler = (e) => {
        e.preventDefault();
        if(formData.name && formData.email && formData.password && formData.passwordConfirm && formData.role)
        {
          if(formData.password === formData.passwordConfirm)
          {
        dispatch(addUser(formData))
        props.handleClose()
          }
          else
          {
            alert("password and confirm password did not match!!")   
          }
        }
        else
        {
         alert("Plese enter requitred field")
        }
      };
    

   return <>

    <Dialog
    open={props.open}
    onClose={props.handleClose}
    aria-labelledby='form-dialog-title'
    fullWidth
    PaperProps = {{classes : {root: classes.paperRoot}}}
    >
       <AuthAppBar title='Add User' icon={<PersonOutlineOutlinedIcon/>} />
        <form >
        <DialogContent>
         
         
         <FormControl variant='outlined'>

         <InputLabel id="projectLabel">Role</InputLabel>
           
           <Select
             variant="standard"
             labelId='projectLabel'
             label='Role'
             name='role'
             value={role}
             onChange={(e) => onChangeHandler(e)}
             required={true}>
             <MenuItem value='admin'>Admin</MenuItem>
             <MenuItem value='user'>User</MenuItem>
           </Select>
         </FormControl>
         <TextField
           onChange={(e) => onChangeHandler(e)}
           placeholder='Enter Full Name'
           margin='dense'
           label='Name'
           type='text'
           name='name'
           value={name}
           variant='outlined'
           InputLabelProps={{
             shrink: true,
           }}
           required={true}
           fullWidth
         />
         <TextField
           onChange={(e) => onChangeHandler(e)}
           placeholder='Enter Email Address'
           margin='dense'
           variant='outlined'
           label='Email'
           type='email'
           name='email'
           value={email}
           InputLabelProps={{
             shrink: true,
           }}
           fullWidth
           required={true}
         />
         <TextField
           onChange={(e) => onChangeHandler(e)}
           placeholder='Password'
           margin='dense'
           variant='outlined'
           label='Password'
           type='password'
           name='password'
           value={password}
           InputLabelProps={{
             shrink: true,
           }}
           fullWidth
           required={true}
         />
         <TextField
           onChange={(e) => onChangeHandler(e)}
           placeholder='Confirm Password'
           margin='dense'
           variant='outlined'
           label='Confirm Password'
           type='password'
           name='passwordConfirm'
           value={passwordConfirm}
           InputLabelProps={{
             shrink: true,
           }}
           fullWidth
           required={true}
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



   </>;

  }

  export default AddUser;