import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import type { EspeciePet, Pet, PortePet } from '../types/pet';
import { agrupar, filtrarPorNome, type Secao } from '../lib/agrupar';
import { CardPet } from '../components/item-pet';
import { ListaVazia } from '../components/lista-vazia';
import { TelaRegistro } from './tela-registro';
import { usePetStore } from '../store/use-pet-store';
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
  Input,
  InputField,
  Text,
  VStack,
} from '../components/ui/gluestack-ui';

const ESPECIES: EspeciePet[] = ['cachorro', 'gato', 'ave', 'outro'];
const PORTES: PortePet[] = ['pequeno', 'medio', 'grande'];

export function TelaPets() {
  const router = useRouter();
  const { tema } = useTheme();
  const pets = usePetStore((state) => state.pets);
  const isLoading = usePetStore((state) => state.isLoading);
  const error = usePetStore((state) => state.error);
  const fetchPets = usePetStore((state) => state.fetchPets);
  const addPet = usePetStore((state) => state.addPet);
  const togglePasseio = usePetStore((state) => state.togglePasseio);
  const registrarPasseio = usePetStore((state) => state.registrarPasseio);

  const [busca, setBusca] = useState('');
  const [petRegistrando, setPetRegistrando] = useState<string | null>(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaEspecie, setNovaEspecie] = useState<EspeciePet>('cachorro');
  const [novoPorte, setNovoPorte] = useState<PortePet>('medio');
  const [novaIdade, setNovaIdade] = useState('12');

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  async function handleRegistro(local?: Pet['local'], fotoUri?: string) {
    if (!petRegistrando) return;
    try {
      await registrarPasseio(petRegistrando, local, fotoUri);
      setPetRegistrando(null);
    } catch {
      // Erro tratado na store
    }
  }

  async function handleCriarPet() {
    const nomeLimpo = novoNome.trim();
    if (!nomeLimpo) return;
    const idadeNumero = Math.max(1, Number.parseInt(novaIdade, 10) || 1);
    try {
      await addPet({
        nome: nomeLimpo,
        especie: novaEspecie,
        porte: novoPorte,
        idadeMeses: idadeNumero,
      });
      setNovoNome('');
      setNovaIdade('12');
      setMostrarForm(false);
    } catch {
      // Erro exibido no banner
    }
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

  const concluidos = pets.filter((p) => p.statusPasseio === 'concluido').length;
  const pendentes = pets.filter((p) => p.statusPasseio === 'pendente').length;
  const secoes = agrupar(filtrarPorNome(pets, busca));

  return (
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <SectionList<Pet, Secao>
        sections={secoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPet
            pet={item}
            onAbrirDetalhe={(id) =>
              router.push({ pathname: '/pet/[id]', params: { id } })
            }
            onAlternar={(id) => {
              togglePasseio(id).catch(() => {});
            }}
            onRegistrar={(id) => setPetRegistrando(id)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.secaoHeader,
              { backgroundColor: tema.fundo },
            ]}
          >
            <Heading size="md">{section.title}</Heading>
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <Card variant="outline">
              <VStack space="sm" className="items-center p-4">
                <ActivityIndicator size="large" color={tema.primaria} />
                <Text size="sm" muted>
                  Sincronizando pets com o servidor...
                </Text>
              </VStack>
            </Card>
          ) : (
            <ListaVazia termoBusca={busca} totalPets={pets.length} />
          )
        }
        stickySectionHeadersEnabled={true}
        refreshing={isLoading}
        onRefresh={fetchPets}
        ListHeaderComponent={
          <VStack space="md" style={styles.cabecalho}>
            <Card variant="filled">
              <HStack className="justify-between flex-wrap">
                <VStack space="xs">
                  <Text size="xs" muted className="uppercase font-bold">
                    Resumo Diário
                  </Text>
                  <Heading size="md">
                    {concluidos} de {pets.length} passeios feitos
                  </Heading>
                </VStack>
                <HStack space="xs">
                  <Badge action="success">
                    <BadgeText>{concluidos} ok</BadgeText>
                  </Badge>
                  <Badge action="warning">
                    <BadgeText>{pendentes} pend.</BadgeText>
                  </Badge>
                </HStack>
              </HStack>
            </Card>

            <HStack space="sm">
              <Button
                action="primary"
                className="flex-1"
                onPress={() => setMostrarForm((v) => !v)}
              >
                <ButtonText>
                  {mostrarForm ? 'Fechar Formulário' : '+ Novo Pet'}
                </ButtonText>
              </Button>

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
            </HStack>

            {error ? (
              <View
                style={[
                  styles.caixaErro,
                  {
                    backgroundColor: tema.primariaSuave,
                    borderColor: tema.primaria,
                  },
                ]}
              >
                <VStack space="xs">
                  <Text
                    size="sm"
                    className="font-semibold"
                    style={{ color: tema.erro }}
                  >
                    {error}
                  </Text>
                  <Pressable onPress={fetchPets}>
                    <Text
                      size="sm"
                      className="font-bold"
                      style={{ color: tema.azulTexto }}
                    >
                      Tentar novamente
                    </Text>
                  </Pressable>
                </VStack>
              </View>
            ) : null}

            {mostrarForm ? (
              <Card variant="elevated">
                <VStack space="md">
                  <Heading size="md">Cadastrar novo pet</Heading>

                  <VStack space="xs">
                    <Text size="sm" className="font-semibold">
                      Nome do pet
                    </Text>
                    <Input isDisabled={isLoading}>
                      <InputField
                        value={novoNome}
                        onChangeText={setNovoNome}
                        placeholder="Ex: Thor"
                      />
                    </Input>
                  </VStack>

                  <VStack space="xs">
                    <Text size="sm" className="font-semibold">
                      Espécie
                    </Text>
                    <HStack space="xs" className="flex-wrap">
                      {ESPECIES.map((esp) => {
                        const ativo = novaEspecie === esp;
                        return (
                          <Pressable
                            key={esp}
                            onPress={() => setNovaEspecie(esp)}
                            style={[
                              styles.chip,
                              {
                                borderColor: ativo
                                  ? tema.azulClaro
                                  : tema.borda,
                                backgroundColor: ativo
                                  ? tema.azulSuave
                                  : tema.fundo,
                              },
                            ]}
                          >
                            <Text
                              size="sm"
                              className="capitalize font-semibold"
                              style={{
                                color: ativo ? tema.azulTexto : tema.texto,
                              }}
                            >
                              {esp}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </HStack>
                  </VStack>

                  <VStack space="xs">
                    <Text size="sm" className="font-semibold">
                      Porte
                    </Text>
                    <HStack space="xs" className="flex-wrap">
                      {PORTES.map((prt) => {
                        const ativo = novoPorte === prt;
                        return (
                          <Pressable
                            key={prt}
                            onPress={() => setNovoPorte(prt)}
                            style={[
                              styles.chip,
                              {
                                borderColor: ativo
                                  ? tema.azulClaro
                                  : tema.borda,
                                backgroundColor: ativo
                                  ? tema.azulSuave
                                  : tema.fundo,
                              },
                            ]}
                          >
                            <Text
                              size="sm"
                              className="capitalize font-semibold"
                              style={{
                                color: ativo ? tema.azulTexto : tema.texto,
                              }}
                            >
                              {prt}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </HStack>
                  </VStack>

                  <VStack space="xs">
                    <Text size="sm" className="font-semibold">
                      Idade (meses)
                    </Text>
                    <Input isDisabled={isLoading}>
                      <InputField
                        value={novaIdade}
                        onChangeText={setNovaIdade}
                        keyboardType="numeric"
                        placeholder="12"
                      />
                    </Input>
                  </VStack>

                  <Button
                    action="primary"
                    isDisabled={novoNome.trim() === '' || isLoading}
                    onPress={handleCriarPet}
                  >
                    {isLoading ? <ButtonSpinner /> : null}
                    <ButtonText>
                      {isLoading ? 'Salvando...' : 'Salvar Pet'}
                    </ButtonText>
                  </Button>
                </VStack>
              </Card>
            ) : null}

            <Input>
              <InputField
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar pet por nome..."
              />
            </Input>
          </VStack>
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
    paddingTop: 12,
    paddingBottom: 6,
  },
  conteudo: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  secaoHeader: {
    paddingVertical: 8,
  },
  linkAcao: {
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 15,
  },
  caixaErro: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
});