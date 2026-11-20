# Relatório de Uso de Inteligência Artificial — Mini-Projeto (Unidade 2)

> **Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School  
> **Projeto:** App de Gestão e Rotina Pet (`pet-routine-expo`)  
> **Estudante:** [Preencher seu nome completo]  
> **Data:** 20/11/2026

---

## 1. Declaração Obrigatória (Política de Governança de IA do CESAR)

> ⚠️ **Preenchimento obrigatório.** Caso não tenha utilizado nenhuma ferramenta de IA em nenhuma etapa do mini-projeto, assinale a opção correspondente abaixo e justifique na Seção 2.

- [x] **Utilizei** ferramenta(s) de Inteligência Artificial constante(s) no Catálogo de IA do CESAR e preenchi a declaração narrativa e a curadoria técnica abaixo.
- [ ] **NÃO utilizei** nenhuma ferramenta de Inteligência Artificial no desenvolvimento, refatoração de UI/UX ou documentação deste mini-projeto.

### Texto da Declaração Oficial

> *"Declaro que utilizei a(s) ferramenta(s) de Inteligência Artificial **Google Gemini (Gemini 2.5 Pro)** nesta atividade, com a finalidade de gerar um rascunho sobre **estrutura de navegação com Expo Router, integração de câmera/GPS/notificações, gerenciamento de estado com Zustand e SQLite, autenticação JWT com backend REST e refatoração de UI/UX com GlueStack UI, NativeWind e @expo/ui**, sobre o qual realizei análise crítica (curadoria) das informações apresentadas. Não tratei dados pessoais no uso desta ferramenta. Revisei criticamente o conteúdo gerado, identificando seus acertos e eventuais imprecisões, e assumo a responsabilidade integral pela versão final apresentada."*

---

## 2. Registro de Uso por Etapa do Mini-Projeto

Liste todas as interações relevantes realizadas com ferramentas de IA durante o desenvolvimento das Etapas 1 a 5 e na reformulação de UI/UX.

| # | Etapa do Mini-Projeto | Ferramenta e Versão | Finalidade / Resumo do Prompt | O que foi aproveitado? | O que precisou ser corrigido ou descartado? |
|---|---|---|---|---|---|
| 1 | Etapa 1 — Expo Router + `SectionList` + `ImagePicker` | Google Gemini (Gemini 2.5 Pro) | Estruturar a migração para rotas baseadas em arquivos em `src/app/`, listagem agrupada de pets e captura de foto quadrada (1:1). | Estrutura de rotas no Expo Router, uso de `SectionList` sem `ScrollView` externo e contrato de 3 tempos no `ImagePicker` (`aspect: [1, 1]`). | Remoção de componentes visuais que haviam sido colocados dentro de `src/app/` (Regra 15), movendo-os para `src/components/` e `src/screens/`. |
| 2 | Etapa 2 — Tabs, Rota Dinâmica `[id]`, GPS e Notificações | Google Gemini (Gemini 2.5 Pro) | Criar layout de abas `(tabs)`, tela dinâmica `src/app/pet/[id].tsx`, captura de coordenadas GPS e lembrete local com `expo-notifications`. | Navegação tipada com `useLocalSearchParams`, registro de localização via `expo-location` e listener de resposta da notificação redirecionando para `/pet/[id]`. | Ajuste nas mensagens de erro para diferenciar permissão negada (`canAskAgain: true`) de bloqueio permanente no sistema operacional. |
| 3 | Etapa 3 — Hooks, Zustand, `AsyncStorage` e `expo-sqlite` | Google Gemini (Gemini 2.5 Pro) | Implementar `ThemeContext` claro/escuro persistido em `AsyncStorage`, cronômetro `WalkTimer` com `useEffect` e histórico local em `expo-sqlite`. | Paleta Bordô, Azul Claro e Off-White persistida em `@petroutine:theme`, atualização funcional `setSeconds((prev) => prev + 1)` com `clearInterval` e queries SQLite parametrizadas (`?`). | Adição de flag de cancelamento no `useEffect` de leitura inicial do `AsyncStorage` e formatação de data local (`pt-BR`) na lista do histórico. |
| 4 | Etapa 4 — Auth com `sessionToken` e CRUD no Backend | Google Gemini (Gemini 2.5 Pro) | Criar `useAuthStore` persistente, cliente HTTP `apiFetch`, telas `(auth)/login` e `(auth)/signup`, Auth Guard no `_layout.tsx` e CRUD na `usePetStore`. | Hidratação com `onRehydrateStorage` (`isHydrated`), redirecionamento com `router.replace`, injeção de `Bearer` token e limpeza no `finally` do `logoutUser`. | Substituição de acessos diretos sem tipagem no retorno de erros HTTP por validação explícita com `unknown` (*type narrowing*) e tratamento de rollback nas ações da store. |
| 5 | Etapa 5 — UI/UX com GlueStack/NativeWind, `@expo/ui`, OTA e EAS | Google Gemini (Gemini 2.5 Pro) | Refatorar o visual das telas com GlueStack UI + NativeWind, integrar controles nativos `@expo/ui`, cartão OTA (`expo-updates`) e perfis do `eas.json`. | Hierarquia visual com `Card`, `VStack`, `HStack`, `Badge` semântico por status, `SafeAreaView`, verificador OTA com bloqueio em `__DEV__` e perfil `preview` gerando `.apk`. | Reescrita completa de `native-pet-reminder-settings.tsx` após erros de compilação causados por assinaturas obsoletas do `@expo/ui` v57 e preservação dos assets originais no `app.json`. |

---

## 3. Análise Crítica e Curadoria Técnica (Acertos, Erros e Alucinações)

Modelos de linguagem frequentemente sugerem APIs depreciadas do ecossistema React Native / Expo (como `@react-navigation/*` manual em vez de `expo-router`, `ImagePicker.MediaTypeOptions.Images` em vez de `['images']`, `result.cancelled` com dois "L", `shadow*`/`elevation` em vez de `boxShadow`, ou mutação direta de arrays).

Responda com base no que aconteceu durante o desenvolvimento do seu grupo:

### 3.1. Principais Acertos da Ferramenta
A ferramenta acelerou significativamente a estruturação repetitiva (*boilerplate*) da arquitetura — como a configuração do middleware `persist` do Zustand com `AsyncStorage`, o esqueleto das rotas públicas `(auth)` e privadas `(tabs)`, as queries SQL parametrizadas do `expo-sqlite` e a padronização dos componentes de layout (`Card`, `VStack`, `HStack`, `Badge` e `Button`) adaptados simultaneamente aos temas Claro e Escuro.

### 3.2. Imprecisões, Código Desatualizado ("Zumbis") ou Violações das Regras da Disciplina

1. **Problema identificado na sugestão da IA (APIs e importações desatualizadas no `@expo/ui` v57):**
  - **O que a IA gerou:** `import { Host, Picker, Switch } from '@expo/ui/swift-ui'` passando `<Picker options={OPCOES_META} selectedIndex={metaIndex} variant="segmented" />` e `<Switch>` no submódulo SwiftUI.
  - **Por que estava incorreto/desatualizado:** Na versão instalada no projeto (`@expo/ui@~57.0.26`), `@expo/ui/swift-ui` não exporta `Switch` (que se chama `Toggle`), e o componente universal `Picker` mudou sua assinatura, gerando 8 erros de compilação no `npm run typecheck` (`TS2305` e `TS2322`).
  - **Como corrigimos no código final:** Inspecionamos os arquivos `.d.ts` em `node_modules/@expo/ui` e migramos para a API universal (`import { Host, Picker, Switch } from '@expo/ui'`), utilizando `<Picker<MetaPasseio> selectedValue={metaSelecionada} onValueChange={...} appearance="menu">` com filhos `<Picker.Item />`, zerando os erros do TypeScript.

2. **Problema identificado na sugestão da IA (Uso de API depreciada no `expo-image-picker` e tipagem frouxa em respostas HTTP):**
  - **O que a IA gerou:** `mediaTypes: ImagePicker.MediaTypeOptions.Images` na seleção de fotos e leitura direta de `data.error` após `JSON.parse(rawText)` sem validação de tipo no `apiFetch`.
  - **Por que estava incorreto/desatualizado:** `ImagePicker.MediaTypeOptions` está marcado como `@deprecated` nas versões atuais do Expo SDK, e acessar propriedades sem *type narrowing* em `strict: true` viola a regra de zero `any` implícito/explícito e pode gerar exceções caso o servidor retorne texto puro.
  - **Como corrigimos no código final:** Substituímos por `mediaTypes: ['images']` no `ImagePicker` e tipamos o retorno intermediário do `JSON.parse` como `unknown` no `src/services/api.ts`, validando explicitamente com `typeof data === 'object' && data !== null && 'error' in data` antes de lançar a exceção.

---

## 4. Confirmação de Proteção de Dados e Autoria

- [x] Confirmo que **nenhum dado pessoal ou sensível** (próprio, de colegas ou de terceiros) nem chaves privadas reais foram inseridos nos prompts enviados às ferramentas de IA.
- [x] Confirmo que compreendo integralmente o funcionamento de cada arquivo entregue na branch e sou capaz de explicar e modificar qualquer trecho durante a arguição/avaliação.