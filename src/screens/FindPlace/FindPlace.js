import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../components/PlaceList/PlaceList';

import { getPlaces } from '../../store/actions/index';

class FindPlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: 'orange'
    };
    
    state = { // to determin whether we have data here
        placesLoaded: false,  //internal state : placeLoaded
        removeAnim: new Animated.Value(1), // remove animation when we remove the button
        placesAnim: new Animated.Value(0) // start from 0 to 1 
    }

    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentDidMount() {  //add a life cycle hook here , dispatch an action to fetch the places 
        this.props.onLoadPlaces();
    
    }

    onNavigatorEvent = event => {
        //console.log(event);
        if ( event.type === "NavBarButtonPress" ){
            if (event.id === "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    };


    placesLoadedHandler = () =>{
        Animated.timing(this.state.placesAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
        }).start();
    }

    placesSearchHandler = () =>{
        //play the animation
        Animated.timing (this.state.removeAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true
        }).start(()=>{
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
        });
    }

    itemSelectedHandler = key =>{
        const selPlace = this.props.places.find(place => {
            return place.key === key;
        });
        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selPlace.name,
            passProps: {
                selectedPlace: selPlace //intheend comes from our store for the place the user tapped on
            }
        });
    }
    render () {
        let content = ( //list or button   here is the button defination
            <Animated.View style = {{
                    opacity: this.state.removeAnim, //this is not a number only animatied knew what to do with that
                    transform :[
                        {
                            scale: this.state.removeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [12, 1]
                            })
                        }
                    ]
                }}>
                <TouchableOpacity onPress = {this.placesSearchHandler}>
                    <View style = {styles.searchButton}>
                        <Text style = {styles.searchButtonText}>
                            Find Places
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
        if (this.state.placesLoaded){
            content = (
                <Animated.View style = {{
                    opacity: this.state.placesAnim
                }}>
                    <PlaceList 
                        places = {this.props.places} 
                        onItemSelected = {this.itemSelectedHandler} />
                </Animated.View>
            );
        }
        return (
            <View style = {this.state.placesLoaded? null: styles.buttonContainer}>
                {content}    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    searchButton:{
        borderColor:'orange',
        borderWidth: 3,
        borderRadius: 50,
        padding: 20
    },
    searchButtonText:{
       color: 'orange',
       fontWeight: 'bold',
       fontSize: 26 
    }

});

const mapStateToProps = state => {
    return {
        places: state.places.places
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPlaces: () => dispatch(getPlaces()) //onLoadPlaces is now accessible on props and can be executed to initialize the 
        // fetching of places 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);