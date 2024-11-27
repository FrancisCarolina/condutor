import React, { useState } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";
import { useNavigate } from "react-router-native"; // Usando useNavigate do react-router-native

export default function LoginScreen() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate(); // Substituindo useNavigation do react-navigation

    const handleLogin = () => {
        if (username === "admin" && password === "password") {
            Alert.alert("Login Successful", "Welcome!");
        } else {
            Alert.alert("Login Failed", "Please check your credentials.");
        }
    };

    return (
        <View style={styles.container}>
            <InputField
                label="Username"
                value={username}
                onChangeText={setUsername}
            />
            <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <CustomButton title="Login" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigate("/register")}>
                <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    linkText: {
        marginTop: 10,
        textAlign: "center",
        color: "#0066CC",
        fontSize: 16,
    },
});
