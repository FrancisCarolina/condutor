import React from "react";
import { TextInput, StyleSheet, Text, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    ...props
}) => {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={label}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                {...props} // Permite passar outras propriedades opcionais do TextInput
            />
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
        color: "gray",
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "black",
    },
});

export default InputField;
