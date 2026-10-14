// ============================================================
// Prática 3 — Tela principal: lista de pets + registro de passeio
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Na Prática 2 esta tela mostrava um pet em destaque.
// Agora mostra uma lista de verdade com SectionList, toque
// interativo e registro de passeio com sensores.
//
// Restrições:
//   • Nenhuma ScrollView envolvendo a lista
//   • Nenhuma mutação de estado — toda mudança cria array novo
//   • Agrupamento e filtro moram em src/lib/, não aqui
//   • Sem useEffect para sensores (cleanup é assunto da Aula 6)
// ============================================================
import { useState } from 'react';
import { SectionList, type SectionListData, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Pet } from './src/types/pet';
import { PETS } from './src/data/pets';
import { agrupar, filtrarPorNome, type Secao } from './src/lib/agrupar';
import { ItemPet } from './src/components/item-pet';
import { ListaVazia } from './src/components/lista-vazia';
import { TelaRegistro } from './src/screens/tela-registro';
import { cores, espaco, layout, tipografia } from './src/theme';

// Simula a latência de uma recarga (o mock volta de imediato, mas o spinner precisa aparecer).
const ATRASO_RECARGA_MS = 800;

// Declarado FORA do componente: não depende de estado local, então não é
// recriado a cada render.
function renderCabecalhoSecao({ section }: { section: SectionListData<Pet, Secao> }) {
  return (
    <Text style={styles.cabecalhoSecao}>
      {section.title} ({section.data.length})
    </Text>
  );
}

export default function App() {
  const [pets, setPets] = useState<Pet[]>(PETS);
  const [busca, setBusca] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  // Guarda o ID do pet sendo registrado, ou null para mostrar a lista.
  const [petRegistrando, setPetRegistrando] = useState<string | null>(null);

  // Imutável: .map devolve array novo e o `{ ...p }` cria objeto novo.
  function alternarStatus(id: string) {
    setPets((anteriores) =>
      anteriores.map((p) =>
        p.id === id
          ? { ...p, statusPasseio: p.statusPasseio === 'concluido' ? 'pendente' : 'concluido' }
          : p,
      ),
    );
  }

  // Imutável: .filter devolve array novo.
  function removerPet(id: string) {
    setPets((anteriores) => anteriores.filter((p) => p.id !== id));
  }

  // Simula refresh: volta ao mock e limpa a busca.
  async function recarregar() {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, ATRASO_RECARGA_MS));
    setPets(PETS);
    setBusca('');
    setAtualizando(false);
  }

  // Recebe o resultado da TelaRegistro. Se o usuário negou tudo, `local` e `fotoUri`
  // chegam `undefined` e o pet continua com o que já tinha: o app não quebra.
  function handleRegistro(local?: Pet['local'], fotoUri?: string) {
    if (!petRegistrando) return;
    setPets((anteriores) =>
      anteriores.map((p) =>
        p.id === petRegistrando
          ? {
              ...p,
              statusPasseio: 'concluido',
              local: local ?? p.local,
              fotoUri: fotoUri ?? p.fotoUri,
            }
          : p,
      ),
    );
    setPetRegistrando(null);
  }

  // Renderização condicional (sem navegação): com um pet em registro, a tela
  // de registro substitui a lista.
  const petAlvo = pets.find((p) => p.id === petRegistrando);
  if (petAlvo) {
    return (
      <TelaRegistro
        pet={petAlvo}
        onSalvar={handleRegistro}
        onCancelar={() => setPetRegistrando(null)}
      />
    );
  }

  // Filtrar E DEPOIS agrupar: assim as seções já nascem sem os pets filtrados e
  // seção que ficou sem itens é descartada pelo `agrupar`. Se fosse o contrário,
  // agrupar trabalharia sobre pets que serão descartados em seguida.
  const secoes = agrupar(filtrarPorNome(pets, busca));

  return (
    <View style={styles.tela}>
      <SectionList<Pet, Secao>
        sections={secoes}
        // Chave estável pelo id do pet (nunca o índice): mudar de seção ou filtrar
        // não troca a identidade do item.
        keyExtractor={(item) => item.id}
        // Depende de estado local (os callbacks), então fica inline.
        renderItem={({ item }) => (
          <ItemPet
            pet={item}
            onAlternar={alternarStatus}
            onRemover={removerPet}
            onRegistrar={(id) => setPetRegistrando(id)}
          />
        )}
        renderSectionHeader={renderCabecalhoSecao}
        stickySectionHeadersEnabled
        // Primeiro acesso x busca sem resultado: o ListaVazia decide pelo termo.
        ListEmptyComponent={<ListaVazia termoBusca={busca} />}
        refreshing={atualizando}
        onRefresh={recarregar}
        // Para o toque na lista fechar o teclado sem "engolir" o primeiro toque no item.
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar pet por nome..."
              placeholderTextColor={cores.textoFraco}
              style={styles.busca}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
        }
        contentContainerStyle={styles.conteudo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    paddingTop: layout.topoTela,
    backgroundColor: cores.fundo,
  },
  // O recuo lateral vem do contentContainerStyle da lista; aqui só o respiro de baixo.
  cabecalho: {
    paddingBottom: espaco.sm,
  },
  // `gap` espaça cabeçalho, seções e itens — nunca margin em cada item.
  conteudo: {
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    paddingBottom: espaco.lg,
  },
  cabecalhoSecao: {
    ...tipografia.titulo,
    backgroundColor: cores.fundo, // opaco, para o header "grudado" cobrir os itens que sobem
    paddingVertical: espaco.sm,
  },
  busca: {
    ...tipografia.corpo,
    borderWidth: 1,
    borderColor: cores.textoFraco,
    borderRadius: espaco.sm,
    padding: espaco.sm,
    backgroundColor: cores.cartao,
  },
});