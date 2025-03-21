import * as types from "../_actions/types";

const initialState = {
  gltf: null,
  gltfs: [],
  gltfName: null,
  error: {},
  filtered: null,
  loading: true,
  floorGltf : null,
  newGltfName : "om",
  newFenceGltfName : "om",
  fenceFloorGltf:null,
  showBackdrop : false

};

export default function gltfReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_GLTF:
      return {
        ...state,
        gltf: payload,
        loading: false,
      };

    case types.GET_GLTFS:
      console.log("GetGLTFS>>>>>>"+payload[0].gltf)
      return {
        ...state,
        gltfs: payload,
        gltfName: payload[0].gltf,
        loading: false,
      };

    case types.ADD_GLTF:
      return {
        ...state,
        gltf: payload,
        loading: false,
      };
    case types.SET_CURRENT_GLTF:
      return {
        ...state,
        gltf: action.payload,
      };
    case types.CLEAR_GLTF:
      return {
        ...state,
        gltf: null,
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
    case types.DELETE_GLTF:
      return {
        ...state,
        gltfs: state.gltfs.filter((gltf) => gltf._id !== action.payload),
        loading: false,
      };
    case types.GLTF_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
     case types.SET_GLTF_OF_FLOORPLAN:
       
       if(payload.length >0)
       { 
        //console.log(payload[0].gltf)
       return {
         ...state,
         newGltfName: payload[0].gltf,
         floorGltf : payload[0] 

       }
       } 
      case types.SET_GLTF_OF_FENCE_FLOORPLAN:
          
        if(payload.length >0)
        { 
         console.log("fence floorplan>>",payload[0].gltf)
        return {
          ...state,
          newFenceGltfName: payload[0].gltf,
          fenceFloorGltf: payload[0]
          
 
        }
      }
        else
        {
          return {
            ...state,
            newFenceGltfName: "om",
            fenceFloorGltf: null
        }
      }

    case types.SET_BACKDROP:
        return {
          ...state,
          showBackdrop : payload
        }


    default:
      return state;
  }
}
