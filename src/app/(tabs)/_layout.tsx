import { Tabs, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
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
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 15,
  },
});
