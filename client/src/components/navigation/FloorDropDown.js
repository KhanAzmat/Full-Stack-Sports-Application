import * as React from 'react';
import { useEffect, useRef } from 'react';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import {setCurrentFloorIndex ,getFloorplansForCurrentBuilding,setCurrentFloorPlanId } from '../../feature/floorplan/floorplanSlice'
import { getDisplayFloorplan } from '../../feature/floorplan/floorplanThunk';

export default function SelectLabels() {
  
  const dispatch = useDispatch()
  const floorPlans = useSelector((state)=>state.floorplan.floorplans)
  const floorIndex = useSelector((state)=>state.floorplan.floorPlanIdx) 
  const [expanded, setExpanded] = React.useState(false)
  const[state,setState] = React.useState({idx : (floorPlans && floorPlans.length > 0 ? 0 : -1) ,
    disabled : (floorPlans && floorPlans.length >0 ? false : true),
    })

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);



  var itemList =[]
  //console.log(props.floorPlans.length)
  if(floorPlans.length > 0)
  { 
   itemList = floorPlans.map(obj=> obj.floor)
   
  }

  useEffect(()=>{
    // setIdx( props.floorPlans.length > 0 ? props.floorPlanIdx : -1)
    setState({
        ...state,
        idx : (floorPlans && floorPlans.length > 0 ? 0 : -1),
       disabled : (floorPlans && floorPlans.length > 0 ?false : true),
      
    })
     
     console.log(floorPlans[0])
 },[floorPlans])

 useEffect(()=>{
  // setIdx( props.floorPlans.length > 0 ? props.floorPlanIdx : -1)
  if(floorPlans && floorPlans.length>0 )
  {
  setState({
      ...state,
      idx : floorIndex
  })
}
   console.log("Effect" + (floorPlans.length))
},[floorIndex])


const [floor, setFloor] = React.useState('');



//console.log(itemList)
const handleClose=(event)=>{
        
  setExpanded(!expanded)
  
  if (anchorRef.current && anchorRef.current.contains(event.target)) {
    return;
  }

  if("tabIndex" in event.currentTarget )
  {
  setState({...state,
            idx:event.currentTarget.tabIndex,
           })
  //console.log(event.currentTarget.tabIndex)
  const i =event.currentTarget.tabIndex
  dispatch(setCurrentFloorIndex(i))
  const info ={id: floorPlans[i]._id, floor: floorPlans[i].floor, 
             }
  console.log(floorPlans[i])
  dispatch(setCurrentFloorPlanId(info))
 // console.log(props.floorPlans[i].id)
 dispatch(getDisplayFloorplan(floorPlans[i]._id))
 // props.getGltfOfFloor(props.floorPlans[i].id)
  
  //props.setBackdrop(true);

  }
  setOpen(false);
  }

   //////////New  button functions ///////////
   const handleToggle = () => {
    setExpanded(!expanded)
    setOpen((prevOpen) => !prevOpen);
    console.log("Expanded",expanded)
    
  };

  ////////////handle list key down///////
  function handleListKeyDown(event) {
    console.log("event key",event.key)
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => {
    setFloor(event.target.value);
  };


const floors = [1]
  return (
    
    <TextField
      size="small"
      label={ state.idx > -1 ? itemList[state.idx]:"N / A"}
      // label='Floor'
      disabled={("disabled" in state)? state.disabled : false}
      ref={anchorRef}
      aria-controls={open ? 'menu-list-grow' : undefined}
      aria-haspopup='true'
      onClick={handleToggle}
      sx={{ width: 80,}}
      select
      value={floor}
      onChange={handleChange}
      InputLabelProps={{
        sx: { fontSize: '15px' },
      }}
    >
      {itemList.map((item, index) => (
        <MenuItem key={index} value={item} tabIndex={index}>
          {item}
        </MenuItem>
      ))}
    </TextField>
  
  );
}


const mapSubStateToProps = (state) => ({
  floorPlans: state.floorplan.floorplans,
  floorIndex: state.floorplan.floorPlanIdx,

});
