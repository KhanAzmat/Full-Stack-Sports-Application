
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from "prop-types";
import { connect,useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { Slide } from "@mui/material";

/*function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}*/

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    zIndex: 2000
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="right" />;
}

function Alert2(props) {
  const classes = useStyles();
  
  const alerts = useSelector((state)=>state.alert.value)

  
  return (
    <>
      {console.log(props)}
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <Snackbar
            open={alert.open ? true : false}
            autoHideDuration={2000}
            TransitionComponent = {SlideTransition}
            key={alert.id}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
             }}
            sx = {{zIndex : 20000}}
          >
            <Alert severity={alert.alertType} variant="filled">{alert.msg}</Alert>
          </Snackbar>
        ))}
    </>
  );
}

/*Alert2.propTypes = {
  alerts: PropTypes.array.isRequired,
};*/

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default (Alert2);
