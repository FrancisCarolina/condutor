import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Menu, Divider, IconButton, Button } from 'react-native-paper';
import { deslogar, obterNomeCondutor, obterToken, obterCondutorId } from "@/utils/storage";
import { useNavigate } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function NovoVeiculosPage() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [ano, setAno] = useState("");
    const [cor, setCor] = useState("");
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
    }, []);

    const handleSave = async () => {
        try {
            const token = await obterToken();
            const id = await obterCondutorId();
            if (!token) {
                Alert.alert("Erro", "Token não encontrado.");
                handleLogout();
                return;
            }

            await axios.post(
                `${API_URL}/veiculo`,
                { marca, modelo, placa, ano, cor, condutor_id: id },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
            Alert.alert("Sucesso", "Veículo cadastrado com sucesso!");
            navigate("/veiculos");
        } catch (error) {
            console.error("Erro ao salvar veículo: ", error);
            Alert.alert("Erro", "Não foi possível salvar o veículo.");
        }
    };

    return (
        <View style={styles.container}>
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
            <View style={styles.content}>
                <Text style={styles.title}>Cadastre seus veículos!</Text>
                <ScrollView style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Marca:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a marca"
                            value={marca}
                            onChangeText={setMarca}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Modelo:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o modelo"
                            value={modelo}
                            onChangeText={setModelo}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Placa:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a placa"
                            value={placa}
                            onChangeText={setPlaca}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ano:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o ano"
                            value={ano}
                            onChangeText={setAno}
                            keyboardType="numeric"
                            placeholderTextColor="#aaa"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cor:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a cor"
                            value={cor}
                            onChangeText={setCor}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button mode="outlined" onPress={() => navigate(-1)} style={styles.button}>Cancelar</Button>
                        <Button mode="contained" onPress={handleSave} style={styles.button}>Salvar</Button>
                    </View>
                </ScrollView>
            </View>
        </View>
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
        paddingHorizontal: 10,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "transparent",
        color: "#000",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        width: "48%",
        borderColor: "#6950a5"
    },
});
