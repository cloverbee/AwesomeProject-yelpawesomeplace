import { AsyncStorage } from 'react-native';
import {TRY_AUTH, AUTH_SET_TOKEN} from './actionTypes';
import {uiStartLoading, uiStopLoading} from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';
import App from '../../../App';

const API_KEY = 'AIzaSyC0yNrswfVNPgnsER2f4fgApaP6FP2iXXE';

export const tryAuth = (authData, authMode) => {
    return dispatch => {
        dispatch(uiStartLoading())
        //const apiKey = 'AIzaSyC0yNrswfVNPgnsER2f4fgApaP6FP2iXXE';
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY;
        if (authMode === 'signup')
        {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + API_KEY;
        }
        fetch(url, 
            {
                method: 'POST',
                body: JSON.stringify({
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        .catch(err => {
            console.log(err)
            alert("Authentication failed, please try again")
            dispatch(uiStopLoading())
        })
        .then(res => res.json())
        .then(parsedRes => {
            dispatch(uiStopLoading())
            if (!parsedRes.idToken)
            {
                alert("Authentication failed, please try again")
            }
            else{
                dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn, parsedRes.refreshToken))
                startMainTabs();
            }
        })
    };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
    return dispatch => {// store in the async storage
        dispatch(authSetToken(token))// also want to store in the redux store
        const now = new Date()
        const expiryDate = now.getTime() + 20 * 1000//expiresIn * 1000
        //console.log(now, new Date(expiryDate))
        AsyncStorage.setItem('ap:auth:token', token)
        AsyncStorage.setItem('ap:auth:expiryDate', expiryDate.toString())
        AsyncStorage.setItem('ap:auth:refreshToken', refreshToken)
    }
}

export const authSetToken = token => {// store in the redux store
    return {
        type: AUTH_SET_TOKEN,
        token: token
    }
}

export const authGetToken = () => { //as a help function so to say from anywhere in our application
    //in the end return a kind of token
    return (dispatch, getState) => {//work with redux thunk, return a promise here and that will later be useful
        const promise =  new Promise((resolve, reject) => {//Promise take a function as a argument to the constructor
            const token = getState().auth.token;// get from redux
            if (!token)
            {
                let fetchedToken 
                AsyncStorage.getItem('ap:auth:token')//have a look at async storage and see if we got a token here
                .catch(err => reject())
                .then(tokenFromStorage => {
                    fetchedToken = tokenFromStorage
                    if (!tokenFromStorage){
                        reject()
                        return
                    }
                    return AsyncStorage.getItem('ap:auth:expiryDate')
                })
                .then(expiryDate => {
                    const parsedExpiryDate = new Date(parseInt(expiryDate))// parse string to a real date
                    const now = new Date()
                    if ( parsedExpiryDate > now){
                        dispatch(authSetToken(fetchedToken))
                        resolve(fetchedToken)
                    }
                    else{
                        reject()
                    }
                })
                .catch(err => reject())
            }
            else
            {
                resolve(token)
            }
        })
        //clean up my AsynchStorage if we fail 
        // if we have no token or token expired
        return promise.catch(err => { 
            //The catch() method returns a Promise and deals with rejected cases only.
                return  AsyncStorage.getItem('ap:auth:refreshToken')
                .then(refreshToken => {
                    return fetch("https://securetoken.googleapis.com/v1/token?key=" + API_KEY, {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: "grant_type=refresh_token&refresh_token=" + refreshToken
                    })
                })
                .then(res => res.json())
                .then(parsedRes => {
                    if (parsedRes.id_token) {
                       dispatch(authStoreToken(parsedRes.id_token, parsedRes.expires_in, parsedRes.refresh_token));
                       return parsedRes.id_token; //authGetToken  we are still in authGetToken
                    }else{
                        dispatch(authClearStorage())//doesn`t throw an error
                    }
                })
        })//catch block 
        .then(token => {
            if (!token){
                throw new Error()
            }
            else{
                return token
            }
        })
        //return promise;
    }

}// in the end the idea is kind of return a token 

export const authAutoSignIn = () =>{
    return dispatch =>{
        dispatch(authGetToken())
        .then(token => {
            startMainTabs() // if we did have a token we already set the token to the redux store and we need to redirect the user
        })
        .catch(err => console.log('Failed to fetch token!'))// after this sentence run I want to clean up
    }
}

export const authClearStorage = () => { //dispatch this if we have no refresh_token or we really want to get rid of it
    AsyncStorage.removeItem('ap:auth:token')
    AsyncStorage.removeItem('ap:auth:expiryDate')
    return AsyncStorage.removeItem('ap:auth:refreshToken')// and subscribe to it
}

export const authLogout = () => {
    return dispatch => {
        dispatch(authClearStorage())// we need to go back to the auth page though
            .then() // subscribe to the authClearStorage
        App();
    }
}