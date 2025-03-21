
import React, { useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import {getConfigFloorplan} from '../../feature/floorplan/floorplanThunk'
import { resetConfigFloor } from '../../feature/floorplan/floorplanSlice'
import { useEffect } from 'react'
import {connect,useDispatch,useSelector} from 'react-redux'
import { AppBar, Toolbar} from '@mui/material';
import ProgressBar from './ProgressBar'
import { useState } from 'react'



const ProcessFloorId=(props)=>{
    const [configured, setConfigured] = useState(false)
    // const [floorplans, setFloorplans] = useState(null)
    const param = useParams()
  const dispatch = useDispatch()


useEffect(()=>{
    dispatch(resetConfigFloor())
   dispatch(getConfigFloorplan(param.id))

   console.log('on reload', floorplan)
   console.log('on reload', param.id)

   
},[])

const floorplan = useSelector(state=>state.floorplan.configFloor)

useEffect(()=>{
    if(floorplan){
        setConfigured(floorplan.data.configured)
    }
    
  }, [floorplan])


    

  


//   const configured = location?.state?.configured ? location.state.configured:null
  console.log(`ID : ${param.id}  Configured: ${configured}`)

   return (
       <>
       {console.log("parameter id:", param.id)}
       <AppBar position="fixed" sx={{ width:{xl:'94vw', lg:'103vw'},  borderRadius:'10px 0 0 10px', bgcolor:'transparent', boxShadow:0}}>
        <Toolbar >
          
        <ProgressBar  id={param.id} configured={configured}/>

        </Toolbar>
      </AppBar>
       </>
   )

}

export default  (ProcessFloorId)