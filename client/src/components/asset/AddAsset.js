



import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addAsset } from "../../feature/asset/assetThunk";
import PropTypes from "prop-types";
import { connect , useDispatch, useSelector} from "react-redux";
import { makeStyles } from "@mui/styles";
import { AssetIcon } from "../UI/CustomIcon";


import Dropzone from "react-dropzone";
import { Unstable_TrapFocus } from "@mui/material";

const useStyles  = makeStyles((theme)=>({
  
  paperRoot : {
    borderRadius : '30px'
  },
  actionRoot : {justifyContent: "center"}    
  
  }));

const AddAsset = (props) => {

  const dispatch = useDispatch()
  const classes = useStyles()
  const [previewSrc, setPreviewSrc] = useState("");
 
  const [image, setImage] = useState(null);
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = React.useRef();
 
  const itemList = ["","Employee","Machine Tool","Other object"];
  
  const [assetOpen,setAssetOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    assetId: "",
    name: "",
    assetType:"",
    description: "",
  });
  const {
    assetId,
    name,
    assetType,
    description,
  } = formData;

  const [emptyMessage, setEmptyMessage] = useState("");

  const onChangeHandler = (e) => {
    e.preventDefault();

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (assetId.length === 0 || name.length === 0 || assetType.length === 0 ) {
      setEmptyMessage("Fields marked * are mandatory");
    } else {
      const form = new FormData();
      form.append("assetId",formData.assetId)
      form.append("name",formData.name)
      form.append("assetType",formData.assetType)
      form.append("image",image)
      form.append("description",formData.description)
     
      console.log(form)
      dispatch(addAsset(form))
     props.handleClose()
    }
  };
  

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setImage(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    dropRef.current.style.border = "2px dashed #e9ebeb";
  };


  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };

  

  
  return <>
     { console.log("Asset Type>>", assetOpen)}
     <form  encType='multipart/form-data' >
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby='form-dialog-title'
      fullWidth
      PaperProps = {{classes : {root: classes.paperRoot}}}
    >
      <DialogTitle id='form-dialog-title'><AssetIcon /> Add Asset</DialogTitle>
      <DialogContent>
        <p className='text-danger'>{emptyMessage}</p>
        <TextField
          variant="standard"
          onChange={(e) => onChangeHandler(e)}
          placeholder='Asset ID'
          autoFocus
          margin='dense'
          label='Asset Id'
          type='text'
          name='assetId'
          value={assetId}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          required />
        <br />
        <br />
        <TextField
          variant="standard"
          onChange={(e) => onChangeHandler(e)}
          placeholder='Name'
          margin='dense'
          label='Name'
          type='text'
          name='name'
          value={name}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          required />
        <br />
        <br />
        
        <TextField
          variant="standard"
          onChange={(e) => onChangeHandler(e)}
          placeholder='Asset Type'
          margin='dense'
          label='Asset Type'
          type='text'
          select
          name='assetType'
          value={assetType}
          helperText="Plese select asset type"
          SelectProps={{
            native: true,
          }}
          fullWidth
          required>

             {itemList.map((option,index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}

          </TextField>
        <br />
        <br />




        <TextField
          variant="standard"
          onChange={(e) => onChangeHandler(e)}
          placeholder='Description'
          margin='dense'
          label='Description'
          type='text'
          name='description'
          value={description}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth />

        <Dropzone
            onDrop={onDrop}
            onDragEnter={() => updateBorder("over")}
            onDragLeave={() => updateBorder("leave")}
            style={{ border: "1px dashed #e9ebeb" }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({ className: "drop-zone" })}
                ref={dropRef}
              >
                <input {...getInputProps()} />
                <p>
                 *Drag & drop profile image Or, click here to select a profile 
                  picture
                </p>
                {image && (
                  <div className='text-primary'>{image.name}</div>
                )}
              </div>
            )}
          </Dropzone>
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
          )): (
            <div className='preview-message'>
              <img src='/profile.jpg' alt='' width='70%' />
              <br />
              <p>*Profile picture preview will be shown here after selection</p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions classes = {{root : classes.actionRoot }}>
        <Button onClick={props.handleClose} color='primary' variant='contained'>
          Cancel
        </Button>
        <Button color='primary' variant='contained' onClick={(e) => onSubmitHandler(e)}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
    </form>
  </>;
};

AddAsset.propTypes = {
  addAsset: PropTypes.func.isRequired,
};

export default AddAsset;
