import * as types from "../_actions/types";

const initialState = {
  employee: null,
  employees: [],
  error: {},
  filtered: null,
  loading: true,
};

export default function employeeReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_EMPLOYEE:
      return {
        ...state,
        employee: payload,
        loading: false,
      };

    case types.GET_EMPLOYEES:
      return {
        ...state,
        employees: payload,
        loading: false,
      };

    case types.ADD_EMPLOYEE:
      return {
        ...state,
        employee: payload,
        loading: false,
      };
    case types.SET_CURRENT_EMPLOYEE:
      return {
        ...state,
        employee: action.payload,
      };
    case types.CLEAR_EMPLOYEE:
      return {
        ...state,
        employee: null,
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
    case types.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(
          (employee) => employee._id !== action.payload
        ),
        loading: false,
      };
    case types.EMPLOYEE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
