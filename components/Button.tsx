import React from "react";
import { Button } from "react-native-paper";

interface CustomButtonProps {
    title: string;
    onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
    return (
        <Button mode="contained" onPress={onPress}>
            {title}
        </Button>
    );
};

export default CustomButton;
