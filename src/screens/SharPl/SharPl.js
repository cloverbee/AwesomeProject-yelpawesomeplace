import React , { Component } from "react";
import {View, Text, TextInput, Button, StyleSheet, ScrollView, Image, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';

import { addPlace } from '../../store/actions/index';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MNT/MainText';
import HeadingText from '../../components/UI/HDT/HeadingText';
import PickImage from '../../components/PikImg/PikImg';
import PickLocation from '../../components/PikLctn/PikLctn';

import validate from '../../utility/validation';

class SharePlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: 'orange'
    }
    state = {
        controls:{
            placeName:{//store the name the user entered
                value:'',
                valid: false,
                touched: false,
                validationRules:{
                    notEmpty: true
                }
            },
            location:{// store the location
                value: null, //value should be the value of the location object
                valid: false // will turn to true while we got the true location
            },
            image:{
                value: null,
                valid: false 
            }
        }
    };
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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
    }

    placeNameChangedHandler = val => {
        this.setState(prevState => {
            return {
                controls:{
                    ...prevState.controls,
                    placeName: {
                        ...prevState.controls.placeName,
                        value: val,
                        valid: validate(val, prevState.controls.placeName.validationRules),
                        touched: true
                    }
                }
            };
        });
    }

    locationPickedHandler = location =>{
        this.setState(prevState =>{
            return {
                controls:{
                    ...prevState.controls,
                    location:{
                        value: location,
                        valid: true
                    }
                }
            }
        })
    }

    placeAddedHandler = () => {
        this.props.onAddPlace(this.state.controls.placeName.value,
                              this.state.controls.location.value,
                              this.state.controls.image.value);
        
    }

    imagePickHandler = image => {
        this.setState(prevState => {
            return {
                controls:{
                    ...prevState.controls,
                    image:{
                        value: image,
                        valid: true
                    }
                }
            }
        })
    }

    render()
    {
        let submitButton = ( //by default the submitButton is the <Button/>
                            <Button 
                                title = 'Share the place!' 
                                onPress = {this.placeAddedHandler}
                                disabled = {!this.state.controls.placeName.valid || 
                                            !this.state.controls.location.valid ||
                                            !this.state.controls.image.valid
                                            }/>
        );
        if (this.props.isLoading)
        {
            submitButton = <ActivityIndicator/>;
        }
        return (
            <ScrollView>
            <View style = {styles.container}>
                <MainText>
                    <HeadingText>
                    Share a place with us
                    </HeadingText>
                </MainText>
                
                <PickImage onImagePicked={this.imagePickHandler}/>
                <PickLocation onLocationPick = {this.locationPickedHandler}/>
                
                <PlaceInput 
                    placeData = {this.state.controls.placeName} 
                    onChangeText = {this.placeNameChangedHandler}/>
                <View style = {styles.button}>
                    {submitButton}    
                </View>
            </View>    
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    placeholder:{
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#eee',
        width: '80%',
        height: 150
    },
    button: {
        margin: 8
    },
    previewImage:{
        width: '100%',
        height: '100%'
    }

});

//connect this to my state
const mapStateToProps = state => { //get redux state as an argument
    return {
        isLoading: state.ui.isLoading   // isLoading prop map to state.ui.isLoading
    }//return my mapping object
};

const mapDispatchToProps = dispatch =>{
    return {
        onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)) 
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);