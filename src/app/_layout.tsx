import { Tabs, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { cores } from '../theme';
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: '#FAF8F5',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoFraco,
        tabBarStyle: {
          backgroundColor: cores.cartao,
          borderTopColor: cores.borda,
        },
        headerRight: () => (
          <View style={styles.acoesCabecalho}>
            <Link href="/settings" style={styles.linkCabecalho}>
              Ajustes
            </Link>
            <Link href="/sobre" style={styles.linkCabecalho}>
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
    color: cores.azulClaro,
    fontWeight: '600',
    fontSize: 15,
  },
});