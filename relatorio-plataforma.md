# Relatório de decisão de plataforma — App de Rotina Pet

Alessandra Barbosa  24/09/2026

## 1. Recomendação

Para o aplicativo do tutor, recomendo seguir pelo caminho **cross-platform**, utilizando React Native com Expo.

## 2. Restrições que sustentam a escolha

| # | Restrição do enunciado | Como ela empurra para a minha escolha |
|---|---|---|
| 1 | Time de 2 devs (domínio em TypeScript e React; zero Kotlin ou Swift) | Aproveitamos 100% da bagagem que a equipe já tem. Ir para o desenvolvimento nativo exigiria aprender duas linguagens novas do zero ou mais gente, o que é inviável para um time de duas pessoas. |
| 2 | Orçamento de R$ 90 mil e prazo de 3 meses para o piloto | Mantemos uma única base de código para iOS e Android. Tentar criar e testar dois aplicativos separados com esse orçamento e prazo deixaria a entrega totalmente inviável. |
| 3 | Uso de câmera (fotos e documentos), GPS para passeios e notificações de vacina | O Expo já resolve esses acessos ao hardware com módulos prontos e estáveis. Uma PWA, por outro lado, traria instabilidades sérias com GPS em segundo plano e notificações. O cross-platform entrega o que precisamos sem a complexidade do nativo puro. |

## 3. O que estamos perdendo

Abordagem rejeitada: **nativo (Kotlin / Swift)**

Ao abrir mão do desenvolvimento nativo puro, deixamos de ter o desempenho máximo em celulares mais fracos, além de um controle mais fino sobre a bateria e processos rodando em segundo plano (ponto sensível para o rastreamento do passeio). Também ficamos mais sujeitos ao ecossistema de bibliotecas de terceiros do React Native/Expo: se algo quebrar ou for descontinuado, a bronca de corrigir fica com a nossa equipe.

## 4. O painel das clínicas

Mesma tecnologia do app do tutor?  ( ) sim   (X) não

Justificativa: o painel das clínicas roda em computadores na recepção. O caminho mais prático é uma aplicação web em React, rodando direto no navegador, sem necessidade de instalação e otimizada para monitores maiores, tabelas e uso de teclado. A equipe continua dentro do seu ecossistema principal (TypeScript/React) e ainda conseguimos reaproveitar estruturas de dados (tipos) e chamadas da API entre o app e a web.

## 5. Risco técnico e mitigação

| | |
|---|---|
| **Risco concreto** | O app engasgar, travar ou consumir memória demais em Androids mais fracos. |
| **Por que ele é plausível aqui** | Cerca de 65% do público usa Android de entrada (com menos de 4 GB de RAM). O cross-platform consome mais recursos que o nativo, e juntar processamento de fotos com GPS em tempo real pesa na máquina. |
| **Como eu mitigaria** | Testar em aparelhos fracos reais desde as primeiras semanas (nada de confiar só no emulador). Vamos comprimir e redimensionar fotos antes do envio, usar listas otimizadas (FlatList), cortar bibliotecas pesadas e acompanhar métricas de performance a cada entrega para não deixar o app arrastado. |

## 6. A pergunta que eu faria ao cliente

Algo que o enunciado NÃO informa e que poderia mudar minha resposta:

"O rastreamento do passeio precisa gravar o GPS sem falhas com a tela apagada e o app em segundo plano? E as notificações de vacina precisam ter entrega garantida mesmo com o aplicativo fechado?"

Se a resposta fosse **"sim, isso é vital e não pode falhar"**, eu mudaria minha recomendação para **desenvolvimento nativo (começando pelo Android)**, porque celulares de entrada costumam matar processos em segundo plano agressivamente para economizar bateria, e contornar isso exige um nível de controle do sistema que o cross-platform nem sempre consegue entregar com estabilidade.