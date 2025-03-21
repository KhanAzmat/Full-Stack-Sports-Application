import * as types from "../_actions/types";

const initialState = {
  organisation: null,
  organisations: [],
  error: {},
  filtered: null,
  loading: true,
};

export default function organisationReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_ORGANISATION:
      return {
        ...state,
        organisation: payload.data,
        loading: false,
      };
    case types.GET_ORGANISATIONS:
      return {
        ...state,
        organisations: payload,
      };
    case types.ADD_ORGANISATION:
      return {
        ...state,
        organisation: payload,
        loading: false,
      };
    case types.SET_CURRENT_ORGANISATION:
      return {
        ...state,
        organisation: action.payload,
      };
    case types.CLEAR_ORGANISATION:
      return {
        ...state,
        organisation: null,
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
    case types.DELETE_ORGANISATION:
      return {
        ...state,
        organisations: state.organisations.filter(
          (um) => um._id !== action.payload
        ),
        loading: false,
      };
    case types.ORGANISATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
