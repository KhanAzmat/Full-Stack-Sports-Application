
import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Geofence Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Geofence Details here</DialogContentText>
          <TextField
            variant="standard"
            autoFocus
            margin='dense'
            id='name'
            label='Geofence Name'
            type='text'
            fullWidth />
          <TextField
            variant="standard"
            margin='dense'
            id='description'
            label='Description'
            type='text'
            fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
