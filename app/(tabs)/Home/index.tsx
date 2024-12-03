import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { useNavigate } from "react-router-native";
import QRCode from "react-native-qrcode-svg"; // Importando o componente QRCode
import { obterUserId, obterToken, deslogar } from "@/utils/storage";
import axios from "axios";

export default function HomePage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [hashCode, setHashCode] = useState<string | null>(null); // Adicionando o estado para o hash
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
                    `http://192.168.100.103:8000/condutor/user/${userId}`,
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                );

                setUserName(response.data.nome);
                setHashCode("$2a$10$tw2R6xF/6F6ceiunSdlxjOCbIuTM264fQ4/YbJ6Jq.xxHVc9QN/7q"); // Supondo que o código hash venha na resposta
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
                    {hashCode && ( // Exibe o QR Code somente se o hash estiver disponível
                        <QRCode
                            value={hashCode}
                            size={350} // Tamanho do QR Code
                            backgroundColor="#ffffff"
                            color="#000000"
                        />
                    )}
                    <Button title="Sair" onPress={handleLogout} color="#FF0000" />
                </>
            ) : (
                <Text style={styles.loadingText}>Carregando...</Text>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    qrcode: {
        padding: 10
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
