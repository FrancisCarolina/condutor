import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { useNavigate } from "react-router-native"; // Hook para navegação
import { obterUserId, obterToken, deslogar } from "@/utils/storage";
import axios from "axios";

export default function HomePage() {
    const [userName, setUserName] = useState<string | null>(null); // Armazena o nome do usuário
    const navigate = useNavigate(); // Para redirecionar o usuário

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await obterUserId(); // Recupera o ID do usuário do armazenamento
                const token = await obterToken(); // Recupera o token do armazenamento

                if (!userId || !token) {
                    Alert.alert("Erro", "Usuário ou token não encontrado.");
                    return;
                }

                const response = await axios.get(
                    `http://192.168.100.103:8000/condutor/user/${userId}`,
                    {
                        headers: {
                            "x-access-token": token, // Usa x-access-token como cabeçalho
                        },
                    }
                );
                setUserName(response.data.nome); // Define o nome do usuário
            } catch (error) {
                console.error("Erro ao buscar informações do usuário:", error);
                Alert.alert("Erro", "Não foi possível carregar as informações do usuário.");
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await deslogar(); // Remove token e userId do armazenamento
            navigate("/"); // Redireciona para a tela de login
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
});
