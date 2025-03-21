import React from "react";
import AuthAppBar from "../UI/AuthAppBar";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import {
  BuildOutlined,
  LinkOutlined,
  LocalOfferOutlined,
  LocalShippingOutlined,
  GroupAddOutlined,
  ApartmentOutlined,
  BorderInnerOutlined,
  LocalMallOutlined,
} from "@mui/icons-material";
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

function ListItemLink(props) {
  return <ListItem button component='a' {...props} />;
}

const Configuration = ({role}) => {
  const titleIcon = <BuildOutlined color='primary' fontSize='large' />;

if(role === 'user') {
    return (
      <Redirect to='/' />
    )
}
  return (
    <div className=''>
      <AuthAppBar title='Configuration' icon={titleIcon} />

      <div className='row'>
        <div className='col-sm-8 text-center'>
          <div
            className=''
            style={{
              paddingTop: "135px",
              paddingBottom: "135px",
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to='/addBuilding'
            >
              Start Configuration
            </Button>
            <br />

            <br />
            <p>
              Click on start configuration button above to start the
              step-by-step process of configuring the application.
            </p>
          </div>
        </div>

        <div className='col-sm-4'>
          <Paper className=' p-3 '>
            <Typography variant='h6'>Configuration Menu</Typography>
            <List component='nav'>
             
              
              <ListItemLink to='/asset' component={Link}>
                <ListItemIcon>
                  <LocalShippingOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Asset' />
              </ListItemLink>

              <ListItemLink to='/item' component={Link}>
                <ListItemIcon>
                  <LocalMallOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Item' />
              </ListItemLink>

              <ListItemLink to='/employee' component={Link}>
                <ListItemIcon>
                  <GroupAddOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Employee' />
              </ListItemLink>

              {/* <ListItemLink component={Link} to='/anchor'>
                <ListItemIcon>
                  <MemoryOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Anchor' />
              </ListItemLink>
               */}
              <ListItemLink to='/tag' component={Link}>
                <ListItemIcon>
                  <LocalOfferOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Tag' />
              </ListItemLink>

              <ListItemLink to='/linkTag' component={Link}>
                <ListItemIcon>
                  <LinkOutlined color='primary' />
                </ListItemIcon>
                <ListItemText primary='Link Tags' />
              </ListItemLink>
            </List>
          </Paper>
        </div>
      </div>
    </div>
  );
};


const mapStateToProps = (state) => ({
  role: state.auth.role
});

export default connect(mapStateToProps)(Configuration);
