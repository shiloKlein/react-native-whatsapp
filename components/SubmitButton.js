import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../constants/colors'

const SubmitButton = props => {

  const enableBgColor = props.color || colors.primary
  const disableBgColor = props.color || colors.lightGrey
  const bgColor = props.disabled ? disableBgColor : enableBgColor

  return (
    <TouchableOpacity
      onPress={props.disabled ? () => { } : props.onPress}
      style={{ 
      ...styles.button,
      ...props.style,
       ...{ backgroundColor: bgColor } }}>
      <Text
        style={{ color: props.disabled ? colors.gray : 'white' }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    fustifyContent: 'center',
    alignItems: 'center',
  }
})
export default SubmitButton