import { SET_PLACES, REMOVE_PLACE } from '../actions/actionTypes';


const initialState = {
    places: []
};


const reducer = (state = initialState, action) => {
    switch (action.type){
        case SET_PLACES:
            return {
                ...state,  //distribute the old state
                places: action.places //initialize my places array here, equal to the places we fetch from server
                
            }
        case REMOVE_PLACE:
            return {
                ...state,
                places: state.places.filter(place => {
                    return place.key !== action.key; //action.key defined in /actions.places
                  })
            };
        
        default:
            return state;
    }
};

export default reducer;