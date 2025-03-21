import React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button'
import { InputLabel } from '@mui/material';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem';
import { MenuList } from '@mui/material';
import { connect,useDispatch,useSelector} from "react-redux"
//import { ArrowDropDown } from '@mui/icons-material';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
//import { setCurrentBuildingIndex } from '../../_actions/buildingAction'
import {setCurrentFloorIndex ,getFloorplansForCurrentBuilding,setCurrentFloorPlanId } from '../../feature/floorplan/floorplanSlice'
import Icon from "@mui/material/Icon";
//import { Build } from '@mui/icons-material';
import { getGltfOfFloor ,setBackdrop} from '../../feature/gltf/gltfSlice';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx'
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import { ClickAwayListener } from '@mui/material';
import Popper from '@mui/material/Popper';
import { getDisplayFloorplan } from '../../feature/floorplan/floorplanThunk';


const useStyles = makeStyles((theme) => ({
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
    paper: {
      marginRight: theme.spacing(2),
    },
    label : {
      margin : "auto",
      color : "black",
      fontWeight : '430',
      
    }
  }));





///////////COde for sub menu
const pxToRem = (px, oneRemPx = 17) => `${px / oneRemPx}rem`;


function SubMenu (props) {

    const dispatch = useDispatch()
    const floorPlans = useSelector((state)=>state.floorplan.floorplans)
      const floorIndex = useSelector((state)=>state.floorplan.floorPlanIdx) 

    const classes = useStyles()
    const [expanded, setExpanded] = React.useState(false)
    //const[anchorEl, setAnchorEl] = React.useState(null) 
    const[state,setState] = React.useState({idx : (floorPlans && floorPlans.length > 0 ? 0 : -1) ,
                                            disabled : (floorPlans && floorPlans.length >0 ? false : true),
                                            })
    //const[enable,setEnable]=React.useState( props.floorPlans.length > 0 ? true : false )
    

                                 
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
        console.log('tab index', event.currentTarget.tabIndex)
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
  
  
  
  const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }
  
      prevOpen.current = open;
    }, [open]);
  
  
  
  
  




    return(

    <>
           {/* <Button 
                
                disabled={("disabled" in state)? state.disabled : false}
                aria-controls="simple-menu" 
                aria-haspopup="false"  
                variant="contained" 
                color="primary"
                
                
                onClick={handleClick}>
                {console.log(state.disabled)}
                
                
                {
                    
                state.idx > -1 ? itemList[state.idx] : "NOT AVAILABLE"
                }
                <KeyboardArrowDownTwoToneIcon className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}/>            
                </Button>    
        <Menu
            id="simple-menu"
            anchorEl={state.anchorEl}
            keepMounted
            open={Boolean(state.anchorEl)}
            onClose={handleClose}
            
        >
                {itemList.map((item, index) => <MenuItem key={index} onClick={handleClose} tabIndex={index}>{item}</MenuItem>

                )}
            </Menu>*/}

<Button variant='contained'
          color='primary'
          disabled={("disabled" in state)? state.disabled : false}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          sx = {{padding: "4px  1px 4px 10px", textAlign : "center", borderRadius:2 , width:pxToRem(70), height : pxToRem(37),
          
                // background:(theme)=>`linear-gradient(60deg,${theme.palette.primary.light},${theme.palette.secondary.main})`,
                // color:"#fff"
                background:'#eeeeee',
                color:'black'
              
              }}
          >
                    
                      <InputLabel className = {classes.label}>   { state.idx > -1 ? itemList[state.idx]:"N / A"} </InputLabel> 
                     <KeyboardArrowDownTwoToneIcon className={clsx(classes.expand,{[classes.expandOpen]: expanded})}/>      
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition sx= {{zIndex:(theme)=>theme.zIndex.tooltip+10}}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
            <Paper sx= {{zIndex:(theme)=>theme.zIndex.tooltip+10}}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {itemList.map((item, index) => <MenuItem key={index} onClick={handleClose} tabIndex={index}>{item}</MenuItem>)}
                  </MenuList>
                </ClickAwayListener>
            </Paper>
            </Grow>
          )}
        </Popper>





    </>

    );
  }
 
    const mapSubStateToProps = (state) => ({
        floorPlans: state.floorplan.floorplans,
        floorIndex: state.floorplan.floorPlanIdx,

      });

      

      const FloorMenu = (SubMenu)

export  { FloorMenu }

  