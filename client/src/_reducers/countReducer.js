import * as types from "../_actions/types";

const initialState = {
  tagsCount: null,
  buildingsCount: null,
  geofencesCount: null,
  error: {},
  loading: true,
};

export default function assetReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_TAGS_COUNT:
      return {
        ...state,
        tagsCount: payload,
        loading: false,
      };

    case types.GET_BUILDINGS_COUNT:
      return {
        ...state,
        buildingsCount: payload,
        loading: false,
      };

    case types.GET_GEOFENCES_COUNT:
      return {
        ...state,
        geofencesCount: payload,
        loading: false,
      };
    case types.COUNT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
