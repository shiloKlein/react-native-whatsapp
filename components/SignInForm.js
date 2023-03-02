import react, { useCallback, useReducer } from "react";
import { Feather } from '@expo/vector-icons';


import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton';
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
const SignInForm = props => {

    const initialState = {
        inputValues:{
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    }
    const [formState, dispatchFormState] = useReducer(reducer, initialState)


    const inputChangeHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue)
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState])

    const authHandler = ()=>{
        signIn(
            formState.inputValues.email,
            formState.inputValues.password
            )
    }
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

            />

            <SubmitButton
                disabled={!formState.formIsValid}
                title='Sign in'
                onPress={authHandler}
                style={{ marginTop: 20 }}
            />
        </>

    )
}

export default SignInForm