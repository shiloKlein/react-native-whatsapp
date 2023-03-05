import { StyleSheet } from "react-native"
import { Text } from "react-native"
import { View } from "react-native"
import colors from '../constants/colors'

export default PageTitle = props => {
    return <View style={styles.container}>
        <Text style={styles.text}>
            {props.text}
        </Text>

    </View>
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    text: {
        fontSize: 28,
        color: colors.textColor,
        letterSpacing: 0.4,
    }
})