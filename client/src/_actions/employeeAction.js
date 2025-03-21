/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Employee
export const getEmployee = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/employee/${id}`);

    dispatch({
      type: types.GET_EMPLOYEE,
      payload: res.data.data,
    });
  } catch (err) {}
};

//Get all Employees
export const getEmployees = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/employee");
    dispatch({
      type: types.GET_EMPLOYEES,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.EMPLOYEE_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Employees
export const getFavEmployees = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/employee?favorite=true");
    dispatch({
      type: types.GET_FAV_EMPLOYEES,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.EMPLOYEE_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Employee
export const addEmployee = (formData, history) => async (dispatch) => {
  try {
    
    const res = await axios.post("/api/employee", formData);
    dispatch({
      type: types.ADD_EMPLOYEE,
      payload: res.data,
    });
    dispatch(getEmployees());
    dispatch(setAlert("Employee Added", "success", true));
    history.push("/Employee");
  } catch (err) {
    if(err.response && err.response.data) {
      dispatch(setAlert(err.response.data, "error", true));
      } else {
      console.log(err);
      }
  }
};

// Edit Employee
export const editEmployee = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/employee/${id}`, formData, config);

    dispatch({
      type: types.GET_EMPLOYEE,
      payload: res.data,
    });

    dispatch(setAlert(alertMsg, "success", true));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
  }
};

//Set Current Employee
export const setCurrentEmployee = (Employee) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_EMPLOYEE,
    payload: Employee,
  });
};

//Delete Employee
export const deleteEmployee = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/employee/${id}`);
    dispatch({
      type: types.DELETE_EMPLOYEE,
      payload: id,
    });
    dispatch(setAlert("Employee Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.EMPLOYEE_ERROR,
    });
  }
};

// Clear Employee
export const clearEmployee = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_EMPLOYEE });
};

//Filter Employee
export const filterEmployee = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_EMPLOYEE, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};
*/