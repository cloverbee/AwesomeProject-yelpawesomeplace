import {UI_START_LOADING, UI_STOP_LOADING} from '../actions/actionTypes';

const initialState = {
    isLoading: false
}// we are not loading by default

const reducer = (state = initialState, action) => { //action is the action I received
    switch (action.type){
        case UI_START_LOADING:
            return {
                ...state,
                isLoading: true
            }

        case UI_STOP_LOADING:
            return {
                ...state,
                isLoading: false
            }

        default:

        return state;
    }
}

export default reducer;//export the reducer function as the default of this file