import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Menu, Divider, IconButton, Button, Dialog, Portal, Paragraph, Provider } from 'react-native-paper';
import { deslogar, obterNomeCondutor, obterToken, obterCondutorId } from "@/utils/storage";
import { useNavigate } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function VeiculosPage() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [veiculos, setVeiculos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVeiculoId, setSelectedVeiculoId] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(false); // Estado para o modal
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

    const fetchVeiculosData = async () => {
        try {
            const token = await obterToken();
            const id = await obterCondutorId();
            if (!token) {
                Alert.alert("Erro", "Token não encontrado.");
                handleLogout();
                return;
            }
            const responseVeiculos = await axios.get(
                `${API_URL}/veiculo/condutor/${id}`,
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
            setVeiculos(responseVeiculos.data);
        } catch (error) {
            console.log("Erro em carregar veiculos: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVeiculosData();
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

    const handleDelete = async () => {
        if (selectedVeiculoId) {
            try {
                const token = await obterToken();
                await axios.delete(`${API_URL}/veiculos/${selectedVeiculoId}`, {
                    headers: {
                        "x-access-token": token,
                    },
                });
                Alert.alert("Sucesso", "Veículo excluído com sucesso.");
                setModalVisible(false);
                fetchVeiculosData(); // Recarrega a lista
            } catch (error) {
                console.error("Erro ao excluir veículo:", error);
                Alert.alert("Erro", "Não foi possível excluir o veículo.");
            }
        }
    };
    const handlePerfil = () => {
        navigate("/perfil");
    }


    const renderVeiculo = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Placa: {item.placa}</Text>
                <Text style={styles.cardSubtitle}>{item.modelo}</Text>
                <Text style={styles.cardDetail}>{item.marca}</Text>
            </View>
            <View style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() => navigate(`/editVeiculo/${item.id}`)}
                    style={styles.actionButton} textColor="#6950a5"
                >
                    Editar
                </Button>
                <Button
                    mode="contained"
                    onPress={() => {
                        setSelectedVeiculoId(item.id);
                        setModalVisible(true);
                    }}
                    style={styles.actionButton} buttonColor="#6950a5" textColor="#fff"
                >
                    Excluir
                </Button>
            </View>
        </View>
    );

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
                        <Menu.Item onPress={handlePerfil} title="Perfil" />
                        <Divider />
                        <Menu.Item onPress={() => { }} title="Veículos" />
                        <Divider />
                        <Menu.Item onPress={handleLogout} title="Logout" />
                    </Menu>
                </View>
                <View style={styles.content}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#6950a5" style={styles.loader} />
                    ) : (
                        <FlatList
                            data={veiculos}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderVeiculo}
                        />
                    )}
                </View>
                <Portal>
                    <Dialog visible={isModalVisible} onDismiss={() => setModalVisible(false)}>
                        <Dialog.Title>Confirmação</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Tem certeza de que deseja excluir este veículo?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
                            <Button onPress={handleDelete}>Excluir</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                        navigate("/novoVeiculo");
                    }}
                >
                    <Icon name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </Provider>
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
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardSubtitle: {
        fontSize: 16,
        color: "#666",
    },
    cardDetail: {
        fontSize: 14,
        color: "#888",
    },
    cardActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionButton: {
        marginHorizontal: 4, borderColor: "#6950a5"
    },
    fab: {
        position: "absolute",
        bottom: 16,
        right: 16,
        backgroundColor: "#6950a5",
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
