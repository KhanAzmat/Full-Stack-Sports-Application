

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
import { DeleteOutlined } from '@mui/icons-material';
import {LinkIcon, UnlinkIcon } from '../UI/CustomIcon';
import {Card,CardActions,CardContent} from "@mui/material"

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

function NewTagTable(props) {
  //console.log(props)
  const tags = [...props.t]
  console.log(tags)
  const dispatch = useDispatch()
  const classes = useStyles();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delId, setDelId] = useState("");
  
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


  return <>

  
   <TableContainer component={Paper} className={classes.container} elevation={0} >
     <Table stickyHeader  aria-label="customized table" size = "small">
       <TableHead >
         <TableRow>
          
           <StyledTableCell align="center">TagId</StyledTableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {tags.map((tag) => (
           
           <StyledTableRow key={tag}>
             <StyledTableCell component="td" scope="row" align="center">
               {tag}
             </StyledTableCell>
            
            
           </StyledTableRow>
           
         ))}
       </TableBody>
     </Table>
   </TableContainer>
  </>;
}

const mapStateToProps = (state) => ({
    //tags: state.tag.tags,
  });

export default connect(null, { getTags, setCurrentTag, deleteTag })(
  NewTagTable
);