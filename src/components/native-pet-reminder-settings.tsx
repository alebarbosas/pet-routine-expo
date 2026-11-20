import { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Host, Picker, Switch } from '@expo/ui';

import { useTheme } from '../context/theme-context';
import {
  Badge,
  BadgeText,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
} from './ui/gluestack-ui';

type MetaPasseio = 'Curto' | 'Moderado' | 'Longo';

const OPCOES_META: MetaPasseio[] = ['Curto', 'Moderado', 'Longo'];

const DESCRICAO_META: Record<MetaPasseio, string> = {
  Curto: '15 min — ideal para filhotes ou dias chuvosos',
  Moderado: '30 min — rotina diária equilibrada',
  Longo: '60 min — gasto energético intenso ao ar livre',
};

const STORAGE_NATIVE_PREFS = '@petroutine:native-reminder-prefs';

export function NativePetReminderSettings() {
  const { tema, isDark } = useTheme();
  const [lembreteAtivo, setLembreteAtivo] = useState(true);
  const [metaSelecionada, setMetaSelecionada] =
    useState<MetaPasseio>('Moderado');

  useEffect(() => {
    let ativo = true;
    AsyncStorage.getItem(STORAGE_NATIVE_PREFS)
      .then((raw) => {
        if (!ativo || !raw) return;
        const parsed = JSON.parse(raw) as {
          lembreteAtivo?: boolean;
          metaSelecionada?: MetaPasseio;
        };
        if (typeof parsed.lembreteAtivo === 'boolean') {
          setLembreteAtivo(parsed.lembreteAtivo);
        }
        if (
          parsed.metaSelecionada &&
          OPCOES_META.includes(parsed.metaSelecionada)
        ) {
          setMetaSelecionada(parsed.metaSelecionada);
        }
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  function atualizarPreferencias(novoAtivo: boolean, novaMeta: MetaPasseio) {
    setLembreteAtivo(novoAtivo);
    setMetaSelecionada(novaMeta);
    AsyncStorage.setItem(
      STORAGE_NATIVE_PREFS,
      JSON.stringify({ lembreteAtivo: novoAtivo, metaSelecionada: novaMeta })
    ).catch(() => {});
  }

  return (
    <Card variant="elevated" className="w-full">
      <VStack space="md">
        <HStack className="justify-between">
          <VStack space="xs" className="flex-1">
            <Heading size="sm">Controles Nativos (@expo/ui)</Heading>
            <Text size="xs" muted>
              Preferências nativas do sistema para lembretes e duração alvo
            </Text>
          </VStack>
          <Badge action="info">
            <BadgeText>{metaSelecionada}</BadgeText>
          </Badge>
        </HStack>

        <Host matchContents colorScheme={isDark ? 'dark' : 'light'}>
          <Switch
            value={lembreteAtivo}
            onValueChange={(valor: boolean) =>
              atualizarPreferencias(valor, metaSelecionada)
            }
            label="Lembretes diários de passeio"
          />
        </Host>

        <VStack space="xs">
          <Text size="sm" className="font-semibold">
            Meta de duração do passeio
          </Text>

          <Host matchContents colorScheme={isDark ? 'dark' : 'light'}>
            <Picker<MetaPasseio>
              selectedValue={metaSelecionada}
              onValueChange={(valor: MetaPasseio) =>
                atualizarPreferencias(lembreteAtivo, valor)
              }
              appearance="menu"
            >
              {OPCOES_META.map((opcao) => (
                <Picker.Item key={opcao} label={opcao} value={opcao} />
              ))}
            </Picker>
          </Host>
        </VStack>

        <View
          style={{
            backgroundColor: tema.superficie,
            borderColor: tema.borda,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text size="xs" muted>
            {lembreteAtivo
              ? `Lembretes ativos • ${DESCRICAO_META[metaSelecionada]}`
              : 'Lembretes diários desativados no momento.'}
          </Text>
        </View>
      </VStack>
    </Card>
  );
}