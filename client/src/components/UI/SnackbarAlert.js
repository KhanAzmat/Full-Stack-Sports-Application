
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import makeStyles from '@mui/styles/makeStyles';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SnackbarAlert(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={3000}
        onClose={props.handleClose}
        message={props.message}
        action={
          <React.Fragment>
            <IconButton
              size='small'
              aria-label='close'
              color='inherit'
              onClick={props.handleClose}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </React.Fragment>
        }
      ></Snackbar>
    </div>
  );
}
