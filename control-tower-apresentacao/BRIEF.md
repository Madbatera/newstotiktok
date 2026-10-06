---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Control Tower: as informações do Protheus viram visão gerencial, com acesso ao detalhe."
destination: linkedin-feed
aspect: "16:9"
language: pt-BR
audience: gestores, diretores, controllers, CEOs e CFOs
length: 87s
vo_mode: tts (Kokoro pm_alex, pt-BR)
music: original-instrumental, ducking sob a locução
capture: demo-mode (protheus-gestao 1.9.0, tema escuro)
---

# Control Tower — apresentação (16:9)

Base: `Control_Tower_Roteiro_Video_Apresentacao_1.md` (06/10/2026), com o pedido de Marcos de **tirar a parte do
contato** (Daniel e telefone) do fechamento.

## Cenas

| Tempo | Cena | Telas reais usadas |
|---|---|---|
| 0–9,5 | Marca → visão geral | `logo.png` do produto, Visão geral |
| 9,5–18,7 | Acesso com usuário Protheus | tela de login real (sem credenciais reais), menu lateral |
| 18,7–28,6 | Visão conectada | Financeiro, Compras, Estoque, Controladoria & Performance |
| 28,6–38,2 | Do indicador ao documento | cartão "A receber vencido" → painel de detalhe com os títulos |
| 38,2–49,2 | Estoque | valor em estoque, abaixo do mínimo, por armazém, produtos de maior valor |
| 49,2–58,7 | Compras | posição atual, aguardando aprovação, maiores fornecedores |
| 58,7–68,3 | Consolidado e cálculo | seletor "Consolidado — 5 contas", DRE e Balanço, descrição do cálculo do fluxo |
| 68,3–77,8 | Servidor e cache | ilustração conceitual (identificada) + rodapé real "recalculada a cada 15 min" |
| 77,8–87 | Fechamento | marca, "Mais clareza para sua gestão.", "Conheça a solução." — sem contato |

## Ajustes ao roteiro (fidelidade ao produto)

- Estoque: o roteiro cita cobertura, itens sem saída, curva ABC e giro, que não existem na versão 1.9.0 do
  GitHub. A locução fala do que a tela mostra (valor por armazém, maior valor, abaixo do mínimo).
- Compras: preços e prazos não aparecem na tela; a locução fala de fornecedores, pedidos em aberto, aprovações e atrasos.
- Filial: o seletor de filial não aparece no modo demonstração; a cena usa o seletor "Consolidado — 5 contas" e a
  locução diz "consolidada ou por recorte".
- IA: a explicação por IA depende de um modelo externo e não pôde ser demonstrada; ficou fora da locução.
- Nome: "Control Tower", como no roteiro e no produto (`APP_NOME`). A pronúncia na locução usa a grafia
  "Contról Táuer" e "quéchi" (cache) só no texto enviado ao TTS.

## Áudio

- Locução sintética (Kokoro-82M, voz pm_alex) em `assets/locucao/`; falas em `assets/locucao/falas.txt`.
- Trilha original `audio-src/compor-trilha.mjs` (104 BPM), com o volume reduzido para 32% durante as falas.
- Efeitos da biblioteca HyperFrames (Pixabay Content License). Render final normalizado para −16 LUFS.

## Revisões

- 06/10/2026: a locução não fala mais o nome do produto (pedido de Marcos); logo e "Control Tower" continuam na tela.
  Abertura: "Agora, essas informações ficam mais próximas de quem precisa decidir."; fechamento sem "Control Tower.".
