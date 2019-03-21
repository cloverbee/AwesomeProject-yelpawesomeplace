import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Image} from 'react-native';


const listItem = (props) =>
(
    <TouchableOpacity onPress = {props.onItemPressed}>
        <View style={styles.listItem} >
            <Image resizeMode = "contain" source = {props.placeImage} style={styles.placeImage}/>
            <Text>
                {props.placeName}
            </Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem:{
        width:"100%",
        padding: 10,
        backgroundColor: "#eee",
        margin: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    placeImage:{
        marginRight: 8,
        height: 90,
        width: 90
    }
});

export default listItem;