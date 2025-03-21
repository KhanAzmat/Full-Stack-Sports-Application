
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import * as types from "../_actions/types";

const initialState = {
  building: null,
  buildings: [],
  error: {},
  filtered: null,
  loading: true,
  buildingIdx : -1
  
};

export default function buildingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_BUILDING:
      return {
        ...state,
        building: payload,
        loading: false,
      };

    case types.GET_BUILDINGS:
      return {
        ...state,
        buildings: payload,
        buildingIdx: 0,
        loading: false
      };

    case types.ADD_BUILDING:
      return {
        ...state,
        building: payload,
        loading: false,
      };
    case types.SET_CURRENT_BUILDING:
      return {
        ...state,
        building: action.payload,
      };
    case types.CLEAR_BUILDING:
      return {
        ...state,
        building: null,
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
    case types.DELETE_BUILDING:
      return {
        ...state,
        buildings: state.buildings.filter(
          (building) => building._id !== action.payload
        ),
        loading: false,
      };
    case types.BUILDING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

     case types.SET_BUILDING_INDEX:
      
      console.log(state.buildings.length)
       if (state.buildings.length > 0){
        console.log("SET_BUILDING_INDEXS")
       return{
         ...state,
         buildingIdx : payload
       }
      }
      else
        return state 
    default:
      return state;
  }
}
