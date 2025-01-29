import React, { useState } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from "react-native";
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Substituindo useNavigation do react-navigation

    async function handleLogin() {
        setLoading(true);
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
            setLoading(false);
            console.error("Erro ao realizar login:", error);
            Alert.alert("Erro", "Credenciais inválidas ou problema ao validar o acesso.");
        }
    }

    return (
        <View style={styles.container}>
            {/* Logo */}
            <ScrollView>
                <View style={styles.imagemContainer}>
                    <Image
                        source={require("@/assets/images/QR_VAccess_logo.png")}
                        style={styles.logo} resizeMode="cover"
                    />
                </View>
                <View style={styles.content}>
                    {/* Título */}
                    <Text style={styles.title}>Login</Text>

                    {/* Campos de entrada */}
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

                    {/* Botão de login */}
                    <CustomButton title="Login" onPress={handleLogin} loading={loading} />

                    {/* Link para cadastro */}
                    <TouchableOpacity onPress={() => navigate("/register")}>
                        <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: "center",
    }, imagemContainer: {
        display: 'flex',
        width: '100%',
        padding: 0,
        margin: 0,
        marginBottom: 50
    },
    logo: {
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        height: 250
    }, content: {
        padding: 20
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
        marginTop: 220,
    },
    linkText: {
        marginTop: 10,
        textAlign: "center",
        color: "#0066CC",
        fontSize: 16,
    },
});
