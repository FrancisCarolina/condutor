import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from "react-native"; // Importe o ActivityIndicator
import { useNavigate } from "react-router-native";
import QRCode from "react-native-qrcode-svg";
import { obterUserId, obterToken, deslogar, setarCondutorId, setarNomeCondutor } from "@/utils/storage";
import axios from "axios";
import Constants from 'expo-constants';
import { RadioButton, Menu, Divider, IconButton, Provider } from 'react-native-paper'; // Importando o Provider
import CustomButton from "@/components/Button";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function HomePage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [hashCode, setHashCode] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const [veiculos, setVeiculos] = useState<any[]>([]);
    const [condutorId, setCondutorId] = useState(null);
    const [selectedVeiculo, setSelectedVeiculo] = useState<number | null>(null);
    const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar a visibilidade do menu
    const navigate = useNavigate();

    useEffect(() => {
        const verificarSeLoginAlterado = async (userId: string, token: string) => {
            try {
                const response = await axios.get(
                    `${API_URL}/usuario/${userId}`,
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                );
                const { login } = response.data;
                if (login) {
                    const loginParts = login.split('@');
                    console.log(loginParts);

                    if (loginParts.length <= 1) {
                        navigate("/changeLogin");
                    }
                } else {
                    console.log("Login não encontrado ou inválido.");
                }
            } catch (error) {
                handleLogout();
                console.error("Erro ao buscar informações do usuário:", error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userId = await obterUserId();
                const token = await obterToken();

                if (!userId || !token) {
                    Alert.alert("Erro", "Usuário ou token não encontrado.");
                    handleLogout();
                    return;
                }

                verificarSeLoginAlterado(userId, token);

                const response = await axios.get(
                    `${API_URL}/condutor/user/${userId}`,
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                );

                const { nome, ativo, id } = response.data;
                setCondutorId(id);
                setUserName(nome);
                setarCondutorId(id);
                setarNomeCondutor(nome);
                if (nome && ativo) {
                    try {
                        const responseVeiculos = await axios.get(
                            `${API_URL}/veiculo/condutor/${id}`,
                            {
                                headers: {
                                    "x-access-token": token,
                                },
                            }
                        );

                        setVeiculos(responseVeiculos.data);
                        const veiculoEmUso = responseVeiculos.data.find((veiculo: any) => veiculo.em_uso);
                        if (veiculoEmUso) {
                            gerarCodigo(veiculoEmUso.id, id);
                            setSelectedVeiculo(veiculoEmUso.id);
                        }
                    } catch (error) {
                        console.error("Erro ao buscar informações do veículo:", error);
                    }
                }

                setIsActive(ativo);

            } catch (error) {
                handleLogout();
                console.error("Erro ao buscar informações do usuário:", error);
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

    const handleNewVeiculos = () => {
        navigate("/veiculos");
    }

    const gerarCodigo = async (idVeiculo: number, idCondutor: number | null) => {
        try {
            const token = await obterToken();

            if (!token) {
                Alert.alert("Erro", "Token não encontrado.");
                return;
            }
            if (!idCondutor) {
                Alert.alert("Erro", "Condutor não encontrado.");
                return;
            }

            const response = await axios.post(
                `${API_URL}/condutor/${idCondutor}/codigo`,
                { veiculo_id: idVeiculo },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );

            setHashCode(response.data.codigo);
        } catch (error) {
            console.error("Erro ao gerar codigo:", error);
            Alert.alert("Erro", "Não foi possível gerar o código.");
        }
    };

    const handleSelectVeiculo = async (idVeiculo: number) => {
        try {
            const token = await obterToken();

            if (!token) {
                Alert.alert("Erro", "Token não encontrado.");
                return;
            }

            await axios.put(
                `${API_URL}/condutor/${condutorId}/mudarVeiculoEmUso`,
                { veiculo_em_uso: idVeiculo },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );

            setSelectedVeiculo(idVeiculo);
            gerarCodigo(idVeiculo, condutorId);
            Alert.alert("Sucesso", "Veículo alterado com sucesso.");
        } catch (error) {
            console.error("Erro ao alterar veículo:", error);
            Alert.alert("Erro", "Não foi possível alterar o veículo.");
        }
    };

    return (
        <Provider> {/* Adicionando o Provider aqui */}
            <View style={styles.container}>
                {userName ? (
                    <>
                        <View style={styles.menuSuperior}>
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
                                {isActive &&
                                    <>
                                        <Menu.Item onPress={handleLogout} title="Perfil" />
                                        <Divider />
                                        <Menu.Item onPress={handleNewVeiculos} title="Veículos" />
                                        <Divider />
                                    </>
                                }
                                <Menu.Item onPress={handleLogout} title="Logout" />
                            </Menu>
                        </View>

                        {isActive ? (
                            <View style={styles.userContent}>
                                {hashCode ? (
                                    <QRCode
                                        value={hashCode}
                                        size={350}
                                        backgroundColor="#ffffff"
                                        color="#000000"
                                    />
                                ) : (
                                    <View>
                                        <Text style={styles.infoText}>
                                            Cadastre um veículo para gerar seu código de acesso.
                                        </Text>
                                        <CustomButton title="Cadastrar Veículo" onPress={handleNewVeiculos} loading={false} />

                                    </View>

                                )}

                                {/* Lista de veículos com RadioButton */}
                                {veiculos && veiculos.length > 0 && < View style={styles.veiculoList}>
                                    <Text style={styles.veiculoListTitle}>Selecione o veículo em uso:</Text>
                                    <ScrollView>
                                        {veiculos.map((veiculo) => (
                                            <View key={veiculo.id} style={styles.veiculoItem}>
                                                <RadioButton
                                                    value={veiculo.id.toString()}
                                                    status={selectedVeiculo === veiculo.id ? 'checked' : 'unchecked'}
                                                    onPress={() => handleSelectVeiculo(veiculo.id)} // Desabilita o RadioButton se o veículo não estiver em uso
                                                />
                                                <Text>{veiculo.modelo} ({veiculo.placa})</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>}
                            </View>
                        ) : (
                            <View style={styles.containerNoUser} >
                                <View style={styles.imagemContainer}>
                                    <Image
                                        source={require("@/assets/images/invalido.png")}
                                        style={styles.logo} resizeMode="contain"
                                    />
                                </View>
                                <Text style={styles.inactiveText}>
                                    Sua conta está inativa. Entre em contato com o administrador para ativá-la.
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.containerNoUser} >
                        {/* Substituindo o texto por um ActivityIndicator */}
                        <ActivityIndicator size="large" color="#6950a5" />
                    </View>
                )}
            </View >
        </Provider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    containerNoUser: {
        display: 'flex',
        justifyContent: 'center',
        height: '80%',
        padding: 20
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
    imagemContainer: {
        display: 'flex',
        width: '100%',
    }, userContent: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60
    },
    logo: {
        width: "100%",
        height: 400
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
    },
    inactiveText: {
        fontSize: 18,
        textAlign: "center",
    },
    infoText: {
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        marginVertical: 20,
    },
    veiculoList: {
        marginTop: 20,
        width: "80%",
    },
    veiculoListTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    veiculoItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
});
