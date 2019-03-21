import { createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import placesReducer from './reducers/places';
import uiReducer from './reducers/ui';
//add it to other reducers into our root reducer
import authReducer from './reducers/auth';

const rootReducer = combineReducers({
    places: placesReducer ,//map places to placesReducer? 
    ui: uiReducer, // with this I can access its state and it`s hooked into redux
    auth: authReducer //part of our combine reducer
});


let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
    
};

export default configureStore;
//creating a store
