import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import commonStyles from '../constants/comonStyles'
import { authenticate, setDidTryAutoLogin } from "../store/authSlice";
import { getUserData } from "../utils/actions/userAction";

const StartUpScreen = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const tryLogin = async () => {
            const storeAuthInfo = await AsyncStorage.getItem('userData')
            if (!storeAuthInfo) {
                console.log('no storage found');
                dispatch(setDidTryAutoLogin())
                return
            }
            
            const parsedData = JSON.parse(storeAuthInfo)
            const {token, userId, expiryDate:expiryDateString} = parsedData

            const expiryDate = new Date(expiryDateString)
            if(expiryDate<= new Date()||!token||!userId){
                dispatch(setDidTryAutoLogin)
                return
            }
            const userData =await getUserData(userId)
            dispatch(authenticate({ token: token, userData }))
        }
        tryLogin()
    }, [])

    return <View style={commonStyles.center}>
        <ActivityIndicator size='large' color={colors.primary} />
    </View>
}

export default StartUpScreen