
/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";
import { getAssets } from "./assetAction";

// Get current LinkedTag
export const getLinkedTag = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/linkedTag/${id}`);

    dispatch({
      type: types.GET_LINKED_TAG,
      payload: res.data.data,
    });
  } catch (err) {}
};

//Get all LinkedTags
export const getLinkedTags = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/linkedTag");
    dispatch({
      type: types.GET_LINKED_TAGS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.LINKED_TAG_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav LinkedTags
export const getFavLinkedTags = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/linkedTag?favorite=true");
    dispatch({
      type: types.GET_FAV_LINKED_TAGS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.LINKED_TAG_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add LinkedTag
export const addLinkedTag = (formData) => async (dispatch) => {
  const { asset, tag } = formData;
  const newFormData = {
    tag: tag._id,
    asset: asset 
  };

  try {
    const res = await axios.post("/api/linkedTag", newFormData);
    dispatch({
      type: types.ADD_LINKED_TAG,
      payload: res.data,
    });
    dispatch(setAlert("Tag successfully Linked to Asset", "success", true));
    dispatch(getAssets())
  } catch (err) {
    if(err.response && err.response.data) {
      dispatch(setAlert(err.response.data, "error", true));
      } else {
      console.log(err);
      }
  }
};

// Edit LinkedTag
export const editLinkedTag = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/linkedTag/${id}`, formData, config);

    dispatch({
      type: types.GET_LINKED_TAG,
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

//Set Current LinkedTag
export const setCurrentLinkedTag = (LinkedTag) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_LINKED_TAG,
    payload: LinkedTag,
  });
};

//Delete LinkedTag
export const deleteLinkedTag = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/linkedTag/${id}`);
    dispatch({
      type: types.DELETE_LINKED_TAG,
      payload: id,
    });
    dispatch(setAlert("tag unlinked from asset", "success", "true"));
    dispatch(getAssets())
  } catch (err) {
    dispatch({
      type: types.LINKED_TAG_ERROR,
    });
  }
};

// Clear LinkedTag
export const clearLinkedTag = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_LINKED_TAG });
};

//Filter LinkedTag
export const filterLinkedTag = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_LINKED_TAG, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};

////get linked tag by tagid////////
export const getLinkedTagbyTag = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`api/tag/taginfo/${id}`);
    console.log(res)
    dispatch({
      type: types.GET_LINKED_TAG_INFO,
      payload: [id, res.data],
    });
  } catch (err) {}
};

///Hide ifo card in nav
export const hideInfoCard=() => async(dispatch)=>{
  dispatch({type : types.HIDE_CARD})
}
*/