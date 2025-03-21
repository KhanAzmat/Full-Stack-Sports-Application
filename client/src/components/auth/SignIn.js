import { Box, Avatar, FormControlLabel, Checkbox, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import * as React from "react";

//import Logo from "../asset/Logo";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../feature/auth/authThunk";
import { Logo } from "../UI/CustomIcon";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        sx={{
          color: "#ffa726",
        }}
        href="https://rtlscompany.com/"
      >
        RTLS Company
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function SignIn() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const count = useSelector((state) => state.auth.count);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  let from = "/";
  if (location.state && location.state.from && location.state.from.pathname) {
    from = location.state.from.pathname;
  }

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (count <= 0) {
    //return  <Navigate to="/signUp"  state={{ from: location }} replace/>
    navigate("/signUp", { state: { from: location }, replace: true });
  }
  if (isAuthenticated && !loading) {
    navigate(from, { replace: true });
  }

  /*const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };*/

  return (
   
      <Container component="main" maxWidth="xs">
        
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Logo 
          fontSize = "large"
          sx={{ maxWidth:"300",maxHeight:"50"}} />
          <Avatar sx={{ m: 1, bgcolor: "white" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            //onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => onChange(e)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => onChange(e)}

            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {/* turn button text dark in mui  */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ color: "#000" }}
              onClick={(e) => onSubmitHandler(e)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forget" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              {/*<Grid item>
                <Link href="/lo" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
        </Grid>*/}
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
   
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default SignIn;
