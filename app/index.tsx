import LogoM from "@/assets/images/LogoM.svg";
// import { useAppStore } from "@/store/useAppStore";
import AFMSLogo from "@/components/AFMSLogo";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [locationChecked, setLocationChecked] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const fixedLat = 28.6716709;
  const fixedLng = 77.2513574;

  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkLocationAccess = async () => {
    try {
      console.log("🔍 Requesting location permission...");
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;

      console.log(`📍 Current Lat: ${userLat}, Lng: ${userLng}`);

      const distance = getDistanceFromLatLonInMeters(
        userLat,
        userLng,
        fixedLat,
        fixedLng
      );
      console.log(`📏 Distance to fixed point: ${distance.toFixed(2)} meters`);

      if (distance <= 100) {
        // Alert.alert("✅ Access Granted", "You are within the allowed 100m range.");
        setLocationChecked(true);
      } else {
        Alert.alert(
          "❌ Access Denied",
          `Your location is outside the authorized 100-meter range.\n\n` +
            `📍 Latitude: ${userLat}\n` +
            `📍 Longitude: ${userLng}\n` +
            `📏 Distance: ${distance.toFixed(2)} meters`
        );
        setLocationChecked(false);
      }
    } catch (error) {
      console.error("💥 Error checking location:", error);
      Alert.alert("Error", "Something went wrong while checking location.");
    }
  };

  useEffect(() => {
    checkLocationAccess();
  }, []);

  const getOTP = async () => {
    router.push({ pathname: "/login/otp-verify", params: { userId } });
    try {
      setLoading(true); // ✅ Start loading

      const payload = {
        mobileNumber: userId,
      };

      // console.log(payload);
      // const data = await CrudService.postData('mobile-email-verification-service/login-with-otp-ats', payload);
      // console.log('📊 Fetched ATS Data:', data);

      // if (data.message === "OTP has been sent successfully on mobile number") {
      //   router.push({ pathname: '/login/otp-verify', params: { userId } });
      //   Alert.alert("Success", "OTP sent successfully.");
      // }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleLogin = () => {
    if (!locationChecked) {
      Alert.alert(
        "🚫 Access Blocked",
        "You must be within the allowed location range."
      );
      return;
    }
    if (userId.length === 10) {
      getOTP();
    } else {
      Alert.alert(
        "❗ Invalid Number",
        "Please enter a valid 10-digit mobile number."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top right Logo */}
        <View style={styles.topRightLogo}>
          <LogoM width={180} height={180} />
        </View>

        {/* Center Logo */}
        <View style={styles.afmsLogoWrapper}>
          <AFMSLogo />
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {/* Mobile Input */}
        <TextInput
          placeholder="Enter Mobile Number"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          value={userId}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9]/g, "");
            setUserId(numeric.slice(0, 10));
          }}
        />

        {/* Send OTP Button with Loader */}
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  topRightLogo: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  afmsLogoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#ff6f00",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
