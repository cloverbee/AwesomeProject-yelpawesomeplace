import React, { Component } from 'react';
import {View , Text, Button, TextInput, StyleSheet, ImageBackground, 
    Dimensions, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';


import { connect } from 'react-redux';

import DefaultInput from '../../components/UI/DFI/DefaultInput';
import HeadingText from '../../components/UI/HDT/HeadingText';
import MainText from '../../components/UI/MNT/MainText';
import backgroundImage from '../../assets/bkgimg.jpg';
import ButtonWithBackground from '../../components/UI/ButonWthBkg/ButonWthBkg.js';
import validate from '../../utility/validation';

import { tryAuth, authAutoSignIn } from '../../store/actions/index';//bundle all my export

class AuthScreen extends Component{

    state = {
        viewMode: Dimensions.get('window').height > 500 ? 'portrait':'landscape',
        authMode: 'login', 
    controls: {
        email:{
            value:'',
            valid: false,
            validationRules:{
                isEmail: true
            },
            touched: false
        },
        password:{
            value:'',
            valid: false,
            validationRules:{
                minLength: 6
            } ,
            touched: false
        },
        confirmPassword:{
            value:'',
            valid: false,
            validationRules:{
                equalTo: 'password'
            },
            touched: false
        }
    }
    };

    constructor(props){
        super(props);
        Dimensions.addEventListener('change', this.updateStyles);
    }

    componentDidMount()//a new life cycle hook 
    // this will not be excuted if I just close the app and go back into it without killing it 
    // but it will be excuted if the user did kill the app and relaunches it
    // so it is a good place to check if we have a token 
    {
        this.props.onAutoSignIn()
    }



    componentWillUnmount(){
        Dimensions.removeEventListener('change', this.updateStyles)
    }

    switchAuthModeHandler = () =>{
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === 'login'? 'signup':'login'
            }
        })
    }

    updateStyles = (dims) =>{
        this.setState({
            viewMode:  
                Dimensions.get('window').height > 500 ? 'portrait':'landscape'
                //dims.window.height     same as
            })
    }

    authHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        };
        this.props.onTryAuth(authData, this.state.authMode);// forward the authMode
    }

    updateInputState = (key, value) =>{
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo){
            const equalControl = this.state.controls[key].validationRules.equalTo;
            const equalValue = this.state.controls[equalControl].value;
            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            };
        }
        if ( key === 'password'){
            
            connectedValue = {
                ...connectedValue,
                equalTo: value
            };
        }
        this.setState(prevState => {
            return {
                controls:{
                    ...prevState.controls,
                    confirmPassword:{
                        ...prevState.controls.confirmPassword,
                        valid: 
                            key === 'password'?
                            validate( //this is a javascript object which we handle this in the .js file
                                prevState.controls.confirmPassword.value,
                                prevState.controls.confirmPassword.validationRules,
                                connectedValue
                            )
                            :prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value, 
                        valid: validate(value, prevState.controls[key].validationRules, connectedValue),
                        touched: true
                    }
                },
                
            }
        });
    }

    render(){
        let headingText = null;
        let confirmPasswordControl = null;
        let submitButton = ( // only want to render this if we are not waiting for our request to finish
            <ButtonWithBackground 
                        color = "#29aaf4" 
                        onPress = {this.authHandler}
                        disabled = {
                            (! this.state.controls.confirmPassword.valid && this.state.authMode === 'signup') || 
                            ! this.state.controls.password.valid || 
                            ! this.state.controls.email.valid
                    }
                    >
                    Submit</ButtonWithBackground>
        )

        if (this.state.viewMode === 'portrait')
        {
            headingText = (
                <MainText>
                        <HeadingText style = {styles.textHeading} >Please log in</HeadingText>
                </MainText>
            );
        }
        if (this.state.authMode === 'signup'){
            confirmPasswordControl = (
                <View  style = {
                    this.state.viewMode === 'portrait'
                    ? styles.portraitPasswordWrapper
                    :styles.landscapePasswordWrapper}
                    >
                    <DefaultInput 
                        placeholder = "Confirm password" 
                        style = {styles.input}
                        value = {this.state.controls.confirmPassword.value}
                        onChangeText = {val => this.updateInputState('confirmPassword', val)}
                        valid = {this.state.controls.confirmPassword.valid}
                        touched = {this.state.controls.confirmPassword.touched}
                        secureTextEntry
                    />
                </View>
            );
        }
        if (this.props.isLoading )// override the submit button if we are waiting for our request to finish
        {// find out if we are waiting to use this if request
            submitButton = <ActivityIndicator/>
        }

        return (
            <ImageBackground source = {backgroundImage} style = {styles.backgroundImage}>
                <KeyboardAvoidingView style = { styles.container } behavior = 'padding'>
                    {headingText}
                    <ButtonWithBackground 
                        color = '#29aaf4' 
                        onPress={this.switchAuthModeHandler}>
                        Switch to {this.state.authMode === 'login'?"Sign Up":'Login'} 
                    </ButtonWithBackground>
                    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                        <View style = {styles.inputContainer}>
                            <DefaultInput 
                                placeholder = "Your Email Address" 
                                style = {styles.input}
                                value = {this.state.controls.email.value}
                                onChangeText = {(val)=> this.updateInputState('email', val)}
                                valid = {this.state.controls.email.valid}
                                touched = {this.state.controls.email.touched}
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                keyboardType = 'email-address'
                            />
                            <View style = {
                                this.state.viewMode === 'portrait'||this.state.authMode ==='login'
                                ? styles.portraitPasswordContainer
                                : styles.landscapePasswordContainer}
                            >
                                <View  style = {
                                    this.state.viewMode === 'portrait' ||this.state.authMode ==='login'
                                    ? styles.portraitPasswordWrapper
                                    :styles.landscapePasswordWrapper}
                                >
                                    <DefaultInput 
                                        placeholder = "Password" 
                                        style = {styles.input}
                                        value = {this.state.controls.password.value}
                                        onChangeText = {val => this.updateInputState('password', val)}
                                        valid = {this.state.controls.password.valid}
                                        touched = {this.state.controls.password.touched}
                                        secureTextEntry
                                    />
                                </View>
                                {confirmPasswordControl}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {submitButton}
                
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    backgroundImage:{
        width: '100%',
        flex : 1
    },
    inputContainer:{
        width: "80%"
    },
    textHeading:{
        fontSize: 28,
        fontWeight: 'bold' 
    },
    input:{
        backgroundColor: '#eee',
        borderColor: '#bbb'
    },
    landscapePasswordContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    portraitPasswordContainer:{
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    landscapePasswordWrapper:{
        width:"45%"
    },
    portraitPasswordWrapper:{
        width:"100%"
    } 
});

//we also need to connect this auth screen to our state in Redux
const mapStateToProps = state => { // to get access to the information whether we are loading or not 
    return {// js mapping object 
        isLoading : state.ui.isLoading,

    }

}

//dispatch an action
const mapDispatchToProps = dispatch =>{
    return {
        onTryAuth: ( authData, authMode ) => dispatch(tryAuth(authData, authMode)), //dispatch(ACTIONS), tryAuth() is an action creater, 
        //use onLogin in loginHandler                        //creater excuted and pass on the authData
        onAutoSignIn: () => dispatch(authAutoSignIn())// now I can access this on the props in this screen component
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
