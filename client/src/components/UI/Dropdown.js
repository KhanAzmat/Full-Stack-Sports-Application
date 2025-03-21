import * as React from "react";
import { Link } from "react-router-dom";

import { MenuItem, Menu, Button, Divider, List } from "@mui/material";
import { BuildOutlined } from "@mui/icons-material";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls='basic-menu'
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{
          color: "#ffffff",
        }}
      >
        <BuildOutlined
          style={{
            color: "#ffffff",
          }}
        />
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        style={{
          minWidth: "400px",
        }}
      >
        <List>
          <MenuItem onClick={handleClose} to='/building' component={Link}>
            Building
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} to='/floorplan' component={Link}>
            Floor Plan
          </MenuItem>
          <Divider />

          <Divider />
          <MenuItem onClick={handleClose} to='/asset' component={Link}>
            Asset
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} to='/item' component={Link}>
            Item
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} to='/employee' component={Link}>
            Employee
          </MenuItem>
          <Divider />

          <MenuItem onClick={handleClose} to='/tag' component={Link}>
            Tag
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} to='/linkTag' component={Link}>
            Link Tag
          </MenuItem>
        </List>
      </Menu>
    </div>
  );
}
