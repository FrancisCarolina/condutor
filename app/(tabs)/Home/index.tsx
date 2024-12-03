import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { obterUserId, obterToken } from "@/utils/storage"; // Função para obter o userId do armazenamento
import axios from "axios";

export default function HomePage() {
    const [userName, setUserName] = useState<string | null>(null); // Armazena o nome do usuário

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

    return (
        <View style={styles.container}>
            {userName ? (
                <Text style={styles.welcomeText}>Bem-vindo, {userName}!</Text>
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
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
    },
});
