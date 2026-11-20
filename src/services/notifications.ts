import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type ResultadoAgendamento =
  | { ok: true }
  | { ok: false; motivo: 'negada' | 'bloqueada' };

export async function agendarLembretePasseio(
  petId: string,
  nomePet: string
): Promise<ResultadoAgendamento> {
  const atual = await Notifications.getPermissionsAsync();
  let statusFinal = atual.status;
  let canAskAgain = atual.canAskAgain;

  if (statusFinal !== 'granted') {
    const pedida = await Notifications.requestPermissionsAsync();
    statusFinal = pedida.status;
    canAskAgain = pedida.canAskAgain;
  }

  if (statusFinal !== 'granted') {
    return {
      ok: false,
      motivo: canAskAgain ? 'negada' : 'bloqueada',
    };
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Hora do passeio de ${nomePet}! 🐾`,
      body: 'Toque para abrir os detalhes e registrar o passeio.',
      data: { petId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });

  return { ok: true };
}