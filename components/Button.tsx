import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    loading: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, loading }) => {
    return (
        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onPress}
            disabled={loading} // Desabilita o botão se estiver em loading
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#6950a5",
        padding: 13,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: "#6950a5", // Cor do botão desabilitado
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CustomButton;
