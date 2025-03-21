import { Box, Paper, Typography } from "@mui/material";
// import { styled } from '@mui/material/styles'


const Header = ({ box1_h, box2, label })=>{
    return <>
    {/* <Box position='fixed'>
    </Box> */}

<Box sx={{
        width:`100vw`,
        height:`${box1_h}vh`,
        boxShadow:2,
        borderRadius:3,
        background:'linear-gradient(90deg, rgba(251,150,30,1) 0%, rgba(6,2,43,1) 92%)',
    }}></Box>

    <Box 
    display='flex'
    justifyContent='center'
    sx={{
        marginTop:'-2vh',        
        zIndex:'drawer',
    }}> 
        <Paper elevation={3} sx={{
            width:`${box2.width}vw`,
            height:`${box2.height}vh`,
            borderRadius:'10px 10px 10px 10px',
            padding:1.2
        }}>
        <Typography sx={{ fontWeight:500 }} >{label}</Typography>
        </Paper>

    </Box>
    </>
   
}

export default Header;