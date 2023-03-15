import React, { useCallback, useReducer, useState } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import PageTitle from '../components/pageTitle'
import PageContainer from '../components/PageContainer'
import Input from '../components/Input'
import { Feather } from '@expo/vector-icons'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducer'
import { useDispatch, useSelector } from 'react-redux'
import SubmitButton from '../components/SubmitButton'
import { ActivityIndicator } from 'react-native'
import colors from '../constants/colors'
import { updateSignedInUserData, userLogout } from '../utils/actions/authActions'
import { updateLoggedInData } from '../store/authSlice'
import ProfileImage from '../components/ProfileImage'



const SettingsScreen = props => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessMessagge, setShowSuccessMessagge] = useState(false)
    const userData = useSelector(state => state.auth.userData)

    const firstName = userData.firstName || ''
    const lastName = userData.lastName || ''
    const email = userData.email || ''
    const about = userData.about || ''

    const initialState = {
        inputValues: {
            firstName,
            lastName,
            email,
            about,
        },
        inputValidities: {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            about: undefined,
        },
        formIsValid: false
    }

    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    console.log(formState.formIsValid);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues

        try {
            setIsLoading(true)
            await updateSignedInUserData(userData.userId, updatedValues)
            dispatch(updateLoggedInData({ newData: updatedValues }))

            setShowSuccessMessagge(true)
            setTimeout(() => {
                setShowSuccessMessagge(false)
            }, 2500);

        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }, [formState, dispatch])

    const hasChanges = () => {
        const currentValues = formState.inputValues
        return currentValues.firstName !== firstName ||
            currentValues.lastName !== lastName ||
            currentValues.email !== email ||
            currentValues.about !== about
    }

    return <PageContainer>
        <PageTitle text="Settings" />

        <ScrollView contentContainerStyle={styles.formContainer}>
            <ProfileImage 
            size={80} 
            userId={userData.userId}
            uri={userData.profilePicture}
            showEditButton={true}
            />
            <Input
                id="firstName"
                label="First name"
                icon="user"
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
                autoCapitalize="none"
                errorText={formState.inputValidities["firstName"]}
                initialValue={userData.firstName} />

            <Input
                id="lastName"
                label="Last name"
                icon="user"
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
                autoCapitalize="none"
                errorText={formState.inputValidities["lastName"]}
                initialValue={userData.lastName} />

            <Input
                id="email"
                label="Email"
                icon="mail"
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
                keyboardType="email-address"
                autoCapitalize="none"
                errorText={formState.inputValidities["email"]}
                initialValue={userData.email} />

            <Input
                id="about"
                label="About"
                icon="user"
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
                autoCapitalize="none"
                errorText={formState.inputValidities["about"]}
                initialValue={userData.about} />

            <View style={{ marginTop: 20 }}>
                {showSuccessMessagge && <Text>Saved!</Text>}
                {isLoading ?
                    <ActivityIndicator size={'small'} color={colors.primary} style={{ marginTop: 10 }} /> :
                    hasChanges() && <SubmitButton
                        disabled={!formState.formIsValid}
                        title='Save'
                        onPress={saveHandler}
                        style={{ marginTop: 20 }}
                    />}

                <SubmitButton
                    title='Logout'
                    onPress={() => dispatch(userLogout())}
                    style={{ marginTop: 20 }}
                    color={colors.red}
                />
            </View>
        </ScrollView>
    </PageContainer>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer:{
    alignItems:'center',
    }

})

export default SettingsScreen;

// const initialState = {
//     inputValues: {
//         firstName: '',
//         lastName: '',
//         email: '',
//         about: '',
//     },
//     inputValidities: {
//         firstName: false,
//         lastName: false,
//         email: false,
//         about: false,
//     },
//     formIsValid: false
// }


// const SettingsScreen = props => {

// const userData = useSelector(state=>state.auth.userData)
//     const [formState, dispatchFormState] = useReducer(reducer, initialState)


//     const inputChangeHandler = useCallback((inputId, inputValue) => {
//         const result = validateInput(inputId, inputValue)
//         dispatchFormState({ inputId, validationResult: result, inputValue })
//     }, [dispatchFormState])

//     return (
//         <PageContainer style={styles.container}>
//             <PageTitle text='Settings' />
//             < Input label='First name'
//                 id='firstName'
//                 icon='user'
//                 autoCapitalize='none'
//                 iconPack={Feather}
//                 errorText={formState.inputValidities['firstName']}
//                 onInputChanged={inputChangeHandler}
//                 value={userData}
//             />
//             <Input label='Last name'
//                 id='lastName'
//                 icon='user'
//                 autoCapitalize='none'
//                 iconPack={Feather}
//                 errorText={formState.inputValidities['lastName']}
//                 onInputChanged={inputChangeHandler}
//             />
//             <Input label='Email'
//                 id='email'
//                 icon='mail'
//                 autoCapitalize='none'
//                 keyboardType='email-address'
//                 iconPack={Feather}
//                 errorText={formState.inputValidities['email']}
//                 onInputChanged={inputChangeHandler}
//             />
//               <Input label='About'
//                 id='about'
//                 icon='user'
//                 autoCapitalize='none'
//                 iconPack={Feather}
//                 errorText={formState.inputValidities['about']}
//                 onInputChanged={inputChangeHandler}
//             />

//         </PageContainer>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     }
// })


// export default SettingsScreen




// // export  function ChatSettingsScreen(props) {
// //   return (
// //     <div>ChatSettingsScreen</div>
// //   )
// // }