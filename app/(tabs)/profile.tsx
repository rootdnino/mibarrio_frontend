import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://192.168.35.15:8080';

export default function MyProfileScreen() {
  const { authToken, signOut } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (authToken) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  const loadUserProfile = () => {
    fetch(`${API_URL}/api/usuarios/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el perfil');
      return response.json();
    })
    .then(data => {
      console.log('Datos del usuario:', data);
      setUser(data);
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar tu información.');
      setLoading(false);
    });
  };

  const handlePickImage = async () => {
    // Solicitar permisos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permisos necesarios", "Necesitas dar permisos para acceder a tus fotos.");
      return;
    }

    // Abrir selector de imágenes
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (pickerResult.canceled) {
      return;
    }

    const imageUri = pickerResult.assets[0].uri;
    await uploadImage(imageUri);
  };

  const uploadImage = async (imageUri) => {
    setUploading(true);

    try {
      let formData = new FormData();

      if (Platform.OS === 'web') {
        // Para web: convertir la URI a Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('file', blob, `profile-${user.id}.jpg`);
      } else {
        // Para móvil nativo
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      console.log('Subiendo imagen...');

      const uploadResponse = await fetch(`${API_URL}/api/usuarios/me/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // NO incluir 'Content-Type': FormData lo maneja automáticamente
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`El servidor respondió con un error: ${uploadResponse.status}`);
      }

      const data = await uploadResponse.json();
      console.log('Respuesta del servidor:', data);
      
      // Recargar el perfil completo desde el servidor
      await loadUserProfile();
      Alert.alert('Éxito', 'Tu foto de perfil ha sido actualizada.');
    } catch (error) {
      console.error('Error al subir la foto:', error);
      Alert.alert('Error', `No se pudo subir la foto: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.messageText}>Inicia sesión para ver tu perfil.</Text>
      </SafeAreaView>
    );
  }

  // Construir la URL completa de la imagen
  const avatarUrl = user?.fotoUrl 
    ? `${API_URL}${user.fotoUrl}?t=${Date.now()}` // Agregar timestamp para evitar caché
    : null;

  console.log('URL del avatar:', avatarUrl);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
        {uploading ? (
          <View style={styles.avatarContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        ) : (
          <>
            <Image
              style={styles.avatar}
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require('../../assets/images/default-avatar.png')
              }
              onError={(error) => {
                console.error('Error al cargar imagen:', error.nativeEvent.error);
              }}
            />
            <Text style={styles.editAvatarText}>
              {uploading ? 'Subiendo...' : 'Toca para cambiar'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.profileCard}>
        <Text style={styles.name}>{user?.nombre}</Text>
        <Text style={styles.info}>Email: {user?.email}</Text>
        <Text style={styles.info}>Barrio: {user?.barrio}</Text>
        <Text style={styles.info}>Rol: {user?.rol}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
    marginBottom: 10,
  },
  editAvatarText: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 15 
  },
  info: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  logoutButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});