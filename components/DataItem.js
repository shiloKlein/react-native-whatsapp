import React from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons';


import ProfileImage from '../components/ProfileImage'
import colors from '../constants/colors'
const imageSize = 40
const DataItem = props => {
    const { title, subtitle, image, type, isChecked, icon } = props

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>

            <View style={styles.container}>
                {
                    !icon &&
                    <ProfileImage
                        uri={image}
                        size={imageSize}
                    />
                }
                {
                    icon &&
                    <View style={styles.leftIconContainer}>
                        <AntDesign name={icon} size={20} color={colors.blue} />

                    </View>
                }
                <View style={styles.textContainer}>
                    <Text
                        style={{ ...styles.title, ...{ color: type === 'button' ? colors.blue : colors.textColor } }}
                        numberOfLines={1}  
                    >
                        {title}
                    </Text>
                    {subtitle &&
                        <Text
                            style={styles.subtitle}
                            numberOfLines={1}>
                            {subtitle}
                        </Text>
                    }

                </View>
                {
                    type === 'checkbox' &&
                    <View style={{ ...styles.iconContainer, ...isChecked && styles.checkedStyle }}>
                        <Ionicons name="checkmark" size={18} color="white" />
                    </View>
                }
                {
                    type === 'link' &&
                    <View >
                        <Ionicons name="chevron-forward-outline" size={18} color={colors.grey} />
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 7,
        borderBottomColor: colors.extraLightGrey,
        borderBottomWidth: 1,
        alignItems: 'center',
        minHeight: 50,
    },
    textContainer: {
        marginStart: 14,
        flex: 1,
    },
    title: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.4,
    },
    subtitle: {
        fontFamily: 'medium',
        color: colors.grey,
        letterSpacing: 0.4,
    },
    iconContainer: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        backgroundColor: 'white'
    },
    checkedStyle: {
        backgroundColor: colors.primary,
        borderColor: 'transparent'
    },
    leftIconContainer: {
        backgroundColor: colors.extraLightGrey,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: imageSize,
        height: imageSize,
    },
})
export default DataItem