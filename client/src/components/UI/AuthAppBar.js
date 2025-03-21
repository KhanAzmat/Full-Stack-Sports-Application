import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function AuthAppBar(props) {
  return (
    <div>
      <AppBar position='static' className='bg-grey mb-1' elevation={0}>
        <Toolbar>
          <Typography variant='h6'>
            {props.icon} {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
