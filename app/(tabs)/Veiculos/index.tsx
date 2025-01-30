import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Menu, Divider, IconButton } from 'react-native-paper';
import { deslogar, obterNomeCondutor } from "@/utils/storage";
import { useNavigate } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function VeiculosPage() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await deslogar();
            navigate("/");
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            Alert.alert("Erro", "Não foi possível sair da conta.");
        }
    };

    useEffect(() => {
        const getNomeCondutor = async () => {
            try {
                const nomeCondutor = await obterNomeCondutor();
                setUserName(nomeCondutor);
            } catch (erro) {
                console.log("Erro em recuperar o nome do condutor: ", erro);

            }
        }
        getNomeCondutor();
    }, [])

    return <View style={styles.container}>
        <View style={styles.menuSuperior}>
            <TouchableOpacity onPress={() => navigate(-1)}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.welcomeText}>Bem-vindo, {userName}!</Text>
            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <IconButton
                        icon="dots-vertical"
                        onPress={() => setMenuVisible(true)}
                    />
                }
            >
                <Menu.Item onPress={handleLogout} title="Perfil" />
                <Divider />
                <Menu.Item onPress={() => { }} title="Veículos" />
                <Divider />
                <Menu.Item onPress={handleLogout} title="Logout" />
            </Menu>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    menuSuperior: {
        width: "100%",
        backgroundColor: "#6950a5", // Cor de fundo do menu superior
        paddingVertical: 20, // Adiciona padding para o menu
        alignItems: "center",
        flexDirection: "row", // Alinha o texto e o ícone na horizontal
        justifyContent: "space-between", // Espaçamento entre os itens
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        paddingHorizontal: 20
    },
});