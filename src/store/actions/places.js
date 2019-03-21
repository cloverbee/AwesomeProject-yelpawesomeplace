import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import {uiStartLoading, uiStopLoading, authGetToken} from './index';

export const addPlace = (placeName, location, image) => {
    
    return dispatch => {
        let authToken;
        //dispatch uiStartloading right before we sent the fetch request
        dispatch(uiStartLoading());
        dispatch(authGetToken())
        .catch(() => {
            alert('No valid token found!')
        })
            .then(token => {
                authToken = token
                return fetch('https://us-central1-fir-demo-project-f2018.cloudfunctions.net/storeImage', {
                    method: "POST",
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers:{
                        'Authorization' : 'Bearer ' + authToken
                    }
                })
            
            })

        .catch(err => {
            console.log(err);
            dispatch(uiStopLoading());
        })
        .then(res => res.json())
        .then(parsedRes => {
            const placeData = {
                name: placeName,
                location: location,
                image: ''+ parsedRes.imageUrl,//JSON.stringify(" "+parsedRes.imageUrl),
                test:'stringshorterthan'
            };
            return fetch('https://rn-awesomeprojec-1550793671851.firebaseio.com/places.json?auth=' + authToken, {
                method: "POST",
                body: JSON.stringify(placeData)
            })
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log(parsedRes);
            dispatch(uiStopLoading());//when we finaly done we dont want to show a spinner anymore
        })
        .catch(err => {
            console.log(err);
            dispatch(uiStopLoading());
        })
    };
};

export const getPlaces = () => { //reach out to our backend to get the places
    //running asych code here
    return dispatch => { //redux thunk helps
        dispatch(authGetToken())
            .then(token => {
                return fetch('https://rn-awesomeprojec-1550793671851.firebaseio.com/places.json?auth=' + token)
            })
            .catch(() => {
                alert('No valid token found!')
            })
            .then(res => res.json())//extract the json data 
            .then(parsedRes =>{ //another block to have the parsed response 
            // dispatch another action which will be consumed by our reducer which then should set up the places
                const places = [];
                for (let key in parsedRes){
                    places.push( {
                        ...parsedRes[key],
                        image: {
                            uri: parsedRes[key].image
                        },
                        key: key
                    }
                    )
                }   
                dispatch(setPlaces(places))//essentialy dispatch this action (type places )object
            })
            .catch(err => {
                alert('something went wrong, sorry : /');
                console.log(err);  // don`t dispatch start or stop loading  I don`t using a spinner 
            })
            

        
        

    }
}

export const setPlaces = places => {// this is the action we use when we got a response
    return {
        type: SET_PLACES, //pass to reducer
        places: places// pass places as a property of that action
    }
}

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
        .catch(() => {
            alert('No valid token found!')
        })
            .then(token => {
                dispatch(removePlace(key));
                return fetch("https://rn-awesomeprojec-1550793671851.firebaseio.com/places/"+ key + ".json?auth=" + token, {
                    method: "DELETE"
                })
            })
            .then(res => res.json())//extract the json data
            .then(parsedRes =>{
                console.log('Done');
            })
            .catch(err => {
                alert('something went wrong, sorry : /');
                console.log(err);  // don`t dispatch start or stop loading  I don`t using a spinner 
            })    
    };
};

export const removePlace = key => {
    return { // return a javascript object which should have a type and the key is the payload
            // define a new type for this in the actionType
        type: REMOVE_PLACE,
        key: key //pass on the key as an argument  so remove the target in Redux
    }
}
