/** @format */
import React from 'react'; 
import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './src/store/configureStore';
import {name as appName} from './app.json';

const store = configureStore(); // creat a store and can pass extra configuration
const RNRedux = () => (
    <Provider store = {store}> 
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
