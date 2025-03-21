


import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IOSSwitch } from '../UI/Switch';
import { getAssets,
    setCurrentAsset,
    deleteAsset } from "../../feature/asset/assetThunk"
import { Avatar,Grid } from '@mui/material';    
import Confirm from "../UI/Confirm";
import { Tooltip } from '@mui/material';
import { DeleteOutlined, SubscriptionsOutlined } from '@mui/icons-material';
import AddLinkTag from '../linkTag/AddLinkTag';
import { getTags } from '../../feature/tag/tagThunk';
import { deleteLinkedTag } from '../../feature/linkedTag/linkedTagThunk';
import withStyles from '@mui/styles/withStyles';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    
  },
}))(TableCell);

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  
});



function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
       
        <TableCell align="right">
          {row.assetId}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.assetType}</TableCell>
        <TableCell align= "right">
           {props.linkComp}
             
        </TableCell>

        <TableCell align="right">{props.deleteComp}</TableCell>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Details</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="center">Linked Tag</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                 
                    <TableRow >
                      <TableCell  align = "center">
                          {row.description}
                      </TableCell>
                      <TableCell>
                          {row.image? (<Avatar alt={row.name} src={`/uploads/emp/${row.image}`} />)
                          : (<Avatar>OM</Avatar>)}

                      </TableCell>
                      <TableCell align = "center">
                        {row.taginfo? row.taginfo.tagId: "N/A" }
                        </TableCell>
                    </TableRow>
                  
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const useStyle = makeStyles((theme)=>({

  container:{
    maxHeight : 500,
    minWidth: 500,
  } 

}))



function AssetTable(props) {

  const assets = useSelector((state)=>state.asset.assets)
  const dispatch = useDispatch()
 const classes = useStyle()
    const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [delId, setDelId] = React.useState("");
  const [unlinkId,setUnlinkId] =React.useState("")
  const [openAddLinkedTag, setOpenAddLinkedTag] = React.useState(false)
  const [selectedAsset,setSelectedAsset] =React.useState(null)
  const [confirmUnlinkTag,setConfirmUnlinkTag] = React.useState(false)
    const onDeleteOpen = (id) => {
        setConfirmDelete(true);
        setDelId(id);
      };
    
      const onDeleteClose = () => {
        setConfirmDelete(false);
      };
      const onDeleteHandler = () => {
        dispatch(deleteAsset(delId));
        //dispatch(getAssets())
        onDeleteClose();

      };
      

   const onUnlinkOpen = (id) =>{
     setConfirmUnlinkTag(true);
     setUnlinkId(id)
   }

   const onUnlinkClose=() =>{
     setConfirmUnlinkTag(false)
     setUnlinkId("")
   }
   
   const onUnlinkHandler =() =>{
     dispatch(deleteLinkedTag(unlinkId))
    
     onUnlinkClose()
   }







  const handleAddLinkedTagClose=()=>{
    setOpenAddLinkedTag(false)
    setSelectedAsset("")

    //only for update check
    

  }
  const handleAddLinkOpen=(as)=>{
    dispatch(getTags())
    setSelectedAsset(as)
     setOpenAddLinkedTag(true)
  }
     const handleLinkChange=(e)=>{
         
         if(e.target && ("tabIndex" in e.target)){
           console.log(assets[e.target.tabIndex])
           const asset = assets[e.target.tabIndex]
           if("tag" in asset)
           {
            console.log("Asset",asset)
            onUnlinkOpen(asset.tag._id)
           }
           else
           {
            handleAddLinkOpen(asset)
           }
         }
     } 


  return <>
  {console.log("assets>>",assets)}
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

    {confirmUnlinkTag && (
       <Confirm
         open={confirmUnlinkTag}
         onClose={onUnlinkClose}
         onConfirm={onUnlinkHandler}
         title='Confirm Unlink?'
         content='Warning! Unlink cannot be reversed.'
         handleOpen={onUnlinkOpen}
       />
     )}

     {openAddLinkedTag && 
     (<AddLinkTag
        open = {openAddLinkedTag}
        handleClose = {handleAddLinkedTagClose}
        asset = {selectedAsset}
        handleOpen = {handleAddLinkOpen}
     />)}
   <TableContainer component={Paper} className = {classes.container}>
     <Table stickyHeader aria-label="collapsible table" size="small">
       <TableHead>
         <TableRow>
           
           <StyledTableCell align="right">Asset Id</StyledTableCell>
           <StyledTableCell align="right">AssetName</StyledTableCell>
           <StyledTableCell align="right">Asset Type</StyledTableCell>
           <StyledTableCell align="center">Link Status</StyledTableCell>
           <StyledTableCell align ="right">Delete</StyledTableCell>
           <StyledTableCell>Details</StyledTableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {assets.map((row,index) => (
           <Row key={row.assetId} row={row} deleteComp = {<IconButton aria-label='share' onClick={() => onDeleteOpen(row._id)} size="large">
               {
                 <Tooltip title='Delete'>
                   <DeleteOutlined color='primary' />
                 </Tooltip>
               }
             </IconButton>}
             
             linkComp = {  <Grid  container direction="row"  justifyContent="flex-end" alignItems="center">
             <Grid item>Unlinked</Grid>
             <Grid item>
                 <IOSSwitch  checked = {row.tag? true : false} onChange = {handleLinkChange}  tabIndex= {index}/>
               
             </Grid>
             <Grid item>linked</Grid>
          </Grid>}
             />
         ))}
       </TableBody>
     </Table>
   </TableContainer>
   </>;
}

const mapStateToProps = (state) => ({
    assets: state.asset.assets,
    
  });
  
  export default AssetTable;