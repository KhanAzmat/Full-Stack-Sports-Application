import { MenuItem, Avatar, ButtonBase, Menu } from '@mui/material'
import { CirclePicker, CompactPicker, TwitterPicker } from 'react-color'
import { useEffect, useState } from 'react'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useSelector } from 'react-redux';

const ColorPicker = ({ colorSelected, defaultColor})=>{
    const playerToEdit = useSelector(state=>state.player.player)
    const [teamColor, setTeamColor] = useState(defaultColor?defaultColor:'gray')
    const [anchorEl, setAnchorEl] = useState(null)
    const openPicSelection = Boolean(anchorEl)
    // useEffect(()=>{
    //     setTeamColor(playerToEdit?.color?playerToEdit.color:'gray')
    // },
    // [playerToEdit])

    const chooseColor = (event)=>{
        console.log('Update Pic')
        // setOpenPicSelection(true)
        setAnchorEl(event.target)
    }

    const closeChooseColor = ()=>{
        setAnchorEl(null)
    }

    const handleChange = (color, event)=>{
        setTeamColor(color.hex)
        colorSelected(color.hex)
        // chooseColor(color.hex)
        closeChooseColor()
        
    }

    return <>
    <ButtonBase onClick={chooseColor}>
    <Avatar variant='rounded' sx={{color:teamColor, bgcolor:teamColor}}/>
    </ButtonBase>
    

    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openPicSelection}
        onClose={closeChooseColor}
        // onClick={closeChooseColor}
        // PaperProps={{
        //   elevation: 0,
        //   sx: {
        //     overflow: 'visible',
        //     filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        //     mt: 1.5,
        //     '& .MuiAvatar-root': {
        //       width: 32,
        //       height: 32,
        //       ml: -0.5,
        //       mr: 1,
        //     },
        //     '&:before': {
        //       content: '""',
        //       display: 'block',
        //       position: 'absolute',
        //       top: 0,
        //       right: 14,
        //       width: 10,
        //       height: 10,
        //       bgcolor: 'background.paper',
        //       transform: 'translateY(-50%) rotate(45deg)',
        //       zIndex: 0,
        //     },
        //   },
        // }}
        // transformOrigin={{ horizontal: 'center', vertical: 'center' }}
        // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={closeChooseColor}>
        <TwitterPicker triangle='hide' onChange={handleChange}/>
        </MenuItem>
      </Menu>
    </>
}

export default ColorPicker