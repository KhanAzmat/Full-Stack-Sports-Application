import { Card, CardContent, Typography, Divider, List,ListItem,ListItemText } from "@mui/material"
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setTagDetails } from "../../feature/linkedTagPlayer/linkedTagPlayerSlice";

// const TagCard = ({lft, tp, pickedTag, posX, close, jumpCount, stepCount})=>{
//     const dispatch = useDispatch()
//     // const tagDetails = useSelector(state=>state.linkedTagPlayer.tagDetails)
//     // useEffect(()=>{
//     //     if(Object.keys(tagDetails).length>0)
//     //     setShowCard
//     // },
//     // [tagDetails])
//     // useEffect(()=>{
//     //     setTimeout(()=>{
//     //         // dispatch(setTagDetails({showCard : false, posX: 0, posY:0, stepCount : 0, jumpCount : 0}))
//     //         close()
//     //     },3000)
//     // },[])

//     return <>
//         {/* <Card sx={{position:'absolute', left:{lft}, top:{tp}}}> */}
//         <Card sx={{position:'absolute', left:lft, top:tp, zIndex:'tooltip'}}>
            // <CardContent>
            // <Typography display='inline' variant='button'>&nbsp;&nbsp;Step Count&nbsp;:&nbsp;</Typography>
            // <Typography display='inline' variant='caption' sx={{mt:'2%'}} > {stepCount}&nbsp;&nbsp;</Typography>
            // <Divider sx={{display:'inline', mt:'-0.15vw'}} orientation='vertical' />
            // <Typography display='inline' variant='button' >&nbsp;&nbsp;Jump Count&nbsp;:&nbsp;</Typography> 
            // <Typography display='inline' variant='caption' sx={{mt:'2%'}}>{jumpCount}&nbsp;&nbsp;</Typography> 
            // </CardContent>
//         </Card>
//     </>
// }

// export default TagCard;

import React, { useState, useEffect } from 'react';
import './Card.css'; // Import CSS for styling

const TagCard = ({lft, tp, pickedTag, posX, close, jumpCount, stepCount, speed}) => {
  const [position, setPosition] = useState({});
// let c = 0;
// let posArr = [0,1,2,3,4,5,6,7,8,9]

  // Update position whenever data changes
  useEffect(() => {
    setPosition(calculateNewPosition());
  }, [pickedTag, lft, tp]);

  // Calculate new position based on data (you can customize this logic)
  const calculateNewPosition = () => {
    // Example logic: Just add some random values for demo
    // const newX = Math.random() ;
    // const newY =  Math.random() ;
    const newX = lft;
    const newY = tp
    return { x: newX, y: newY };
  };

  return (
    <Card
      component='div'
      className="card"
      // style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      sx={{zIndex:'tooltip',
       height:'23.5%', width:'12%',
    }}
    >
        <CardContent
        // sx={{mt:'-2%'}}
        >
            {/* <Typography display='inline' variant='button'>Step Count&nbsp;:&nbsp;</Typography>
            <Typography display='inline' variant='caption' sx={{mt:'2%'}} > {stepCount}&nbsp;&nbsp;</Typography>
            <Divider sx={{display:'inline', mt:'-0.15vw'}} orientation='vertical' />
            <Typography display='inline' variant='button' >&nbsp;&nbsp;Jump Count&nbsp;:&nbsp;</Typography> 
            <Typography display='inline' variant='caption' sx={{mt:'2%'}}>{jumpCount}&nbsp;&nbsp;</Typography>  */}

            <List dense={true} disablePadding={true}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={stepCount}
                    secondary='Step Count'
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText
                    primary={jumpCount}
                    secondary='Jump Count'
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText
                    primary={speed?speed:0}
                    secondary='Speed(m/sec)'
                  />
                </ListItem>
              
            </List>


            </CardContent>
    </Card>
  );
};

export default TagCard;
