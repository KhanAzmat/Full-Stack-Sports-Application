
/*import axios from "axios";
import { setAlert } from "./alertAction";
import * as types from "./types";

// Get current Geofence
export const getGeofence = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/geoFence/${id}`);

    dispatch({
      type: types.GET_GEOFENCE,
      payload: res.data.data,
    });
  } catch (err) {}
};

//Get all Geofences
export const getGeofences = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/geoFence");
    dispatch({
      type: types.GET_GEOFENCES,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GEOFENCE_ERROR,
      payload: { status: err.response },
    });
  }
};

//Get all Fav Geofences
export const getFavGeofences = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/geoFence?favorite=true");
    dispatch({
      type: types.GET_FAV_GEOFENCES,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GEOFENCE_ERROR,
      payload: { status: err.response },
    });
  }
};

// Add Geofence
export const addGeofence = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.post("/api/geoFence", formData);
    dispatch(setAlert("Geofence Added", "success", true));
    dispatch({
      type: types.ADD_GEOFENCE,
      payload: res.data,
    });
    //dispatch(getGeofences());
    
    // history.push("/Geofence");
    dispatch(setGeofenceAddStatus(1))
  } catch (err) {
    const errors = err.response

    console.log(errors);
    if(errors.status===406){
      dispatch(setAlert("Current geofence intersects with other fence","error",true))
      

    } 
    else{
      dispatch(setAlert(`Internal server error`,"error",true))
    }
    dispatch(setGeofenceAddStatus(2))

    if (errors) {
      //errors.forEach((error) => dispatch(setAlert(error.msg, "error", true)));
    }
  }
};

// Edit Geofence
export const editGeofence = (formData, id, alertMsg) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.patch(`/api/geoFence/${id}`, formData, config);

    dispatch({
      type: types.GET_GEOFENCE,
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

//Set Current Geofence
export const setCurrentGeofence = (Geofence) => async (dispatch) => {
  dispatch({
    type: types.SET_CURRENT_GEOFENCE,
    payload: Geofence,
  });
};

//Delete Geofence
export const deleteGeoDB = (id) => async (dispatch) => {
    try {
      await axios.delete(`/api/geoFence/${id}`);
      dispatch({
        type: types.DELETE_GEOFENCE,
        payload: id,
      });
      //dispatch(getGeofences())
      dispatch(setAlert("Geofence Deleted", "success", "true"));
      dispatch(setGeofenceAddStatus(3))

    } catch (err) {
      console.log(err)
      dispatch({
        type: types.GEOFENCE_ERROR,
      });
      dispatch(setAlert("Internal error. Geofence can't be deleted", "error", "true"));
      dispatch(setGeofenceAddStatus(2))
    }
 
};

// Clear Geofence
export const clearGeofence = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_GEOFENCE });
};

//Filter Geofence
export const filterGeofence = (text) => async (dispatch) => {
  dispatch({ type: types.FILTER_GEOFENCE, payload: text });
};

// Clear Filter
export const clearFilter = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_FILTER });
};



///get geofence by floor
export const getGeofencesByFloor = (floorid) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/geoFence/floorplan/${floorid}`);
    dispatch({
      type: types.GET_GEOFENCE_OF_FLOOR,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.GEOFENCE_ERROR,
      payload: { status: err.response },
    });
  }
};


//show geofence card
export const showGeofenceInfo = (info)=>async(dispatch)=>{

  try{
    dispatch({
      type : types.SHOW_GEOFENCE_CARD,
      payload : info

    });

  }catch(err){
    console.log(err)
  }


}


export const hideGeofenceCard =()=>async(dispatch)=>{
try{
  dispatch({
    type: types.HIDE_GEOFENCE_CARD,
  });
}catch(err)
{
  console.log(err)
}

}


export const setNumberOfGeofence =(i)=>async(dispatch)=>{
  
    dispatch({
      type: types.SET_NUMBER_OF_GEOFENCE, 
      payload : i
    });
  
  
}

///This method sets geofence creation status
//0 . Geofence yet to be added
//1 . new geofence creation success
//2 . gefence creation or deletion  failed
//3 . geofence sucessfully deleted 

export const setGeofenceAddStatus =(i)=>async(dispatch)=>{
  
  dispatch({
    type: types.SET_GEOFENCE_CREATE_STATUS,
    payload : i
  });


}*/
