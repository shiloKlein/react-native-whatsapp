import react, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather } from '@expo/vector-icons';

import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton';
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native";
import colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";


const initialState = {
    inputValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    },
    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
    },
    formIsValid: false
}


const SignUpForm = props => {

const dispatch = useDispatch()

    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)

    const inputChangeHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue)
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState])

    useEffect(() => {
        if (error) {
            Alert.alert('An error accured', error)
        }
    }, [error])

    const authHandler = async () => {
        try {
            setIsLoading(true)
            const action = signUp(
                formState.inputValues.firstName,
                formState.inputValues.lastName,
                formState.inputValues.email,
                formState.inputValues.password
            )
           dispatch(action) 
            setError(null)
        } catch (err) {
            // console.log(err.message);
            setError(err.message)
            setIsLoading(false)
        }
    }

    return (
        <>
            < Input label='First name'
                id='firstName'
                icon='user'
                autoCapitalize='none'
                iconPack={Feather}
                errorText={formState.inputValidities.firstName}
                onInputChanged={inputChangeHandler}
            />
            <Input label='Last name'
                id='lastName'
                icon='user'
                autoCapitalize='none'
                iconPack={Feather}
                errorText={formState.inputValidities.lastName}
                onInputChanged={inputChangeHandler}
            />
            <Input label='Email'
                id='email'
                icon='mail'
                autoCapitalize='none'
                keyboardType='email-address'
                iconPack={Feather}
                errorText={formState.inputValidities.email}
                onInputChanged={inputChangeHandler}
            />
            <Input label='Password'
                id='password'
                icon='lock'
                autoCapitalize='none'
                secureTextEntry
                iconPack={Feather}
                errorText={formState.inputValidities.password}
                onInputChanged={inputChangeHandler}
            />

        {
        isLoading?
        <ActivityIndicator size={'small'} color={colors.primary} style={{marginTop:10}}/>:
        <SubmitButton
            disabled={!formState.formIsValid}
            title='Sign up'
            onPress={authHandler}
            style={{ marginTop: 20 }}
        />
        }
        </>

    )
}

export default SignUpForm