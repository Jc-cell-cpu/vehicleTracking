import { CrudService } from "@/api/post";
import * as Crypto from 'expo-crypto';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Dummy decrypt function, replace with your actual implementation
async function decrypt(token: string, key: string): Promise<any> {
    // Implement your decryption logic here
    // For now, just return the token for demonstration
    return token;
}

interface OtpVerificationProps {
    userId: string;
    onVerify: (otp: string) => void;
    onResend: () => void;
    otpLength?: number;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
    userId,
    onVerify,
    onResend,
    otpLength = 6,
}) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = () => {
        if (otp.length !== otpLength) {
            Alert.alert('Invalid OTP', `Please enter a ${otpLength}-digit OTP`);
            return;
        }
        // handleOtpSubmit()
        router.push('/verify-booking/booking')
    }


    const [mobilenumber, setMobileNumber] = useState('');
    const [fillotp, setFillOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleOtpSubmit = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            const encyBody = {
                mobileNumber: mobilenumber,
                otp: fillotp,
                userType: "AS"
            };
            alert("submitted")
            // Replace with your actual encryption logic or method
            const encryptedData = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                JSON.stringify(encyBody) + "7f9a1a292f6ed6aa3d6d7056ff265600545867897f7c4f9e17cddfe5180a4633"
            );

            // You need to call your API here to get the response object
            // Example:
            // const response = await CrudService.verifyOtp(encryptedData);
            console.log("encryptedData", encryptedData)
            // For demonstration, let's mock a response object:

            let payload = {
                "encData": encryptedData
            }
            const data = await CrudService.postData('mobile-email-verification-service/validate-otp-login', payload);
            console.log('📊 Fetched ATS Data:', data);

            // if (response.jwt) {
            //     // Replace this with your actual decrypt function or logic
            //     const decryptedToken = await decrypt(response.jwt, "7f9a1a292f6ed6aa3d6d7056ff265600545867897f7c4f9e17cddfe5180a4633");
            //     console.log(decryptedToken)
            // }
            // else if (response.message === 'OTP Verification has Failed' || response.message === 'Unauthorized Access') {
            //     setErrorMessage(response.message);
            // }

            // if (response.jwt) {
            //     const decryptedToken = await decrypt(response.jwt, "7f9a1a292f6ed6aa3d6d7056ff265600545867897f7c4f9e17cddfe5180a4633");
            //     console.log(decryptedToken)
            // }
            // else if (response.message === 'OTP Verification has Failed' || response.message === 'Unauthorized Access') {
            //     setErrorMessage(response.message);
            // }
        } catch (err) {
            setIsLoading(false);
            setErrorMessage('Something went wrong. Please try again.');
            console.error(err);
        }
    };

    // return your OTP component or UI here and pass handleOtpSubmit to a button





    const handleResend = () => {
        if (timer > 0) return;
        setTimer(30);
        onResend();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>OTP Verification</Text>
            <Text style={styles.label}>Enter the OTP sent to {userId}</Text>

            <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={otpLength}
                placeholder="Enter OTP"
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <Text style={styles.timerText}>
                {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't get the OTP?"}
            </Text>

            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text style={[styles.resend, { opacity: timer > 0 ? 0.5 : 1 }]}>
                    Resend OTP
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default OtpVerification;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 18,
        padding: 12,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#ff6f00',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    timerText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        color: '#555',
    },
    resend: {
        color: '#0066cc',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
    },
});
