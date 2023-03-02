import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import PageContainer from '../components/PageContainer'
import SignInForm from '../components/SignInForm'
import SignUpForm from '../components/SingUpForm';
import colors from '../constants/colors'
import logo from '../assets/images/logo.png'
import { Image } from 'react-native'
import { ScrollView } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
const AuthScreen = props => {

    const [isSignUp, setIsSignUp] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <ScrollView>
                    <KeyboardAvoidingView
                        style={styles.keyboardAvoidingView}
                        behavior={Platform.OS === 'ios' ? 'height' : undefined}
                        keyboardVerticalOffset={100}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={logo} style={styles.image} />
                        </View>

                        {
                            isSignUp ?
                                <SignUpForm /> :
                                <SignInForm />
                        }
                        <TouchableOpacity
                            onPress={() => setIsSignUp(prevState => !prevState)}
                            style={styles.linkContainer}
                        >
                            <Text style={styles.link}>{`Switch to ${isSignUp ? 'sign in' : 'sign up'}`}</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    linkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    link: {
        color: colors.blue,
        fontFamily: 'medium',
        letterSpacing: 0.4,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    image: {
        width: '50%',
        resizeMode: 'contain'
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
    }
    //     container: {
    //         flex: 1,
    //         alignItems:'center',
    //         justifyContent:'center',


    //     },
})
export default AuthScreen 
