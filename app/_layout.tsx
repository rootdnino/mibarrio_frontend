import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Este componente decide qué pantalla mostrar
function AppLayout() {
  const { authToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Si ya terminamos de cargar el token...
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (
        // Si hay un token y estamos en una pantalla de autenticación (login/registro)
        authToken && inAuthGroup
      ) {
        // Redirige al usuario a la pantalla principal
        router.replace('/(tabs)');
      } else if (
        // Si NO hay token y NO estamos en una pantalla de autenticación
        !authToken && !inAuthGroup
      ) {
        // Redirige al usuario a la pantalla de login
        router.replace('/login');
      }
    }
  }, [authToken, isLoading, segments]);

  // Mientras carga, no mostramos nada para evitar parpadeos
  if (isLoading) {
    return null;
  }

  // Una vez cargado, muestra el Stack
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login', presentation: 'modal' }} />
      <Stack.Screen name="register" options={{ title: 'Registro', presentation: 'modal' }} />
      <Stack.Screen name="profile/[id]" options={{ title: 'Perfil del Proveedor' }} />
      <Stack.Screen name="create-review" options={{ title: 'Escribir Reseña', presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}