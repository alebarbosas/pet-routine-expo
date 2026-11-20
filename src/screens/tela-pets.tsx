import { useState } from 'react';
import { SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';

import type { Pet } from '../types/pet';
import { PETS } from '../data/pets';
import { agrupar, filtrarPorNome, type Secao } from '../lib/agrupar';
import { ItemPet } from '../components/item-pet';
import { ListaVazia } from '../components/lista-vazia';
import { TelaRegistro } from './tela-registro';
import { cores, espaco, tipografia } from '../theme';

export function TelaPets() {
  const [pets, setPets] = useState<Pet[]>(PETS);
  const [busca, setBusca] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [petRegistrando, setPetRegistrando] = useState<string | null>(null);

  function alternarStatus(id: string) {
    setPets((anteriores) =>
      anteriores.map((p) =>
        p.id === id
          ? { ...p, statusPasseio: p.statusPasseio === 'concluido' ? 'pendente' : 'concluido' }
          : p
      )
    );
  }

  function removerPet(id: string) {
    setPets((anteriores) => anteriores.filter((p) => p.id !== id));
  }

  async function recarregar() {
    setAtualizando(true);
    await new Promise((r) => setTimeout(r, 800));
    setPets(PETS);
    setBusca('');
    setAtualizando(false);
  }

  function handleRegistro(local?: Pet['local'], fotoUri?: string) {
    if (!petRegistrando) return;
    setPets((anteriores) =>
      anteriores.map((p) =>
        p.id === petRegistrando
          ? { ...p, statusPasseio: 'concluido' as const, local, fotoUri }
          : p
      )
    );
    setPetRegistrando(null);
  }

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

  const secoes = agrupar(filtrarPorNome(pets, busca));

  return (
    <View style={styles.tela}>
      <SectionList<Pet, Secao>
        sections={secoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemPet
            pet={item}
            onAlternar={alternarStatus}
            onRemover={removerPet}
            onRegistrar={(id) => setPetRegistrando(id)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.cabecalhoSecao}>{section.title}</Text>
        )}
        ListEmptyComponent={<ListaVazia termoBusca={busca} />}
        stickySectionHeadersEnabled={true}
        refreshing={atualizando}
        onRefresh={recarregar}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <View style={styles.barraLinks}>
              <Link href="/foto-do-pet" style={styles.linkAcao}>
                Foto do Pet (1:1)
              </Link>
              <Link href="/sobre" style={styles.linkAcao}>
                Sobre o App
              </Link>
            </View>
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar pet por nome..."
              style={styles.busca}
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
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    paddingTop: espaco.sm,
    paddingBottom: espaco.sm,
  },
  barraLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espaco.sm,
  },
  linkAcao: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  conteudo: {
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    paddingBottom: espaco.lg,
  },
  cabecalhoSecao: {
    ...tipografia.titulo,
    backgroundColor: cores.fundo,
    paddingVertical: espaco.sm,
    paddingHorizontal: espaco.md,
  },
  busca: {
    borderWidth: 1,
    borderColor: cores.textoFraco,
    borderRadius: espaco.sm,
    padding: espaco.sm,
    fontSize: tipografia.corpo.fontSize,
    backgroundColor: cores.cartao,
  },
});
