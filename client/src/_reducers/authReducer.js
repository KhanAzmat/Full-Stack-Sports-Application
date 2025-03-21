import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GET_USERS,
  LOAD_3D,
  SET_USER_COUNT,
} from "../_actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: {},
  users: [],
  role: "",
  loaded3D : false,
  count: -1
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload.data,
        role:payload.data.data.role
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        token:payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: true,
        user: {},
        loaded3D : false
      };
      case LOAD_3D:
        return {
          ...state,
          loaded3D : payload
        };
      case SET_USER_COUNT:
        return{
          ...state,
          count: payload
        }  



    default:
      return state;
  }
}
