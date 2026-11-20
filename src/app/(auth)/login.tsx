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
import { loginUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';
import { espaco, tipografia } from '../../theme';

export default function TelaLogin() {
  const { tema } = useTheme();
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
    <KeyboardAvoidingView
      style={[styles.tela, { backgroundColor: tema.fundo }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.cabecalho, { backgroundColor: tema.primaria }]}>
          <Text style={styles.tituloMarca}>Pet Routine</Text>
          <Text style={[styles.subtituloMarca, { color: tema.azulClaro }]}>
            Entre na sua conta para gerenciar a rotina dos seus pets
          </Text>
        </View>

        <View
          style={[
            styles.cartao,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
          ]}
        >
          <Text style={[styles.tituloForm, { color: tema.primaria }]}>
            Acessar Conta
          </Text>

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
              placeholder="Sua senha"
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
            onPress={handleLogin}
            disabled={camposInvalidos || isLoading}
            style={({ pressed }) => [
              styles.botaoEntrar,
              { backgroundColor: tema.primaria },
              (camposInvalidos || isLoading) && styles.desabilitado,
              pressed && styles.pressionado,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FAF8F5" />
            ) : (
              <Text style={styles.textoBotaoClaro}>Entrar</Text>
            )}
          </Pressable>

          <Link
            href="/(auth)/signup"
            style={[
              styles.linkCadastro,
              {
                backgroundColor: tema.azulSuave,
                color: tema.azulTexto,
                borderColor: tema.azulClaro,
              },
            ]}
          >
            Não tem conta? Criar cadastro
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
  tituloForm: {
    ...tipografia.titulo,
    fontSize: 20,
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
  botaoEntrar: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoClaro: {
    color: '#FAF8F5',
    fontWeight: '700',
    fontSize: tipografia.corpo.fontSize,
  },
  linkCadastro: {
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