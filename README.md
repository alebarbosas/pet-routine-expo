# Pet Routine — Aplicativo Mobile (Expo + React Native)

Aplicativo mobile para gerenciamento da rotina de pets, cadastro de animais, registro de passeios com GPS e câmera, cronômetro com histórico em SQLite, autenticação JWT e atualizações Over-The-Air (OTA).

---

## Reformulação de UI/UX

Na Etapa 5, toda a interface do aplicativo foi refatorada utilizando **GlueStack UI + NativeWind** (`GluestackUIProvider`, `Card`, `VStack`, `HStack`, `Heading`, `Text`, `Badge`, `Button`, `Input`) integrada ao contexto global de Tema Claro/Escuro (`useTheme`), além de controles nativos do sistema operacional via **`@expo/ui`**.

### Decisões Visuais e de Usabilidade

1. **Identidade Cromática e Contraste (Claro e Escuro):**
   - **Modo Claro:** fundo Off-White quente (`#FAF8F5`), cartões brancos (`#FFFFFF`), destaque principal em Bordô (`#722F37`) e acentos informativos em Azul Claro (`#7DD3FC` / `#0369A1`).
   - **Modo Escuro:** superfície vinho profunda (`#171012` / `#24191C`), texto principal em Off-White (`#FAF8F5`) e bordô luminoso (`#9E3E4A`), garantindo legibilidade em ambientes internos e externos.

2. **Hierarquia Visual e Emblemas Semânticos (`Badge`):**
   - Cada `CardPet` e a tela de detalhe exibem emblemas semânticos diferenciados por cor e contraste para o status do passeio:
     - `concluido` → verde (`action="success"`)
     - `pendente` → âmbar (`action="warning"`)
     - `cancelado` → vermelho (`action="error"`)
   - Espécie, porte e idade são agrupados em `HStack` com emblemas compactos (`action="info"` e `action="muted"`), facilitando a leitura rápida da lista.

3. **Consistência de Espaçamento e Área Segura (`SafeAreaView`):**
   - Adoção sistemática de `VStack` e `HStack` com escala de `gap` padronizada (`xs: 4`, `sm: 8`, `md: 12`, `lg: 16`) e `paddingHorizontal: 16` em todas as telas, eliminando elementos colados nas bordas ou sobrepostos à barra de status.

4. **Feedbacks Visuais Completos:**
   - Estados de carregamento com `ActivityIndicator` / `ButtonSpinner` durante login, cadastro, busca de pets e verificação OTA;
   - Banners de erro destacados com opção de nova tentativa;
   - Feedback tátil imediato (`pressed`) e bloqueio visual (`isDisabled`) durante requisições assíncronas.

5. **Controles Nativos (`@expo/ui`) e OTA (`expo-updates`):**
   - Na aba **Estatísticas / Perfil**, o usuário conta com `<Switch>` e `<Picker variant="segmented">` nativos do iOS/Android encapsulados em `<Host matchContents>`, além do cartão de diagnóstico OTA com canal, `runtimeVersion` e verificação segura.

### Comparativo Antes e Depois

| Tela / Fluxo | Antes (Etapas 1–4) | Depois (Etapa 5 — GlueStack UI + `@expo/ui`) |
|---|---|---|
| **Login & Cadastro** | Campos e botões simples sem cabeçalho de marca ou alternância de tema | Hero Bordô com `SafeAreaView`, `Card` elevado, `Input` acessível, `ButtonSpinner` e alternância de tema |
| **Meus Pets & CardPet** | Lista com textos corridos e botões básicos | Resumo diário no topo, `CardPet` com avatar/monograma e `Badge` semântico por status, espécie e porte |
| **Detalhe & Registro** | Cartões planos e botões empilhados sem hierarquia | Hierarquia clara com `Heading`, `Badge`, cronômetro com cleanup, histórico SQLite e registro GPS/Câmera |
| **Estatísticas & Perfil** | Métricas básicas e links textuais | Grade de métricas, controles nativos `@expo/ui` (`Switch` + `Picker`), card OTA e logout com feedback |

> **Capturas de tela (Antes e Depois):** adicione as imagens da execução do grupo na pasta `docs/screenshots/` (`antes-login.png`, `depois-login.png`, `antes-pets.png`, `depois-pets.png`, `depois-stats.png`).

---

## Como Executar e Gerar Builds (EAS)

```bash
# Instalar dependências e validar tipos
npm install
npm run typecheck

# Iniciar em desenvolvimento
npx expo start

# Gerar APK Android (perfil preview)
eas build --platform android --profile preview

# Gerar build para Simulador iOS (perfil preview)
eas build --platform ios --profile preview