import * as React from 'react';
import {Box, Radio, RadioGroup, FormLabel, FormControlLabel, CardMedia, Button, DialogTitle, DialogContent, DialogContentText, TextField, Dialog, DialogActions, Backdrop, CircularProgress, CardContent, Card, Typography, Grid, FormControl, Badge, IconButton} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { editServer } from '../../feature/server/serverThunk';

const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditForm = (props) => {
  const dispatch = useDispatch()
  const serverToEdit = useSelector(state=>state.server.configServer)
  const [displayImage, setDisplayImage] = useState(null)
  const [imageFile, setImageFile] = useState(undefined)
  // const [serverInput, setServerInput] = useState({
  //   name : '',
  //   location : '',
  //   image : '',
  // })
  const inputFile = useRef(null)
  const nameInput = useRef(null)
  const locInput = useRef(null)
  
  const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);

useEffect(()=>{
    setOpen(props.open)
},
[props.open])

// useEffect(()=>{
//   console.log('Name', serverInput.name)
//   console.log('Location',serverInput.location)
//   console.log('Image',serverInput.image)
//   // handleClose()
//   // setOpen(false)
//   //   props.editServer()
// },
// [serverInput])

  const handleClose = () => {
    setOpen(false)
    props.editServer()
};

const handleSave = (event)=>{
    event.preventDefault()
    console.log(imageFile)
    let formData  = new FormData()
    formData.append('name', nameInput.current.value?nameInput.current.value : '')
    formData.append('location', locInput.current.value?locInput.current.value : '')
    formData.append('server', imageFile)
    console.log('FormData : ', ...formData)
   let  serverInput = {
    id : serverToEdit._id,
    data : formData
    }

    dispatch(editServer(serverInput))
    
    handleClose()
} 

const chooseImage = ()=>{
  inputFile.current.click()
}

const changeImage = (event)=>{
  event.preventDefault()
  setImageFile(event.target.files[0])
  // setServerInput(prevState => ({...prevState, image : file}))
  setDisplayImage(URL.createObjectURL(event.target.files[0]))
}
  return <>
  <input type='file' id='file' ref={inputFile} style={{display:'none'}} accept="image/png, image/jpeg, image/jpg" onChange={changeImage}/>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 , padding:25}}
        open={open}
        // onClick={handleClose}
      >
        {/* <CircularProgress color="inherit" /> */}
        {/* <Badge 
        badgeContent={<IconButton onClick={handleClose} color='error'>
            <CancelIcon fontSize='large' />
        </IconButton>}
        // color='transparent'
        > */}
        <Box>
        <Badge 
        badgeContent={<IconButton onClick={handleClose} color='error'>
            <CancelIcon fontSize='large' />
        </IconButton>}
        // color='transparent'
        >
        <Card elevation={10} sx={{ borderRadius:4}} >
            <CardContent sx={{mr:-4, mt:-2, mb:-3}}>
            <Grid container justifyItems='center' alignItems='center' flexDirection='row' >
                    <Grid item xs={6} flexDirection='column' sx={{mt:-2}}> 
            <form noValidate autoComplete='off' onSubmit={handleSave}>
                <FormControl>
                
                    <Grid item  flexDirection='row' sx={{mt:3}} >
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Server Name</Typography>
                        <TextField inputRef={nameInput} label='' variant='outlined' size='small' placeholder={serverToEdit.name} sx={{input:{
                          '&::placeholder':{
                            opacity:1,
                          }
                        }}}></TextField>
                    </Grid>

                    <Grid item flexDirection='column'  sx={{mt:3}}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Server Location</Typography>
                        <TextField inputRef={locInput} label='' variant='outlined' size='small' placeholder={serverToEdit.location} sx={{input:{
                          '&::placeholder':{
                            opacity:1,
                          }
                        }}}></TextField>
                    </Grid>

                    <Grid item flexDirection='row' sx={{mt:3}}>
                        <Typography variant='body2' justifySelf='center' alignSelf='center'>Server Status</Typography>
  <RadioGroup
    defaultValue="Offline"
    name="radio-buttons-group"
    row
  >

    {serverToEdit.status && <FormControlLabel value="Online" control={<Radio sx={{'&.Mui-checked': {color: 'green', },}}/>} label="Online" />}
    {!serverToEdit.status &&  <FormControlLabel value="Offline" control={<Radio sx={{'&.Mui-checked': {color: 'red', },}}/>} label="Offline" />}
   
    
  </RadioGroup>
                    </Grid>

                    <Button sx={{position:'relative', left:250, width:'40%', mr:2, mb:1}} variant="contained" type='submit'>Save</Button>
                    </FormControl>
        </form>
                    </Grid>
                    
                    <Grid item xs={6} display='flex' justifyContent='center' alignContent='center' overflow='hidden'>
                    
                    <CardMedia
            component="img"
            height="300"
            sx={{minWidth:'40vw', maxWidth:'40vw', objectFit:'fill'}}
            image={displayImage ? `${displayImage}` : `/uploads/serverImage/${serverToEdit.image}`}
            alt="server image"
            onClick={chooseImage}
          />
          
                    </Grid>
                   
                </Grid>
                
            </CardContent>
        </Card>
        </Badge>
        </Box>
        
      </Backdrop>
  </>

}


export default EditForm