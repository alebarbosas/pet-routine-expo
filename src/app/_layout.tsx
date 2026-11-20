import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import '../services/notifications';
import { ThemeProvider, useTheme } from '../context/theme-context';
import { GluestackUIProvider } from '../components/ui/gluestack-ui';
import { useAuthStore } from '../store/use-auth-store';

function NavegacaoRaiz() {
  const router = useRouter();
  const segments = useSegments();
  const { tema } = useTheme();

  const sessionToken = useAuthStore((state) => state.sessionToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    const naAreaAuth = segments[0] === '(auth)';

    if (!sessionToken && !naAreaAuth) {
      router.replace('/(auth)/login');
    } else if (sessionToken && naAreaAuth) {
      router.replace('/(tabs)');
    }
  }, [sessionToken, isHydrated, segments, router]);

  useEffect(() => {
    const recebidoSub = Notifications.addNotificationReceivedListener(() => {
      // Notificação recebida em primeiro plano
    });

    const respostaSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (!useAuthStore.getState().sessionToken) return;
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

  if (!isHydrated) {
    return (
      <View style={[styles.carregando, { backgroundColor: tema.fundo }]}>
        <ActivityIndicator size="large" color={tema.primaria} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.primaria },
        headerTintColor: '#FAF8F5',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: tema.fundo },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
      <GluestackUIProvider>
        <NavegacaoRaiz />
      </GluestackUIProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});