import * as types from "../_actions/types";

const initialState = {
  anchor: null,
  anchors: [],
  error: {},
  filtered: null,
  loading: true,
};

export default function anchorReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_ANCHOR:
      return {
        ...state,
        anchor: payload,
        loading: false,
      };

    case types.GET_ANCHORS:
      return {
        ...state,
        anchors: payload,
        loading: false,
      };

    case types.ADD_ANCHOR:
      return {
        ...state,
        anchor: payload,
        loading: false,
      };
    case types.SET_CURRENT_ANCHOR:
      return {
        ...state,
        anchor: action.payload,
      };
    case types.CLEAR_ANCHOR:
      return {
        ...state,
        anchor: null,
        loading: false,
      };

    // case types.FILTER_ACTIVITY:
    //   return {
    //     ...state,
    //     filtered: state.activities.filter(activity => {
    //       const regex = new RegExp(`${action.payload}`, "gi");
    //       return (
    //         staff.firstName.match(regex) ||
    //         staff.lastName.match(regex) ||
    //         staff.email.match(regex) ||
    //         staff.mobile.match(regex) ||
    //         staff.username.match(regex)
    //       );
    //     })
    //   };
    case types.CLEAR_FILTER:
      return {
        ...state,
        filtered: null,
      };
    case types.DELETE_ANCHOR:
      return {
        ...state,
       
        loading: false,
      };
    case types.ANCHOR_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
