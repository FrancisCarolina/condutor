import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";
import { useNavigate } from "react-router-native";
import Icon from "react-native-vector-icons/Ionicons"

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleRegister = () => {
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        Alert.alert("Sucesso", "Conta criada com sucesso!");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigate(-1)}
            >
                <Icon name="arrow-back" size={24} />
            </TouchableOpacity>

            {/* Formulário */}
            <InputField label="Nome" value={name} onChangeText={setName} />
            <InputField label="CPF" value={cpf} onChangeText={setCpf} />
            <InputField label="Login" value={username} onChangeText={setUsername} />
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
    backButtonText: {
        fontSize: 18,
        color: "gray",
    },
});
