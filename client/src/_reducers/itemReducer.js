import * as types from "../_actions/types";

const initialState = {
  item: null,
  items: [],
  error: {},
  filtered: null,
  loading: true,
};

export default function itemReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_ITEM:
      return {
        ...state,
        item: payload,
        loading: false,
      };

    case types.GET_ITEMS:
      return {
        ...state,
        items: payload,
        loading: false,
      };

    case types.ADD_ITEM:
      return {
        ...state,
        item: payload,
        loading: false,
      };
    case types.SET_CURRENT_ITEM:
      return {
        ...state,
        item: action.payload,
      };
    case types.CLEAR_ITEM:
      return {
        ...state,
        item: null,
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
    case types.DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
        loading: false,
      };
    case types.ITEM_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
