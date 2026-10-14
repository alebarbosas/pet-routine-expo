# Auditoria — TelaPasseio

## 1. Problemas de permissão

| # | Sintoma para o usuário | Causa no código | Correção |
|---|---|---|---|
| 1 | Nega a permissão de localização e o botão "Iniciar passeio" simplesmente não faz nada; nenhuma mensagem aparece (e em desenvolvimento surge um erro vermelho) | `requestForegroundPermissionsAsync()` devolve `{ status, canAskAgain }`, mas o resultado é **ignorado**; o código segue para `getCurrentPositionAsync`, que lança exceção sem permissão e não há `try/catch` | Ler o retorno; se `!granted`, mostrar mensagem e parar antes de ler a posição; envolver tudo em `try/catch` |
| 2 | Nega uma vez, toca de novo e o app nunca mais pergunta (e também não explica por quê) | A variável de módulo `jaPediuPermissao` vira `true` após a **primeira tentativa**, mesmo que o usuário tenha negado; as seguintes pulam o pedido | Remover a variável; consultar `getForegroundPermissionsAsync()` (o sistema já sabe o estado) e pedir só quando `status` for indeterminado e `canAskAgain` for `true` |
| 3 | Com o GPS do aparelho desligado, o toque não faz nada e a mensagem genérica "Erro ao obter localização" nunca aparece | Não há `hasServicesEnabledAsync()`; e o `setErro` fica **depois** das chamadas, num `if (!posicao)` que nunca é verdadeiro (`getCurrentPositionAsync` lança erro, não devolve vazio) | Checar o serviço antes e mostrar mensagem própria; tratar o erro no `catch` |
| 4 | Permissão negada com "não perguntar de novo" (bloqueada) é tratada igual à negada comum: o usuário não sabe que precisa ir às configurações | Não existe distinção entre `canAskAgain: true` e `false`: são três situações (negada, bloqueada, serviço desligado) com a mesma resposta: nenhuma | Três mensagens distintas; na bloqueada, botão `Linking.openSettings()` |
| 5 | Em build de produção no iOS, o app pode fechar ao pedir localização, ou o prompt não mostra o motivo | *Não aparece no trecho:* o `app.json` precisa da configuração do plugin `expo-location` (texto de uso da localização). No Expo Go funciona, o que esconde o problema | Conferir `locationWhenInUsePermission` no plugin `expo-location` do `app.json` antes de gerar o build |

## 2. Vazamentos

Duas "torneiras" ficam abertas e **nunca** são fechadas:

- `Location.watchPositionAsync(...)` devolve uma *subscription* (uma promessa de) que o código **descarta**: não há `remove()`. O GPS continua ligado enquanto o app estiver vivo, mesmo depois de sair da tela.
- `Accelerometer.addListener(...)` também devolve uma subscription descartada, sem `remove()`; o sensor continua entregando leituras.

Consequências: a bateria descarrega com o GPS e o acelerômetro ativos sem necessidade (e o ícone de localização fica aceso no sistema); a memória cresce porque `registros` só aumenta e cada callback guarda referência ao estado; callbacks tentam `setState` em tela já desmontada.

**Cinco toques em "Iniciar passeio"** abrem **5 `watchPositionAsync`** e **5 listeners do acelerômetro** (mais 5 chamadas extras de `getCurrentPositionAsync`). Como não há guarda contra repetição, cada posição nova é entregue 5 vezes: a lista ganha **5 registros por posição** (e 5 chamadas de `reverseGeocodeAsync`), e o contador de "passos" sobe **5 vezes mais rápido**. Os efeitos se multiplicam a cada toque.

## 3. Consumo de bateria

1. **`Accuracy.BestForNavigation` e `Accuracy.Highest`.** São modos para navegação passo a passo (GPS no máximo, combinando sensores). Para registrar pontos de um passeio, `Balanced` ou `High` bastam. Usaria `Balanced` no acompanhamento contínuo e `High` só numa leitura única.
2. **`watchPositionAsync` sem `distanceInterval`/`timeInterval`, com `reverseGeocodeAsync` a cada fix.** Sem intervalo o sistema entrega posição o mais rápido que puder (cerca de 1 por segundo), e cada uma dispara uma consulta de geocodificação inversa (rede, limitada pelos provedores). Usaria `distanceInterval` (ex.: 20–50 m) e `timeInterval` e faria o geocode só quando o usuário pedir ou a cada N metros. Também é redundante chamar `getCurrentPositionAsync` e depois `watchPositionAsync`: o watch já entrega a primeira posição.
3. **`Accelerometer.setUpdateInterval(16)`**: 16 ms são ~60 leituras por segundo, chamando JavaScript o tempo todo, para contar passos que acontecem ~2 vezes por segundo. Usaria um intervalo bem maior se continuasse com o acelerômetro (100–200 ms) — mas o ideal é trocar de sensor (seção 4).

## 4. O uso errado de sensor

O **acelerômetro** está sendo usado como **contador de passos** (`if (x > 1.5) setPassos(n => n + 1)`). Ele mede **aceleração**, em unidades de *g* e **inclui a gravidade**, no eixo `x` do aparelho; não detecta passos. Não funciona porque:

- Cada passo gera **várias** leituras acima de 1,5 a 60 Hz, então um único passo é contado várias vezes (e um balanço de mão ou uma freada de carro também contam).
- O eixo `x` depende de como o celular está orientado (no bolso, na mão, deitado): o mesmo passo dá valores totalmente diferentes.
- O limiar fixo de 1,5 não se adapta a ritmo, peso do tutor ou do pet, nem filtra ruído.

O autor provavelmente queria **contar passos do passeio**. O sensor certo é o **`Pedometer`** do `expo-sensors` (`Pedometer.isAvailableAsync()` e `Pedometer.watchStepCount`), que usa o contador de passos do hardware (baixo consumo, algoritmo do sistema). Ele pede permissão de atividade física/movimento no Android e no iOS e também precisa de `remove()` na subscription.

## 5. Os defeitos de imagem

1. **`fotoUrl` fixa e remota (`picsum.photos/seed/passeio/...`)** para todos os registros: o "registro do passeio" mostra a mesma foto de banco de imagens, não o que foi capturado. Sem internet o espaço fica vazio e não há tratamento de erro nem placeholder; além de baixar uma imagem de 600×400 para exibir 140 px de altura. O dado do registro devia ser a foto tirada no aparelho (um `uri` local).
2. **`Image` do `react-native`, com `resizeMode`**, em vez de `expo-image` com `contentFit`: sem cache em disco controlado, sem `placeholder`/`transition`, sem `recyclingKey` na lista. Ao rolar o `FlatList`, as fotos "piscam" e podem aparecer trocadas ao reaproveitar células, e cada exibição pode voltar à rede.

(Relacionado, fora da imagem: `{item.lat}, {item.lon}` mostra a coordenada crua com 14 casas decimais, que não é informação para o usuário; falta formatar e mostrar a precisão.)

## 6. Ordem de correção — tenho meio dia

Critério: **impacto no usuário por hora de trabalho**.

1. **`try/catch` + ler o retorno da permissão + remover `jaPediuPermissao` (problemas 1–3), ~45 min.** Hoje o botão principal falha em silêncio quando algo dá errado; é a primeira coisa que qualquer pessoa que negue a permissão vê. Baixíssimo custo.
2. **Guardar e fechar as subscriptions e impedir início duplicado (seção 2), ~1 h.** Para o fluxo de iniciar/parar: estado `ativo`, desabilitar o botão, `remove()` no "parar" e ao sair da tela. Elimina duplicação de registros e o consumo de bateria contínuo; é o bug mais caro em campo.
3. **Mensagens distintas (negada, bloqueada, serviço desligado) + `openSettings` (problema 4), ~45 min.** Torna a falha recuperável pelo próprio usuário.
4. **Ajustar bateria (seção 3): accuracy, `distanceInterval`/`timeInterval`, tirar o `getCurrentPosition` redundante e o geocode por fix, ~30 min.** São mudanças de parâmetros, com ganho direto de bateria.
5. **Trocar `Image` por `expo-image` e usar a foto real (seção 5), ~45 min.** Visível na lista, mas não quebra o fluxo de permissão/GPS.
6. **Formatar coordenadas (item extra da seção 5), ~10 min.** Barato.
7. **Conferir o plugin do `expo-location` no `app.json` (problema 5), ~15 min.** Fica antes do primeiro build de produção; para quem usa Expo Go não aparece.

## 7. O que eu decidi NÃO corrigir

**A troca do acelerômetro pelo `Pedometer` (seção 4)**, que não cabe em meio dia: exige nova permissão em dois sistemas, testes em aparelho físico (simuladores não têm o sensor), tratamento de indisponibilidade e de bloqueio e novo ciclo de inscrição/encerramento. Enquanto isso, a correção segura e barata é **esconder o contador "Passos"** para não mostrar um número errado como se fosse verdade, e abrir uma tarefa separada para migrar para `Pedometer`. Também deixo para depois limitar o tamanho de `registros` (crescimento da lista), que é um ajuste de produto a ser discutido, não um defeito de permissão ou de sensor.