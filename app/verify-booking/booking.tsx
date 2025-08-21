import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const VerifyBookingScreen = () => {
    const [bookingId, setBookingId] = useState('');
    const [status, setStatus] = useState<'success' | 'error' | ''>('');

    const verifyBookingId = async () => {
        if (!bookingId.trim()) {
            Alert.alert('Validation', 'Please enter a Booking ID.');
            return;
        }

        // Simulated verification - replace with your actual API call
        const isValid = bookingId === '123456789'; // Replace with real validation logic

        if (isValid) {
            setStatus('success');
            router.push('/opne-camera/camera'); // Navigate to camera screen
        } else {
            setStatus('error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Booking ID</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Booking ID"
                value={bookingId}
                onChangeText={setBookingId}
                autoCapitalize="characters"
                keyboardType="number-pad"
                maxLength={16}
            />

            <TouchableOpacity style={styles.button} onPress={verifyBookingId}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            {status === 'success' && (
                <Text style={styles.success}>✅ Booking ID is valid.</Text>
            )}
            {status === 'error' && (
                <Text style={styles.error}>❌ Invalid Booking ID.</Text>
            )}
        </View>
    );
};

export default VerifyBookingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F8F8F8',
    },
    title: {
        fontSize: 22,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderColor: '#CCC',
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#ff6f00',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    success: {
        color: 'green',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 12,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 12,
    },
});
