import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, ButtonBase, Button } from '@mui/material'
import { getPlaybackData } from "../../feature/linkedTagPlayer/linkedTagPlayerThunk";
import { Link,  useNavigate } from "react-router-dom";
import {setCurrentFloorIndex ,getFloorplansForCurrentBuilding,setCurrentFloorPlanId } from '../../feature/floorplan/floorplanSlice'
import { getDisplayFloorplan } from '../../feature/floorplan/floorplanThunk';
import { setLoaded3D } from "../../feature/auth/authSlice";
import dayjs from 'dayjs';
import { setDisplayCharts } from "../../feature/linkedTagPlayer/linkedTagPlayerSlice";
import { toggleView } from "../../feature/layerSlice";


const LapList = ({records})=>{
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const height = useSelector(state=>state.dimension.height)
    const width = useSelector(state=>state.dimension.width)
    const floorPlans = useSelector((state)=>state.floorplan.floorplans)
    const floorIndex = useSelector((state)=>state.floorplan.floorPlanIdx) 
    const [selectedRow, setSlectedRow] = useState(0)
    useEffect(()=>{
        console.log('Width : ', width)
    },
    [width, height])
    // const [lapList, setLapList] = useState([])
    // const laps = useSelector(state=>state.linkedTagPlayer.laps)
    // useEffect(()=>{
    //     if(laps.length>0)
    //     setLapList(laps)
    // },
    // [laps])

    const handleClick = (data, index)=>{
        console.log(data)
        // const duration = {timeStart : data.start_time, timeStop : data.stop_time}
        setSlectedRow(index)
        dispatch(getPlaybackData(data.id))
        // dispatch(setLoaded3D(false))
        dispatch(setDisplayCharts(true))
        // dispatch(toggleView())
        // navigate(`/playback`)
    }

    return <Box sx={{zIndex:'drawer',  }}>
        <TableContainer component={Paper} >
    <Table  aria-label="simple table" >
      <TableHead>
        <TableRow selected={false}>
          {/* <TableCell>ID</TableCell> */}
          <TableCell align="right">Start Time</TableCell>
          <TableCell align="right">Stop Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((record, index) => (
            
          <TableRow onClick={()=>handleClick(record, index+1)} key={record.id} sx={{cursor:'pointer'}} selected={selectedRow === index+1}>
            {/* <TableCell align="left">{record.id}</TableCell> */}
            <TableCell align="right">{dayjs.unix(record.start_time).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
            <TableCell align="right">{dayjs.unix(record.stop_time).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
    </Box>
}

export default LapList
