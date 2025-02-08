import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Menu, Divider, IconButton, Button } from 'react-native-paper';
import { deslogar, obterNomeCondutor, obterToken } from "@/utils/storage";
import { useNavigate, useParams } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import CustomButton from "@/components/Button";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function EditVeiculoPage() {
    const { idVeiculo } = useParams();
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [ano, setAno] = useState("");
    const [cor, setCor] = useState("");
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getNomeCondutor = async () => {
            try {
                const nomeCondutor = await obterNomeCondutor();
                setUserName(nomeCondutor);
            } catch (error) {
                console.error("Erro ao obter o nome do condutor:", error);
            }
        };

        const fetchVeiculoData = async () => {
            try {
                const token = await obterToken();
                if (!token) {
                    Alert.alert("Erro", "Token não encontrado.");
                    navigate("/");
                    return;
                }

                const response = await axios.get(`${API_URL}/veiculos/${idVeiculo}`, {
                    headers: { "x-access-token": token },
                });

                const { marca, modelo, placa, ano, cor } = response.data;
                setMarca(marca);
                setModelo(modelo);
                setPlaca(placa);
                setAno(String(ano));
                setCor(cor);
            } catch (error) {
                console.error("Erro ao buscar dados do veículo:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do veículo.");
            }
        };

        getNomeCondutor();
        fetchVeiculoData();
    }, [idVeiculo]);

    const handleLogout = async () => {
        try {
            await deslogar();
            navigate("/");
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            Alert.alert("Erro", "Não foi possível sair da conta.");
        }
    };

    const handlePerfil = () => {
        navigate("/perfil");
    }

    const handleSave = async () => {
        setLoader(true);
        if (!marca || !modelo || !placa || !ano || !cor) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            setLoader(false);
            return;
        }

        try {
            const token = await obterToken();
            if (!token) {
                Alert.alert("Erro", "Token não encontrado.");
                navigate("/");
                return;
            }

            await axios.put(
                `${API_URL}/veiculos/${idVeiculo}`,
                { marca, modelo, placa, ano, cor },
                { headers: { "x-access-token": token } }
            );

            Alert.alert("Sucesso", "Veículo atualizado com sucesso!");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            Alert.alert("Erro", "Não foi possível salvar o veículo.");
        } finally {
            setLoader(false);
        }
    };

    return (
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
                    <Menu.Item onPress={handlePerfil} title="Perfil" />
                    <Divider />
                    <Menu.Item onPress={() => { }} title="Veículos" />
                    <Divider />
                    <Menu.Item onPress={handleLogout} title="Logout" />
                </Menu>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Editar Veículo</Text>
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
                    <CustomButton title="Salvar" onPress={handleSave} loading={loader} />
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
});
