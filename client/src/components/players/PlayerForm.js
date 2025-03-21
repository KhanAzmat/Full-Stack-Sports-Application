import {Divider, MenuItem, ListItemIcon, Menu, Typography, Card, Backdrop, FormControl, FormControlLabel, TextField, Grid, RadioGroup, Button, Radio, CardContent, Badge, Avatar, ButtonBase } from "@mui/material"
import { useState, useRef, useEffect } from "react"
// import PicSelection from "./PicSelection"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FolderIcon from '@mui/icons-material/Folder';
import TeamDropdown from "./TeamDropdown";
import ColorPicker from "./ColorPicker";
import Camera from "./Camera";
import { Link } from "react-router-dom";
import EditDisplay from "./EditPicture";
import EditPicture from "./EditPicture";
import { addPlayer, editPlayer } from "../../feature/player/playerThunk";
import { useDispatch } from "react-redux";
import { clearPlayer, setPlayerToEdit } from "../../feature/player/playerSlice";


const PlayerForm = (props)=>{
  const dispatch = useDispatch()
  // useEffect(()=>{
  //   console.log('Call SetPlayerToEdit')
  //   dispatch(setPlayerToEdit(props.player))
  //   return ()=>{
  //     console.log('Unmount useEffect')
  //     dispatch(clearPlayer())
  //   }
  // },[])
  const [image, setImage] = useState(props.player?.image? `/uploads/playerImage/${props.player.image}`:null)
  const [imageFile, setImageFile] = useState('')
  const [nameError, setNameError] = useState(false)
  const [initialsError, setInitialsError] = useState(false)
  const nameRef = useRef(props.player?.name?props.player.name:null)
  const initialsRef = useRef(props.player?.initials?props.player.initials:null)
  const [color, setColor] = useState('')
  const [teamSelected, setTeamSelected] = useState('')
    const [avatarImage, setAvatarImage] = useState(null)
    const [editPicture, setEditPicture] = useState(false)
    const inputFile = useRef(null)
    const [openCamera, setOpenCamera] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    
    // const [openPicSelection, setOpenPicSelection] = useState(false)

    // useEffect(()=>{
    //   if(avatarImage){
    //     setEditPicture(true)
    //   }
    // },
    // [avatarImage])
    const openPicSelection = Boolean(anchorEl)
    const handleClose = ()=>{
        setOpen(false)
        if(props.close)
          props.close()
    }

    const handleSave = (event)=>{        
      event.preventDefault()
      console.log(props.player?.name)
      console.log(`Name : ${nameRef}, Initials : ${initialsRef.current.value}`)
    if(!nameRef.current.value?.trim() && !props.player?.name){
      setNameError(true)
      return
    }
    if(!initialsRef.current.value?.trim() && !props.player?.initials){
      setInitialsError(true)
      return
    }
    else{
      let formData  = new FormData()
      // formData.append('name', nameRef.current.value?.trim()?nameRef.current.value.trim():'')
      // formData.append('initials', initialsRef.current.value.trim()?initialsRef.current.value.trim():'')
      // formData.append('team',teamSelected)
      // formData.append('color', color)
      // formData.append('image', imageFile)
      // console.log(nameRef.current.value?.trim()?nameRef.current.value.trim():'')
      // formData.name = nameRef.current.value?.trim()?nameRef.current.value.trim():''
      // formData.initials = initialsRef.current.value?.trim()
      formData.append('name', nameRef.current.value?.trim())
      formData.append('initials', initialsRef.current.value?.trim())
      formData.append('team', teamSelected)
      formData.append('color', color)
      formData.append('player', imageFile)
      console.log(teamSelected)
      if(props.player){
        console.log(...formData)
        let playerInput = {
          id : props.player._id,
          formData : formData
        }
        dispatch(editPlayer(playerInput))
      }
      else{
        dispatch(addPlayer(formData))
      }
      // let playerInput = {
      //   id : props.player._id,
      //   data : formData
      // }
      // dispatch(editPlayer(playerInput))
      handleClose()
    }
    // handleClose()
    }   

    const updateDPic = (event)=>{
        // event.preventDefault()
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
      
      // setEditPicture(true)
      setAvatarImage(e.target.files[0])
      setImageFile(e.target.files[0])
      setImage(URL.createObjectURL(e.target.files[0]))
    }

    const cropImage = (imgFile)=>{
      setImageFile(imgFile)
      setImage(URL.createObjectURL(imgFile))
      setEditPicture(false)
    }

    const teamSelect = (team)=>{
      console.log('Team Select : ', team)
      setTeamSelected(team)
    }

    const selectColor = (hex)=>{
      console.log(hex)
      setColor(hex)
    }

    const resetError = (comp)=>{
      if(comp === 'name')
      setNameError(false)
      if(comp === 'initials')
      setInitialsError(false)
    }

    console.log('Player : ', props)

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
        <Avatar src={image}  sx={{height:100, width:100,display:'flex', justifyContent:'center', alignContent:'center'}}/>
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
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Player Name</Typography>
                        </Grid>
                        <Grid item xs={8} >
                        <TextField onFocus={()=>resetError('name')} inputRef={nameRef} label='' variant='outlined' size='small'
                        sx={{justifySelf:'center', input:{
                          '&::placeholder':{
                            opacity:1,
                          }}}} 
                        error={nameError} helperText={nameError?'Please enter a valid name.':''}
                        placeholder={props.player?props.player.name:''}></TextField>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} flexDirection='row' justifyItems='center' alignItems='center' >
                    <Grid item  xs={4}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Initials</Typography>
                        </Grid>
                        <Grid item xs={8}>
                        <TextField onFocus={()=>resetError('initials')} inputRef={initialsRef} label='' variant='outlined' size='small' 
                        sx={{input:{
                          '&::placeholder':{
                            opacity:1,
                          }}}}
                        error={initialsError} helperText={initialsError?'Please enter Initials.':''}
                        placeholder={props.player?props.player.initials:''}></TextField>
                        </Grid>
                    </Grid>

                    {
                      props.player && <Grid container spacing={3} flexDirection='row' justifyItems='center' alignItems='center' >
                      <Grid item  xs={4}>
                          <Typography variant='body2' justifySelf='center' alignSelf='center'>Team</Typography>
                          </Grid>
                          <Grid item xs={8}>
                              {/* <TeamDropdown select={teamSelect} defaultTeam={props.player?.team?props.player.team:undefined}/>                    */}
                              <TextField label='' variant='outlined' size='small' 
                          sx={{input:{
                            '&::placeholder':{
                              opacity:1,
                            }}}}
                           placeholder={props.player.team?props.player.team.name:'Not Assigned'} disabled={true}></TextField>
                          </Grid>
                      </Grid>
                    }

                    <Grid container spacing={3} flexDirection='row' justifyItems='center' alignItems='center' >
                    <Grid item  xs={4}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Color</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <ColorPicker colorSelected={selectColor} defaultColor={props.player?.color?props.player.color:undefined}/>                       
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

export default PlayerForm