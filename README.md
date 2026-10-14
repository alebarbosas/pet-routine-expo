# Pet Routine Expo

**Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
**Branch:** `feature/ads025_2026-2`

## Sobre o projeto

App de Gestão e Rotina Pet: um aplicativo para tutores de animais de estimação organizarem a rotina, passeios e histórico de saúde dos pets.

Este projeto é usado nas atividades guiadas e aplicadas da disciplina ao longo do semestre. Cada aula adiciona uma camada nova por cima da anterior — o histórico de commits desta branch é, em si, um registro do progresso.

## Estado atual (Aula 1)

Scaffold inicial gerado com Expo (`create-expo-app`, template `blank-typescript`). Nenhuma tela ou modelagem de domínio foi implementada ainda — isso é propositalmente deixado para as próximas aulas. Veja os comentários `TODO` em `App.tsx`.

## Como rodar

```bash
npm install
npx expo start
```

Abra o app **Expo Go** no celular e escaneie o QR code (ou use um emulador). Requisito: **Node.js 22.11+**.

## Práticas da Aula 1

Os esqueletos das práticas de `PRATICA.md` já estão no repositório. Cada `TODO Px.y` no código corresponde a um item do enunciado — resolva na ordem.

| Prática | Arquivo | Escopo |
|---|---|---|
| 1 — Modelagem do domínio Pet | `src/types/pet.ts` | TypeScript puro |
| 2 — Serviço mockado | `src/services/petService.ts` | TypeScript puro |
| 2 — Estado de tela | `src/tela-pet.ts` | TypeScript puro |
| 3 — Relatório de plataforma | `docs/pratica-03-relatorio-plataforma.md` | Texto |
| 4 — Material desatualizado *(bônus)* | `docs/pratica-04-material-desatualizado.md` | Texto |

As Práticas 1 e 2 **não precisam de React Native nem do Expo** — são verificáveis só com o compilador:

```bash
npm run typecheck        # equivale a `npx tsc --noEmit`
npm run pratica:tela     # roda src/tela-pet.ts via tsx
```

> ⚠️ **O `typecheck` falha de propósito enquanto os TODOs não estiverem resolvidos.** Cada erro reportado aponta para um `TODO` que ainda falta preencher — é esse o critério de pronto. Alguns blocos marcados como *verificação* precisam **falhar** ao serem descomentados; não os apague.

## Próximos passos (exercícios)

Os `TODO` deixados no código apontam para os exercícios de `exercises.md` de cada aula. Resolva-os na ordem em que aparecem e mantenha um commit por exercício (ou por bloco), para que o histórico da branch sirva de evidência de progresso.

## Decisões de Projeto (Prática 2)

- **Decisão de modelagem**: Optamos por utilizar a prop condicional `destacado?: boolean` no componente `Card` no lugar de criar componentes separados. Como o destaque do cartão reflete mudanças mínimas de interface (bordas diferentes), o uso de um booleano mantém o componente genérico e de simples utilização.
- **Decisão de organização de estilo**: As cores, os espaçamentos principais e as propriedades fixas de tipografia viraram tokens no `theme.ts` visando assegurar a consistência visual geral da aplicação. Já atributos de disposição e estruturais (como `flexDirection`, alinhamentos e variações focadas da margem interna) ficaram como estilos locais nos componentes, já que refletem a necessidade espacial e estrutural local de cada exibição.

## Decisões da Prática 3

**Critério de agrupamento: status do passeio.** As seções são *Pendente*, *Concluído* e *Cancelado*, nessa ordem. Pendente vem primeiro porque é o que exige ação do dono; cancelado fica por último por ser o menos relevante no dia a dia. A ordem é uma constante em `src/lib/agrupar.ts`, e não a ordem de chegada dos pets. O critério também mostra a interação: ao tocar num item, ele muda de seção na hora.

**Por que `SectionList` e não `FlatList`.** Os pets têm um agrupamento natural (status), e o usuário precisa ver o grupo ao qual cada item pertence. A `SectionList` dá cabeçalhos de seção (inclusive fixos, com `stickySectionHeadersEnabled`) sem que eu precise intercalar "itens de cabeçalho" num array plano da `FlatList`, o que misturaria dois tipos de dado na mesma lista e quebraria a chave estável. Com uma lista sem grupo, a `FlatList` bastaria.

**Onde agrupo os dados e por que não no JSX.** Em `src/lib/agrupar.ts`, em funções puras (`agrupar` e `filtrarPorNome`), sem React. No JSX, a conta seria refeita de forma misturada com a renderização, não poderia ser testada sozinha e incharia o `App.tsx`. A tela só faz `agrupar(filtrarPorNome(pets, busca))`. **Filtrar antes de agrupar**: as seções já nascem só com os pets que casam, e a seção que ficar sem itens é descartada pelo `agrupar` — não há cabeçalho solto sem itens.

**Escolha de `Accuracy`: `High`.** O registro mostra o raio de precisão (±Nm) e o dono quer saber em que trecho o passeio aconteceu; `Balanced` (~100 m) pode errar o quarteirão. Não uso `Highest`/`BestForNavigation`, que mantêm o GPS no máximo para navegação passo a passo, com custo de bateria sem ganho aqui. Como é **uma única leitura** (`getCurrentPositionAsync`) e não uma assinatura contínua, o gasto extra de bateria do `High` dura poucos segundos.

**Estados da lista.** Com dados; vazio (`ListEmptyComponent` com texto de primeiro acesso); atualizando (`refreshing` + `onRefresh`); e filtrado sem resultado, em que o `ListaVazia` recebe o termo da busca e diz *"Nenhum pet encontrado para "x""* — texto diferente do de primeiro acesso.

**Estados de falha de sensor (mensagens distintas).** Localização negada (`canAskAgain: true`), localização bloqueada (`canAskAgain: false`, com botão para abrir as configurações), serviço de localização desligado, câmera negada (e bloqueada), e sensor/hardware indisponível (GPS e câmera têm textos próprios). Negando tudo, o botão *Salvar* continua habilitado e o pet segue sem foto e sem local.

**Limitações assumidas.**
- **Tela de registro sem cleanup de subscription.** Ela só faz leituras únicas (`getCurrentPositionAsync`, `takePictureAsync`), então não abre `addListener`/`watchPositionAsync`. Se abrisse, a assinatura **não seria encerrada ao sair da tela, porque a ferramenta para isso (`useEffect` com cleanup) é assunto da Aula 6.** A câmera é fechada pelo botão (desmonta a `CameraView`).
- **A foto fica no cache do app, não na galeria.** O `uri` é um arquivo temporário que o sistema pode apagar; salvar na galeria e escolher do rolo estão fora do escopo.
- **A foto do mock é um PNG embutido** (data URI), só para exercitar a renderização condicional sem rede.
- **Remoção sem confirmação.** O toque longo remove o pet imediatamente; um diálogo de confirmação ficou fora do escopo.