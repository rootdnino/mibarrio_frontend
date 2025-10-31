import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    // El AuthProvider NO debe estar aquí
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mi Perfil',
        }}  
      />
    </Tabs>
  );
}
