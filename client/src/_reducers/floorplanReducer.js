import { FloorMenu } from "../components/UI/Menu";
import * as types from "../_actions/types";

const initialState = {
  floorplan: null,
  floorplans: [],
  gltfName: "",
  error: {},
  filtered: null,
  loading: true,
  floorPlanIdx : 0,
  buildingFloorPlans :[],
  floorPlanId: null,
  floorMenu : false,
  currentFloorNumber : null,
  currentFloorId : null,
  configFloor : null,
};

export default function floorplanReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_FLOORPLAN:
      return {
        ...state,
        floorplan: payload.data,
        gltfName: payload.gltf,
        loading: false,

      };

    case types.GET_FLOORPLANS:
      return {
        ...state,
        floorplans: payload,
      };

    case types.ADD_FLOORPLAN:
      return {
        ...state,
        floorplan: payload,
        loading: false,
      };
    case types.SET_CURRENT_FLOORPLAN:
      return {
        ...state,
        floorplan: action.payload,
        gltfName: action.payload.gltf
      };
    case types.CLEAR_FLOORPLAN:
      return {
        ...state,
        floorplan: null,
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
    case types.DELETE_FLOORPLAN:
      return {
        ...state,
        floorplans: state.floorplans.filter(
          (floorplan) => floorplan._id !== action.payload
        ),
        loading: false,
      };
    case types.FLOORPLAN_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };


      case types.GET_BUILDING_FLOORPLANS :
        //console.log(payload)
        return {
          ...state,
          floorPlanIdx : 0,
          buildingFloorPlans : payload
        }


       case types.SET_FLOORPLAN_INDEX :
         return {
            ...state,
            floorPlanIdx : payload

         }
         
         case types.SET_FLOORPLAN_ID :
           return{
             ...state,
             floorPlanId :payload
           }
         
         case types.SHOW_FLOOR_MENU :
         
           return {
              ...state,
              floorMenu: payload 
           }

          case types.SET_CURRENT_FLOOR_NUMBER:
            console.log("set current floor number>>>", payload)
            return {
              ...state,
              currentFloorNumber : payload
            }
          case types.SET_CURRENT_FLOOR_ID :
            console.log("set  floorId>>>",payload)
            return {
              ...state,
              currentFloorId : payload
            }
            
          case types.SET_CONFIG_FLOORPLAN : 
             return{
               ...state,
               configFloor : payload 
             }

    default:
      return state;
  }
}
