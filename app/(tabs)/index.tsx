import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import LoginScreen from "@/app/(tabs)/Login";
import RegisterScreen from "@/app/(tabs)/Register";
import HomePage from "@/app/(tabs)/Home";
import SplashScreen from "@/app/(tabs)/Splash";
import ChangeCredentialsScreen from "./ChangeLogin";
import VeiculosPage from "./Veiculos";
import NovoVeiculosPage from "./NovoVeiculo";
import EditVeiculoPage from "./EditVeiculo";

const App = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/changeLogin" element={<ChangeCredentialsScreen />} />
        <Route path="/veiculos" element={<VeiculosPage />} />
        <Route path="/novoVeiculo" element={<NovoVeiculosPage />} />
        <Route path="/editVeiculo/:id" element={<EditVeiculoPage />} />
      </Routes>
    </NativeRouter>
  );
};

export default App;
