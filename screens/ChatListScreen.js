import React from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'


const ChatListScreen = props => {
    return (
        <View style={styles.container}>
            <Text>chat list component</Text>
            <Button title='Go to Chat screen' onPress={()=>props.navigation.navigate('ChatScreen')}/>
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


export default ChatListScreen




// export  function ChatListScreen(props) {
//   return (
//     <div>ChatListScreen</div>
//   )
// }