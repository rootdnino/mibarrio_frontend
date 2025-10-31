import * as ImagePicker from 'expo-image-picker';

import React, { useEffect, useState } from 'react';

import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // <-- LÍNEA CORREGIDA

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';



const API_URL = 'http://192.168.35.15:8080';



export default function MyProfileScreen() {

  const { authToken, signOut } = useAuth();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    if (authToken) {

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

        setUser(data);

        setLoading(false);

      })

      .catch(error => {

        console.error(error);

        Alert.alert('Error', 'No se pudo cargar tu información.');

        setLoading(false);

      });

    } else {

      setLoading(false); // Si no hay token, dejamos de cargar

    }

  }, [authToken]);



  // --- FUNCIÓN ÚNICA Y CORREGIDA ---

  const handlePickImage = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {

      Alert.alert("Necesitas dar permisos para acceder a tus fotos.");

      return;

    }



    const pickerResult = await ImagePicker.launchImageLibraryAsync({

      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,

      aspect: [1, 1],

      quality: 0.5,

    });



    if (!pickerResult.canceled) {

      const imageUri = pickerResult.assets[0].uri;

     

      const formData = new FormData();

      formData.append('file', {

        uri: imageUri,

        name: `profile-${user.id}.jpg`,

        type: 'image/jpeg',

      });



      fetch(`${API_URL}/api/usuarios/me/avatar`, {

        method: 'POST',

        body: formData,

        headers: {

          'Authorization': `Bearer ${authToken}`,

        },

      })

      .then(response => {

        if (!response.ok) {

            throw new Error(`El servidor respondió con un error: ${response.status}`);

        }

        return response.json();

      })

      .then(data => {

        setUser(data);

        Alert.alert('Éxito', 'Tu foto de perfil ha sido actualizada.');

      })

      .catch(error => {

        console.error('Error al subir la foto:', error);

        Alert.alert('Error', 'No se pudo subir la foto.');

      });

    }

  };



  if (loading) {

    return <ActivityIndicator size="large" style={styles.loader} />;

  }



  // Si no hay usuario (porque no se ha iniciado sesión), podemos mostrar un mensaje

  if (!user) {

    return (

        <SafeAreaView style={styles.container}>

            <Text>Inicia sesión para ver tu perfil.</Text>

        </SafeAreaView>

    );

  }



  return (

    <SafeAreaView style={styles.container}>

      <TouchableOpacity onPress={handlePickImage}>

        <Image

          style={styles.avatar}

          source={user?.fotoUrl

            ? { uri: `${API_URL}${user.fotoUrl}` }

            : require('../../assets/images/default-avatar.png')

          }

        />

        <Text style={styles.editAvatarText}>Toca para cambiar</Text>

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

  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  avatar: {

    width: 120,

    height: 120,

    borderRadius: 60, // Círculo perfecto

    borderWidth: 3,

    borderColor: '#007BFF',

    marginBottom: 10,

  },

  editAvatarText: {

    textAlign: 'center',

    color: 'gray',

    marginBottom: 20,

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

  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },

  info: { fontSize: 16, marginBottom: 8 },

  logoutButton: {

    backgroundColor: '#dc3545',

    padding: 15,

    borderRadius: 8,

    alignItems: 'center',

    width: '100%',

    marginTop: 'auto',

  },

  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }

});