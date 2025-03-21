/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Organisation
export const getOrganisation = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/organisation/${id}`);

    dispatch({
      type: types.GET_ORGANISATION,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ORGANISATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get all Organisations
export const getOrganisations = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/organisation");
    dispatch({
      type: types.GET_ORGANISATIONS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ORGANISATION_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Organisation
export const addOrganisation = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.post("/api/organisation", formData);
    dispatch({
      type: types.ADD_ORGANISATION,
      payload: res.data,
    });
    dispatch(getOrganisations());
    dispatch(setAlert("Organisation Added", "success", true));
    history.push("/organisation");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", true)));
    }

    dispatch({
      type: types.ORGANISATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit Organisation
export const editOrganisation = (formData, history, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/organisation/${id}`, formData, config);

    dispatch({
      type: types.GET_ORGANISATION,
      payload: res.data,
    });

    dispatch(setAlert("Organisation Updated", "success", true));

    history.push("/organisation");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }

    dispatch({
      type: types.ORGANISATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Set Current Organisation
export const setCurrentOrganisation = (Organisation) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_ORGANISATION,
    payload: Organisation,
  });
};

//Delete Organisation
export const deleteOrganisation = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/organisation/${id}`);
    dispatch({
      type: types.DELETE_ORGANISATION,
      payload: id,
    });
    dispatch(setAlert("Organisation Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.ORGANISATION_ERROR,
    });
  }
};

// Clear Organisation
export const clearOrganisation = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_ORGANISATION });
};

//Filter Organisation
export const filterOrganisation = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_ORGANISATION, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};*/
