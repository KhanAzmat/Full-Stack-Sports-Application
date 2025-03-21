/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Asset
export const getAsset = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/asset/${id}`);

    dispatch({
      type: types.GET_ASSET,
      payload: res.data.data,
    });
  } catch (err) {}
};

//Get all Assets
export const getAssets = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/asset/");
    dispatch({
      type: types.GET_ASSETS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ASSET_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Assets
export const getFavAssets = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/asset?favorite=true");
    dispatch({
      type: types.GET_FAV_ASSETS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ASSET_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Asset
export const addAsset = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/api/asset", formData);
    dispatch({
      type: types.ADD_ASSET,
      payload: res.data,
    });
    dispatch(getAssets());
    dispatch(setAlert("Asset Added", "success", true));
  } catch (err) {
    if(err.response && err.response.data) {
dispatch(setAlert(err.response.data, "error", true));
} else {
console.log(err);
}
  }
};

// Edit Asset
export const editAsset = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/asset/${id}`, formData, config);

    dispatch({
      type: types.GET_ASSET,
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

//Set Current Asset
export const setCurrentAsset = (Asset) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_ASSET,
    payload: Asset,
  });
};

//Delete Asset
export const deleteAsset = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/asset/${id}`);
    dispatch({
      type: types.DELETE_ASSET,
      payload: id,
    });
    dispatch(setAlert("Asset Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.ASSET_ERROR,
    });
  }
};

// Clear Asset
export const clearAsset = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_ASSET });
};

//Filter Asset
export const filterAsset = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_ASSET, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};
*/