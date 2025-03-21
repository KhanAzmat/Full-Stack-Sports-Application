/

import React, { useState, useRef, useEffect,useCallback } from "react";
import { Button } from "@mui/material";
import { Navigate, Redirect } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
//import  BorderInnerOutlined from '@mui/icons-material'
import {
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import Alert from '@mui/material/Alert';
import AuthAppBar from "../UI/AuthAppBar";
import { BorderInnerOutlined } from "@mui/icons-material";
//import { withRouter } from "react-router-dom";
import { addFloorplan } from "../../feature/floorplan/floorplanThunk";

import PropTypes from "prop-types";
import { connect,useDispatch,useSelector } from "react-redux";
import makeStyles from '@mui/styles/makeStyles';

const useStyles  = makeStyles((theme)=>({
  
  paperRoot : {
    borderRadius : '30px'
  } ,
  actionRoot : {justifyContent: "center"}  
  
  }));

const AddFloorPlan = (props) => {
  const dispatch = useDispatch()
  const role = useSelector((state)=>state.auth.role)
  const classes = useStyles()
  const [floorplan, setFloorplan] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [state, setState] = useState({
   // building: "",
    floor: 1,
    description: "",
  });

  useEffect(() => {
   // getBuildings();
    //eslint-disable-next-line
  }, []);



  const { floor, description} = state;

  const [errorMsg, setErrorMsg] = useState("");
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area




  const onChangeHandler = (event, selected) => {
    
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
    
  };

  const onDrop = useCallback((files) => {
    const [uploadedFile] = files;
    if(!uploadedFile.name.match(/\.(jpeg|jpg|png)$/))
    {
      alert("Plese upload a valid image file.(JPG/PNG)")
      return 
    }
    if(uploadedFile.size > 5000000)
    {
      alert("Maximum allowed image file size is 2MB")
      return
    }
    setFloorplan(uploadedFile);
    console.log("uploadedFile>>",uploadedFile)

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
      console.log(fileReader.result)
      return
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    //dropRef.current.style.border = "2px dashed #e9ebeb";
  },[]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})




  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {
      
        if (floorplan) {
          //console.log(selectedBuilding.floors);
          /*if (floor > selectedBuilding.floors || floor < selectedBuilding.basements * -1) {
            setErrorMsg(`This Building doesn't have a ${floor} floor`);
          } else {*/
            const formData = new FormData();
            formData.append("floorplan", floorplan);
            //formData.append("building", building);
            formData.append("floor", floor);
            formData.append("description", description);

            setErrorMsg("");
            dispatch(addFloorplan(formData));
            setFloorplan(null);
            setPreviewSrc("");
            setState({
              //building: "",
              floor: "",
              description: "",
            });
            props.handleClose()
          //}
        } else {
          setErrorMsg("Fields marked * are mandatory");
        }
      
      
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

 
  if (role === "user") {
    return <Navigate to='/'/>;
  }
  return (
    <div className=''>
     

      
      {/* <Stepper /> */}
      {/*<Button
        variant='outlined'
        color='primary'
        component={Link}
        to='/config'
        className='mr-2'
      >
        Configuration
      </Button>
      <Button
        variant='outlined'
        color='primary'
        component={Link}
        to='/floorplan'
      >
        Floor plan
      </Button>*/}
     <form className='card p-3' encType='multipart/form-data'>
        <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby='form-dialog-title'
        fullWidth
        PaperProps = {{classes:{root : classes.paperRoot}}}
        >
         <DialogTitle id='form-dialog-title'><BorderInnerOutlined/>  Add Floor Plan</DialogTitle>
          
          <DialogContent>
            <p className='text-danger text-left'>{errorMsg}</p>
            {/*<FormControl variant='outlined'>
              <InputLabel id='buildingLabel'>*Select Building</InputLabel>
              <Select
                labelId='buildingLabel'
                label='Building'
                name='building'
                value={building}
                onChange={(e) => onChangeHandler(e, "buildingSelected")}
                required='true'
              >
                <option value='' disabled Selected hidden>
                  -Select Building-
                </option>

                {buildings &&
                  buildings.map((building) => (
                    <MenuItem value={building._id}>
                      {building.buildingName}
                    </MenuItem>
                  ))}
              </Select>
                  </FormControl>*/}
            

            <TextField
              onChange={(e) => onChangeHandler(e, "selectedFloor")}
              placeholder='Floor'
              margin='dense'
              variant='outlined'
              label='Floor'
              type='number'
              name='floor'
              value={floor}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required
            />
            <TextField
              onChange={(e) => onChangeHandler(e)}
              placeholder='Description'
              margin='dense'
              variant='outlined'
              label='Description'
              type='text'
              name='description'
              value={description}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              multiline
              rows={4}
            />
             
              
                <div
                  {...getRootProps({ className: "drop-zone" })}
                  ref={dropRef}
                >
                  <input {...getInputProps()} />
                  <p>
                    *Drag & drop a Floor Plan Or, click here to select a Floor
                    Plan. <br/>(Only JPG/PNG file of less than 5MB is acceptable)
                  </p>
                  {floorplan && (
                    <div className='text-primary'>{floorplan.name}</div>
                  )}
                </div>
              
            
             
            <div className='text-center'>
                {previewSrc ? (
                    isPreviewAvailable ? (
                    <div className='image-preview'>
                         <img className='preview-image' src={previewSrc} alt='Preview' />
                    </div>
                    ) : (
                    <div className='preview-message card p-5'>
                          <p>No preview available for this file</p>
                    </div>
                    )
                   ) : (
                      <div className='preview-message'>
                         <img src='/placeholder.png' alt='' width='100%' />
                      <br />
                     <p>*Floor plan preview will be shown here after selection</p>
                    </div>
                  )}
             </div>
             </DialogContent>
             <DialogActions classes = {{root : classes.actionRoot }}>
               <Button onClick={props.handleClose}  variant='contained' color='primary'>
                 Cancel
               </Button>


            <Button
              color='primary'
              variant='contained'
              onClick={(e) => handleOnSubmit(e)}
            >
              Submit{" "}
            </Button>
            </DialogActions>
          </Dialog>
          
          
      </form>
       
        
      
    </div>
  );
};

AddFloorPlan.propTypes = {
  addFloorplan: PropTypes.func.isRequired,
  //getBuildings: PropTypes.func.isRequired,
  //getBuilding: PropTypes.func.isRequired,
  //buildings: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  //buildings: state.building.buildings,
  //selectedBuilding: state.building.building && state.building.building.data,
  role: state.auth.role,
});

export default connect(mapStateToProps, {
  addFloorplan,
  //getBuildings,
  //getBuilding,
})((AddFloorPlan));
