// import logo from './logo.svg';
import { useEffect, useState, useRef } from 'react';
// import './App.css';
import { Box, Button, IconButton, Fab, Grid } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

const Camera = () => {
  const videoRef = useRef(null)
  const photoRef = useRef(null)
  const [hasPhoto, setHasPhoto] = useState(false)

  useEffect(()=>{
    getVideo()
  },
  [videoRef])

  const getVideo = ()=>{
    navigator.mediaDevices.getUserMedia({
      video:{facingMode:'environment'}
    })
    .then(stream=>{
      let video = videoRef.current
      video.srcObject = stream
      video.play()
    })
    .catch(err=>{
      console.log(err)
    })
  }

//   const getPhoto = ()=>{
//     const width =  414
//     const height = width/(16/9)

//     let video = videoRef.current
//     let photo = photoRef.current
     
//     photo.width = width
//     photo.height = height

//     let ctx = photo.getContext('2d')
//     ctx.drawImage(video, 0, 0, width, height)

//     setHasPhoto(true)
//   }

  const closePhoto = ()=>{
    let photo = photoRef.current
    let ctx = photo.getContext('2d')

    ctx.clearRect(0, 0, photo.width, photo.height)

    setHasPhoto(false)
  }

  return (<>
     <Box className='camera'
     > 
      <video disablepictureinpicture ref={videoRef} width='100%' height='100%' />

      <Grid spacing={4} container flexDirection='row' justifyContent='center'>
        <Grid item>
        <Fab size="large" color="primary" aria-label="add">
  <ArrowLeftIcon sx={{fontSize:'400% '}}/>
</Fab>
        </Grid>
      <Grid item>
      <Fab size="large" color="primary" aria-label="add">
  <RadioButtonCheckedIcon sx={{fontSize:'400% '}}/>
</Fab>
</Grid>
      </Grid>
      {/* <Button 
    //   onClick={getPhoto}
      >Snap</Button> */}
     </Box>

     <Box className={'result'+(hasPhoto ? 'hasPhoto':'')}>
      <canvas ref={photoRef}></canvas>
      <Button onClick={closePhoto}>Close</Button>
     </Box>
     </>
  );
}

export default Camera;
