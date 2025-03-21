
/*import axios from "axios";
import { setAlert } from "./alertAction";
import setAuthToken from "../utils/setAuthToken";
import * as types from "./types";
import { Navigate,useNavigate, useLocation } from "react-router-dom"

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/user/me");
    dispatch({
      type: types.USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: types.AUTH_ERROR,
    });
  }
};

// Get Users
export const getUsers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/user/");
    dispatch({
      type: types.GET_USERS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.AUTH_ERROR,
    });
  }
};

// Add User
export const addUser = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/api/user/signup", formData);

    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert("User Added Successfully", "success", true));
    dispatch(getUsers());

  } catch (err) {
    console.log(err)
    const errors = err.response.data;
    
    
      dispatch(setAlert("User Registration failed", "error", true));
    

    dispatch({
      type: types.REGISTER_FAIL,
    });
  }
};

// Update me
export const updateMe = (photoData, history) => async (dispatch) => {
  try {
    const res = await axios.patch("/api/user/updateMe", photoData);

    dispatch({
      type: types.USER_LOADED,
      payload: res.data,
    });

    dispatch(setAlert("Profile Updated!", "success"));
    dispatch(loadUser());

    // history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: types.AUTH_ERROR,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("/api/user/login", body, config);

    if(res.data.token){
      setAuthToken(res.data.token)
      console.log(res.data.token)
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: res.data,
      });
      
      dispatch(loadUser());
    }
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "error", true));
    }

    dispatch({
      type: types.LOGIN_FAIL,
    });
  }
};

// Update My Password
export const updateMyPassword = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.patch("/api/user/updateMyPassword", formData);

    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(setAlert("Password Updated!", "success"));
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors.message, "error", true));
    }

    dispatch({
      type: types.LOGIN_FAIL,
    });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/user/${id}`);
    dispatch({
      type: types.USER_DELETED,
      payload: id,
    });
    dispatch(setAlert("User Deleted", "success", "true"));
    dispatch(getUsers())
  } catch (err) {
    dispatch({
      type: types.AUTH_ERROR,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: types.CLEAR_USER });
  dispatch({ type: types.LOGOUT });
};

export const setLoaded3D = (v)=>async(dispatch)=>{
  await dispatch({type : types.LOAD_3D,
    payload : v
  })
}



////Get user count

export const getUserCount = () => async (dispatch) => {
  try {
    const res = await axios.post("/api/user/checkUser");
    console.log("Initial Response",res)
    dispatch({
      type: types.SET_USER_COUNT,
      payload: res.data.count,
    });
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "error", true));
    }
  }
};


////First time  user registration////

export const addFirstUser= (formData) => async (dispatch) => {
  //const navigate = useNavigate()
  try {
    console.log("Sign up first called")
    const res = await axios.post("/api/user/signupFirst", formData);

    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert("User Added Successfully", "success", true));
    //dispatch(getUsers());
   // navigate("/", { replace: true })
    dispatch(getUserCount())
  } catch (err) {
    console.log(err)
    const errors = err.response.data;
    
    
      dispatch(setAlert("User Registration failed", "error", true));
    

    dispatch({
      type: types.REGISTER_FAIL,
    });
  }
};*/