




import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addTag } from "../../feature/tag/tagThunk";
import PropTypes from "prop-types";
import { connect,useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { TagIcon } from "../UI/CustomIcon";
import  {FloorMenu,BuildingMenu}  from "../UI/Menu"
import { Stack,Typography } from "@mui/material";

const useStyles  = makeStyles((theme)=>({
  
  paperRoot : {
    borderRadius : '5px'
  },
  actionRoot : {justifyContent: "center"}  
  
  }));

const AddTag = (props) => {

  const dispatch = useDispatch()
  const classes = useStyles()
  const [formData, setFormData] = useState({
    tagId: "",
    tagRegDate: "",
  });

  const [emptyMessage, setEmptyMessage] = useState("")

  const { tagId, tagRegDate } = formData;
  const onChangeHandler = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(tagId.length === 0 || tagRegDate.length === 0) {
      setEmptyMessage("Fields marked * are mandatory")
    } 
    else {
      dispatch(addTag(formData));
    props.handleClose();
    }
   
   
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby='form-dialog-title'
        PaperProps = {{classes : {root: classes.paperRoot}}}
      >
        <DialogTitle id='form-dialog-title'><TagIcon />Add Tag</DialogTitle>
        <DialogContent >
        <Stack direction={"row"} alignItems="center" spacing={1} sx ={{mt:1}}>
                       <Typography>Select Floor</Typography>
                       { <FloorMenu /> }
                   </Stack>
                  
        
        </DialogContent>
        {/*<DialogActions  classes = {{root : classes.actionRoot }}>
          <Button onClick={props.handleClose} color='primary' variant='contained'>
            Cancel
          </Button>
          <Button 
          //onClick={} 
          color='primary' variant='contained'>
            Add
          </Button>
  </DialogActions>*/}
      </Dialog>
    </div>
  );
};

AddTag.propTypes = {
  addTag: PropTypes.func.isRequired,
};

export default AddTag;
