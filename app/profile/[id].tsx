import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";



const API_URL = 'http://192.168.35.15:8080';

export default function ProfileDetailScreen() {
    const { id } = useLocalSearchParams();
    const { authToken } = useAuth();
    const router = useRouter();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/api/perfiles/${id}`)
                .then(response => response.json())
                .then(data => {
                    setPerfil(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al obtener el perfil:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    console.log("Valor de authToken en ProfileDetailScreen:", authToken);

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!perfil) {
        return <Text style={styles.errorText}>No se pudo cargar el perfil.</Text>;
    }

    const handleWhatsAppPress = () => {
        Linking.openURL(`https://wa.me/${perfil.numeroWhatsapp}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.nombre}>{perfil.usuario.nombre}</Text>
                    <Text style={styles.barrio}>Barrio: {perfil.usuario.barrio}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.descripcion}>{perfil.descripcion}</Text>
                </View>

                <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
                    <Text style={styles.whatsappButtonText}>Contactar por WhatsApp</Text>
                </TouchableOpacity>

                {authToken && (
                    <TouchableOpacity 
                        style={styles.reviewButton} 
                        onPress={() => router.push(`/create-review?proveedorId=${id}`)}
                    >
                        <Text style={styles.reviewButtonText}>Escribir una Reseña</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reseñas</Text>
                    {perfil.reseñas && perfil.reseñas.length > 0 ? (
                        perfil.reseñas.map(reseña => (
                            <View key={reseña.id} style={styles.reseñaCard}>
                                <Text style={styles.reseñaAutor}>{reseña.vecino.nombre}</Text>
                                <Text style={styles.reseñaCalificacion}>Calificación: {'⭐️'.repeat(reseña.calificacion)}</Text>
                                <Text style={styles.reseñaComentario}>"{reseña.comentario}"</Text>
                            </View>
                        ))
                    ) : (
                        <Text>Este proveedor aún no tiene reseñas.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: { backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
    nombre: { fontSize: 26, fontWeight: 'bold' },
    barrio: { fontSize: 16, color: 'gray', marginTop: 4 },
    section: { backgroundColor: 'white', padding: 20, marginTop: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    descripcion: { fontSize: 16, lineHeight: 24 },
    whatsappButton: { backgroundColor: '#25D366', padding: 15, borderRadius: 8, alignItems: 'center', margin: 20 },
    whatsappButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    reseñaCard: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 15, marginTop: 15 },
    reseñaAutor: { fontWeight: 'bold' },
    reseñaCalificacion: { marginVertical: 5 },
    reseñaComentario: { fontStyle: 'italic', color: '#555' },
    reviewButton: { 
    backgroundColor: '#007BFF', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginHorizontal: 20,
    marginBottom: 20,
  },
  reviewButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
    errorText: { textAlign: 'center', marginTop: 50, fontSize: 18 }
});