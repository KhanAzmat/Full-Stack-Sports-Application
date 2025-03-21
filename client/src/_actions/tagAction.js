/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Tag
export const getTag = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/tag/${id}`);

    dispatch({
      type: types.GET_TAG,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.TAG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get current Tag
export const getTagInfo = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`api/tag/taginfo/${id}`);
    //console.log(res.data);
    dispatch({
      type: types.GET_TAG_INFO,
      payload: res.data,
    });
  } catch (err) {
    // dispatch({
    //   type: types.TAG_ERROR,
    //   payload: { msg: err.response.statusText, status: err.response.status },
    // });
    console.log("No Tag information Available");
  }
};

//Get all Tags
export const getTags = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/tag");
    dispatch({
      type: types.GET_TAGS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.TAG_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Tag
export const addTag = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.post("/api/tag", formData);
    dispatch({
      type: types.ADD_TAG,
      payload: res.data,
    });
    dispatch(getTags());
    dispatch(setAddingTag(null))
    dispatch(setAlert(`New Tag ${formData.tagId} added`, "success", true));
  } catch (err) {
    if(err.response && err.response.data) {
dispatch(setAlert(err.response.data, "error", true));
} else {
console.log(err);
}

  }
};

// Edit Tag
export const editTag = (formData, id, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/tag/${id}`, formData, config);

    dispatch({
      type: types.GET_TAG,
      payload: res.data,
    });

    dispatch(setAlert("Tag Updated", "success"));

    history.push("/Tags");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }

    dispatch({
      type: types.TAG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Set Current Tag
export const setCurrentTag = (Tag) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_TAG,
    payload: Tag,
  });
};

//Delete Tag
export const deleteTag = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/tag/${id}`);
    dispatch({
      type: types.DELETE_TAG,
      payload: id,
    });
    dispatch(setAlert("Tag Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.TAG_ERROR,
    });
  }
};

// Clear Tag
export const clearTag = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_TAG });
};

//Filter Tag
export const filterTag = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_TAG, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};


////adding new tag in data base. It donst allow database query for tag being added to database

export const setAddingTag=(pid)=>async(dispatch)=>{
  dispatch({ type: types.ADDING_TAG , payload : pid});
}
*/
