import React from 'react'
import { TextInputBase } from 'react-native'
import { Text } from 'react-native'
import { StyleSheet } from 'react-native'
import { View, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons';

import colors from '../constants/colors'


const Input = props => {

    const onChangeText = text=>{
    props.onInputChanged(props.id, text)
    // console.log(props.id, text);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <View style={styles.inputContainer}>
                {
                    props.icon && <props.iconPack   //dynamyc icon pack
                        name={props.icon}
                        size={props.iconSize || 20}
                        style={styles.icon} />
                }
                <TextInput 
                {...props}
                style={styles.input} 
                onChangeText={onChangeText}
                />
            </View>

            {props.errorText && <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{props.errorText}</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    label: {
        marginVertical: 8,
        fontFamily: 'bold',
        letterSpacing: 0.4,
        color: colors.textColor,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: colors.nearlyWhite,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginEnd: 10,
        color: colors.grey,
    },
    input: {
        color: colors.textColor,
        flex: 1,
        fontFamily: 'regular',
        letterSpacing: 0.4,
        paddingTop: 0,
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        fontFamily: 'regular',
        letterSpacing: 0.3,
    }
})
export default Input