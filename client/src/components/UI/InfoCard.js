

import React from "react";
import {connect} from  'react-redux'
import { useEffect,useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { hideInfoCard } from "../../feature/linkedTag/linkedTagSlice";
import Close from "@mui/icons-material/Close";
import { NaturePeopleOutlined } from "@mui/icons-material";
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "5px",
    boxShadow: "0 4px 8px 0 rgba(1,1,1,0.5)",
     maxWidth: "400"
    
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


function ObjectInfoCard(props) {
  const classes = useStyles();

  const [pos,setPos]= React.useState({x:0,y:0,z:0})
  let name=null

  let processMessage = (event) => {
    console.log(event.data)
    let data = JSON.parse(JSON.stringify(event.data));
  console.log(props.tagId)
    if(props.tagId===data.id)
    {

    
        setPos({
          ...pos,
            x: data.x ,
            y: data.y,
            z: data.z
        });
         //  setState({...state})
    }
    ////Route Tagdata hare////
    //this.props.tagPos(
      //data);
  }
  
  const [state,setState] = React.useState({zval:false, 
                                            dataProcessor :  processMessage})


  const handleClose = () => {
    
    props.hideInfoCard()
  };





  ///////Process Mqtt Mesage //////
  

   useEffect(()=>{
    
         return ()=>{
          
            //delete processMessage
           }
   },[])
  

   useEffect(()=>{
    console.log('POS');
    console.log(pos);
   },
   [pos])
 
  return (
    <Card className={classes.root}>
        {console.log(props.tagInfo)}
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            T
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick ={handleClose} size="large">
            <Close />
          </IconButton>
        }
        
        title= { props.tagInfo && props.tagInfo.data ? props.tagInfo.data.tagId: null}
      />
     {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"SS
        title="Paella dish"
     />*/}
      <CardContent>
        <Stack direction={"column"} >
          <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
            <Typography variant="caption">Tag Height :</Typography>  
            <Typography variant="caption">{Number.parseFloat(props.tagInfo.data.height).toFixed(3)}</Typography>  
          </Stack>  
          <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
            <Typography variant="caption">Reg Date :</Typography>  
            <Typography variant="caption">{new  Date(props.tagInfo.data.tagRegDate).toDateString()}</Typography>  
          </Stack>  


           
          
          {props.tagInfo && props.tagInfo.data && props.tagInfo.data.assetinfo ?(<><Stack direction={"row"} gap={2} justifyContent={"space-between"}>
            <Typography variant="caption">Asset Name :</Typography>  
            <Typography variant="caption">{props.tagInfo.data.assetinfo.name}</Typography>  
          </Stack> 

          <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
            <Typography variant="caption">Asset Type :</Typography>  
            <Typography variant="caption">{props.tagInfo.data.assetinfo.assetType}</Typography>  
          </Stack> </> ) : 
                                                                                 (<Typography variant="caption">Tag Yet to be linked</Typography> )}
            
            
            
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
  );
}





const mapStateToProps = (state) => ({
  
    //geofences: state.geofence.geofences,
    //tagInfo: state.tag.tag,
    tagId: state.linkedTag.tagId,
    tagInfo:state.linkedTag.tagInfo,
    showCard : state.linkedTag.showCard
  });
  
  export default connect(mapStateToProps, {
    //tagPos,
   hideInfoCard
  })(ObjectInfoCard);