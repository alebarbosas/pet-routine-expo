import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Meus Pets' }} />
      <Stack.Screen name="foto-do-pet" options={{ title: 'Foto do Pet' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o Aplicativo' }} />
    </Stack>
  );
}
