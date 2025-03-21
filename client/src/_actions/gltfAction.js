


/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Gltf
export const getGltf = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/gltf/${id}`);

    dispatch({
      type: types.GET_GLTF,
      payload: res.data.data,
    });
  } catch (err) {}
};

//Get all Gltfs
export const getGltfs = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/gltf");
    dispatch({
      type: types.GET_GLTFS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GLTF_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Gltfs
export const getFavGltfs = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/gltf?favorite=true");
    dispatch({
      type: types.GET_FAV_GLTFS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GLTF_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Gltf
export const addGltf = (formData) => async (dispatch) => {
  console.log(formData);
  try {
    const res = await axios.post("/api/gltf", formData);
    dispatch({
      type: types.ADD_GLTF,
      payload: res.data,
    });
    dispatch(getGltfOfFloor(formData.floorplan))
    dispatch(setAlert("GLTF File Uploaded!", "success", true));
    //history.push("/navigation");
  } catch (err) {
    const errors = err.response && err.response.data.errors;

    console.log(err);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", true)));
    }
  }
};


////This edit  function uploads new gltf file
export const editGltfWithFile = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/gltf/updategltf/${id}`, formData, config);

    dispatch({
      type: types.GET_GLTF,
      payload: res.data,
    });
    dispatch(getGltfOfFloor(formData.floorplan))
    dispatch(setAlert("Gltf information updated", "success", true));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
  }
};






// Edit Gltf without gltf file
export const editGltf = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/gltf/${id}`, formData, config);

    dispatch({
      type: types.GET_GLTF,
      payload: res.data,
    });
    dispatch(getGltfOfFloor(formData.floorplan))
    dispatch(setAlert("Gltf information updated", "success", true));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
  }
};

//Set Current Gltf
export const setCurrentGltf = (Gltf) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_GLTF,
    payload: Gltf,
  });
};

//Delete Gltf
export const deleteGltf = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/gltf/${id}`);
    dispatch({
      type: types.DELETE_GLTF,
      payload: id,
    });
    dispatch(setAlert("Gltf Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.GLTF_ERROR,
    });
  }
};

// Clear Gltf
export const clearGltf = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_GLTF });
};

//Filter Gltf
export const filterGltf = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_GLTF, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};



export const getGltfOfFloor = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/gltf/floorplan/${id}`);

    dispatch({
      type: types.SET_GLTF_OF_FLOORPLAN,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GLTF_ERROR,
      payload: { status: err.response },
    });
  }
};

export const getGltfOfFenceFloor = (id) => async (dispatch) => {
  try {
    
    dispatch({
      type: types.SET_GLTF_OF_FENCE_FLOORPLAN,
      payload: [],
    });
    
    const res = await axios.get(`/api/gltf/floorplan/${id}`);

    dispatch({
      type: types.SET_GLTF_OF_FENCE_FLOORPLAN,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GLTF_ERROR,
      payload: { status: err.response },
    });
  }
};

export const setBackdrop=(value)=>async(dispatch)=>{
  dispatch({
    type : types.SET_BACKDROP,
    payload : value
  })
}
*/

