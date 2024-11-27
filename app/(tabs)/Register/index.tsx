import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleRegister = () => {
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        // Aqui você pode integrar a lógica de cadastro com a API
        Alert.alert("Sucesso", "Conta criada com sucesso!");
    };

    return (
        <View style={styles.container}>
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
});
