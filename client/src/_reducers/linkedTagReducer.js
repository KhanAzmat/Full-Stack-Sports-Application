
import * as types from "../_actions/types";

const initialState = {
  linkedTag: null,
  linkedTags: [],
  error: {},
  filtered: null,
  loading: true,
  tagInfo: null,
  showCard: false,
  tagId : ""

};

export default function linkedTagReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GET_LINKED_TAG:
      return {
        ...state,
        linkedTag: payload,
        loading: false,
      };

    case types.GET_LINKED_TAGS:
      return {
        ...state,
        linkedTags: payload,
        loading: false,
      };

    case types.ADD_LINKED_TAG:
      return {
        ...state,
        linkedTag: payload,
        loading: false,
      };
    case types.SET_CURRENT_LINKED_TAG:
      return {
        ...state,
        linkedTag: action.payload,
      };
    case types.CLEAR_LINKED_TAG:
      return {
        ...state,
        linkedTag: null,
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
    case types.DELETE_LINKED_TAG:
      return {
        ...state,
        linkedTags: state.linkedTags.filter(
          (linkedTag) => linkedTag._id !== action.payload
        ),
        loading: false,
      };
    case types.LINKED_TAG_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
       };


       case types.GET_LINKED_TAG_INFO:
        console.log(">>>>>Tag info",payload)
        console.log(">>>>>Tag info",state.showCard)
       
        return {
          ...state,
          tagId:payload[0],
          tagInfo: payload[1],
          loading: false,
          showCard: true
        };  
        

        case types.HIDE_CARD:
          return{
            ...state,
            tagId:"",
            showCard: false
   
          }



    default:
      return state;
  }
}
