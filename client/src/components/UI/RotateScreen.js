import { Box, Backdrop }  from '@mui/material'

const RotateScreen = ({open , width, height })=>{
    console.log('Inside Rotate Screen', open)

    return <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 , padding:25}}
      open={open}
      // onClick={handleClose}
    >
      <Box
      component='img'
      sx={{
        height:'100vh',
        width:'100vw',
      }}
      src='/static/media/rotate.jpg'/>
      
    </Backdrop>
</>
}

export default RotateScreen