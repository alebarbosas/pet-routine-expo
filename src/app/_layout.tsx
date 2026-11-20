import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import '../services/notifications';
import { ThemeProvider, useTheme } from '../context/theme-context';

function NavegacaoRaiz() {
  const router = useRouter();
  const { tema } = useTheme();

  useEffect(() => {
    const recebidoSub = Notifications.addNotificationReceivedListener(() => {
      // Notificação recebida em primeiro plano
    });

    const respostaSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const petId = typeof data?.petId === 'string' ? data.petId : null;
        if (petId) {
          router.push({ pathname: '/pet/[id]', params: { id: petId } });
        }
      }
    );

    return () => {
      recebidoSub.remove();
      respostaSub.remove();
    };
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.primaria },
        headerTintColor: '#FAF8F5',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: tema.fundo },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pet/[id]" options={{ title: 'Detalhes do Pet' }} />
      <Stack.Screen name="foto-do-pet" options={{ title: 'Foto do Pet' }} />
      <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o Aplicativo' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavegacaoRaiz />
    </ThemeProvider>
  );
}