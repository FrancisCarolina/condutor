import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";
import { obterToken } from "@/utils/storage";

export default function SplashScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await obterToken();

            if (token) {
                navigate("/home"); // Redireciona para a HomePage se o token existir
            } else {
                navigate("/login"); // Caso contrário, vai para LoginScreen
            }
        };

        checkAuth();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
});
