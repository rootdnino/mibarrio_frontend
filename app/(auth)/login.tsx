import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';


const API_URL = 'http://192.168.35.15:8080';

export default function LoginScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { signIn } = useAuth();

    const handleLogin = () => {
        if (!email || !password){
            Alert.alert('Error', 'Por favor ingresa tu correo y contraseña.');
            return;
        }

        fetch(`${API_URL}/api/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then(async response => {
            if(response.ok){
                const data = await response.json();
                signIn(data.token);
                console.log('Token JWT:', data.token);
                Alert.alert('¡Bienvenido!','Has iniciado sesión correctamente.');

                //router.push('/(tabs)');
            }else{
                Alert.alert('Error','Credenciales inválidas. Inténtalo de nuevo.');
            }
        })
        .catch(error => {
            console.error(error);
            Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
        });
        
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style = {styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style = { styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title:{
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});