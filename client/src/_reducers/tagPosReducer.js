import * as types from "../_actions/types";

const initialState = {
  tagPosData: [],
  error: {},
};

export default function tagReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_TAG_POSES:
      return {
        ...state,
        tagPosData: payload,
        loading: false,
      };

    default:
      return state;
  }
}
