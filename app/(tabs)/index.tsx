import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://192.168.35.15:8080'; 

export default function ListaProveedoresScreen() { 
  const { authToken, signOut } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  
  const [loading, setLoading] = useState(true); // Para mostrar un spinner
  const [searchQuery, setSearchQuery] = useState(''); // Lo que el usuario escribe
  const [searchTerm, setSearchTerm] = useState('');   // El término de búsqueda que se envía a la API

  useEffect(() => {
    setLoading(true); 
    let url = `${API_URL}/api/perfiles`; 

    if (searchTerm) {
      url += `?search=${searchTerm}`;
    }
    

    fetch(url) 
      .then(response => {
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        return response.json();
      })
      .then(data => {
        setProveedores(data);
        setLoading(false); 
      })
      .catch(error => {
        console.error("Hubo un error al obtener los perfiles:", error);
        setLoading(false); 
      });
  }, [searchTerm]); 

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Esto es tu código existente, está perfecto */}
        <Text style={styles.title}>Proveedores del Barrio</Text>
        <View style={styles.buttonContainer}>
          {authToken ? (
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity style={styles.registerButton}>
                  <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </Link>
            </>
          )}
        </View>
      </View>
      
      {/* --- NUEVA BARRA DE BÚSQUEDA --- */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o servicio..."
          value={searchQuery}
          onChangeText={setSearchQuery} 
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODIFICADO: AÑADIMOS ESTADO DE CARGA --- */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={proveedores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={`/profile/${item.id}`} asChild>
              <TouchableOpacity>
                <View style={styles.card}>
                  <Text style={styles.nombre}>{item.usuario.nombre}</Text>
                  <Text style={styles.descripcion}>{item.descripcion}</Text>
                  <Text style={styles.barrio}>Barrio: {item.usuario.barrio}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// Copiamos todos tus estilos existentes y añadimos los nuevos para la búsqueda
const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545', // rojo
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  },
  registerButton: {
  backgroundColor: '#28a745', // verde
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
  },
  loginButton: {
  backgroundColor: '#007BFF', // azul
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
  },
  nombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descripcion: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    barrio: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        fontStyle: 'italic',
    },
    
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        fontSize: 16, 
    },
    searchButton: {
        backgroundColor: '#007BFF', 
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 8,
    },
});