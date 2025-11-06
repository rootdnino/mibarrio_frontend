import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';


const API_URL = 'http://192.168.35.15:8080'; 

export default function CreateReviewScreen() {
  const { proveedorId } = useLocalSearchParams(); 
  const { authToken } = useAuth();
  const router = useRouter();
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');

  const handleSubmitReview = () => {
    if (!comentario) {
      Alert.alert('Error', 'Por favor escribe un comentario.');
      return;
    }

    console.log("Token que se está enviando al crear la reseña:", authToken);
    fetch(`${API_URL}/api/reseñas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // <-- ¡Usamos el token!
      },
      body: JSON.stringify({
        proveedorId: proveedorId,
        calificacion: calificacion,
        comentario: comentario,
      }),
    })
    .then(response => {
      if (response.ok) {
        Alert.alert('¡Gracias!', 'Tu reseña ha sido publicada.');
        router.back(); // Vuelve a la pantalla anterior
      } else {
        Alert.alert('Error', 'No se pudo publicar tu reseña.');
      }
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Escribe tu Reseña</Text>
      
      <Text style={styles.label}>Calificación:</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setCalificacion(star)}>
            <Text style={star <= calificacion ? styles.starSelected : styles.star}>⭐️</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Comentario:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Describe tu experiencia..."
        value={comentario}
        onChangeText={setComentario}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
        <Text style={styles.buttonText}>Publicar Reseña</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  star: { fontSize: 30, color: 'grey' },
  starSelected: { fontSize: 30 },
  input: { backgroundColor: 'white', height: 100, textAlignVertical: 'top', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});