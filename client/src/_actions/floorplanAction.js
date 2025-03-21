

/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Floorplan
export const getFloorplan = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/floorplan/${id}`);

    dispatch({
      type: types.GET_FLOORPLAN,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get all Floorplans
export const getFloorplans = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/floorplan");
    dispatch({
      type: types.GET_FLOORPLANS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Floorplans
export const getFavFloorplans = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/floorplan?favorite=true");
    dispatch({
      type: types.GET_FAV_FLOORPLANS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all floorplan of current building
export const getFloorplansForCurrentBuilding = (building) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/floorplan/building/${building}`);
    
    dispatch({
      type: types.GET_BUILDING_FLOORPLANS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Floorplan
export const addFloorplan = (formData) => async (dispatch) => {
  console.log(formData)
  try {
    const res = await axios.post("/api/floorplan", formData);
    dispatch({
      type: types.ADD_FLOORPLAN,
      payload: res.data,
    });
    dispatch(getFloorplans());
    dispatch(setAlert("Floor Plan Added, 3D Model will be ready in 24 hours", "success", true));
    //history.push("/floorplan");
  } catch (err) {
    if(err.response && err.response.data) {
dispatch(setAlert(err.response.data, "error", true));
} else {
console.log(err);
}
  }
};

// Edit Floorplan
export const editFloorplan = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/floorplan/${id}`, formData, config);

    dispatch({
      type: types.SET_CONFIG_FLOORPLAN,
      payload: res.data,
    });

    dispatch(setAlert(alertMsg, "success", true));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }

    dispatch({
      type: types.FLOORPLAN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Set Current Floorplan
export const setCurrentFloorplan = (Floorplan) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_FLOORPLAN,
    payload: Floorplan,
  });
};

//Delete Floorplan
export const deleteFloorplan = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/floorplan/${id}`);
    dispatch({
      type: types.DELETE_FLOORPLAN,
      payload: id,
    });
    dispatch(setAlert("Floorplan Deleted", "success", "true"));
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
    });
  }
};

// Clear Floorplan
export const clearFloorplan = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FLOORPLAN });
};

//Filter Floorplan
export const filterFloorplan = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_FLOORPLAN, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};


export const setCurrentFloorIndex=(idx)=> async (dispatch)=>{
  dispatch({type: types.SET_FLOORPLAN_INDEX, payload: idx })
}


export const getFloorplansForBuilding = (building) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/floorplan?building=${building}`);
    dispatch({
      type: types.GET_FLOORPLANS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
      payload: { status: err.response },
    });
  }
};

export const setCurrentFloorPlanId =(id)=>async(dispatch)=>{
  dispatch({type: types.SET_FLOORPLAN_ID, payload: id })
}

export const showFloorMenu =()=>async(dispatch)=>{
  console.log("showFloorMenu invoked")
  dispatch({type: types.SHOW_FLOOR_MENU, payload: true })
}

export const hideFloorMenu =()=>async(dispatch)=>{
  dispatch({type: types.SHOW_FLOOR_MENU, payload: false })
}

export const setCurrentFloorNumber =(i)=>async(dispatch)=>{
  dispatch({type: types.SET_CURRENT_FLOOR_NUMBER, payload: i })
}

export const setCurrentFloorId =(id)=>async(dispatch)=>{
  dispatch({type: types.SET_CURRENT_FLOOR_ID, payload: id })

}



export const getConfigFloorplan = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/floorplan/${id}`);

    dispatch({
      type: types.SET_CONFIG_FLOORPLAN,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.FLOORPLAN_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}; */