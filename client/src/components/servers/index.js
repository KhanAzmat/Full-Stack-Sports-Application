import { Box } from "@mui/material"
import Header from "./pageHeader"
import { useEffect, useState } from "react"
import ActionCard from "./card"
import RotateScreen from "../UI/RotateScreen";
import { useSelector, useDispatch } from "react-redux";
import { getServers } from "../../feature/server/serverThunk";


// function getWindowSize() {
//   const {innerWidth, innerHeight} = window;
//   console.log(window)
//   return {innerHeight, innerWidth}

// }


// const dummyServers = [
//   {
//     id:'1',
//     name : '#Server 1',
//     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a magna metus. Etiam auctor ante ac quam malesuada, ac eleifend justo pellentesque. Pellentesque laoreet quam eu est tincidunt venenatis. Nulla gravida tortor lacus, vitae lobortis lectus interdum ac. Nam dictum turpis diam, vitae mollis nisi pharetra non. Mauris at porttitor diam. Integer justo sapien, condimentum et porttitor at, viverra id mi.',
//     image : 'ground.jpg',
//     online:true
//   },

//   {
//     id:'2',
//     name : '#Server 2',
//     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a magna metus. Etiam auctor ante ac quam malesuada, ac eleifend justo pellentesque. Pellentesque laoreet quam eu est tincidunt venenatis. Nulla gravida tortor lacus, vitae lobortis lectus interdum ac. Nam dictum turpis diam, vitae mollis nisi pharetra non. Mauris at porttitor diam. Integer justo sapien, condimentum et porttitor at, viverra id mi.',
//     image:'grond.jpg',
//     online:true
//   },

//   {
//     id:'3',
//     name : '#Server 3',
//     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a magna metus. Etiam auctor ante ac quam malesuada, ac eleifend justo pellentesque. Pellentesque laoreet quam eu est tincidunt venenatis. Nulla gravida tortor lacus, vitae lobortis lectus interdum ac. Nam dictum turpis diam, vitae mollis nisi pharetra non. Mauris at porttitor diam. Integer justo sapien, condimentum et porttitor at, viverra id mi.',
//     image : 'ground.jpg',
//     online:false
//   },

//   {
//     id:'4',
//     name : '#Server 4',
//     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a magna metus. Etiam auctor ante ac quam malesuada, ac eleifend justo pellentesque. Pellentesque laoreet quam eu est tincidunt venenatis. Nulla gravida tortor lacus, vitae lobortis lectus interdum ac. Nam dictum turpis diam, vitae mollis nisi pharetra non. Mauris at porttitor diam. Integer justo sapien, condimentum et porttitor at, viverra id mi.',
//     image : 'ground.jpg',
//     online:true
//   },
// ]

const Server = ()=>{
  const dispatch = useDispatch()
  const height = useSelector(state=>state.dimension.height)
  const width = useSelector(state=>state.dimension.width)
  const servers = useSelector(state=>state.server.servers)
  useEffect(()=>{
    dispatch(getServers())
  },[])

  useEffect(()=>{
    console.log(servers)
  },
  [servers])

  return <>
  <Box position='fixed' sx={{height:'100vh', touchAction:'none'}} 
  display='flex' 
>
    <Box position='fixed' sx={{zIndex:'drawer'}}>
          <Header box1_h={height<900? 5.6 : 5} box2={height>width? {height:3.8, width:88}:
      height<900? {height:5, width:92} : {height:4.5, width:95}} label={'Server'}/>
  </Box>

    <Box display='flex' flexWrap='wrap' justifyContent='space-around' alignContent='space-around'  pt={12} pl={3} pr={3} pb={3}>
    
    {servers.map(server => <ActionCard key={server.id} server={server}/>)}
    </Box>
    </Box>
  </>
}

export default Server