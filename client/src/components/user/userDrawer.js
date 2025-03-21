import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles"
import { Drawer, Divider,  ListItemAvatar, ListItemButton, keyframes, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { GroupOutlined } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import Confirm from "../UI/Confirm";
import { logout } from "../../feature/auth/authSlice";

const expand = keyframes`
from {
  transform: scale(0.95);
}
to {
  transform: scale(1.0);
}`;


const RTLSListButton = styled(ListItemButton)(({ theme }) => ({
    "&.Mui-selected": {
      background: `linear-gradient(60deg,${theme.palette.primary.light},${theme.palette.secondary.main})`,
      //background : "none",
      color: "#fff",
    },
    "&.MuiListItemButton-root:hover": {
      backgroundColor: "#D3D3D3",
      borderRadius: "12px 12px 12px 12px",
  
      animation: `${expand} 1s alternate infinite ease`,
    },
    "&.MuiListItemButton-root": {
      borderRadius: "0 12px 12px 0",
    },
  
    "&.MuiListItemButton-root .MuiListItemIcon-root:hover": {
      animation: `${expand} 0.5s alternate infinite ease`,
    },
  }));
  

const UserDrawer = (props) => {
    const [openDrawer, setOpenDrawer] = useState(props.open)
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const dispatch = useDispatch();

const handleDrawer = ()=>{
    setOpenDrawer(false)
    setTimeout(()=>{
    props.close()
    }, 1000)
}

const handleLogoutOpen = () => {
    setLogoutConfirm(true);
    };

const handleLogoutClose = () => {
setLogoutConfirm(false);
};

const onLogoutHandler = () => {
    dispatch(logout());
    //history.push("/login");
  };

  return (
    <React.Fragment>
        
        {logoutConfirm && (
        <Confirm
          title="Are you sure you want to Sign Out?"
          open={logoutConfirm}
          handleOpen={handleLogoutOpen}
          onClose={handleLogoutClose}
          onConfirm={onLogoutHandler}
        />
      )}

    <Drawer open={openDrawer} onClose={handleDrawer} >
        <Divider variant="middle" sx={{mt:'10%'}}/>
         
        <List>
          <ListItem  disablePadding>
            <ListItemButton>
              <ListItemIcon>
              <KeyIcon fontSize='small'/>
              </ListItemIcon>
              <ListItemText primary={'Change Password'} />
            </ListItemButton>
          </ListItem>

          <ListItem  disablePadding>
            <ListItemButton onClick={handleLogoutOpen}>
              <ListItemIcon>
              <LogoutIcon fontSize='small'/>
              </ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItemButton>
          </ListItem>
      
      </List>
                <Divider variant='middle'/>
        </Drawer>

        </React.Fragment>
  )
}



export default UserDrawer;