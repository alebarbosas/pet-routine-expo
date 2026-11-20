import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/theme-context';
import { espaco, tipografia } from '../theme';

type WalkTimerProps = {
  onSalvarSessao: (seconds: number) => Promise<void> | void;
};

export function formatarDuracao(totalSegundos: number): string {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

export function WalkTimer({ onSalvarSessao }: WalkTimerProps) {
  const { tema } = useTheme();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  async function handleSalvar() {
    if (seconds === 0 || salvando) return;
    setIsRunning(false);
    setSalvando(true);
    try {
      await onSalvarSessao(seconds);
      setSeconds(0);
    } finally {
      setSalvando(false);
    }
  }

  function handleZerar() {
    setIsRunning(false);
    setSeconds(0);
  }

  return (
    <View
      style={[
        styles.cartao,
        { backgroundColor: tema.cartao, borderColor: tema.borda },
      ]}
    >
      <Text style={[styles.titulo, { color: tema.primaria }]}>
        Cronômetro de Passeio
      </Text>

      <View
        style={[
          styles.visor,
          { backgroundColor: tema.azulSuave, borderColor: tema.azulClaro },
        ]}
      >
        <Text style={[styles.tempo, { color: tema.azulTexto }]}>
          {formatarDuracao(seconds)}
        </Text>
        <Text style={[styles.statusTexto, { color: tema.textoFraco }]}>
          {isRunning ? 'Passeio em andamento...' : 'Pronto para iniciar ou pausado'}
        </Text>
      </View>

      <View style={styles.linhaBotoes}>
        <Pressable
          onPress={() => setIsRunning((ativo) => !ativo)}
          style={({ pressed }) => [
            styles.botao,
            { backgroundColor: isRunning ? tema.alerta : tema.primaria },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotaoClaro}>
            {isRunning ? 'Pausar' : seconds > 0 ? 'Retomar' : 'Iniciar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleZerar}
          disabled={seconds === 0 && !isRunning}
          style={({ pressed }) => [
            styles.botaoSecundario,
            { backgroundColor: tema.superficie, borderColor: tema.borda },
            seconds === 0 && !isRunning && styles.desabilitado,
            pressed && styles.pressionado,
          ]}
        >
          <Text style={[styles.textoBotaoSecundario, { color: tema.texto }]}>
            Zerar
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={handleSalvar}
        disabled={seconds === 0 || salvando}
        style={({ pressed }) => [
          styles.botaoSalvar,
          { backgroundColor: tema.sucesso },
          (seconds === 0 || salvando) && styles.desabilitado,
          pressed && styles.pressionado,
        ]}
      >
        <Text style={styles.textoBotaoClaro}>
          {salvando ? 'Salvando no SQLite...' : 'Registrar Sessão no Histórico'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
  },
  titulo: {
    ...tipografia.titulo,
    fontSize: 17,
  },
  visor: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: espaco.md,
    alignItems: 'center',
    gap: espaco.xs,
  },
  tempo: {
    fontSize: 34,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statusTexto: {
    ...tipografia.legenda,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: espaco.sm,
  },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoSecundario: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  botaoSalvar: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoClaro: {
    color: '#FAF8F5',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  textoBotaoSecundario: {
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