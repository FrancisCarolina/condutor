import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";
import { useNavigate } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInputMask } from "react-native-masked-text";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [local, setLocal] = useState<string>("");
    const [locals, setLocals] = useState<{ id: string; nome: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/locais`)
            .then(response => setLocals(response.data))
            .catch(() => Alert.alert("Erro", "Não foi possível carregar os locais."));
    }, []);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const removeMask = (value: string): string => {
        return value.replace(/\D/g, "");
    };

    const handleRegister = async () => {
        if (!name || !cpf || !email || !password || !confirmPassword || !local) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }

        if (local === "" || local === '0') {
            Alert.alert("Erro", "Por favor, selecione um local!");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Erro", "Email inválido!");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        const body = {
            nome: name,
            cpf: removeMask(cpf),
            local_id: local,
            login: email,
            senha: password,
        };

        console.log("Corpo da requisição:", body);

        try {
            const response = await axios.post(`${API_URL}/condutor`, body, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Resposta da API:", response.data);
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            navigate(- 1);
        } catch (error: any) {
            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Ocorreu um erro inesperado.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigate(-1)}
            >
                <Icon name="arrow-back" size={24} />
            </TouchableOpacity>

            <InputField label="Nome" value={name} onChangeText={setName} />

            <TextInputMask
                type={"cpf"}
                value={cpf}
                onChangeText={setCpf}
                style={styles.input}
                placeholder="CPF"
            />

            <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={local}
                    onValueChange={(itemValue) => setLocal(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecione o Local" value="0" />
                    {locals.map((loc) => (
                        <Picker.Item key={loc.id} label={loc.nome} value={loc.id} />
                    ))}
                </Picker>
            </View>
            <InputField
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <InputField
                label="Confirmação de Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <CustomButton title="Cadastrar" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 20,
        zIndex: 1,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        marginVertical: 10,
        overflow: "hidden"
    },
    picker: {
        height: 50,
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
});
