import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { signupUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';
import { espaco, tipografia } from '../../theme';

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
    <KeyboardAvoidingView
      style={[styles.tela, { backgroundColor: tema.fundo }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.cabecalho, { backgroundColor: tema.primaria }]}>
          <Text style={styles.tituloMarca}>Criar Conta</Text>
          <Text style={[styles.subtituloMarca, { color: tema.azulClaro }]}>
            Cadastre-se para sincronizar seus pets e passeios
          </Text>
        </View>

        <View
          style={[
            styles.cartao,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
          ]}
        >
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
              <Text style={[styles.textoErro, { color: tema.erro }]}>
                {error}
              </Text>
            </View>
          ) : null}

          <View style={styles.campo}>
            <Text style={[styles.rotulo, { color: tema.texto }]}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor={tema.textoFraco}
              editable={!isLoading}
              style={[
                styles.input,
                {
                  borderColor: tema.borda,
                  backgroundColor: tema.fundo,
                  color: tema.texto,
                },
              ]}
            />
          </View>

          <View style={styles.campo}>
            <Text style={[styles.rotulo, { color: tema.texto }]}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tutor@email.com"
              placeholderTextColor={tema.textoFraco}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
              style={[
                styles.input,
                {
                  borderColor: tema.borda,
                  backgroundColor: tema.fundo,
                  color: tema.texto,
                },
              ]}
            />
          </View>

          <View style={styles.campo}>
            <Text style={[styles.rotulo, { color: tema.texto }]}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 4 caracteres"
              placeholderTextColor={tema.textoFraco}
              secureTextEntry
              editable={!isLoading}
              style={[
                styles.input,
                {
                  borderColor: tema.borda,
                  backgroundColor: tema.fundo,
                  color: tema.texto,
                },
              ]}
            />
          </View>

          <Pressable
            onPress={handleSignup}
            disabled={camposInvalidos || isLoading}
            style={({ pressed }) => [
              styles.botaoCadastrar,
              { backgroundColor: tema.primaria },
              (camposInvalidos || isLoading) && styles.desabilitado,
              pressed && styles.pressionado,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FAF8F5" />
            ) : (
              <Text style={styles.textoBotaoClaro}>Cadastrar e Entrar</Text>
            )}
          </Pressable>

          <Link
            href="/(auth)/login"
            style={[
              styles.linkLogin,
              {
                backgroundColor: tema.azulSuave,
                color: tema.azulTexto,
                borderColor: tema.azulClaro,
              },
            ]}
          >
            Já tenho conta • Voltar para Login
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: espaco.lg,
    gap: espaco.lg,
  },
  cabecalho: {
    borderRadius: 16,
    padding: espaco.lg,
    gap: espaco.xs,
  },
  tituloMarca: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FAF8F5',
  },
  subtituloMarca: {
    ...tipografia.corpo,
    fontWeight: '600',
  },
  cartao: {
    borderRadius: 14,
    padding: espaco.lg,
    gap: espaco.md,
    borderWidth: 1,
  },
  caixaErro: {
    borderWidth: 1,
    borderRadius: 10,
    padding: espaco.sm,
  },
  textoErro: {
    ...tipografia.corpo,
    fontWeight: '600',
  },
  campo: {
    gap: espaco.xs,
  },
  rotulo: {
    ...tipografia.corpo,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: tipografia.corpo.fontSize,
  },
  botaoCadastrar: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoClaro: {
    color: '#FAF8F5',
    fontWeight: '700',
    fontSize: tipografia.corpo.fontSize,
  },
  linkLogin: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  desabilitado: {
    opacity: 0.45,
  },
  pressionado: {
    opacity: 0.8,
  },
});