import {Divider, MenuItem, ListItemIcon, Menu, Typography, Card, Backdrop, FormControl, FormControlLabel, TextField, Grid, RadioGroup, Button, Radio, CardContent, Badge, Avatar, ButtonBase } from "@mui/material"
import { useState, useRef, useEffect } from "react"
// import PicSelection from "./PicSelection"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SportsMenu from "./sportMenu";
import ColorPicker from "../players/ColorPicker";

import { Link } from "react-router-dom";
// import EditDisplay from "./EditPicture";
import EditPicture from "../players/EditPicture";
import { addTeam, editTeam } from "../../feature/team/teamThunk";
import { useDispatch } from "react-redux";


const TeamForm = (props)=>{
  const dispatch = useDispatch()
  const [imageFile, setImageFile] = useState('')
  const [image, setImage] = useState(props.team?.image? `/uploads/teamImage/${props.team.image}`:null)
  const nameRef = useRef('')
  const locRef = useRef('')
  const [sport, setSport] = useState('')
  const [color, setColor] = useState('')
  const [nameError, setNameError] = useState(false)
    const [avatarImage, setAvatarImage] = useState(null)
    const [editPicture, setEditPicture] = useState(false)
    const inputFile = useRef(null)
    const [openCamera, setOpenCamera] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    // const [openPicSelection, setOpenPicSelection] = useState(false)
    const openPicSelection = Boolean(anchorEl)

    const handleClose = ()=>{
        setOpen(false)
        props.onClose()
    }

    const handleSave = (event)=>{
        console.log('Close Form')
      event.preventDefault()
      console.log(props.team?.name)
      console.log(`Name : ${nameRef}`)
    if(!nameRef.current.value?.trim() && !props.team?.name){
      setNameError(true)
      return
    }
    else{
      console.log(imageFile)
      let formData  = new FormData()
      formData.append('name', nameRef.current.value?.trim())
      formData.append('location', locRef.current.value?.trim())
      formData.append('sports', sport)
      formData.append('color', color)
      formData.append('image', imageFile)
      if(props.team){
        console.log(...formData)
        let teamInput = {
          id : props.team._id,
          formData : formData
        }
        dispatch(editTeam(teamInput))
      }
      else{
        dispatch(addTeam(formData))
      }
      // let playerInput = {
      //   id : props.player._id,
      //   data : formData
      // }
      // dispatch(editPlayer(playerInput))
      handleClose()
    }
    // handleClose()

        handleClose()
    }   

    const updateDPic = (event)=>{
        console.log('Update Pic')
        // setOpenPicSelection(true)
        setAnchorEl(event.target)
        inputFile.current.click()
    }

    const closeCamera = ()=>{
        setOpenCamera(false)
    }

    const closePicSelection = (event)=>{
        if(event.target && event.target.id === 'camera')
            setOpenCamera(true)
        // setOpenPicSelection(false)

        else if(event.target && event.target.id === 'folder'){
          inputFile.current.click()
        }
        setAnchorEl(null)
    }

    const handleNewImage = (e)=>{
      console.log('Inside Input files')
      console.log(e.target.files[0])
      setAvatarImage(e.target.files[0])
      setImageFile(e.target.files[0])
      setImage(URL.createObjectURL(e.target.files[0]))
      // setEditPicture(true)
    }

    const cropImage = (img)=>{
      setImage(img)
      setEditPicture(false)
    }

    const handleSportSelection = (value)=>{
      setSport(value)
    }

    const handleColorSelection = (value)=>{
      setColor(value)
    }

    const resetError = ()=>{
      setNameError(false)
    }

    return <>
    {editPicture && <EditPicture open={editPicture} image={avatarImage} onCrop={cropImage}/>}

           <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={props.open}
 
>
<Badge 
  anchorOrigin={{
    vertical:'-20%',
    horizontal:'left'
  }}
  overlap="circular"
  badgeInset='10px'
        badgeContent={
    <ButtonBase onClick={updateDPic}>
         <input type="file" accept="image/*" id="file" ref={inputFile} style={{display:'none'}} onChange={handleNewImage}/>
        <Avatar src={image}  sx={{height:100, width:100}}/>
    </ButtonBase>
        }
        // color='transparent'
        sx={{mt:8, ml:6}}
        >
<Card elevation={5} sx={{ borderRadius:5}}>
           <CardContent sx={{mt:6}}>
           <form noValidate autoComplete='off' onSubmit={handleSave}>
                <FormControl>
                <Grid container rowGap={6} justifyItems='center' alignItems='center' flexDirection='column' sx={{mr:7, ml:3}}>
                    <Grid container  spacing={3} flexDirection='row' justifyItems='center' alignItems='center'  >
                        <Grid item  xs={4}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Team Name</Typography>
                        </Grid>
                        <Grid item xs={8} >
                        <TextField 
                        onFocus={()=>resetError('name')}
                        inputRef={nameRef} label='' variant='outlined' size='small' sx={{justifySelf:'center', input:{
                          '&::placeholder':{
                            opacity:1,
                          }}}}
                        error={nameError} helperText={nameError?'Please enter a valid name.':''}
                        placeholder={props.team?props.team.name:''}/>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} flexDirection='row' justifyItems='center' alignItems='center' >
                    <Grid item  xs={4}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Team Location</Typography>
                        </Grid>
                        <Grid item xs={8}>
                        <TextField inputRef={locRef} label='' variant='outlined' size='small' sx={{justifySelf:'center', input:{
                          '&::placeholder':{
                            opacity:1,
                          }}}}
                          placeholder={props.team?props.team.location:''}/>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} flexDirection='row' justifyItems='center' alignItems='center' >
                    <Grid item  xs={4}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Sports Type</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <SportsMenu chooseSport={handleSportSelection} defaultSport={props.team?.sports?props.team.sports.toLowerCase():''}/>                       
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} flexDirection='row' justifyItems='center' alignItems='center' >
                    <Grid item  xs={4}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Team Color</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <ColorPicker colorSelected={handleColorSelection} defaultColor={props.team?.color?props.team.color:undefined}/>                       
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} flexDirection='row' justifyContent='end' sx={{pr:4}}>
                    
                    <Button variant="contained" type='button' sx={{mr:1, minWidth:'23%' }} onClick={handleClose}>Cancel</Button>  

                    <Button variant="contained" type='submit' sx={{ml:1, minWidth:'23%'}} >Save</Button>                      
                        
                    </Grid>

                    
                    </Grid>
                    </FormControl>
        </form>
          </CardContent>
        
      </Card>

        </Badge>
</Backdrop>

    </>
}

export default TeamForm