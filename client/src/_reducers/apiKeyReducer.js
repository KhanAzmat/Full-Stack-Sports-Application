
import  { GENERATE_API_KEY, DELETE_API_KEY, GET_API_KEYS, TOKEN_GENERATED,RESET_TOKEN } from "../_actions/types" 



const initialState = {
    apiKeys:[],
    apiToken : null
  };
 

  export default function apiKeyReducer(state = initialState, action){
    const { type, payload } = action;

    switch(type){
case GET_API_KEYS : 
   console.log("payload>>",payload)
    return {...state,
      apiKeys : payload
    }
case TOKEN_GENERATED :
    return{
        ...state,
        apiToken : payload
    }
 case RESET_TOKEN :
     return {
         ...state,
         apiToken:null
     }   

    default :
       return state

    }

  }