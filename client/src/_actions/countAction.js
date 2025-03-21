/*import axios from "axios";
import * as types from "./types";

export const getTagsCount = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/tag/count");
    dispatch({
      type: types.GET_TAGS_COUNT,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.COUNT_ERROR,
      payload: { status: err.response },
    });
  }
};

export const getBuildingsCount = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/building/count");
    dispatch({
      type: types.GET_BUILDINGS_COUNT,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.COUNT_ERROR,
      payload: { status: err.response },
    });
  }
};

export const getGeofencesCount = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/geoFence/count");
    dispatch({
      type: types.GET_GEOFENCES_COUNT,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: types.COUNT_ERROR,
      payload: { status: err.response },
    });
  }
};
*/