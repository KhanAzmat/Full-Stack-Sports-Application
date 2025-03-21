import React from "react";
import {connect, useDispatch, useSelector} from  'react-redux'
import { useEffect,useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import {Stack} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import {hideGeofenceCard} from "../../feature/geofence/geofenceSlice"; 
import Close from "@mui/icons-material/Close";
import { NaturePeopleOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "5px",
    boxShadow: "0 4px 8px 0 rgba(1,1,1,0.5)",
     maxWidth: "375"
    
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));


function GeofenceInfoCard(props) {
  const classes = useStyles();

  const showGeofenceCard = useSelector((state)=>state.geofence.showGeofenceCard)
  const geofenceInfo = useSelector((state)=>state.geofence.geofenceInfo)

const dispatch = useDispatch()
  
  const [state,setState] = React.useState({})


  const handleClose = () => {
    
    dispatch(hideGeofenceCard())
  };





  
   
 
  return (
    <Box sx = {{transform : `translate(${props.x}px,${props.y}px)`, display: props.visible?'flex':'none'}}>
    <Card 
    className={classes.root} >
        {/*console.log(geofenceInfo)*/}
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            G
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick ={handleClose} size="large">
            <Close />
          </IconButton>
        }
        
        title= { geofenceInfo ? "Geofence Information": null }
        
      />
     {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
     />*/}
      <CardContent>
        <Stack direction={"column"}>
          <Stack direction={"row"} justifyContent={"space-between"}>
      <Typography  variant="caption" >
         Name :
        </Typography>
      <Typography  variant="caption" >
         {geofenceInfo ?geofenceInfo.selectedGeofenceName:null}
        </Typography>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography  variant="caption" >
         Description :
        </Typography>
        <Typography variant="caption" >
         {geofenceInfo?geofenceInfo.selectedGeofenceDescription:"n/a"}
        </Typography>
        </Stack>
        </Stack>
      </CardContent>
    {/*  <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
        </CardActions>*/}
      
    </Card>
    </Box>
  );
}


const mapStateToProps = (state) => ({
  
    //geofences: state.geofence.geofences,
    //tagInfo: state.tag.tag,
    showGeofenceCard : state.geofence.showGeofenceCard,
    geofenceInfo : state.geofence.geofenceInfo
  });
  
  
export default (GeofenceInfoCard);