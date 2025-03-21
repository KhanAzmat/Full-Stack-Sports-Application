
/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Anchor
export const getAnchor = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/anchors/${id}`);

    dispatch({
      type: types.GET_ANCHOR,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ANCHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get all Anchors
export const getAnchors = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/anchors");
    dispatch({
      type: types.GET_ANCHORS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ANCHOR_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Anchors
export const getFavAnchors = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/anchors?favorite=true");
    dispatch({
      type: types.GET_FAV_ANCHORS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ANCHOR_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Anchor
export const addAnchor = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.post("/api/anchors", formData);
    dispatch({
      type: types.ADD_ANCHOR,
      payload: res.data.data,
    });
    //dispatch(getAnchors());
    dispatch(getAnchorsOfFloor(formData["floorplan"]))
    dispatch(setAlert("Anchor Added", "success", true));
  } catch (err) {
    const errors = err.response && err.response.data.errors;

    console.log(err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", true)));
    }

    dispatch({
      type: types.ANCHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit Anchor
export const editAnchor = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/anchors/${id}`, formData, config);

    dispatch(getAnchorsOfFloor(formData["floorplan"]))

    dispatch(setAlert("Anchor Configuration Updated", "success", true));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }

    dispatch({
      type: types.ANCHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Set Current Anchor
export const setCurrentAnchor = (Anchor) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_ANCHOR,
    payload: Anchor,
  });
};

//Delete Anchor
export const deleteAnchor = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/anchors/${id}`);
    dispatch({
      type: types.DELETE_ANCHOR,
      payload: id,
    });
    dispatch(setAlert("Anchor Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.ANCHOR_ERROR,
    });
  }
};

// Clear Anchor
export const clearAnchor = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_ANCHOR });
};

//Filter Anchor
export const filterAnchor = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_ANCHOR, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};



///get anchors configuration of floor
export const getAnchorsOfFloor = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/anchors/floorplan/${id}`);

    dispatch({
      type: types.GET_ANCHOR,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ANCHOR_ERROR,
      payload: { status: err.response },
    });
  }
};
*/