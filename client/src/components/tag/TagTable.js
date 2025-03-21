
import React from 'react';
import { useState } from 'react';
import { IconButton,Tooltip } from '@mui/material';
import { connect, useDispatch,useSelector} from 'react-redux'
import { getTags,  deleteTag } from "../../feature/tag/tagThunk";
import {setCurrentTag} from "../../feature/tag/tagSlice"
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Confirm from '../UI/Confirm';
import Moment from 'react-moment';
import { Grow,keyframes } from '@mui/material';
import { BurstModeTwoTone, DeleteOutlined } from '@mui/icons-material';
import {LinkIcon, UnlinkIcon } from '../UI/CustomIcon';
import {Card,CardActions,CardContent} from "@mui/material"
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined';
import {Dialog, DialogActions, DialogContent,DialogTitle} from "@mui/material"
import { set } from 'mongoose';
import {TextField,Button} from "@mui/material"
import { editTag } from '../../feature/tag/tagThunk';

const expand = keyframes`
from {
  transform: scale(0.9);
}
to {
  transform: scale(1.1);
}`;



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    
    
  },
 
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
   
   
  },

 
}))(TableRow);


const useStyles = makeStyles({
  table: {
   
  },
  container:{
    maxHeight : 500,
    minWidth: 500,
    
  } 
});

function TagTable(props) {

  const tags = useSelector((state)=>state.tag.tags)
  const dispatch = useDispatch()
  const classes = useStyles();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delId, setDelId] = useState("");
  const [open,setOpen] = useState(false)
  const [tagObj, setTagObj] =useState(null)
  const onDeleteHandler = () => {
    dispatch(deleteTag(delId));
    onDeleteClose();
    dispatch(getTags())
  };

  const onDeleteOpen = (id) => {
    setConfirmDelete(true);
    setDelId(id);
  };

  const onDeleteClose = () => {
    setConfirmDelete(false);
  };


  const handleShowDialog =(obj)=>{
    console.log("tag object",obj)
    setTagObj(obj)
    setOpen(true)
  }

  const handleHideDialog =()=>{
    setOpen(false)
    setTagObj(null)
  }


  const handleTextChange=(event)=>{
    if(tagObj && event.target.value.match(/^-?\d*\.?\d*$/))
  {
       const obj = {...tagObj}
       obj.height = event.target.value
       setTagObj(obj)



  }
  console.log(event.target.value)
  }
   


  const handleSubmit=(event)=>{
       if(tagObj)
       {
           tagObj.height = Number(tagObj.height)
          dispatch(editTag(tagObj))
          dispatch(getTags())
          handleHideDialog()
       }


  }

  return <>
     <Dialog open={open}>
      <DialogTitle>{"New height" }</DialogTitle>
      <DialogContent>
      
      <TextField
          //required
          
          id="outlined-required"
          label="Height"
          //defaultValue="Hello World"
          value = {tagObj && ("height" in tagObj)?tagObj.height:""}
          sx = {{mt:1}}
          onChange={handleTextChange}
        />

      </DialogContent>
      <DialogActions sx={{alignContent:"right"}}>
           <Button variant="contained" size="small" onClick={handleSubmit}>Change</Button>
           <Button variant="contained" size="small"
           onClick={handleHideDialog}>Cancel</Button>
    </DialogActions>
     </Dialog>
   {confirmDelete && (
       <Confirm
         open={confirmDelete}
         onClose={onDeleteClose}
         onConfirm={onDeleteHandler}
         title='Confirm Delete?'
         content='Warning! Delete cannot be reversed.'
         handleOpen={onDeleteOpen}
       />
     )}

    {/**Adjut height dialog */}

   <TableContainer component={Paper} className={classes.container} elevation={0} >
     <Table stickyHeader  aria-label="customized table" size = "small">
       <TableHead >
         <TableRow>
          
           <StyledTableCell align="right">TagId</StyledTableCell>
           <StyledTableCell align="right">Date Registration</StyledTableCell>
           <StyledTableCell align="right">Link Status</StyledTableCell>
           <StyledTableCell align="right">height</StyledTableCell>
           <StyledTableCell align="right">Adjust Height</StyledTableCell>
           <StyledTableCell align="right">Remove</StyledTableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {tags.map((tag) => (
            <Grow
            in={tag.tagId}
            
            {...(tag.tagId? { timeout: 1000 } : {})}
          >
           <StyledTableRow key={tag._id}>
             <StyledTableCell component="th" scope="row" align="right">
               {tag.tagId}
             </StyledTableCell>
             <StyledTableCell align="right">{<Moment format='DD/MM/YYYY'>{tag.tagRegDate}</Moment>}</StyledTableCell>
             <StyledTableCell align="right">
                <Tooltip 
             title={tag.asset? "Tag Linked": "Tag not Linked"}
                arrow>
                  <IconButton disableRipple disableFocusRipple size="large">
                {tag.asset? <LinkIcon color = 'primary'/> : <UnlinkIcon color='primary'/>}
                  </IconButton>     
                </Tooltip>

             </StyledTableCell>

            <StyledTableCell>{Number.parseFloat(tag.height).toFixed(3)}</StyledTableCell>

            <StyledTableCell>

            <IconButton aria-label='delete'  size="large" onClick={()=>handleShowDialog(tag)}>
                     {
                       <Tooltip title='Change Height'>
                         <HeightOutlinedIcon color='primary' />
                       </Tooltip>
                     }
                   </IconButton>



            </StyledTableCell>

             <StyledTableCell align="right">
                   <IconButton aria-label='delete'  onClick={() => onDeleteOpen(tag._id)} size="large">
                     {
                       <Tooltip title='Delete'>
                         <DeleteOutlined color='primary' />
                       </Tooltip>
                     }
                   </IconButton>

             </StyledTableCell>
            
           </StyledTableRow>
           </Grow>
         ))}
       </TableBody>
     </Table>
   </TableContainer>
  </>;
}

const mapStateToProps = (state) => ({
    tags: state.tag.tags,
  });

export default connect(mapStateToProps, { getTags, setCurrentTag, deleteTag })(
  TagTable
);