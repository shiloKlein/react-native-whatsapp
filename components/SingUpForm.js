import react from "react";
import { Feather } from '@expo/vector-icons';


import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton';
const SignUpForm = props => {

    const inputChangeHandler = (inputId, inputValue) => {
console.log('inputId',inputId)
console.log('inputValue',inputValue)
    }

    return (
        <>
            < Input label='First name'
                icon='user'
                iconPack={Feather}
                errorText=''
                onInputChanged={inputChangeHandler}
            />
            <Input label='Last name'
                icon='user'
                iconPack={Feather}
                errorText=''
                onInputChanged={inputChangeHandler}
            />
            <Input label='Email'
                icon='mail'
                iconPack={Feather}
                errorText=''
                onInputChanged={inputChangeHandler}
            />
            <Input label='Password'
                icon='lock'
                iconPack={Feather}
                errorText=''
                onInputChanged={inputChangeHandler}
            />

            <SubmitButton
                disabled={false}
                title='Sign up'
                onPress={() => console.log('button pressed')}
                style={{ marginTop: 20 }}
            />
        </>

    )
}

export default SignUpForm