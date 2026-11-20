import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  rotuloEspecie,
  rotuloStatusPasseio,
  type StatusPasseio,
} from '../../types/pet';
import { usePetStore } from '../../store/use-pet-store';
import { agendarLembretePasseio } from '../../services/notifications';
import {
  listarSessoesPasseio,
  salvarSessaoPasseio,
  type PasseioLog,
} from '../../services/passeio-db';
import { WalkTimer, formatarDuracao } from '../../components/walk-timer';
import { TelaRegistro } from '../../screens/tela-registro';
import { useTheme } from '../../context/theme-context';
import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
  type BadgeAction,
} from '../../components/ui/gluestack-ui';

function acaoBadgeStatus(status: StatusPasseio): BadgeAction {
  if (status === 'concluido') return 'success';
  if (status === 'cancelado') return 'error';
  return 'warning';
}

export default function TelaDetalhePet() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tema } = useTheme();

  const pet = usePetStore((state) => state.pets.find((p) => p.id === id));
  const togglePasseio = usePetStore((state) => state.togglePasseio);
  const registrarPasseio = usePetStore((state) => state.registrarPasseio);
  const removePet = usePetStore((state) => state.removePet);

  const [registrandoPasseio, setRegistrandoPasseio] = useState(false);
  const [feedbackNotificacao, setFeedbackNotificacao] = useState<string | null>(
    null
  );
  const [historico, setHistorico] = useState<PasseioLog[]>([]);

  const carregarHistorico = useCallback(async () => {
    if (!id) return;
    try {
      const lista = await listarSessoesPasseio(id);
      setHistorico(lista);
    } catch {
      setHistorico([]);
    }
  }, [id]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  if (!pet) {
    return (
      <View style={[styles.centralizado, { backgroundColor: tema.fundo }]}>
        <Card variant="elevated" className="w-full">
          <VStack space="md" className="items-center">
            <Heading size="lg">Pet não encontrado</Heading>
            <Text size="sm" muted className="text-center">
              O registro solicitado não está disponível na lista atual.
            </Text>
            <Button action="primary" className="w-full" onPress={() => router.back()}>
              <ButtonText>Voltar</ButtonText>
            </Button>
          </VStack>
        </Card>
      </View>
    );
  }

  if (registrandoPasseio) {
    return (
      <TelaRegistro
        pet={pet}
        onSalvar={async (local, fotoUri) => {
          try {
            await registrarPasseio(pet.id, local, fotoUri);
            setRegistrandoPasseio(false);
          } catch (err) {
            setFeedbackNotificacao(
              err instanceof Error ? err.message : 'Erro ao registrar passeio.'
            );
            setRegistrandoPasseio(false);
          }
        }}
        onCancelar={() => setRegistrandoPasseio(false)}
      />
    );
  }

  async function handleSalvarCronometro(seconds: number) {
    if (!pet) return;
    await salvarSessaoPasseio(pet.id, seconds);
    await carregarHistorico();
    setFeedbackNotificacao(
      `Sessão de ${formatarDuracao(seconds)} salva no histórico SQLite de ${pet.nome}!`
    );
  }

  async function handleAgendarLembrete() {
    if (!pet) return;
    const resultado = await agendarLembretePasseio(pet.id, pet.nome);
    if (resultado.ok) {
      setFeedbackNotificacao(
        `Lembrete agendado! A notificação de ${pet.nome} chegará em 5 segundos.`
      );
      return;
    }
    if (resultado.motivo === 'negada') {
      setFeedbackNotificacao(
        'Permissão de notificação negada. Toque novamente e autorize para receber lembretes.'
      );
      return;
    }
    setFeedbackNotificacao(
      'Notificações bloqueadas no sistema. Libere nas configurações do aparelho.'
    );
  }

  async function handleAlternarStatus() {
    if (!pet) return;
    try {
      await togglePasseio(pet.id);
    } catch (err) {
      setFeedbackNotificacao(
        err instanceof Error ? err.message : 'Erro ao alternar status.'
      );
    }
  }

  async function handleExcluir() {
    if (!pet) return;
    try {
      await removePet(pet.id);
      router.back();
    } catch (err) {
      setFeedbackNotificacao(
        err instanceof Error ? err.message : 'Erro ao excluir pet.'
      );
    }
  }

  return (
    <ScrollView
      style={[styles.tela, { backgroundColor: tema.fundo }]}
      contentContainerStyle={styles.conteudo}
    >
      {pet.fotoUri ? (
        <Image
          source={{ uri: pet.fotoUri }}
          style={styles.foto}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.foto,
            styles.fotoPlaceholder,
            { backgroundColor: tema.cartao, borderColor: tema.azulClaro },
          ]}
        >
          <Text size="md" muted>
            Sem foto cadastrada (proporção 1:1)
          </Text>
        </View>
      )}

      <Card variant="elevated">
        <VStack space="sm">
          <HStack className="justify-between flex-wrap">
            <Heading size="xl">{pet.nome}</Heading>
            <Badge action={acaoBadgeStatus(pet.statusPasseio)}>
              <BadgeText>{rotuloStatusPasseio(pet.statusPasseio)}</BadgeText>
            </Badge>
          </HStack>

          <HStack space="xs" className="flex-wrap">
            <Badge action="info">
              <BadgeText>{rotuloEspecie(pet.especie)}</BadgeText>
            </Badge>
            <Badge action="muted">
              <BadgeText className="capitalize">Porte {pet.porte}</BadgeText>
            </Badge>
            <Badge action="muted">
              <BadgeText>{pet.idadeMeses} meses</BadgeText>
            </Badge>
          </HStack>

          <Text size="sm" muted>
            Última localização:{' '}
            {pet.local
              ? `Lat ${pet.local.latitude.toFixed(5)}, Lon ${pet.local.longitude.toFixed(5)} (±${Math.round(pet.local.precisaoMetros)}m)`
              : 'Nenhum registro de GPS ainda'}
          </Text>
        </VStack>
      </Card>

      <WalkTimer onSalvarSessao={handleSalvarCronometro} />

      <Card variant="elevated">
        <VStack space="sm">
          <HStack className="justify-between">
            <Heading size="md">Histórico de Passeios</Heading>
            <Badge action="info">
              <BadgeText>SQLite ({historico.length})</BadgeText>
            </Badge>
          </HStack>

          {historico.length === 0 ? (
            <Text size="sm" muted>
              Nenhuma sessão cronometrada salva para {pet.nome} ainda.
            </Text>
          ) : (
            historico.map((item) => (
              <View
                key={String(item.id)}
                style={[
                  styles.itemHistorico,
                  { backgroundColor: tema.superficie, borderColor: tema.borda },
                ]}
              >
                <Text
                  size="sm"
                  className="font-bold"
                  style={{ color: tema.azulTexto }}
                >
                  Duração: {formatarDuracao(item.seconds)}
                </Text>
                <Text size="xs" muted>
                  {new Date(item.createdAt).toLocaleString('pt-BR')}
                </Text>
              </View>
            ))
          )}
        </VStack>
      </Card>

      {feedbackNotificacao ? (
        <View
          style={[
            styles.caixaAviso,
            { backgroundColor: tema.azulSuave, borderColor: tema.azulClaro },
          ]}
        >
          <Text size="sm" style={{ color: tema.azulTexto }}>
            {feedbackNotificacao}
          </Text>
        </View>
      ) : null}

      <VStack space="sm">
        <Button
          action="secondary"
          onPress={() =>
            router.push({ pathname: '/foto-do-pet', params: { petId: pet.id } })
          }
        >
          <ButtonText>Alterar foto do pet (1:1)</ButtonText>
        </Button>

        <Button variant="outline" onPress={handleAlternarStatus}>
          <ButtonText>
            Alternar status ({pet.statusPasseio === 'concluido' ? 'marcar pendente' : 'marcar concluído'})
          </ButtonText>
        </Button>

        <Button action="primary" onPress={() => setRegistrandoPasseio(true)}>
          <ButtonText>Registrar passeio com GPS/Câmera</ButtonText>
        </Button>

        <Button action="warning" onPress={handleAgendarLembrete}>
          <ButtonText>Agendar lembrete de passeio (5s)</ButtonText>
        </Button>

        <Button action="negative" onPress={handleExcluir}>
          <ButtonText>Excluir pet</ButtonText>
        </Button>
      </VStack>
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
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  foto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  fotoPlaceholder: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  caixaAviso: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
});