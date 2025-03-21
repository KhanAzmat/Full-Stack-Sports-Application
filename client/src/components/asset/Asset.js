

import React, { useEffect, useState } from "react";
import {Dialog,DialogActions,DialogContent, Box, Paper} from "@mui/material"
import {
  getAssets,
  setCurrentAsset,
  deleteAsset,
} from "../../feature/asset/assetThunk";
import AddAsset from "./AddAsset";

import AuthAppBar from "../UI/AuthAppBar";
import {
  EditOutlined,
  LocalShippingOutlined,
  Add,
  DeleteOutlined,
} from "@mui/icons-material";
import { Typography, Fab, Tooltip, Grid, LinearProgress, Button } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { AssetIcon } from "../UI/CustomIcon";
import PropTypes from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";

import NotAvailable from "../UI/NotAvailable";
import { Link, Redirect } from "react-router-dom";
import { Material } from "three";
import AssetTable from "./AssetTable";


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
  },
  table: {
    minWidth: 650,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  spinner: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  paperRoot : {
    borderRadius : '30px',
    maxHeight : 700

  }  

}));

const Asset = (props) => {
  const dispatch = useDispatch()
  const assets = useSelector((state)=>state.asset.assets)
  const role = useSelector((state)=>state.auth.role)

  const [addAssetForm, setAddAssetForm] = useState(false);

  
  useEffect(() => {
    dispatch(getAssets());
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();
  const handleClickOpen = () => {
    setAddAssetForm(true);
  };

  const handleClose = () => {
    setAddAssetForm(false);
  };

  


  




  const titleIcon = <AssetIcon color='primary' />;

  

  return (
    <>

      {/* <Dialog
        open={props.open}
         onClose={props.handleClose}
         fullWidth
         PaperProps = {{classes : {root: classes.paperRoot}}}
         maxWidth = "md"
        >
  

     
       <DialogContent>
     */}      
     {addAssetForm && (
        <AddAsset
          handleClose={handleClose}
          open={addAssetForm}
          getEmployees={getAssets}
        />
      )}


<Box sx = {{display:"grid",
                  gridTemplateRows: '1fr 9fr',
                  gridTemplateColumns:'0.5fr 9fr 0.5fr',
                  gridTemplateAreas : `" . . ."
                  ". floor ."`, 
                  height : "100%"
                 }} >

     <Paper elevation={6} sx ={{gridArea:"floor", height : "95%", borderRadius: "10px",p:3}} >
     <AuthAppBar title='Tracked Objects' icon={titleIcon} />
      
      {assets && assets.length > 0 ? (

                    <AssetTable />
         ) : (
        <div className={classes.spinner}>
          <LinearProgress />
          <NotAvailable component='Assets' />
        </div>
      )}
      {/*</DialogContent>
      <DialogActions>*/}
      
      <Tooltip title='Setup tracking'>
        <Fab
          sx = {{ 
            position : "fixed",
         bottom : 55,
        right : 100,
            background: (theme)=>`linear-gradient(60deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color:"#fff"}}
          aria-label='add'
          onClick={handleClickOpen}
          size='large'
        >
          <Add fontSize="large"/>
        </Fab>
      </Tooltip>

      {/*
      </DialogActions>
      </Dialog>
    */}
    </Paper>
    </Box>
    </>
  );
};

Asset.propTypes = {
  assets: PropTypes.array.isRequired,
  getAssets: PropTypes.func.isRequired,
  setCurrentAsset: PropTypes.func.isRequired,
  deleteAsset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  assets: state.asset.assets,
  role: state.auth.role,
});



export default Asset;
