import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import type { Pet } from '../types/pet';
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
} from '../components/ui/gluestack-ui';

export type TelaRegistroProps = {
  pet: Pet;
  onSalvar: (local?: Pet['local'], fotoUri?: string) => void | Promise<void>;
  onCancelar: () => void;
};

export function TelaRegistro({
  pet,
  onSalvar,
  onCancelar,
}: TelaRegistroProps) {
  const { tema } = useTheme();
  const [local, setLocal] = useState<Pet['local']>(pet.local);
  const [fotoUri, setFotoUri] = useState<string | undefined>(pet.fotoUri);
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function capturarLocalizacao() {
    setErro(null);
    setBuscandoGps(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        setErro(
          'Permissão de localização negada. Libere o GPS nas configurações.'
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocal({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        precisaoMetros: pos.coords.accuracy ?? 15,
      });
    } catch {
      setErro('Não foi possível obter a localização GPS atual.');
    } finally {
      setBuscandoGps(false);
    }
  }

  async function capturarFoto() {
    setErro(null);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setErro(
        'Permissão da câmera negada. Autorize a câmera para fotografar o passeio.'
      );
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!res.canceled) {
      setFotoUri(res.assets[0].uri);
    }
  }

  async function confirmarRegistro() {
    if (salvando) return;
    setSalvando(true);
    try {
      await onSalvar(local, fotoUri);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.fundo }]}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Card variant="elevated">
          <VStack space="md">
            <HStack className="justify-between">
              <Heading size="lg">Registrar Passeio</Heading>
              <Badge action="info">
                <BadgeText>{pet.nome}</BadgeText>
              </Badge>
            </HStack>

            <Text size="sm" muted>
              Capture a posição GPS e uma foto do passeio para marcar como
              concluído.
            </Text>

            {erro ? (
              <View
                style={[
                  styles.caixaErro,
                  {
                    backgroundColor: tema.primariaSuave,
                    borderColor: tema.primaria,
                  },
                ]}
              >
                <Text size="sm" style={{ color: tema.erro }}>
                  {erro}
                </Text>
              </View>
            ) : null}

            <Card variant="filled">
              <VStack space="xs">
                <Text size="sm" className="font-semibold">
                  Coordenadas GPS
                </Text>
                <Text size="sm" muted>
                  {local
                    ? `Lat ${local.latitude.toFixed(5)}, Lon ${local.longitude.toFixed(5)} (±${Math.round(local.precisaoMetros)}m)`
                    : 'Nenhuma coordenada capturada ainda'}
                </Text>
              </VStack>
            </Card>

            <Button
              action="secondary"
              isDisabled={buscandoGps}
              onPress={capturarLocalizacao}
            >
              {buscandoGps ? <ButtonSpinner /> : null}
              <ButtonText>
                {buscandoGps
                  ? 'Obtendo localização...'
                  : 'Capturar Localização GPS'}
              </ButtonText>
            </Button>

            {fotoUri ? (
              <Image
                source={{ uri: fotoUri }}
                style={styles.previa}
                contentFit="cover"
              />
            ) : null}

            <Button variant="outline" onPress={capturarFoto}>
              <ButtonText>
                {fotoUri ? 'Tirar Nova Foto (1:1)' : 'Fotografar Passeio (1:1)'}
              </ButtonText>
            </Button>

            <HStack space="sm">
              <Button
                variant="outline"
                className="flex-1"
                isDisabled={salvando}
                onPress={onCancelar}
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>

              <Button
                action="positive"
                className="flex-1"
                isDisabled={salvando}
                onPress={confirmarRegistro}
              >
                {salvando ? <ButtonSpinner /> : null}
                <ButtonText>
                  {salvando ? 'Salvando...' : 'Confirmar Passeio'}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  conteudo: {
    padding: 16,
  },
  caixaErro: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  previa: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
});