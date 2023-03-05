import React, { useCallback, useReducer } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import PageTitle from '../components/pageTitle'
import PageContainer from '../components/PageContainer'
import Input from '../components/Input'
import { Feather } from '@expo/vector-icons'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducer'
import { useSelector } from 'react-redux'

const initialState = {
    inputValues: {
        firstName: "",
        lastName: "",
        email: "",
        about: "",
    },
    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        about: false,
    },
    formIsValid: false
}

const SettingsScreen = props => {

    const userData = useSelector(state => state.auth.userData);

    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    console.log(formState.formIsValid);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);
    
    return <PageContainer>
        <PageTitle text="Settings" />

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
    </PageContainer>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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