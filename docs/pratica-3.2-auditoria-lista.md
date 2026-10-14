# Auditoria de lista — TelaPets

## 1. Problemas encontrados

| # | Trecho | Problema | Sintoma para o usuário | Correção |
|---|---|---|---|---|
| 1 | `<ScrollView>` envolvendo `<FlatList>` | Lista vertical dentro de ScrollView vertical: a FlatList não tem altura limitada, então não sabe qual é a janela visível e monta todos os itens | Com 4 000 pets a tela demora a abrir, trava ao rolar e consome muita memória; o app pode ser encerrado em aparelhos fracos | Remover a ScrollView; o título vai em `ListHeaderComponent`, o total em `ListFooterComponent`, e a lista ocupa o `flex: 1` |
| 2 | `alvo.statusPasseio = 'concluido'; setPets(pets)` | Mutação do objeto e `setPets` com a **mesma referência** do array: o React considera que nada mudou e nem re-renderiza | Toca em "registrar passeio" e nada acontece; o resultado só aparece depois, quando outra coisa (digitar na busca) força um render | `setPets(prev => prev.map(p => p.id === id ? { ...p, statusPasseio: 'concluido' } : p))` |
| 3 | `ListHeaderComponent={() => (<TextInput … />)}` | Função inline = um componente **novo** a cada render; o React desmonta e remonta o cabeçalho a cada letra | Digita uma letra, o campo perde o foco e o teclado fecha: só dá para digitar um caractere por vez | Passar um elemento (`ListHeaderComponent={<TextInput … />}`) ou um componente estável fora da tela |
| 4 | `keyExtractor={(item, index) => index.toString()}` | Chave pelo índice: ao filtrar, o item 0 passa a ser outro pet, mas mantém a mesma chave | Ao buscar, linhas "piscam" ou mostram o conteúdo do item errado por um instante; o React reaproveita células de forma incorreta | `keyExtractor={(item) => item.id}` |
| 5 | `p.nome.includes(busca)` | Busca sensível a maiúsculas e minúsculas e a acentos, sem `trim` | Digita "rex" e não acha "Rex"; "agata" não acha "Ágata"; um espaço no fim zera os resultados | Normalizar os dois lados: `trim().toLowerCase()` e remoção de acentos (`normalize('NFD')`) |
| 6 | Sem `ListEmptyComponent` | A lista não tem estado vazio | Busca sem resultado deixa uma área em branco, sem explicar o que houve | `ListEmptyComponent` com texto que diferencia "nenhum pet" de "nenhum resultado para X" |
| 7 | `<Text onPress={…}>registrar passeio</Text>` | Alvo de toque do tamanho do texto, sem feedback visual de pressionado e sem papel de botão para leitor de tela | Difícil acertar o toque, não há resposta visual ao tocar, e o TalkBack/VoiceOver não anuncia como botão | `Pressable` com `accessibilityRole="button"`, `hitSlop` e estilo no `pressed`; ação em `onPress` |
| 8 | `<Text style={styles.rodape}>Total: …</Text>` fora da lista | O rodapé está na ScrollView, depois da FlatList (consequência do item 1) | Para ver o total o usuário tem que rolar a lista inteira (4 000 itens) até o fim | `ListFooterComponent` ou, melhor, mostrar o total no cabeçalho |
| 9 | `renderItem` inline + `index` não usado, `registrar(id)` sem tipo | Função recriada a cada render; parâmetro sem tipo (`any` implícito) e o import de `'../mock'` sem tipo | Nenhum sintoma direto; o `any` esconde erros como passar um `id` do tipo errado. Em lista grande, soma ao custo de render | Declarar `renderItem` fora (ou `useCallback`), tipar `registrar(id: string)` e `Pet` |
| 10 | `pets.filter(...)` calculado a cada render | Recalcula sobre 4 000 itens em todo render, inclusive os que não mexem em `busca`/`pets` | Pequeno atraso ao digitar; custo baixo hoje, cresce se a lista crescer | `useMemo(() => pets.filter(...), [pets, busca])` |

## 2. O problema arquitetural

É o **item 1: a FlatList aninhada na ScrollView** (mesma direção de rolagem).

A virtualização da FlatList depende de conhecer o tamanho da janela visível: ela monta só os itens perto da tela e descarta os distantes. Dentro de uma ScrollView, o pai dá altura *ilimitada* ao filho, então a FlatList entende que "tudo" está visível e monta os 4 000 itens de uma vez, exatamente como um `map` dentro da ScrollView. Ou seja, **o item 1 anula todo o benefício de usar FlatList**, e é mais grave que os outros nove juntos: os outros geram bugs pontuais; este faz a tela inteira ficar lenta e consumir memória proporcional ao tamanho da lista. O React Native chega a emitir o aviso *"VirtualizedLists should never be nested inside plain ScrollViews with the same orientation"*. Ele também faz com que `removeClippedSubviews`, `windowSize` e `initialNumToRender` (seção 3) quase não tenham efeito.

## 3. Os três ajustes de desempenho deste arquivo

| Prop | Default | O que a mudança causa | Por que não resolve o problema real |
|---|---|---|---|
| `removeClippedSubviews={true}` | `true` no Android, `false` no iOS | Desanexa da hierarquia nativa as views fora da tela; pode causar itens que somem ou "piscam" ao rolar, principalmente no iOS, e não reduz o custo de criar os componentes React | Só ataca a hierarquia nativa. Os 4 000 itens continuam sendo criados e mantidos em memória pelo React (item 1) |
| `windowSize={50}` | `21` (10 telas acima, 10 abaixo, 1 visível) | Aumenta a janela para ~25 telas para cada lado: mantém **mais** itens montados, o oposto de otimizar memória | Aumenta o consumo. E, dentro da ScrollView, a janela nem é respeitada porque tudo já está montado |
| `initialNumToRender={100}` | `10` | Renderiza 100 itens no primeiro frame, bloqueando a thread de JS antes de mostrar qualquer coisa | Atrasa o primeiro pixel (tela branca no início); o certo é renderizar só o que cabe na tela |

Em comum: os três foram mexidos **sem medir** (sem profiler, sem número antes e depois), e nenhum ataca a causa. Mudar defaults sem medição costuma piorar ou só esconder o sintoma. O correto é voltar ao default, corrigir a estrutura (item 1) e só então medir se ainda há o que ajustar.

## 4. O bug de "às vezes não atualiza"

**Causa exata:** `registrar` **muta** o objeto (`alvo.statusPasseio = …`) e chama `setPets(pets)` com a mesma referência de array. O React compara com `Object.is`, vê o mesmo array e **não re-renderiza**. A documentação diz que a `FlatList` é um **`PureComponent`**: só re-renderiza quando as props mudam por **comparação rasa** (*shallow-equal*). Como a referência de `pets` não mudou, nada atualiza. "Às vezes" porque, quando outro estado muda (digitar na busca, por exemplo), o componente re-renderiza e aí o valor mutado aparece, como se o app tivesse "atrasado".

(Observação: o item só mostra o nome e "registrar passeio" — o status nem aparece na tela, então o usuário nunca vê o resultado do toque. Isso também precisa ser corrigido ao consertar o bug.)

**Duas correções possíveis:**
1. **Imutabilidade (a correta):** criar array e objeto novos em `setPets` (`prev.map(p => p.id === id ? { ...p, statusPasseio: 'concluido' } : p)`).
2. **`extraData`:** passar `extraData` na FlatList com algo que mude (ex.: um contador) para forçá-la a re-renderizar, remendando a mutação.

**Escolha: a 1.** Corrige a causa (o estado agora muda de verdade, o React re-renderiza naturalmente e o `memo`/`PureComponent` dos itens passa a funcionar). A 2 mantém a mutação, que continuaria quebrando `useMemo`, `React.memo` e qualquer outro lugar que compare referências.

## 5. Ordem de refatoração — tenho meio dia

| Ordem | O que faço | Risco se não fizer | Retorno |
|---|---|---|---|
| 1 | Remover a ScrollView e usar `ListHeaderComponent`/`ListFooterComponent` (item 1) e reverter as três props de desempenho para o default | O app continua travando e consumindo memória em produção; é a reclamação principal ("trava") | Altíssimo: resolve o travamento com poucas linhas |
| 2 | Parar de mutar e usar `setPets` funcional + exibir o status no item (item 2) | Usuário não vê o resultado do toque e acha que o app falhou; dados incoerentes | Alto: resolve a outra reclamação ("não atualiza") |
| 3 | Estabilizar o `ListHeaderComponent` (item 3) | Não dá para digitar uma frase na busca; o usuário desiste da busca | Alto, custo de minutos |
| 4 | `keyExtractor` por `id` (item 4) | Itens mostrando dados trocados ao filtrar; bug difícil de reproduzir | Alto para o esforço (uma linha) |
| 5 | Busca sem diferenciar caixa e acento (item 5) e `ListEmptyComponent` (item 6) | Busca "parece quebrada" e telas em branco | Médio |
| 6 | `Pressable` no lugar de `Text onPress` (item 7), tipagem (item 9) | Toque ruim e acessibilidade; `any` esconde bugs futuros | Médio |
| 7 | `useMemo` na filtragem (item 10) | Pequeno atraso ao digitar | Baixo hoje; só vale medir antes |

A ordem não é a do arquivo: vai por **risco** (o que quebra ou trava para o usuário) × **retorno por hora** (quanto cada correção resolve por esforço). Os itens 1 e 2 vêm primeiro por terem relação direta com as duas queixas do time.

## 6. O que eu decidi NÃO corrigir

**A migração dos estilos para tokens (hex `#FF6002`, `#ccc`, `#fff` e `marginBottom` nos itens).** É uma dívida real do arquivo, mas é preferência de consistência de código, não causa nenhum dos sintomas relatados (trava e não atualiza). Fica para uma tarefa separada, depois que a tela estiver estável; misturar esse refactor com as correções de desempenho aumentaria o risco de regressão sem retorno para o usuário.