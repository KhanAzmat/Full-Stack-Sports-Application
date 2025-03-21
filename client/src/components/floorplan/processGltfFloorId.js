
import React from 'react'
import { useParams } from 'react-router-dom'
import {getConfigFloorplan} from '../../feature/floorplan/floorplanThunk'
import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice'
import { resetFloorGltf } from '../../feature/gltf/gltfSlice'
import { useEffect, useState } from 'react'
import {connect,useDispatch,useSelector} from 'react-redux'
import { AppBar, Toolbar} from '@mui/material';
import ProgressBar from './ProgressBar'


const ProcessGltfFloorId=(props)=>{
    const floorplan = useSelector(state=>state.floorplan.configFloor)
    const [configured, setConfigured] = useState(false)
    const param = useParams()
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(resetConfigFloor())
        dispatch(resetFloorGltf())
       dispatch(getConfigFloorplan(param.id))
    //    if(floorplan){
    //     setConfigured(floorplan.data.configured)
    //     console.log('In Upload GLTF on Reload: ', floorplan)
    //    }
    },[])

    // const floorplan = useSelector(state=>state.floorplan.configFloor)

useEffect(()=>{
    if(floorplan){
        setConfigured(floorplan.data.configured)
        console.log('In Upload GLTF : ', floorplan)
    }
    
  }, [floorplan])


   return (
    <>
    {console.log("parameter id:", param.id)}
    <AppBar position="fixed" sx={{ width:'83%', borderRadius:'10px 0 0 10px', bgcolor:'transparent', boxShadow:0}}>
     <Toolbar >
       
     <ProgressBar  id={param.id} configured={configured}/>

     </Toolbar>
   </AppBar>
    </>
   )

}

export default  (ProcessGltfFloorId)