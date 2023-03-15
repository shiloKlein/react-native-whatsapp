import React from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

import ProfileImage from '../components/ProfileImage'
import colors from '../constants/colors'
const DataItem = props => {

    const { title, subtitle, image } = props

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>

            <View style={styles.container}>
                <ProfileImage
                    uri={image}
                    size={40}
                />
                <View style={styles.textContainer}>
                    <Text
                        style={styles.title}
                        numberOfLines={1}>
                        {title}
                    </Text>
                    <Text
                        style={styles.subtitle}
                        numberOfLines={1}>
                        {subtitle}
                    </Text>

                </View>

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
marginStart:14,
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
})
export default DataItem