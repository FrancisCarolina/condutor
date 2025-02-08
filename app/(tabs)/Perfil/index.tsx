import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Menu, Divider, IconButton, Button, Dialog, Portal, Paragraph, Provider } from 'react-native-paper';
import { deslogar, obterNomeCondutor, obterToken, obterCondutorId } from "@/utils/storage";
import { useNavigate } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function PerfilPage() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
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

    const handleVeiculos = () => {
        navigate("/veiculos");
    }

    useEffect(() => {
        const getNomeCondutor = async () => {
            try {
                const nomeCondutor = await obterNomeCondutor();
                setUserName(nomeCondutor);
            } catch (erro) {
                console.log("Erro em recuperar o nome do condutor: ", erro);
            }
        };
        getNomeCondutor();
    }, []);

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.menuSuperior}>
                    <View style={styles.menuSuperiorInicio}>
                        <TouchableOpacity onPress={() => navigate(-1)}>
                            <Icon name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Bem-vindo, {userName?.split(" ")[0]}!</Text>
                    </View>
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
                        <Menu.Item onPress={() => { }} title="Perfil" />
                        <Divider />
                        <Menu.Item onPress={handleVeiculos} title="Veículos" />
                        <Divider />
                        <Menu.Item onPress={handleLogout} title="Logout" />
                    </Menu>
                </View> <View style={styles.content}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#6950a5" style={styles.loader} />
                    ) : (
                        <View><Text>Pagina de perfil</Text></View>
                    )}
                </View>
            </View>
        </Provider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    menuSuperior: {
        width: "100%",
        backgroundColor: "#6950a5",
        paddingVertical: 20,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    menuSuperiorInicio: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        alignItems: "center"
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
