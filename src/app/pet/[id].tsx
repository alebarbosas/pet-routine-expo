import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { rotuloEspecie, rotuloStatusPasseio } from '../../types/pet';
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
import { espaco, tipografia } from '../../theme';

export default function TelaDetalhePet() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tema } = useTheme();

  const pet = usePetStore((state) => state.pets.find((p) => p.id === id));
  const togglePasseio = usePetStore((state) => state.togglePasseio);
  const registrarPasseio = usePetStore((state) => state.registrarPasseio);
  const removePet = usePetStore((state) => state.removePet);

  const [registrandoPasseio, setRegistrandoPasseio] = useState(false);
  const [feedbackNotificacao, setFeedbackNotificacao] = useState<string | null>(null);
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
        <Text style={[styles.titulo, { color: tema.primaria }]}>
          Pet não encontrado
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.botaoPrimario,
            { backgroundColor: tema.primaria },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotaoClaro}>Voltar</Text>
        </Pressable>
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
          <Text style={[styles.textoPlaceholder, { color: tema.textoFraco }]}>
            Sem foto cadastrada
          </Text>
        </View>
      )}

      <View
        style={[
          styles.cartao,
          { backgroundColor: tema.cartao, borderColor: tema.borda },
        ]}
      >
        <Text style={[styles.titulo, { color: tema.primaria }]}>{pet.nome}</Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          Espécie: {rotuloEspecie(pet.especie)} • Porte: {pet.porte}
        </Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          Idade: {pet.idadeMeses} meses
        </Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          Status do passeio: {rotuloStatusPasseio(pet.statusPasseio)}
        </Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          Última localização:{' '}
          {pet.local
            ? `Lat ${pet.local.latitude.toFixed(5)}, Lon ${pet.local.longitude.toFixed(5)} (±${Math.round(pet.local.precisaoMetros)}m)`
            : 'Nenhum registro de GPS ainda'}
        </Text>
      </View>

      <WalkTimer onSalvarSessao={handleSalvarCronometro} />

      <View
        style={[
          styles.cartao,
          { backgroundColor: tema.cartao, borderColor: tema.borda },
        ]}
      >
        <Text style={[styles.subtitulo, { color: tema.primaria }]}>
          Histórico de Passeios (SQLite)
        </Text>
        {historico.length === 0 ? (
          <Text style={[styles.legenda, { color: tema.textoFraco }]}>
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
              <Text style={[styles.tempoHistorico, { color: tema.azulTexto }]}>
                Duração: {formatarDuracao(item.seconds)}
              </Text>
              <Text style={[styles.legenda, { color: tema.textoFraco }]}>
                {new Date(item.createdAt).toLocaleString('pt-BR')}
              </Text>
            </View>
          ))
        )}
      </View>

      {feedbackNotificacao ? (
        <View
          style={[
            styles.caixaAviso,
            { backgroundColor: tema.azulSuave, borderColor: tema.azulClaro },
          ]}
        >
          <Text style={[styles.textoAviso, { color: tema.azulTexto }]}>
            {feedbackNotificacao}
          </Text>
        </View>
      ) : null}

      <View style={styles.acoes}>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/foto-do-pet', params: { petId: pet.id } })
          }
          style={({ pressed }) => [
            styles.botaoAzul,
            { backgroundColor: tema.azulSuave, borderColor: tema.azulClaro },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={[styles.textoBotaoAzul, { color: tema.azulTexto }]}>
            Alterar foto do pet (1:1)
          </Text>
        </Pressable>

        <Pressable
          onPress={handleAlternarStatus}
          style={({ pressed }) => [
            styles.botaoSecundario,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={[styles.textoBotaoEscuro, { color: tema.texto }]}>
            Alternar status ({pet.statusPasseio === 'concluido' ? 'marcar pendente' : 'marcar concluído'})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setRegistrandoPasseio(true)}
          style={({ pressed }) => [
            styles.botaoPrimario,
            { backgroundColor: tema.primaria },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotaoClaro}>Registrar passeio com GPS/Câmera</Text>
        </Pressable>

        <Pressable
          onPress={handleAgendarLembrete}
          style={({ pressed }) => [
            styles.botaoAlerta,
            { backgroundColor: tema.alerta },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotaoClaro}>Agendar lembrete de passeio (5s)</Text>
        </Pressable>

        <Pressable
          onPress={handleExcluir}
          style={({ pressed }) => [
            styles.botaoPerigo,
            { backgroundColor: tema.erro },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotaoClaro}>Excluir pet</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    padding: espaco.md,
    gap: espaco.md,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.md,
    padding: espaco.md,
  },
  foto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  fotoPlaceholder: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoPlaceholder: {
    ...tipografia.corpo,
  },
  cartao: {
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
  },
  titulo: {
    ...tipografia.titulo,
  },
  subtitulo: {
    ...tipografia.subtitulo,
  },
  corpo: {
    ...tipografia.corpo,
    textTransform: 'capitalize',
  },
  legenda: {
    ...tipografia.legenda,
  },
  itemHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: espaco.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  tempoHistorico: {
    fontWeight: '700',
    fontSize: 14,
  },
  caixaAviso: {
    borderWidth: 1,
    borderRadius: 10,
    padding: espaco.sm,
  },
  textoAviso: {
    ...tipografia.corpo,
  },
  acoes: {
    gap: espaco.sm,
  },
  botaoPrimario: {
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoAzul: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoSecundario: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoAlerta: {
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoPerigo: {
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoClaro: {
    color: '#FAF8F5',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  textoBotaoAzul: {
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  textoBotaoEscuro: {
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  pressionado: {
    opacity: 0.8,
  },
});