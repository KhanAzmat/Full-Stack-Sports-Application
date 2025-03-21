import * as types from "../_actions/types";

const initialState = {
  asset: null,
  assets: [],
  error: {},
  filtered: null,
  loading: true,
};

export default function assetReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_ASSET:
      return {
        ...state,
        asset: payload,
        loading: false,
      };

    case types.GET_ASSETS:
      return {
        ...state,
        assets: payload,
        loading: false,
      };

    case types.ADD_ASSET:
      return {
        ...state,
        asset: payload,
        loading: false,
      };
    case types.SET_CURRENT_ASSET:
      return {
        ...state,
        asset: action.payload,
      };
    case types.CLEAR_ASSET:
      return {
        ...state,
        asset: null,
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
    case types.DELETE_ASSET:
      return {
        ...state,
        assets: state.assets.filter((asset) => asset._id !== action.payload),
        loading: false,
      };
    case types.ASSET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
