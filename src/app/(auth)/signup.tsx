import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { signupUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';
import {
  Badge,
  BadgeText,
  Button,
  ButtonSpinner,
  ButtonText,
  Card,
  Heading,
  Input,
  InputField,
  Text,
  VStack,
} from '../../components/ui/gluestack-ui';

export default function TelaCadastro() {
  const { tema } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camposInvalidos =
    name.trim() === '' || email.trim() === '' || password.trim().length < 4;

  async function handleSignup() {
    if (camposInvalidos || isLoading) {
      setError('Preencha nome, e-mail e uma senha com pelo menos 4 caracteres.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await signupUser(name, email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível concluir o cadastro.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.fundo }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.hero, { backgroundColor: tema.primaria }]}>
            <VStack space="xs">
              <Badge action="info">
                <BadgeText>NOVO TUTOR</BadgeText>
              </Badge>
              <Heading size="2xl" style={{ color: '#FAF8F5' }}>
                Criar Conta
              </Heading>
              <Text size="sm" style={{ color: tema.azulClaro, fontWeight: '600' }}>
                Sincronize seus pets, passeios e lembretes na nuvem.
              </Text>
            </VStack>
          </View>

          <Card variant="elevated">
            <VStack space="md">
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
                  <Text
                    size="sm"
                    className="font-semibold"
                    style={{ color: tema.erro }}
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              <VStack space="xs">
                <Text size="sm" className="font-semibold">
                  Nome completo
                </Text>
                <Input isDisabled={isLoading}>
                  <InputField
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Alessandra Barbosa"
                    editable={!isLoading}
                  />
                </Input>
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-semibold">
                  E-mail
                </Text>
                <Input isDisabled={isLoading}>
                  <InputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tutor@email.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </Input>
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-semibold">
                  Senha (mínimo 4 caracteres)
                </Text>
                <Input isDisabled={isLoading}>
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Crie uma senha segura"
                    secureTextEntry
                    editable={!isLoading}
                  />
                </Input>
              </VStack>

              <Button
                action="primary"
                size="lg"
                isDisabled={camposInvalidos || isLoading}
                onPress={handleSignup}
              >
                {isLoading ? <ButtonSpinner /> : null}
                <ButtonText>
                  {isLoading ? 'Criando conta...' : 'Cadastrar e Entrar'}
                </ButtonText>
              </Button>

              <Link
                href="/(auth)/login"
                style={[
                  styles.linkSecundario,
                  {
                    backgroundColor: tema.azulSuave,
                    color: tema.azulTexto,
                    borderColor: tema.azulClaro,
                  },
                ]}
              >
                Já tenho conta • Voltar para Login
              </Link>
            </VStack>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  hero: {
    borderRadius: 18,
    padding: 22,
  },
  caixaErro: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  linkSecundario: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 13,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
});