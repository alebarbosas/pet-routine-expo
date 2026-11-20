import { Tabs, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/theme-context';

export default function TabsLayout() {
  const { tema, isDark, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: tema.primaria },
        headerTintColor: '#FAF8F5',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: isDark ? tema.azulClaro : tema.primaria,
        tabBarInactiveTintColor: tema.textoFraco,
        tabBarStyle: {
          backgroundColor: tema.cartao,
          borderTopColor: tema.borda,
        },
        headerRight: () => (
          <View style={styles.acoesCabecalho}>
            <Pressable
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel="Alternar tema claro ou escuro"
              style={({ pressed }) => [pressed && styles.pressionado]}
            >
              <Feather
                name={isDark ? 'sun' : 'moon'}
                size={19}
                color={tema.azulClaro}
              />
            </Pressable>
            <Link
              href="/settings"
              style={[styles.linkCabecalho, { color: tema.azulClaro }]}
            >
              Ajustes
            </Link>
            <Link
              href="/sobre"
              style={[styles.linkCabecalho, { color: tema.azulClaro }]}
            >
              Sobre
            </Link>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meus Pets',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Estatísticas',
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  acoesCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingRight: 16,
  },
  linkCabecalho: {
    fontWeight: '600',
    fontSize: 15,
  },
  pressionado: {
    opacity: 0.7,
  },
});