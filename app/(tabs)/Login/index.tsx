import React, { useState } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";
import { useNavigate } from "react-router-native"; // Usando useNavigate do react-router-native
import axios from "axios";
import { logar } from "@/utils/storage";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function LoginScreen() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate(); // Substituindo useNavigation do react-navigation

    async function handleLogin() {
        try {
            // Requisição para login
            const loginResponse = await axios.post(`${API_URL}/login`, {
                login: username,
                senha: password,
            });

            const { token, id } = loginResponse.data;

            // Requisição para buscar o usuário e verificar o role_id
            const userResponse = await axios.get(`${API_URL}/usuario/${id}`, {
                headers: {
                    "x-access-token": token,
                },
            });

            const { role_id } = userResponse.data;

            if (role_id !== 2) {
                Alert.alert("Erro", "Acesso permitido apenas para condutores");
                return;
            }

            // Salva o token e o ID do usuário
            await logar(token, id);

            // Redireciona para a tela inicial
            navigate("/home");
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            Alert.alert("Erro", "Credenciais inválidas ou problema ao validar o acesso.");
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
