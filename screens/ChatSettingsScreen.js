import React from 'react'
import { Text, View, StyleSheet } from 'react-native'


const ChatSettingsScreen = props => {
    return (
        <View style={styles.container}>
            <Text>chat list component</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})


export default ChatSettingsScreen




// export  function ChatSettingsScreen(props) {
//   return (
//     <div>ChatSettingsScreen</div>
//   )
// }