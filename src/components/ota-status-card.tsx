import { useState } from 'react';
import { View } from 'react-native';
import * as Updates from 'expo-updates';
import { useTheme } from '../context/theme-context';
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
} from './ui/gluestack-ui';

export function OtaStatusCard() {
  const { tema } = useTheme();
  const { currentlyRunning } = Updates.useUpdates();

  const [verificando, setVerificando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
  const [erroOta, setErroOta] = useState<string | null>(null);

  const channelAtual = currentlyRunning.channel ?? 'local (sem canal EAS)';
  const runtimeAtual = currentlyRunning.runtimeVersion ?? '1.0.0';

  async function handleBuscarAtualizacao() {
    if (verificando) return;
    setErroOta(null);

    if (__DEV__) {
      setMensagemStatus('OTA desabilitado em modo de desenvolvimento.');
      return;
    }

    setVerificando(true);
    setMensagemStatus('Consultando servidor EAS Update...');
    try {
      const check = await Updates.checkForUpdateAsync();
      if (!check.isAvailable) {
        setMensagemStatus('Nenhuma nova atualização OTA disponível no momento.');
        return;
      }

      setMensagemStatus('Baixando pacote OTA...');
      await Updates.fetchUpdateAsync();
      setMensagemStatus('Atualização pronta! Reiniciando aplicativo...');
      await Updates.reloadAsync();
    } catch (err) {
      setMensagemStatus(null);
      setErroOta(
        err instanceof Error
          ? err.message
          : 'Falha ao verificar atualizações Over-The-Air.'
      );
    } finally {
      setVerificando(false);
    }
  }

  return (
    <Card variant="elevated" className="w-full">
      <VStack space="md">
        <HStack className="justify-between">
          <Heading size="sm">Atualizações Over-The-Air (OTA)</Heading>
          <Badge action={__DEV__ ? 'warning' : 'success'}>
            <BadgeText>{__DEV__ ? 'DEV' : 'RELEASE'}</BadgeText>
          </Badge>
        </HStack>

        <VStack space="xs">
          <HStack className="justify-between">
            <Text size="sm" muted>
              Canal (channel):
            </Text>
            <Text size="sm" className="font-semibold">
              {channelAtual}
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text size="sm" muted>
              Runtime Version:
            </Text>
            <Text size="sm" className="font-semibold">
              {runtimeAtual}
            </Text>
          </HStack>
        </VStack>

        {mensagemStatus ? (
          <View
            style={{
              backgroundColor: tema.azulSuave,
              borderColor: tema.azulClaro,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text size="sm" style={{ color: tema.azulTexto }}>
              {mensagemStatus}
            </Text>
          </View>
        ) : null}

        {erroOta ? (
          <View
            style={{
              backgroundColor: tema.primariaSuave,
              borderColor: tema.primaria,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text size="sm" style={{ color: tema.erro }}>
              {erroOta}
            </Text>
          </View>
        ) : null}

        <Button
          action="secondary"
          isDisabled={verificando}
          onPress={handleBuscarAtualizacao}
        >
          {verificando ? <ButtonSpinner /> : null}
          <ButtonText>
            {verificando ? 'Verificando OTA...' : 'Buscar Atualização OTA'}
          </ButtonText>
        </Button>
      </VStack>
    </Card>
  );
}