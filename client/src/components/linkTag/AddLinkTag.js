

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import { getTags } from "../../feature/tag/tagThunk";

import { addLinkedTag } from "../../feature/linkedTag/linkedTagThunk";
import PropTypes from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import AuthAppBar from "../UI/AuthAppBar";
import { LinkOutlined } from "@mui/icons-material";
import { Paper, Button } from "@mui/material";
import {
  Dialog, DialogContent, DialogActions ,FormLabel
} from "@mui/material";

import { makeStyles } from "@mui/styles";


const useStyles  = makeStyles((theme)=>({
  
  paperRoot : {
    borderRadius : '30px'
  },
  actionRoot : {justifyContent: "center"}
  
  }));
  



const AddLinkTag = (props) => {
  const dispatch = useDispatch()
  const tagData = useSelector((state)=>state.tag.tags)
  const classes = useStyles()
  const tags = tagData.filter(tag=> !("asset" in tag))
  const [formData, setFormData] = useState({
    tag: null,
    asset: props.asset._id
   
  });

  const { tag, asset } = formData;

  const onChangeHandler = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("formdata>>",formData)
    if(formData.tag!==null)
    {
    dispatch(addLinkedTag(formData));
    props.handleClose()
    }
  };

  useEffect(() => {
    getTags();
    //eslint-disable-next-line
  }, []);

  const titleIcon = <LinkOutlined color='primary' fontSize='large' />;

 
 

 

  
  return (
    <>
     
     <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      PaperProps = {{classes : {root: classes.paperRoot}}}
     >
      <AuthAppBar title='Link a Tag' icon={titleIcon} />
        <DialogContent>
            <FormLabel>{tags&& tags.length>0 ? `Please Select a tag for ${props.asset.name}`: "Sorry!!! No free tags available"} </FormLabel>
            <Autocomplete
              id='tag'
              options={tags}
              getOptionLabel={(tag) => tag.tagId}
              onChange={(e, v) => setFormData({ ...formData, tag: v })}
              value={tag}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Select a Tag'
                  variant='outlined'
                />
              )}
            />
            <br />
            <br />
          </DialogContent>
          <DialogActions classes = {{root : classes.actionRoot }}>    
          <Button
              color='primary'
              variant='contained'
              onClick={props.handleClose} 
            >
              Cancel
            </Button>   
            <Button
              color='primary'
              variant='contained'
              
              disabled={tags&& tags.length>0?false:true}
              onClick={(e) => onSubmitHandler(e)}
              
            >
              Link
            </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};



const mapStateToProps = (state) => ({
  tags: state.tag.tags,
 
});

export default AddLinkTag;
