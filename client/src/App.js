import { StyledEngineProvider } from "@mui/material/styles";
import React, { Fragment, useEffect } from "react";
import { useOrientation } from 'react-use'
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Alert2 from "./components/UI/Alert";
import { logout } from "./feature/auth/authSlice";
import { getUserCount, loadUser } from "./feature/auth/authThunk";
import setAuthToken from "./utils/setAuthToken";
//import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navigation from "./components/navigation/Navigation2";
import CheckAuth from "./utils/CheckAuth";
//import PreNavigation  from "./components/navigation/preNav";
import AnchorPlan from "./components/floorplan/configureAnchor";
import ConfigureFloorPlan from "./components/floorplan/configureFloorPLan";
import Floorplan from "./components/floorplan/Floorplan";
import ProcessFloorId from "./components/floorplan/processFloorId";
//import Layout from "./components/UI/Layout";
import Asset from "./components/asset/Asset";
import CustomThemeProvider from "./components/customTheme";
import DrawGeofence from "./components/floorplan/configureGeofence";
import ProcessGltfFloorId from "./components/floorplan/processGltfFloorId";
import UploadGltf from "./components/floorplan/uploadGltf";
import Tag from "./components/tag/Tag";
import "@fontsource/public-sans";
import DrawerCard from "./components/navigation/DrawerCard";
import { IPTable } from "./components/floorplan/ManipulateAnchor";
import ForgetPassword from './components/user/ForgetPassword'
import Servers from './components/servers/index'
import Players from "./components/players";
import { handleResize, setIsMobile } from './feature/dimensions/dimSlice'
import CheckPortrait from "./utils/CheckPortrait";
import Camera from "./components/players/Camera";
import PlayerForm from "./components/players/PlayerForm";
import Tracker from "./components/tracker/index";
import Teams from "./components/teams";
import Playback_Window from "./components/navigation/PlaybackWindow";
import PlaybackWindow from "./components/navigation/PlaybackWindow";

if (localStorage.token) {
  console.log("Tocken", localStorage);
  setAuthToken(localStorage.token);
}

//getUserCount()



const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // check for token in LS

    dispatch(getUserCount());
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      dispatch(loadUser());
    }

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) dispatch(logout());
    });

    window.addEventListener('resize', ()=>{
      dispatch(handleResize())
    })

    let details = navigator.userAgent; 
    let regexp = /android|iphone|ipad/i; 
    // let isMobileDevice = regexp.test(details); 
    let isMobileDevice = /^iP/.test(navigator.platform) ||
           +/^Mac/.test(navigator.platform) && navigator.maxTouchPoints > 4
    if (isMobileDevice) { 
        dispatch(setIsMobile()); 
    }
  }, []);
  return (
    <StyledEngineProvider injectFirst>
     
       
        <CustomThemeProvider>
            <Fragment>
              <Alert2 />
              
              <Router>
                <Routes>
                <Route exact path='/login' element={<SignIn/>} />
                <Route exact path='/signUp' element={<SignUp/>} />
                <Route exact path='/forget' element={<ForgetPassword/>} />
                

                 <Route path='/' element={<CheckAuth><Navigation comp='navigation'/></CheckAuth>}/>                
                 <Route path='/floorplans'  element={<CheckAuth><Floorplan comp='floorplan'/></CheckAuth>}/>
                 <Route path='/configurefloor' element = {<CheckAuth><ConfigureFloorPlan comp='configureFloorplan'/></CheckAuth>}>
                      <Route path=':id' element={<ProcessFloorId/>}/>
                 </Route>

                 <Route path='/configureanchor' element = {<CheckAuth><AnchorPlan comp='anchorPlan'/></CheckAuth>}>
                      <Route path=':id' element={<ProcessFloorId/>}/>
                 </Route>

                 <Route path='/uploadgltf' element = {<CheckAuth><UploadGltf comp='uploadGltf'/></CheckAuth>}>
                      <Route path=':id' element={<ProcessGltfFloorId/>}/>
                 </Route>
                 <Route path='/iptable' element = {<CheckAuth><IPTable/></CheckAuth>}>
                       <Route path=':id' element={<ProcessFloorId/>}/>
                 </Route>
                 <Route path='/drawgeofence' element = {<CheckAuth><DrawGeofence comp='drawGeofence'/></CheckAuth>}>
                      <Route path=':id' element={<ProcessFloorId/>}/>
                 </Route> 
                 <Route path='/tags'  element={<CheckAuth><Tag comp='tag'/></CheckAuth>}/>
                 <Route path = "/assets" element={<CheckAuth><Asset comp='asset'/></CheckAuth>}/>

                 <Route path="/servers" element={<CheckAuth><CheckPortrait><Servers comp='servers'/></CheckPortrait></CheckAuth>}/>
                 <Route path="/players" element={<CheckAuth><CheckPortrait><Players comp='players'/></CheckPortrait></CheckAuth>} />
                 <Route path="/newPlayer" element={<CheckAuth><CheckPortrait><PlayerForm comp='playerForm'/></CheckPortrait></CheckAuth>}/>
                 <Route path="/tracker" element={<CheckAuth><CheckPortrait><Tracker comp='tracker'/></CheckPortrait></CheckAuth>}/>
                 <Route path="/team" element={<CheckAuth><CheckPortrait><Teams comp='team'/></CheckPortrait></CheckAuth>}/>
                 <Route path="/playback" element={<CheckAuth><PlaybackWindow comp='playback'/></CheckAuth>}/>
                </Routes>
              </Router>
           
            </Fragment>
            </CustomThemeProvider>
       
      
    </StyledEngineProvider>
    
  );
};
//export default connect(null, {getUserCount})(App);
export default App;




