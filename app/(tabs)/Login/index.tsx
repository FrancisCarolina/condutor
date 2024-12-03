import React, { useState } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";
import { useNavigate } from "react-router-native"; // Usando useNavigate do react-router-native
import axios from "axios";
import { logar } from "@/utils/storage";

export default function LoginScreen() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate(); // Substituindo useNavigation do react-navigation

    async function handleLogin() {
        try {
            const response = await axios.post("http://192.168.100.103:8000/login", {
                login: username,
                senha: password,
            });

            const { token, id } = response.data;

            await logar(token, id);

            navigate("/home");
        } catch (error) {
            Alert.alert("Erro", "Credenciais inválidas.");
        }
    }

    return (
        <View style={styles.container}>
            <InputField
                label="Email"
                value={username}
                onChangeText={setUsername}
            />
            <InputField
                label="Senha"
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
