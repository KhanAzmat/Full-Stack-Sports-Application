




import { styled, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import * as React from "react";
//import Drawer from "@mui/material/Drawer";
import { ButtonGroup, CardContent, Collapse, Drawer, keyframes, ListItemButton, InputAdornment, TextField, Paper, Grid, Item } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Asset from "../asset/Asset";
import Floorplan from "../floorplan/Floorplan";
import Tag from "../tag/Tag";
import { AssetIcon, TagIcon } from "./CustomIcon";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ComputerIcon from '@mui/icons-material/Computer';
import { GroupOutlined, ReplyAllTwoTone } from "@mui/icons-material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Box, ListItemAvatar, Slide, Stack, Card, Chip, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { setColor } from "../../feature/color/colorSlice";
import User from "../user/User";
import { LogoSingle } from "./CustomIcon";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
//import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logout, setLoaded3D } from "../../feature/auth/authSlice";

//import { getOrganisations } from "../../_actions/organisationAction";
import Moment from "react-moment";
import { showFloorMenu } from "../../feature/floorplan/floorplanSlice";
import Confirm from "./Confirm";
import { HomeScreenModal } from "./HomeScreenModal";
import UserDrawer from "../user/userDrawer";
import { setTagData } from "../../feature/tag/tagSlice";
import { getAllAnchors } from "../../feature/anchor/anchorThunk";
import RouterIcon from '@mui/icons-material/Router';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StyleIcon from '@mui/icons-material/Style';
import GroupsIcon from '@mui/icons-material/Groups';
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';
import DatePickers from "../navigation/DatePickers";
import PlayerList from "../navigation/PlayerList";
import { getLapsByCriteria, getPlayersByDate } from "../../feature/linkedTagPlayer/linkedTagPlayerThunk";
import { clearPlayer } from "../../feature/player/playerSlice";
import { clearLapList, clearPlayerList } from "../../feature/linkedTagPlayer/linkedTagPlayerSlice";
import LapList from "../navigation/LapList";


const drawerWidth = 240;
const appBarMargin = 200;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  hover: {
    backgroundColor: theme.palette.primary.main,
  },
  appBar: {
    width: `calc(100% - ${appBarMargin * 2}px)`,
    marginLeft: `${appBarMargin}px`,
    marginRight: `${appBarMargin}px`,

    borderRadius: "30px",
    //opacity : 0.75,
    // background: `linear-gradient(60deg,${theme.palette.secondary.main},${theme.palette.primary.main})`

    //background: theme.palette.primary.main,
    backdropFilter: "blur(5px)",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  appBaricon: {
    marginLeft: "auto",
  },
  drawer: {
    
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: "border-box",
    borderRadius: "0px 30px 30px 0px",
    //backdropFilter : "blur(5px)"
    //opacity : 0.75
  },

  settingsPaper: {
    width: drawerWidth,
    boxSizing: "border-box",
    borderRadius: "30px 0px 0px 30px",
    //opacity : 0.75
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "center",
  },

  drawerSlide: { direction: "up", in: true },
  content: {
    flexGrow: 1,
    position: "relative",
    //top: "0px",
    //padding: theme.spacing(0),
    /*transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),*/
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  headTitle: {
    margin: "auto",
  },
  ListItemText: {
    fontFamily: "Roboto",
  },
  ListItem: {
    borderRadius: "20px",
    "&:hover $icon": {
      //background:theme.palette.primary.main,
      background: "#363636",
      //background: 'linear-gradient(45deg, #022CFA 30%, #2BFF36 90%)',
      color: "#fff",
    },
    "&:hover": {
      //background: theme.palette.primary.main,
      //background: 'linear-gradient(45deg, #022CFA 30%, #2BFF36 90%)',
      background: `linear-gradient(45deg, #363636 30%, #FDB913 90%)`,
      color: "#fff",
    },
  },
  icon: {
    color: theme.palette.primary.main,
  },
  bottomPush: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 10,
    //background: "#ccc",
    background: "#b6b5fe",

    width: "100%",
  },
  settingCard : {
    zIndex : theme.zIndex.drawer
  },

  settingTextField: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '18px',
    padding: '4px 8px',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.contrastText,
    // border: `1px solid ${theme.palette.primary.dark}`,
    height: '35px',
  },

  textField: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.contrastText,
    // width: '100%',
    // padding: '15px 20px',
    flexGrow: 1,
    marginRight: '40px',
    marginBottom: '10px',
    marginLeft: '10px',
  },

  inputRoot: {
    fontSize: '15px', // Adjust the placeholder font size
    position: 'relative',
  },
  inputInput: {
    position: 'relative',
    top: 4,
    left: 0,
    width: '100%',
    padding: '4px', // Adjust the padding as needed
  },
}));


//Drawer type

const openedMixin = (theme) => ({
  width: drawerWidth,
  //background: `linear-gradient(80deg,${theme.palette.secondary.main},${theme.palette.primary.main})`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  //backdropFilter : "opacity(50%)"  ,
});

const closedMixin = (theme) => ({
  //backdropFilter : "opacity(50%)"  ,
  //background: `linear-gradient(80deg,${theme.palette.secondary.main},${theme.palette.primary.main})`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 2px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 2px)`,
  },
});

const expand = keyframes`
from {
  transform: scale(0.95);
}
to {
  transform: scale(1.0);
}`;

const round = keyframes`
from {
  transform: rotate(-5deg);
}
to {
  transform: rotate(5deg);
}`;

const RTLSListButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    background: `linear-gradient(60deg,${theme.palette.primary.light},${theme.palette.secondary.main})`,
    //background : "none",
    color: "#fff",
  },
  "&.MuiListItemButton-root:hover": {
    backgroundColor: "#D3D3D3",
    borderRadius: "12px 12px 12px 12px",

    animation: `${expand} 1s alternate infinite ease`,
  },
  "&.MuiListItemButton-root": {
    borderRadius: "0 12px 12px 0",
  },

  "&.MuiListItemButton-root .MuiListItemIcon-root:hover": {
    animation: `${expand} 0.5s alternate infinite ease`,
  },
}));

const RTLSAvatar = styled(Avatar)(({ theme }) => ({
  background: `linear-gradient(60deg,${theme.palette.primary.main},${theme.palette.secondary.main})`,
  color: "#fff",
  ":hover": {
    animation: `${expand} 0.5s alternate infinite ease`,
  },
}));

const Layout = (props) => {
  console.log(`in Layout : ${props.children[1].props.comp}`);
  
  const dispatch = useDispatch();
  const currentFloor = useSelector((state)=>state.floorplan.displayFloor)
  const user = useSelector((state) =>state.auth.user && state.auth.user.data && state.auth.user.data.name);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.user && state.auth.user.data && state.auth.user.data.role);
  const colorIndex = useSelector((state) => state.color.colorIndex);
  const tagData = useSelector(state=>state.tag.tagData)
  const tags = useSelector(state=>state.tag.tags)
  const anchors = useSelector(state=>state.anchor.anchorList)
  const isMobile = useSelector(state=>state.dimension.isMobile)
  const playerNames = useSelector(state=>state.linkedTagPlayer.playersForPlayback)
  const allLaps = useSelector(state=>state.linkedTagPlayer.laps)
  const showDatePicker = useSelector(state=>state.linkedTagPlayer.displayCharts)
  const [showLapList,setShowLapList] = React.useState(false)
  // const floor = useSelector(state=>state.floorplan.floorPlanId)
  const [floorId, setFloorId] = React.useState(null)
const [numOfAnchors, setNumOfAnchors] = React.useState(0)

  const [endDate, setEndDate] = React.useState({})
  const [startDate, setStartDate] = React.useState({})
  const [startError, setStartError] = React.useState(false)
  const [endError, setEndError] = React.useState(false)
  const [version, setVersion] = React.useState(0)
  const [names, setNames] = React.useState([])

  React.useEffect(()=>{
    if(allLaps && allLaps.length>0){
      setShowLapList(true)
    }
    else setShowLapList(false)
  }
  ,[allLaps])

  React.useEffect(()=>{
    console.log('players for playback', playerNames)
    if(playerNames.length>0)
    setNames([...playerNames])
},
[playerNames])

  React.useEffect(() => {
  dispatch(getAllAnchors())
  dispatch(clearLapList())
  console.log('Dipatched getAllAnchors')
  
  dispatch(clearPlayerList())
  }, []);

  React.useEffect(()=>{
    if(anchors && anchors.length>0){
      setNumOfAnchors(anchors.length)
      console.log('Floorplan idx:',anchors.length)
    }
    },
  [anchors])

React.useEffect(()=>{
  if(startDate && endDate)
  if(Object.keys(startDate).length>0 && Object.keys(endDate).length>0){
    const dates = {
      start : startDate.unix(),
      end : endDate.unix()
    }
    dispatch(getPlayersByDate(dates))
  }
},
[startDate, endDate])

// React.useEffect(()=>{
//   if(tags && tags.length>0)
//   setNumOfTags(tags.length)
// },[tags])

  //let history = useHistory();
const [tagValue, setTagValue] = React.useState('');

  const [openAppBar, setOpenAppBar] = React.useState(true);
  const [openSettings, setOpenSettings] = React.useState(false);
  const onLogoutHandler = () => {
    dispatch(logout());
    //history.push("/login");
  };
  // const colorIndex = props.colorIndex
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [logoutConfirm, setLogoutConfirm] = React.useState(false);
  const [openFloorplan, setOpenFloorplan] = React.useState(false);
  const [openTag, setOpenTag] = React.useState(false);
  const [openAsset, setOpenAsset] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [tab, setTab] = React.useState(-1);
  const [openUserDrawer, setOpenUserDrawer] = React.useState(false)

  const handleOpenUserDrawer=(e)=>{
    handleTabIndex(e);
    setOpenUserDrawer(true);
    handleDrawerClose()
  }

  const handleCloseUserDrawer = ()=>{
    setOpenUserDrawer(false)
  }
  const handleOpenUser = (e) => {
    handleTabIndex(e);
    setOpenUser(true);
    handleDrawerClose();
  };
  const handleCloseUser = () => {
    setOpenUser(false);
  };


  
  const handleTabIndex = (e) => {
    console.log("Button Id", e.target.tabIndex);
    setTab(e.target.tabIndex);
    handleDrawerClose()
    // setOpenFloorplan(true);
    //handleDrawerClose()
  };
  const handleCloseFloorplan = () => {
    setOpenFloorplan(false);
  };

  const handleOpenTag = (e) => {
    handleTabIndex(e);

    setOpenTag(true);
    //handleDrawerClose()
  };
  const handleCloseTag = () => {
    setOpenTag(false);
  };

  const handleOpenAsset = (e) => {
    handleTabIndex(e);
    setOpenAsset(true);
    //handleDrawerClose()
  };
  const handleCloseAsset = () => {
    setOpenAsset(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogoutOpen = () => {
    setLogoutConfirm(true);
  };

  const handleLogoutClose = () => {
    setLogoutConfirm(false);
  };
  const handleFloorMenu = () => {
    dispatch(showFloorMenu());
  };

  const handleAppBar = () => {
    setOpenAppBar(!openAppBar);
  };

  const handleSettingsClose = () => {
    setOpenSettings(false);
  };

  const handleSettingsOpen = () => {
    setOpenSettings(true);
  };

  

  const handleColorChange = (event) => {
    console.log(event.target.tabIndex);
    dispatch(setColor(event.target.tabIndex));
  };
  
  const handleSearch = 
  // (playerList)=>{
    ()=>{
    if(Object.keys(startDate).length<1)
    setStartError(true)
    else if(Object.keys(endDate).length<1)
    setEndError(true)
    else{
      let searchData = {
        // players : playerList,
        startDate : startDate.unix(),
        endDate : endDate.unix()
      }
      dispatch(getLapsByCriteria(searchData))
      setStartDate(null)
      setEndDate(null)
      setVersion(version+1)
      console.log(searchData)

    }

  }

  const handleEndDate = (date)=>{
    console.log('End Date : ', date)
    setEndDate(date)
  }
  const handleStartDate = (date)=>{
    console.log('Start Date : ', date);
    setStartDate(date)
  }

  console.log("layout props>>", props);
  console.log(props.name)
  return (
    <React.Fragment>
      <CssBaseline />
      <HomeScreenModal />
      {openFloorplan && (
        <Floorplan handleClose={handleCloseFloorplan} open={openFloorplan} />
      )}

      {openTag && <Tag handleClose={handleCloseTag} open={openTag} />}

      {openAsset && <Asset handleClose={handleCloseAsset} open={openAsset} />}

      {openUser && <User handleClose={handleCloseUser} open={openUser} />}

      {openUserDrawer && <UserDrawer open={openUserDrawer} close={handleCloseUserDrawer}/>}

      {logoutConfirm && (
        <Confirm
          title="Are you sure you want to Sign Out?"
          open={logoutConfirm}
          handleOpen={handleLogoutOpen}
          onClose={handleLogoutClose}
          onConfirm={onLogoutHandler}
        />
      )}
      <Box
        sx={{
          display: "grid",
          height: "100%",
          width: "100",
          gridTemplateRows: "130px 1fr",
          gridTemplateColumns: "1fr",
          gridTemplateAreas: `"appBar"
                                        "main" `,
        }}
      >
        {props.children[1].props.comp === 'navigation' && <Box
          sx={{
            gridArea: "appBar",
            display: "grid",
            gridTemplateRows: "repeat(10,1fr)",
            gridTemplateColumns: "repeat(260, 1fr)",
          }}
        >
          {!isMobile && 
          <Card className={classes.settingCard} sx={{
            gridRow:'5/10',
            gridColumn:{
              xl:'3/53',
              md:'3/60',
            },
            justifyContent:'center',
            alignItems:'center',
            overflow:'hidden',
          }}  >
            
              <Stack 
              direction='row' 
              spacing={0} 
              justifyContent='center' 
              alignItems='center' 
             
              divider={<Divider  orientation="vertical" flexItem  sx={{position:'relative', ml:{xl:'1.5vh',lg:'1.5vh'}, mr:{xl:'1.5vh',lg:'1.5vh'}}}/>}
              sx={{mr:{xl:'0.5vw', lg:'0.2vw'}, mt:{xl:'0.8vh',lg:'1.7vh'}, ml:{xl:'0.5vw', lg:'0.2vw'}}}>
                <Stack spacing={0.4} alignItems="center" justifyContent="center" sx={{width:{xl:'5vw', lg:'6vw'}}}>
                <ComputerIcon fontSize="medium" sx={{color:'red'}}/>
                <Typography  align="center" sx={{fontSize:{xl:'0.6vw', lg:'0.7vw'}, fontWeight:'500'}} >RTLS Connected</Typography>
                </Stack>
               
                <Stack spacing={0.4} alignItems="center" justifyContent="center" sx={{width:{xl:'5vw', lg:'6vw'}}}>
                <GpsFixedIcon fontSize="medium" sx={{color:'green'}}/>
                <Typography sx={{fontSize:{xl:'0.6vw', lg:'0.7vw'}, fontWeight:'500'}}>{`Active Anchors : ${numOfAnchors}`}</Typography>
                </Stack>
               
                <Stack spacing={0.4} alignItems="center" justifyContent="center" sx={{width:{xl:'5vw', lg:'6vw'}}}>
                <LocationOnIcon fontSize="medium" sx={{color:'green'}}/>
                <Typography sx={{fontSize:{xl:'0.6vw', lg:'0.7vw'}, fontWeight:'500'}}>{`Active Tags : ${tags.length}`}</Typography>
                </Stack>
                
              </Stack>
              {/* <Grid position='relative' top='9px' left='13px' container spacing={2} sx={{wrap:'nowrap', marginRight:'-5px'}}>
              <Grid item direction='column' md={3.8} xl={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <ComputerIcon position='relative' left='35px' fontSize="medium" sx={{color:'red'}}/>
                <Typography position='relative' top='5px' left='-6px' align="center" sx={{fontSize:'9px'}} >Software Connected</Typography>
              </Grid>
              <Divider orientation="vertical" flexItem sx={{ mr: "-1px", mt:{
                xl:'16px',
                md:'12px'
              }, 
              mb:{
                xl:'0px',
                md:'12px',
              } }} />
              <Grid item direction='column' md={3.8} xl={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <GpsFixedIcon fontSize="medium" sx={{color:'green'}}/>
                <Typography position='relative' top='5px' left='7px' sx={{fontSize:'9px'}}>Active Anchors</Typography>
              </Grid>
              <Divider orientation="vertical" flexItem sx={{ mr: "-1px", mt:{
                xl:'16px',
                md:'12px'
              },
              mb:{
                xl:'0px',
                md:'12px',
              } }} />
              <Grid item direction='column' md={3.8} xl={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <LocationOnIcon fontSize="medium" sx={{color:'green'}}/>
                <Typography position='relative' top='5px' left='7px' sx={{fontSize:'9px'}}>Active Tags</Typography>
              </Grid>
              </Grid>*/}

           
          </Card> 
}

          {/*Search Bar */}
          <Paper elevation={1} className={`${classes.settingCard} ${classes.settingTextField}`}  sx={{
            gridRow:'2/4',
               gridColumn:{
                xl:'3/40',
                md:'3/55'
               },
          }}>

<Box component='form'
     display="flex" 
     alignItems="center" 
     onSubmit={(e) => {
        e.preventDefault()
        dispatch(setTagData(tagValue));
            setTagValue("")            
          }}>
<IconButton sx={{
            '&:hover':{backgroundColor:'transparent', color:'black'}
          }} disableRipple margin='20px'>
            <MenuIcon style={{fontSize:'20px'}} onClick={handleDrawerOpen} />
          </IconButton>
          <TextField
      variant="standard"
      placeholder="Search Here"
      sx={{mt:'1%'}}
      className={classes.textField}
      InputProps={{
        disableUnderline: true,
        classes: {
          root:classes.inputRoot,
          input: classes.inputInput,  
        }
        
      }}
      value={tagValue}
      onChange={(e) => {
        e.preventDefault();
        // setState({ ...state, tagData: e.target.value });
        
        setTagValue(e.target.value)
        // dispatch(setTagData(e.target.value))
      }}
      />
      <Tooltip title="Search">
      <IconButton type="submit" disableRipple onClick={handleFloorMenu}>
      <SearchIcon fontSize="small"/>
      </IconButton>
      </Tooltip>
          </Box>
          </Paper>
          
          </Box>}

       {/* {props.children[1].props.comp === 'camera' && <></>} */}

       {props.children[1].props.comp !== 'navigation'  && 
       <Box 
       sx={{
         gridArea: "appBar",
         display: props.children[1].props.comp === 'camera'? 'none' : "grid",
         gridTemplateRows: "repeat(10,1fr)",
         gridTemplateColumns: "repeat(260, 1fr)",
       }}
     >

       {/*Menu Icon */}
       {/* <Paper elevation={1} className={`${classes.settingCard} `}  sx={{
         gridRow:'2/4',
            gridColumn:'3/10',
       }}> */}


<IconButton sx={{
          position:'fixed',
          top: 5,
          left: 5,
          zIndex: 'drawer',
          backgroundColor:'white',
          borderRadius:'8px',
         
       }} margin='30px'>
         <MenuIcon style={{fontSize:'20px'}} onClick={handleDrawerOpen} />
       </IconButton>
      
{/* </Paper> */}
</Box>}  

{props.children[1].props.comp === 'playback'  && 
       <Box 
       sx={{
        // zIndex:'drawer',
         gridArea: "appBar",
         display: props.children[1].props.comp === 'camera'? 'none' : "grid",
         gridTemplateRows: "repeat(10,1fr)",
         gridTemplateColumns: "repeat(260, 1fr)",
       }}
     >
<IconButton sx={{
          position:'fixed',
          top: 5,
          left: 5,
          backgroundColor:'white',
          borderRadius:'8px',
         
       }} margin='30px'>
         <MenuIcon style={{fontSize:'20px'}} onClick={handleDrawerOpen} />
       </IconButton>


  {!showDatePicker && 
    <Grid key={version} container position='relative' top={-3} left={50} sx={{zIndex:'drawer'}}>
    <Grid item>
    <DatePickers label='From [Start Date]' chooseDate={handleStartDate} end={endDate} isError={startError}/>
    </Grid>

    <Grid item>
    <DatePickers label='To [End Date]' chooseDate={handleEndDate} start={startDate} isError={endError} />
    </Grid>
    
    <Grid item sx={{position:'relative', top:9, width:'18vw'}}>
    
      <PlayerList search={handleSearch} />
    
    
    </Grid>

    <Grid item sx={{position:'relative', top:30, width:'18vw'}}>
    {showLapList && <LapList records={allLaps}/>}
    </Grid>
  </Grid>
  }


</Box>} 
        
<Drawer
          className={classes.drawer}
          // variant="permanent"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
        >
          <Box>
            <Stack direction="row" spacing={2} sx={{ ml: 2, mt: 2, mb: 2 }}>
              <LogoSingle fontSize="large" />
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main }}
              >
                RTLS Company
              </Typography>
              <IconButton sx={{
            '&:hover':{backgroundColor:'transparent', color:'black'}
          }} disableRipple onClick={handleDrawerClose} >
                <MenuOpenIcon sx={{fontSize:'18px'}} />
              </IconButton>
            </Stack>
          </Box>
          <Divider variant="middle" />
          <List>
            {role === "admin" && (
              <>
                {" "}
                {/* <a className="sidebar-item" href='/floorplan' >*/}{" "}
                {/*<a className="sidebar-item" href='/floorplans'>*/}
                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  onClick={()=>dispatch(setLoaded3D(false))}
                  to={`/`}
                >
                  <RTLSListButton
                    //className = {classes.ListItem}
                    onClick={handleTabIndex}
                    selected={tab === 0}
                    id="FloorButton"
                    tabIndex={0}
                    sx={{ mr: open ? 2 : 0 }}
                  >
                    {tab !== 0 ? (
                      <ListItemIcon sx={{ pointerEvents: "none" }}>
                        <GpsFixedIcon htmlColor="black" />
                      </ListItemIcon>
                    ) : (
                      <ListItemAvatar sx={{ pointerEvents: "none" }}>
                        <RTLSAvatar>
                          <GpsFixedIcon fontSize="large" />
                        </RTLSAvatar>
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      disableTypography={true}
                      sx={{ pointerEvents: "none" }}
                    >
                      <Typography> Object Tracking</Typography>
                    </ListItemText>
                  </RTLSListButton>
                  {/*</a>*/}
                </Link>
                {/**Floor plan link */}
                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/floorplans`}
                >
                  <RTLSListButton
                    //className = {classes.ListItem}
                    onClick={handleTabIndex}
                    selected={tab === 1}
                    id="FloorButton"
                    tabIndex={1}
                    sx={{ mr: open ? 2 : 0 }}
                  >
                    {tab !== 1 ? (
                      <ListItemIcon sx={{ pointerEvents: "none" }}>
                        <MapOutlinedIcon htmlColor="black" />
                      </ListItemIcon>
                    ) : (
                      <ListItemAvatar sx={{ pointerEvents: "none" }}>
                        <RTLSAvatar>
                          <MapOutlinedIcon fontSize="large" />
                        </RTLSAvatar>
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      disableTypography={true}
                      sx={{ pointerEvents: "none" }}
                    >
                      <Typography> Floorplan</Typography>
                    </ListItemText>
                  </RTLSListButton>
                  {/*</a>*/}
                </Link>
                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/tags`}
                >
                  <RTLSListButton
                    //className = {classes.ListItem}
                    onClick={handleTabIndex}
                    selected={tab === 2}
                    tabIndex={2}
                    sx={{ mr: open ? 2 : 0 }}
                  >
                    {tab !== 2 ? (
                      <ListItemIcon sx={{ pointerEvents: "none" }}>
                        <TagIcon
                          //className = {classes.icon}
                          htmlColor="black"
                        />
                      </ListItemIcon>
                    ) : (
                      <ListItemAvatar sx={{ pointerEvents: "none" }}>
                        <RTLSAvatar>
                          <TagIcon
                            //className = {classes.icon}
                            fontSize="large"
                          />
                        </RTLSAvatar>
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary="Tag Management"
                      sx={{ pointerEvents: "none" }}
                    />
                  </RTLSListButton>
                </Link>
                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/assets`}
                >
                  <RTLSListButton
                    //className = {classes.ListItem}
                    onClick={handleTabIndex}
                    selected={tab === 3}
                    tabIndex={3}
                    sx={{ mr: open ? 2 : 0 }}
                  >
                    {tab !== 3 ? (
                      <ListItemIcon sx={{ pointerEvents: "none" }}>
                        <AssetIcon htmlColor="black" />
                      </ListItemIcon>
                    ) : (
                      <ListItemAvatar sx={{ pointerEvents: "none" }}>
                        <RTLSAvatar>
                          <AssetIcon
                            //className = {classes.icon}
                            fontSize="large"
                          />
                        </RTLSAvatar>
                      </ListItemAvatar>
                    )}

                    <ListItemText
                      primary="Tracking"
                      sx={{ pointerEvents: "none" }}
                    />
                  </RTLSListButton>
                </Link>
                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleOpenUser}
                  selected={tab === 4}
                  tabIndex={4}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 4 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <SettingsIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <SettingsIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Settings"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>

                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleTabIndex}
                  selected={tab === 5}
                  tabIndex={5}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 5 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <AnalyticsOutlinedIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <AnalyticsOutlinedIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Gem Analytics"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>


                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/servers`}
                >
                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleTabIndex}
                  selected={tab === 6}
                  tabIndex={6}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 6 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <RouterIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <RouterIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Server"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>
                </Link>   

                 <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/players`}
                >
                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleTabIndex}
                  selected={tab === 7}
                  tabIndex={7}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 7 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <DirectionsRunIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <DirectionsRunIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Players"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>
                </Link> 

                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/tracker`}
                >
                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleTabIndex}
                  selected={tab === 8}
                  tabIndex={8}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 8 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <StyleIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <StyleIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Tracker Settings"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>
                </Link>   
                
                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to={`/team`}
                >
                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleTabIndex}
                  selected={tab === 9}
                  tabIndex={9}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 9 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <GroupsIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <GroupsIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Teams"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>
                </Link>
                  

                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  onClick={()=>dispatch(setLoaded3D(false))}
                  to={`/playback`}
                >
                <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleTabIndex}
                  selected={tab === 10}
                  tabIndex={10}
                  sx={{ mr: open ? 2 : 0 }}
                >
                  {tab !== 10 ? (
                    <ListItemIcon sx={{ pointerEvents: "none" }}>
                      <EmergencyRecordingIcon htmlColor="black" />
                    </ListItemIcon>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none" }}>
                      <RTLSAvatar>
                        <EmergencyRecordingIcon
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="Playback"
                    sx={{ pointerEvents: "none" }}
                  />
                </RTLSListButton>
                </Link>


              </>
            )}
          </List>
          <Divider variant="middle"/>
          <Divider  sx={{position:'relative', top:{xl:'45vh', lg:'20vh'}}}/>
          <RTLSListButton
                  //className = {classes.ListItem}
                  onClick={handleOpenUserDrawer}
                  selected={tab === 7}
                  tabIndex={7}
                  sx={{ mr: open ? 2 : 0 , mt:'100%', mb:'100%', position:'relative', top:{xl:'20vh',lg:'-20vh'}}}
                >
                  {tab !== 7 ? (
                    <ListItemAvatar sx={{ pointerEvents: "none"}}>
                      <Avatar>
                      <GroupOutlined htmlColor="black" />
                      </Avatar>
                    </ListItemAvatar>
                  ) : (
                    <ListItemAvatar sx={{ pointerEvents: "none"}}>
                      <RTLSAvatar>
                        <GroupOutlined
                          //className = {classes.icon}
                          fontSize="large"
                        />
                      </RTLSAvatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    primary="User"
                    sx={{ pointerEvents: "none"}}
                  />
                </RTLSListButton>
                <Divider  sx={{position:'relative', bottom:{xl:'5vh', lg:'60vh'}}}/>
        </Drawer>

        {/* Props Children */}
        <Box sx={{ gridArea: "appBar / appBar / main / main" }}>
          {props.children}
        </Box>
      </Box>
    </React.Fragment>
  );
};

Layout.propTypes = {
  logout: PropTypes.func.isRequired,
  getOrganisations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user && state.auth.user.data && state.auth.user.data.name,
  role: state.auth.user && state.auth.user.data && state.auth.user.data.role,
 // organisations: state.organisation && state.organisation.organisations,
  isAuthenticated : state.auth.isAuthenticated,
  colorIndex : state.color.colorIndex
  
});
export default (Layout);
