import React, {Component} from 'react';
import {View, Image, Button, StyleSheet, Text, Dimensions} from 'react-native';
import MapView from 'react-native-maps';

//  PickLocation  in the end will be rendered in a Scroll view 
//won` t have problem with the height and so on 
class PickLocation extends Component{
    //manage the initialRegion through the state
    // we need to be able to change it
    // when the user picks a location we re-render the view with that pick location as the initial region
    state = {
        focusedLocation:{//how is such a region defined
            latitude: 37.7900352,
            longitude: -122.4013726,
            latitudeDelta: 0.0122,
            longitudeDelta: 
                Dimensions.get('window').width/
                Dimensions.get('window').height * 
                0.0122
        },
        locationChosen: false //only want to display the marker when we did pick a location
    }

    getLocationHandler = () => {
        navigator.geolocation.getCurrentPosition( pos => {
            const coordsEvent = {
                nativeEvent: {
                    coordinate:{
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                }
            };
            this.pickLocationHandler(coordsEvent);
        },
        err => {
            console.log(err);
            alert( 'Fetching the Position Failed, please pick one manually!');
        });
        //using the native device capabilities of getting a user position 
    }

    pickLocationHandler = event => {
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({ // this method need a javascript object to configure this region we want to navigate to 
        // the region I want to go to
            ...this.state.focusedLocation,
            latitude: coords.latitude,
            longitude: coords.longitude
        });
        this.setState(prevState => {
            return {
                focusedLocation: {
                    ...prevState.focusedLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                locationChosen: true
            }
        })
        this.props.onLocationPick({ // with this we get the data from the pickLocation component to the shareplace component
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    }

    render() {
        let marker = null;
        if (this.state.locationChosen){
            marker = <MapView.Marker coordinate = {this.state.focusedLocation}/>
        }
        return(
            <View style = {styles.container}>
                <MapView
                    initialRegion = {this.state.focusedLocation} //region needs to be flexible   initialize our initialRegion here
                    //region = {this.state.focusedLocation} //the map focus follow the point you pointed
                    style = {styles.map}
                    onPress = {this.pickLocationHandler}
                    ref = {ref => this.map = ref} // create a property in your class which holds a reference to this object 
                    //and then use your object in your code
                >
                    {marker}
                  
                </MapView>
                
                <View style = {styles.button}>
                    <Button title = 'Locate me' onPress = {this.getLocationHandler}/>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        width : '100%',
        alignItems: 'center'
    },
    map:{
        width: '100%',
        height: 250
    },
    button: {
        margin: 8
    }

});

export default PickLocation;