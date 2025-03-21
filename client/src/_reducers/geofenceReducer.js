import * as types from "../_actions/types";

const initialState = {
  geofence: null,
  geofences: [],
  error: {},
  filtered: null,
  loading: true,
  floorGeofence:[],
  showGeofenceCard : false,
  geofenceInfo : null,
  numberOfGeofence : null,
  addStatus : 0

};

export default function geofenceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_GEOFENCE:
      return {
        ...state,
        geofence: payload,
        loading: false,
      };

    case types.GET_GEOFENCES:
      return {
        ...state,
        geofences: payload,
        loading: false,
      };

    case types.ADD_GEOFENCE:
      return {
        ...state,
        geofence: payload,
        loading: false,
      };
    case types.SET_CURRENT_GEOFENCE:
      return {
        ...state,
        geofence: action.payload,
      };
    case types.CLEAR_GEOFENCE:
      return {
        ...state,
        geofence: null,
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
    case types.DELETE_GEOFENCE:
      return {
        ...state,
        geofences: state.geofences.filter(
          (geofence) => geofence._id !== action.payload
        ),
        loading: false,
      };
    case types.GEOFENCE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case types.GET_GEOFENCE_OF_FLOOR:
      return{
        ...state,
        floorGeofence : payload
      }
    
      
    case types.SHOW_GEOFENCE_CARD :
      return{
          ...state,
          showGeofenceCard : true,
          geofenceInfo : payload

      }
    case types.HIDE_GEOFENCE_CARD:
      return{
        ...state,
        showGeofenceCard: false,
        geofenceInfo: null
      }

    case types.SET_NUMBER_OF_GEOFENCE :
      console.log("Set NUmber of Geofence >>>",payload)
      return {
        ...state,
        numberOfGeofence : payload
      }

   case types.SET_GEOFENCE_CREATE_STATUS : 
   return {
     ...state,
     addStatus : payload
   }


    default:
      return state;
  }


}
