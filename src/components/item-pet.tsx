import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import {
  rotuloEspecie,
  rotuloStatusPasseio,
  type Pet,
  type StatusPasseio,
} from '../types/pet';
import { useTheme } from '../context/theme-context';
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
} from './ui/gluestack-ui';

export type ItemPetProps = {
  pet: Pet;
  onAbrirDetalhe: (id: string) => void;
  onAlternar: (id: string) => void;
  onRegistrar: (id: string) => void;
};

function acaoBadgeStatus(status: StatusPasseio): BadgeAction {
  if (status === 'concluido') return 'success';
  if (status === 'cancelado') return 'error';
  return 'warning';
}

export function ItemPet({
  pet,
  onAbrirDetalhe,
  onAlternar,
  onRegistrar,
}: ItemPetProps) {
  const { tema } = useTheme();
  const inicial = pet.nome.trim().charAt(0).toUpperCase() || 'P';

  return (
    <Card variant="elevated">
      <VStack space="md">
        <Pressable
          onPress={() => onAbrirDetalhe(pet.id)}
          accessibilityRole="button"
          accessibilityLabel={`Abrir detalhes de ${pet.nome}`}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <HStack space="md" className="items-start">
            {pet.fotoUri ? (
              <Image
                source={{ uri: pet.fotoUri }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    backgroundColor: tema.primariaSuave,
                    borderColor: tema.primaria,
                  },
                ]}
              >
                <Heading size="md">{inicial}</Heading>
              </View>
            )}

            <VStack space="xs" className="flex-1">
              <HStack className="justify-between flex-wrap">
                <Heading size="md">{pet.nome}</Heading>
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

              <Text size="xs" muted>
                {pet.local
                  ? `GPS: ${pet.local.latitude.toFixed(4)}, ${pet.local.longitude.toFixed(4)}`
                  : 'Toque para abrir cronômetro, histórico e detalhes'}
              </Text>
            </VStack>
          </HStack>
        </Pressable>

        <HStack space="sm">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onPress={() => onAlternar(pet.id)}
          >
            <ButtonText>
              {pet.statusPasseio === 'concluido' ? 'Reabrir' : 'Concluir'}
            </ButtonText>
          </Button>

          <Button
            action="secondary"
            size="sm"
            className="flex-1"
            onPress={() => onRegistrar(pet.id)}
          >
            <ButtonText>Registrar Passeio</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
}

export const CardPet = ItemPet;

const styles = StyleSheet.create({
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 62,
    height: 62,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});