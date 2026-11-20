import { useState } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import type { EspeciePet, Pet, PortePet } from '../types/pet';
import { agrupar, filtrarPorNome, type Secao } from '../lib/agrupar';
import { ItemPet } from '../components/item-pet';
import { ListaVazia } from '../components/lista-vazia';
import { TelaRegistro } from './tela-registro';
import { usePetStore } from '../store/use-pet-store';
import { useTheme } from '../context/theme-context';
import { espaco, tipografia } from '../theme';

const ESPECIES: EspeciePet[] = ['cachorro', 'gato', 'ave', 'outro'];
const PORTES: PortePet[] = ['pequeno', 'medio', 'grande'];

export function TelaPets() {
  const router = useRouter();
  const { tema } = useTheme();
  const pets = usePetStore((state) => state.pets);
  const adicionarPet = usePetStore((state) => state.adicionarPet);
  const alternarStatus = usePetStore((state) => state.alternarStatus);
  const registrarPasseio = usePetStore((state) => state.registrarPasseio);
  const recarregarMock = usePetStore((state) => state.recarregarMock);

  const [busca, setBusca] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [petRegistrando, setPetRegistrando] = useState<string | null>(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaEspecie, setNovaEspecie] = useState<EspeciePet>('cachorro');
  const [novoPorte, setNovoPorte] = useState<PortePet>('medio');
  const [novaIdade, setNovaIdade] = useState('12');

  async function recarregar() {
    setAtualizando(true);
    await new Promise((r) => setTimeout(r, 500));
    recarregarMock();
    setBusca('');
    setAtualizando(false);
  }

  function handleRegistro(local?: Pet['local'], fotoUri?: string) {
    if (!petRegistrando) return;
    registrarPasseio(petRegistrando, local, fotoUri);
    setPetRegistrando(null);
  }

  function handleCriarPet() {
    const nomeLimpo = novoNome.trim();
    if (!nomeLimpo) return;
    const idadeNumero = Math.max(1, Number.parseInt(novaIdade, 10) || 1);
    adicionarPet({
      nome: nomeLimpo,
      especie: novaEspecie,
      porte: novoPorte,
      idadeMeses: idadeNumero,
    });
    setNovoNome('');
    setNovaIdade('12');
    setMostrarForm(false);
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
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <SectionList<Pet, Secao>
        sections={secoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemPet
            pet={item}
            onAbrirDetalhe={(id) =>
              router.push({ pathname: '/pet/[id]', params: { id } })
            }
            onAlternar={alternarStatus}
            onRegistrar={(id) => setPetRegistrando(id)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text
            style={[
              styles.cabecalhoSecao,
              { color: tema.primaria, backgroundColor: tema.fundo },
            ]}
          >
            {section.title}
          </Text>
        )}
        ListEmptyComponent={
          <ListaVazia termoBusca={busca} totalPets={pets.length} />
        }
        stickySectionHeadersEnabled={true}
        refreshing={atualizando}
        onRefresh={recarregar}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <View style={styles.barraTopo}>
              <Pressable
                onPress={() => setMostrarForm((v) => !v)}
                style={({ pressed }) => [
                  styles.botaoNovo,
                  { backgroundColor: tema.primaria },
                  pressed && styles.pressionado,
                ]}
              >
                <Text style={styles.textoBotaoNovo}>
                  {mostrarForm ? 'Fechar formulário' : '+ Novo Pet'}
                </Text>
              </Pressable>

              <Link
                href="/foto-do-pet"
                style={[
                  styles.linkAcao,
                  {
                    backgroundColor: tema.azulSuave,
                    color: tema.azulTexto,
                    borderColor: tema.azulClaro,
                  },
                ]}
              >
                Foto 1:1
              </Link>
            </View>

            {mostrarForm ? (
              <View
                style={[
                  styles.cartaoForm,
                  { backgroundColor: tema.cartao, borderColor: tema.borda },
                ]}
              >
                <Text style={[styles.tituloForm, { color: tema.primaria }]}>
                  Cadastrar novo pet
                </Text>
                <TextInput
                  value={novoNome}
                  onChangeText={setNovoNome}
                  placeholder="Nome do pet (ex: Thor)"
                  placeholderTextColor={tema.textoFraco}
                  style={[
                    styles.busca,
                    {
                      borderColor: tema.borda,
                      color: tema.texto,
                      backgroundColor: tema.fundo,
                    },
                  ]}
                />

                <Text style={[styles.rotulo, { color: tema.texto }]}>Espécie</Text>
                <View style={styles.linhaOpcoes}>
                  {ESPECIES.map((esp) => {
                    const ativo = novaEspecie === esp;
                    return (
                      <Pressable
                        key={esp}
                        onPress={() => setNovaEspecie(esp)}
                        style={[
                          styles.chip,
                          {
                            borderColor: ativo ? tema.azulClaro : tema.borda,
                            backgroundColor: ativo ? tema.azulSuave : tema.fundo,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.textoChip,
                            { color: ativo ? tema.azulTexto : tema.texto },
                            ativo && styles.textoChipAtivo,
                          ]}
                        >
                          {esp}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.rotulo, { color: tema.texto }]}>Porte</Text>
                <View style={styles.linhaOpcoes}>
                  {PORTES.map((prt) => {
                    const ativo = novoPorte === prt;
                    return (
                      <Pressable
                        key={prt}
                        onPress={() => setNovoPorte(prt)}
                        style={[
                          styles.chip,
                          {
                            borderColor: ativo ? tema.azulClaro : tema.borda,
                            backgroundColor: ativo ? tema.azulSuave : tema.fundo,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.textoChip,
                            { color: ativo ? tema.azulTexto : tema.texto },
                            ativo && styles.textoChipAtivo,
                          ]}
                        >
                          {prt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.rotulo, { color: tema.texto }]}>
                  Idade (meses)
                </Text>
                <TextInput
                  value={novaIdade}
                  onChangeText={setNovaIdade}
                  keyboardType="numeric"
                  placeholder="12"
                  placeholderTextColor={tema.textoFraco}
                  style={[
                    styles.busca,
                    {
                      borderColor: tema.borda,
                      color: tema.texto,
                      backgroundColor: tema.fundo,
                    },
                  ]}
                />

                <Pressable
                  onPress={handleCriarPet}
                  disabled={novoNome.trim() === ''}
                  style={({ pressed }) => [
                    styles.botaoSalvar,
                    { backgroundColor: tema.primaria },
                    novoNome.trim() === '' && styles.botaoDesabilitado,
                    pressed && styles.pressionado,
                  ]}
                >
                  <Text style={styles.textoBotaoNovo}>Salvar Pet</Text>
                </Pressable>
              </View>
            ) : null}

            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar pet por nome..."
              placeholderTextColor={tema.textoFraco}
              style={[
                styles.busca,
                {
                  borderColor: tema.borda,
                  color: tema.texto,
                  backgroundColor: tema.cartao,
                },
              ]}
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
  },
  cabecalho: {
    gap: espaco.sm,
    paddingTop: espaco.sm,
    paddingBottom: espaco.sm,
  },
  barraTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaco.sm,
  },
  botaoNovo: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  botaoSalvar: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },
  textoBotaoNovo: {
    color: '#FAF8F5',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  linkAcao: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    overflow: 'hidden',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  cartaoForm: {
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
  },
  tituloForm: {
    ...tipografia.titulo,
    fontSize: 16,
  },
  rotulo: {
    ...tipografia.corpo,
    fontWeight: '600',
  },
  linhaOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  textoChip: {
    ...tipografia.corpo,
    textTransform: 'capitalize',
  },
  textoChipAtivo: {
    fontWeight: '700',
  },
  conteudo: {
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    paddingBottom: espaco.lg,
  },
  cabecalhoSecao: {
    ...tipografia.titulo,
    fontSize: 18,
    paddingVertical: espaco.sm,
  },
  busca: {
    borderWidth: 1,
    borderRadius: 10,
    padding: espaco.sm,
    fontSize: tipografia.corpo.fontSize,
  },
  pressionado: {
    opacity: 0.8,
  },
});