import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { loginUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';
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
} from '../../components/ui/gluestack-ui';

export default function TelaLogin() {
  const { tema, isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camposInvalidos = email.trim() === '' || password.trim() === '';

  async function handleLogin() {
    if (camposInvalidos || isLoading) {
      setError('Preencha o e-mail e a senha para entrar.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível realizar o login. Verifique suas credenciais.'
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
          <HStack className="justify-between">
            <Badge action="info">
              <BadgeText>PET ROUTINE • v1.0</BadgeText>
            </Badge>
            <Pressable
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel="Alternar tema"
              style={[
                styles.botaoTema,
                { backgroundColor: tema.cartao, borderColor: tema.borda },
              ]}
            >
              <Feather
                name={isDark ? 'sun' : 'moon'}
                size={16}
                color={tema.primaria}
              />
              <Text size="xs" className="font-semibold">
                {isDark ? 'Modo Claro' : 'Modo Escuro'}
              </Text>
            </Pressable>
          </HStack>

          <View style={[styles.hero, { backgroundColor: tema.primaria }]}>
            <VStack space="xs">
              <Heading size="2xl" style={{ color: '#FAF8F5' }}>
                Pet Routine
              </Heading>
              <Text size="sm" style={{ color: tema.azulClaro, fontWeight: '600' }}>
                Cuidado diário, passeios com GPS e histórico completo do seu pet.
              </Text>
            </VStack>
          </View>

          <Card variant="elevated">
            <VStack space="md">
              <VStack space="xs">
                <Heading size="lg">Entrar na conta</Heading>
                <Text size="sm" muted>
                  Use o e-mail e senha cadastrados para sincronizar sua rotina.
                </Text>
              </VStack>

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
                  Senha
                </Text>
                <Input isDisabled={isLoading}>
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    editable={!isLoading}
                  />
                </Input>
              </VStack>

              <Button
                action="primary"
                size="lg"
                isDisabled={camposInvalidos || isLoading}
                onPress={handleLogin}
              >
                {isLoading ? <ButtonSpinner /> : null}
                <ButtonText>{isLoading ? 'Entrando...' : 'Entrar'}</ButtonText>
              </Button>

              <Link
                href="/(auth)/signup"
                style={[
                  styles.linkSecundario,
                  {
                    backgroundColor: tema.azulSuave,
                    color: tema.azulTexto,
                    borderColor: tema.azulClaro,
                  },
                ]}
              >
                Não tem conta? Criar cadastro
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
  botaoTema: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
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