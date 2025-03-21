
import { SET_COLOR_INDEX } from "../_actions/types";


const initialState = {
    colorIndex : 0
}


export default function colorReducer(state = initialState,action) {

    const {type , payload} = action
    switch(type)
    {
        case SET_COLOR_INDEX :
            console.log("payload",payload)
            return {
                ...state,
                colorIndex : payload
            }
        
        default :
            return state    
    }
    


}