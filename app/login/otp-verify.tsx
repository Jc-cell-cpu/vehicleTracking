// app/login/otp-verify.tsx

import OtpVerification from '@/components/OtpVerification';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams(); // gets param from previous page

  const handleVerify = (otp: string) => {
    console.log('OTP entered:', otp);
    // If successful:
    router.replace('/');
  };

  const handleResend = () => {
    console.log('Resend OTP triggered');
    // Call resend OTP API
  };

  return (
    <View style={{ flex: 1 }}>
      <OtpVerification
        userId={userId as string}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </View>
  );
}
