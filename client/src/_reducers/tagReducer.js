import { MergeTypeTwoTone } from "@mui/icons-material";
import * as types from "../_actions/types";

const initialState = {
  tag: null,
  tags: [],
  error: {},
  filtered: null,
  loading: true,
  showCard: false,
  tagInfo: null,
  addingTag : null


};

export default function tagReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_TAG:
      return {
        ...state,
        tag: payload,
        loading: false,
      };

    case types.GET_TAG_INFO:
      console.log(">>>>>Tag info",payload)
      
      return {
        ...state,
        tag: payload,
        loading: false,
        
      };
    case types.GET_TAGS:
      return {
        ...state,
        tags: payload,
        loading: false,
      };
    case types.ADD_TAG:
      return {
        ...state,
        tag: payload,
        loading: false,
      };
    case types.SET_CURRENT_TAG:
      return {
        ...state,
        tag: action.payload,
      };
    case types.CLEAR_TAG:
      return {
        ...state,
        tag: null,
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
    case types.DELETE_TAG:
      return {
        ...state,
        tags: state.tags.filter((um) => um._id !== action.payload),
        loading: false,
      };
    case types.TAG_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case types.ADDING_TAG:
      return {
        ...state,
        addingTag : payload
      }  

   


    default:
      return state;
  }
}
