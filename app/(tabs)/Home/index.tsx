import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { useNavigate } from "react-router-native";
import QRCode from "react-native-qrcode-svg";
import { obterUserId, obterToken, deslogar } from "@/utils/storage";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function HomePage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [hashCode, setHashCode] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await obterUserId();
                const token = await obterToken();

                if (!userId || !token) {
                    Alert.alert("Erro", "Usuário ou token não encontrado.");
                    return;
                }

                const response = await axios.get(
                    `${API_URL}/condutor/user/${userId}`,
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                );

                const { nome, ativo } = response.data;

                setUserName(nome);
                setIsActive(ativo);
                setHashCode("$2a$10$tw2R6xF/6F6ceiunSdlxjOCbIuTM264fQ4/YbJ6Jq.xxHVc9QN/7q");
            } catch (error) {
                console.error("Erro ao buscar informações do usuário:", error);
                Alert.alert("Erro", "Não foi possível carregar as informações do usuário.");
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await deslogar();
            navigate("/");
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            Alert.alert("Erro", "Não foi possível sair da conta.");
        }
    };

    return (
        <View style={styles.container}>
            {userName ? (
                <>
                    <Text style={styles.welcomeText}>Bem-vindo, {userName}!</Text>
                    {isActive ? (
                        hashCode && (
                            <QRCode
                                value={hashCode}
                                size={350}
                                backgroundColor="#ffffff"
                                color="#000000"
                            />
                        )
                    ) : (
                        <Text style={styles.inactiveText}>
                            Sua conta está inativa. Entre em contato com o administrador para ativá-la.
                        </Text>
                    )}
                    <Button title="Sair" onPress={handleLogout} color="#FF0000" />
                </>
            ) : (
                <Text style={styles.loadingText}>Carregando...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
    },
    inactiveText: {
        fontSize: 18,
        color: "#FF0000",
        textAlign: "center",
        marginVertical: 20,
    },
});
