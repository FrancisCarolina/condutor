import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/Button";
import { obterUserId, obterToken } from "@/utils/storage"; // Para obter o ID e token do usuário
import axios from "axios";
import Constants from 'expo-constants';
import { useNavigate } from "react-router-native";
import { Ionicons } from '@expo/vector-icons'; // Ícones de olho
import { Label } from "@react-navigation/elements";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function ChangeCredentialsScreen() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
    const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false); // Flag para verificar se é o primeiro login
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await obterUserId();
                const token = await obterToken();

                if (id && token) {
                    setUserId(id);
                    setToken(token);

                    // Verifique se o login e a senha precisam ser alterados
                    const response = await axios.get(`${API_URL}/usuario/${id}`, {
                        headers: {
                            "x-access-token": token,
                        },
                    });

                    const { login } = response.data;
                    setLogin(login);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
            }
        };

        fetchUserData();
    }, []);

    const isEmailValid = (email: string) => {
        // Validação simples de email, verificando a presença do '@'
        return email.includes('@');
    };

    const handleSave = async () => {
        if (!login || !password || !confirmPassword) {
            Alert.alert("Erro", "Login e senha são obrigatórios.");
            return;
        }

        if (!isEmailValid(login)) {
            Alert.alert("Erro", "Por favor, insira um email válido.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        try {
            // Requisição para atualizar o login e senha do usuário
            const response = await axios.put(
                `${API_URL}/usuario/${userId}`,
                {
                    login,
                    senha: password,
                },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );

            // Sucesso na atualização
            Alert.alert("Sucesso", "Login e senha atualizados com sucesso.");
            navigate("/home");
        } catch (error) {
            console.error("Erro ao atualizar dados", error);
            Alert.alert("Erro", "Não foi possível atualizar os dados. Tente novamente.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.messageText}>
                Você precisa alterar seu login e senha, pois estão configurados como padrões pelo administrador.
            </Text>

            <InputField
                label="Novo Email (Login)"
                value={login}
                onChangeText={setLogin}
                keyboardType="email-address"
            />
            <InputField
                label="Nova Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeOne}>
                <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                />
            </TouchableOpacity>
            <InputField
                label="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeTwo}>
                <Ionicons
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                />
            </TouchableOpacity>

            <CustomButton title="Salvar Alterações" onPress={handleSave} />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    inputPassword: { width: "100%" },

    messageText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    eyeOne: {
        width: 40,
        left: 340,
        bottom: 50,
    },
    eyeTwo: {
        width: 40,
        left: 340,
        bottom: 50
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    linkText: {
        marginTop: 10,
        textAlign: "center",
        color: "#0066CC",
        fontSize: 16,
    },
});
