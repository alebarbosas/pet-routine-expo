import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { rotuloEspecie, rotuloStatusPasseio } from '../../types/pet';
import { usePetStore } from '../../store/use-pet-store';
import { agendarLembretePasseio } from '../../services/notifications';
import { TelaRegistro } from '../../screens/tela-registro';
import { cores, espaco, tipografia } from '../../theme';

export default function TelaDetalhePet() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const pet = usePetStore((state) => state.pets.find((p) => p.id === id));
  const alternarStatus = usePetStore((state) => state.alternarStatus);
  const registrarPasseio = usePetStore((state) => state.registrarPasseio);
  const removerPet = usePetStore((state) => state.removerPet);

  const [registrandoPasseio, setRegistrandoPasseio] = useState(false);
  const [feedbackNotificacao, setFeedbackNotificacao] = useState<string | null>(null);

  if (!pet) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.titulo}>Pet não encontrado</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.botaoPrimario, pressed && styles.pressionado]}
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
        onSalvar={(local, fotoUri) => {
          registrarPasseio(pet.id, local, fotoUri);
          setRegistrandoPasseio(false);
        }}
        onCancelar={() => setRegistrandoPasseio(false)}
      />
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

  function handleExcluir() {
    if (!pet) return;
    removerPet(pet.id);
    router.back();
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      {pet.fotoUri ? (
        <Image
          source={{ uri: pet.fotoUri }}
          style={styles.foto}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.foto, styles.fotoPlaceholder]}>
          <Text style={styles.textoPlaceholder}>Sem foto cadastrada</Text>
        </View>
      )}

      <View style={styles.cartao}>
        <Text style={styles.titulo}>{pet.nome}</Text>
        <Text style={styles.corpo}>
          Espécie: {rotuloEspecie(pet.especie)} • Porte: {pet.porte}
        </Text>
        <Text style={styles.corpo}>Idade: {pet.idadeMeses} meses</Text>
        <Text style={styles.corpo}>
          Status do passeio: {rotuloStatusPasseio(pet.statusPasseio)}
        </Text>
        <Text style={styles.corpo}>
          Última localização:{' '}
          {pet.local
            ? `Lat ${pet.local.latitude.toFixed(5)}, Lon ${pet.local.longitude.toFixed(5)} (±${Math.round(pet.local.precisaoMetros)}m)`
            : 'Nenhum registro de GPS ainda'}
        </Text>
      </View>

      {feedbackNotificacao ? (
        <View style={styles.caixaAviso}>
          <Text style={styles.textoAviso}>{feedbackNotificacao}</Text>
        </View>
      ) : null}

      <View style={styles.acoes}>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/foto-do-pet', params: { petId: pet.id } })
          }
          style={({ pressed }) => [styles.botaoAzul, pressed && styles.pressionado]}
        >
          <Text style={styles.textoBotaoAzul}>Alterar foto do pet (1:1)</Text>
        </Pressable>

        <Pressable
          onPress={() => alternarStatus(pet.id)}
          style={({ pressed }) => [styles.botaoSecundario, pressed && styles.pressionado]}
        >
          <Text style={styles.textoBotaoEscuro}>
            Alternar status ({pet.statusPasseio === 'concluido' ? 'marcar pendente' : 'marcar concluído'})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setRegistrandoPasseio(true)}
          style={({ pressed }) => [styles.botaoPrimario, pressed && styles.pressionado]}
        >
          <Text style={styles.textoBotaoClaro}>Registrar passeio com GPS/Câmera</Text>
        </Pressable>

        <Pressable
          onPress={handleAgendarLembrete}
          style={({ pressed }) => [styles.botaoAlerta, pressed && styles.pressionado]}
        >
          <Text style={styles.textoBotaoClaro}>Agendar lembrete de passeio (5s)</Text>
        </Pressable>

        <Pressable
          onPress={handleExcluir}
          style={({ pressed }) => [styles.botaoPerigo, pressed && styles.pressionado]}
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
    backgroundColor: cores.fundo,
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
    backgroundColor: cores.fundo,
  },
  foto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  fotoPlaceholder: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoPlaceholder: {
    ...tipografia.corpo,
    color: cores.textoFraco,
  },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: {
    ...tipografia.titulo,
    color: cores.primaria,
  },
  corpo: {
    ...tipografia.corpo,
    textTransform: 'capitalize',
  },
  caixaAviso: {
    backgroundColor: cores.azulSuave,
    borderWidth: 1,
    borderColor: cores.azulClaro,
    borderRadius: 10,
    padding: espaco.sm,
  },
  textoAviso: {
    ...tipografia.corpo,
    color: cores.azulTexto,
  },
  acoes: {
    gap: espaco.sm,
  },
  botaoPrimario: {
    backgroundColor: cores.primaria,
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoAzul: {
    backgroundColor: cores.azulSuave,
    borderWidth: 1,
    borderColor: cores.azulClaro,
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoSecundario: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoAlerta: {
    backgroundColor: cores.alerta,
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoPerigo: {
    backgroundColor: cores.erro,
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
    color: cores.azulTexto,
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  textoBotaoEscuro: {
    color: cores.texto,
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  pressionado: {
    opacity: 0.8,
  },
});