import react, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather } from '@expo/vector-icons';


import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton';
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { ActivityIndicator } from "react-native";
import colors from "../constants/colors";

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'a@a.com' : '',
        password: isTestMode ? 'aaaaaa' : '',
    },
    inputValidities: {
        // TODO: change the values of email passwoer and formisvalid to false. this is just for testing, the usernamt password obove too.
        email: isTestMode,
        password: isTestMode,
    },
    formIsValid: isTestMode
}

const SignInForm = props => {

    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

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

    const authHandler = useCallback(async () => {
        try {
            setIsLoading(true)
            const action = signIn(
                formState.inputValues.email,
                formState.inputValues.password
            )
            setError(null)
            await dispatch(action)
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
        }
    }, [dispatch, formState])

    return (
        <>

            <Input
                id='email'
                label='Email'
                icon='mail'
                iconPack={Feather}
                autoCapitalize='none'
                errorText={formState.inputValidities.email}
                onInputChanged={inputChangeHandler}
                initialValue={formState.inputValues.email}

            />
            <Input
                id='password'
                label='Password'
                icon='lock'
                iconPack={Feather}
                autoCapitalize='none'
                secureTextEntry
                errorText={formState.inputValidities.password}
                onInputChanged={inputChangeHandler}
                initialValue={formState.inputValues.password}


            />

            {isLoading ?
                <ActivityIndicator size={'small'} color={colors.primary} style={{ marginTop: 10 }} /> :
                <SubmitButton
                    disabled={!formState.formIsValid}
                    title='Sign in'
                    onPress={authHandler}
                    style={{ marginTop: 20 }}
                />}
        </>

    )
}

export default SignInForm