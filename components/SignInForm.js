import react from "react";
import { Feather } from '@expo/vector-icons';


import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton';
const SignInForm = props => {
    return (
        <>
           
            <Input label='Email'
                icon='mail'
                iconPack={Feather}
                errorText=''
            />
            <Input label='Password'
                icon='lock'
                iconPack={Feather}
                errorText=''
            />

            <SubmitButton
                disabled={false}
                title='Sign in'
                onPress={() => console.log('button pressed')}
                style={{ marginTop: 20 }}
            />
        </>

    )
}

export default SignInForm