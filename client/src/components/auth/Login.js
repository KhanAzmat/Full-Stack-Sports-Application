import React, { useState } from "react";
import { Navigate,useNavigate, useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";

import PropTypes from "prop-types";
import { login } from "../../feature/auth/authThunk";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import AppBar from "../UI/AppBar";

const Login = () => {
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const location = useLocation()
  const navigate = useNavigate()

  let from = location.state.from.pathname || "/";
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch(login({email, password}));
  };

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  return (
    <div className='login'>
      <AppBar />
      <div className='p-5 '>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-8'>
              <h4 className='text-white'>
                We at <b>RTLS Company</b> are proud to introduce you to the
                best{" "}
                <b className='font-weight-bold'>
                  RTLS (Real-Time Locationing System){" "}
                </b>
                in the world.
              </h4>
              <img src='/login1.svg' alt='' width='90%' />
            </div>
            <div className='col-sm-4 col-xs-6 mx-auto'>
              <Paper className='p-5'>
                <Typography variant='h4' noWrap component='div'>
                  Sign in
                </Typography>
                <Typography variant='body2' noWrap component='div'>
                  to your Account
                </Typography>
                <br />
                <br />
                <FormGroup onSubmit={() => null} autoComplete='off'>
                  <TextField
                    variant="standard"
                    id='email'
                    className='mb-3'
                    type='email'
                    required
                    placeholder='you@example.com'
                    onChange={(e) => onChange(e)}
                    name='email'
                    value={email}
                    label='Email' />

                  <TextField
                    variant="standard"
                    id='password'
                    type='password'
                    required
                    placeholder='Enter a valid password'
                    onChange={(e) => onChange(e)}
                    name='password'
                    value={password}
                    label='Password' />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => onChange(e)}
                        name='checkedB'
                        color='primary'
                      />
                    }
                    label='Remember me?'
                  />
                  <Button
                    type='submit'
                    color='primary'
                    variant='contained'
                    onClick={(e) => onSubmitHandler(e)}
                  >
                    Sign in
                  </Button>
                  <hr />
                  <p className='mt-2 text-center'>Forgot Password?</p>
                </FormGroup>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default Login;
