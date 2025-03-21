/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Item
export const getItem = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/item/${id}`);

    dispatch({
      type: types.GET_ITEM,
      payload: res.data.data,
    });
  } catch (err) {}
};

//Get all Items
export const getItems = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/item");
    dispatch({
      type: types.GET_ITEMS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ITEM_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Items
export const getFavItems = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/item?favorite=true");
    dispatch({
      type: types.GET_FAV_ITEMS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.ITEM_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Item
export const addItem = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.post("/api/item", formData);
    dispatch({
      type: types.ADD_ITEM,
      payload: res.data,
    });
    dispatch(getItems());
    dispatch(setAlert("Item Added", "success", true));
    history.push("/Item");
  } catch (err) {
    if(err.response && err.response.data) {
      dispatch(setAlert(err.response.data, "error", true));
      } else {
      console.log(err);
      }
  }
};

// Edit Item
export const editItem = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/item/${id}`, formData, config);

    dispatch({
      type: types.GET_ITEM,
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

//Set Current Item
export const setCurrentItem = (Item) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_ITEM,
    payload: Item,
  });
};

//Delete Item
export const deleteItem = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/item/${id}`);
    dispatch({
      type: types.DELETE_ITEM,
      payload: id,
    });
    dispatch(setAlert("Item Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.ITEM_ERROR,
    });
  }
};

// Clear Item
export const clearItem = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_ITEM });
};

//Filter Item
export const filterItem = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_ITEM, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};
*/