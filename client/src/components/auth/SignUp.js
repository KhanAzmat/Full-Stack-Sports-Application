
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { adaptV4Theme, createTheme } from "@mui/material/styles";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setAlerts } from "../../_actions/alertAction";
import { addFirstUser } from "../../feature/auth/authThunk";
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
      <Link color="inherit" href="https://rtlscompany.com/">
        RTLS Company
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: "#ffa726",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff7043",
        contrastText: "#ffffff",
      },
    },
  })
);

function SignUp() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const count = useSelector((state) => state.auth.count);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  console.log("count   ", count);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state.from.pathname || "/";
  //let from = "/";

  if (count > 0 && !loading) {
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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    //login(email, password);
    console.log(formData);
    if (!formData.firstName || formData.firstName === "") {
      setAlerts("First Name cant be blank.", "error", true);
    } else if (!formData.lastName || formData.lastName === "") {
      setAlerts("Last Name cant be blank.", "error", true);
    } else if (
      !formData.email ||
      formData.email === "" ||
      !validateEmail(formData.email)
    ) {
      setAlerts("Invalid Email!Please Check email", "error", true);
    } else if (!formData.password || formData.password === "") {
      setAlerts("password cant be blank", "error", true);
    } else if (
      !formData.confirmPassword ||
      formData.confirmPassword === "" ||
      formData.confirmPassword === ""
    ) {
      setAlerts("confirm password cant be blank", "error", true);
    } else if (formData.password !== formData.confirmPassword) {
      setAlerts(
        "Password Mismatch. password and confirm password must match",
        "error",
        true
      );
    } else {
      //setFormData({...formData, name : formData.firstName + " "+ formData.lastName })
      console.log(formData);
      const data = {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      dispatch(addFirstUser(data));
    }
  };

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
        <Logo />
        <Avatar sx={{ m: 1, bgcolor: "white" }}></Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={onSubmitHandler}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="standard"
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e) => onChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="standard"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={(e) => onChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => onChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => onChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="new-password"
                onChange={(e) => onChange(e)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: "#000" }}
            //onClick={(e) => onSubmitHandler(e)}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  count: state.auth.count,
});

export default SignUp;
