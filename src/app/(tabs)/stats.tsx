import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { usePetStore } from '../../store/use-pet-store';
import { useAuthStore } from '../../store/use-auth-store';
import { logoutUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';
import { NativePetReminderSettings } from '../../components/native-pet-reminder-settings';
import { OtaStatusCard } from '../../components/ota-status-card';
import {
  Badge,
  BadgeText,
  Button,
  ButtonSpinner,
  ButtonText,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
} from '../../components/ui/gluestack-ui';

export default function TelaEstatisticas() {
  const pets = usePetStore((state) => state.pets);
  const user = useAuthStore((state) => state.user);
  const { tema, modo, toggleTheme } = useTheme();
  const [saindo, setSaindo] = useState(false);

  const total = pets.length;
  const concluidos = pets.filter((p) => p.statusPasseio === 'concluido').length;
  const pendentes = pets.filter((p) => p.statusPasseio === 'pendente').length;
  const cancelados = pets.filter((p) => p.statusPasseio === 'cancelado').length;
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  async function handleLogout() {
    if (saindo) return;
    setSaindo(true);
    try {
      await logoutUser();
    } finally {
      setSaindo(false);
    }
  }

  return (
    <ScrollView
      style={[styles.tela, { backgroundColor: tema.fundo }]}
      contentContainerStyle={styles.conteudo}
    >
      <View style={[styles.cartaoDestaque, { backgroundColor: tema.primaria }]}>
        <VStack space="xs">
          <HStack className="justify-between">
            <Text size="sm" style={{ color: tema.azulClaro, fontWeight: '700' }}>
              Meta de passeios de hoje
            </Text>
            <Badge action="info">
              <BadgeText>{concluidos}/{total}</BadgeText>
            </Badge>
          </HStack>
          <Heading size="2xl" style={{ color: '#FAF8F5', fontSize: 38 }}>
            {percentual}%
          </Heading>
          <Text size="sm" style={{ color: '#FAF8F5' }}>
            {concluidos} de {total} passeios concluídos hoje
          </Text>
        </VStack>
      </View>

      <View style={styles.grade}>
        <Card variant="elevated" style={styles.celulaMetrica}>
          <VStack space="xs">
            <Heading size="xl">{total}</Heading>
            <Text size="sm" muted>
              Total de Pets
            </Text>
          </VStack>
        </Card>

        <Card variant="elevated" style={styles.celulaMetrica}>
          <VStack space="xs">
            <Heading size="xl" style={{ color: tema.sucesso }}>
              {concluidos}
            </Heading>
            <Text size="sm" muted>
              Concluídos
            </Text>
          </VStack>
        </Card>

        <Card variant="elevated" style={styles.celulaMetrica}>
          <VStack space="xs">
            <Heading size="xl" style={{ color: tema.alerta }}>
              {pendentes}
            </Heading>
            <Text size="sm" muted>
              Pendentes
            </Text>
          </VStack>
        </Card>

        <Card variant="elevated" style={styles.celulaMetrica}>
          <VStack space="xs">
            <Heading size="xl" style={{ color: tema.erro }}>
              {cancelados}
            </Heading>
            <Text size="sm" muted>
              Cancelados
            </Text>
          </VStack>
        </Card>
      </View>

      <NativePetReminderSettings />

      <OtaStatusCard />

      <Card variant="elevated">
        <VStack space="md">
          <HStack className="justify-between">
            <Heading size="md">Perfil e Conta Autenticada</Heading>
            <Badge action="success">
              <BadgeText>JWT Ativo</BadgeText>
            </Badge>
          </HStack>

          <VStack space="xs">
            <Text size="sm">
              Tutor: {user?.name ?? 'Usuário autenticado'}
            </Text>
            <Text size="sm" muted>
              E-mail: {user?.email ?? '—'}
            </Text>
          </VStack>

          <Button action="secondary" onPress={toggleTheme}>
            <ButtonText>
              Alternar para modo {modo === 'claro' ? 'Escuro' : 'Claro'}
            </ButtonText>
          </Button>

          <Button
            action="negative"
            isDisabled={saindo}
            onPress={handleLogout}
          >
            {saindo ? <ButtonSpinner /> : null}
            <ButtonText>
              {saindo ? 'Saindo...' : 'Sair da Conta (Logout)'}
            </ButtonText>
          </Button>

          <HStack className="justify-between">
            <Link
              href="/settings"
              style={{ color: tema.azulTexto, fontWeight: '700', fontSize: 14 }}
            >
              Configurações (/settings)
            </Link>
            <Link
              href="/sobre"
              style={{ color: tema.azulTexto, fontWeight: '700', fontSize: 14 }}
            >
              Sobre (/sobre)
            </Link>
          </HStack>
        </VStack>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  cartaoDestaque: {
    borderRadius: 18,
    padding: 20,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  celulaMetrica: {
    width: '48%',
  },
});