import { Navigation } from "react-native-navigation";
import { Provider } from 'react-redux';



import AuthScreen from "./src/screens/Auth/Auth";
import SharePlaceScreen from "./src/screens/SharPl/SharPl";
import FindPlaceScreen from "./src/screens/FindPlace/FindPlace";
import configureStore from './src/store/configureStore';
import PlaceDetailScreen from './src/screens/PlaceDe/PlaceDetail';
import SideDrawer from './src/screens/SidDr/SidDrwer';

const store = configureStore(); // creat a store and can pass extra configuration

// Register Screens
Navigation.registerComponent("awesome-places.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("awesome-places.SharePlaceScreen", () => SharePlaceScreen, store, Provider);
Navigation.registerComponent("awesome-places.FindPlaceScreen", () => FindPlaceScreen, store, Provider);//thrid and fourth argument for global state
Navigation.registerComponent("awesome-places.PlaceDetailScreen", () => PlaceDetailScreen, store, Provider);
Navigation.registerComponent("awesome-places.SideDrawer", () => SideDrawer);


// Start a App
export default () => Navigation.startSingleScreenApp({
  screen: {
    screen: "awesome-places.AuthScreen",
    title: "Login"
  }
});