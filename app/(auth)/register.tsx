import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ¡IMPORTANTE! Reemplaza esta IP con la de tu computadora
const API_URL = 'http://192.168.35.15:8080'; // Ejemplo

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [barrio, setBarrio] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // Validaciones básicas (puedes mejorarlas después)
    if (!nombre || !email || !password || !barrio) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    fetch(`${API_URL}/api/usuarios/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        password: password,
        barrio: barrio,
        rol: 'vecino', // Por defecto, todos se registran como 'vecino'
      }),
    })
    .then(response => {
      if (response.ok) {
        Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.');
        router.push('/(tabs)'); // Vuelve a la pantalla de inicio
      } else {
        Alert.alert('Error', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Barrio"
        value={barrio}
        onChangeText={setBarrio}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
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