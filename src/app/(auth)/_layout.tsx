import { Stack } from 'expo-router';
import { useTheme } from '../../context/theme-context';

export default function AuthLayout() {
  const { tema } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tema.fundo },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}