
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    borderRadius: "12px",
  },
  actionRoot: { justifyContent: "center", marginBottom: "16px" },
}));

export default function Confirm(props) {
  const classes = useStyles()
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps = {{classes : {root: classes.paperRoot}}}
      >
        <DialogTitle id='alert-dialog-title'>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions classes = {{root : classes.actionRoot }}>
          <Button onClick={props.onClose}  variant='contained' color='primary'>
            No
          </Button>
          <Button onClick={props.onConfirm}  variant='contained' color='primary' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
