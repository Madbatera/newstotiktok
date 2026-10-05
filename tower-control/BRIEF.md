---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Tower Control. A visão que sua gestão precisa para decidir e agir."
destination: linkedin-feed
aspect: "1:1"
language: pt-BR
audience: CEOs, CFOs, diretores, controllers e gestores de departamento
length: 50s
angle: "Pergunta de abertura → situações concretas (dor) → a torre de controle → caixa, operação e detalhe → personalização → chamada para mensagem"
vo_mode: none
music: original-instrumental
capture: demo-mode
---

# Tower Control — vídeo motion para LinkedIn

## Intent

Peça promocional para o feed do LinkedIn, baseada no briefing de divulgação de 05/10/2026
(`Briefing_Tower_Control_LinkedIn.md`). Narrativa do carrossel proposto (8 páginas) convertida em vídeo:
começa pela decisão do gestor, mostra situações reconhecíveis e apresenta o Tower Control como apoio para
visualizar e priorizar. Sem narração: o LinkedIn reproduz sem som, então a mensagem é carregada pelo texto.

## Assets

Telas reais do produto (repositório `Madbatera/protheus-gestao` v1.6.1) rodando em modo demonstração
(`PAINEL_DEMO=1`, números fictícios), capturadas em 2x por elemento com o nome trocado para "Tower Control".
Ficam em `assets/`.

## Customizations

- Sem moldura de navegador, abas ou endereço localhost: só recortes dos cartões e painéis.
- Selo "Dados demonstrativos" sempre que uma tela aparece.
- Verde, laranja e vermelho mantêm o sentido dos estados e alertas.

## Notes — precisão da divulgação (briefing § 10)

- "Dados atualizados automaticamente", nunca "tempo real".
- Protheus como implementação inicial; nenhum outro ERP citado.
- Personalização como possibilidade, conforme o escopo.
- Sem aprovação/correção pelo painel, sem envio automático de cobrança, sem IA, sem resultados prometidos.
- A tela de Controladoria/DRE (`#/contabilidade`) não existe na versão do GitHub; a cena de detalhe usa o
  painel lateral "A receber vencido". Controladoria aparece só como departamento na cena de personalização.

## Áudio

- Trilha instrumental original (`audio-src/compor-trilha.mjs`, 100 BPM, Lá menor, gerada por código, sem direitos
  de terceiros), normalizada para −16 LUFS; render final a −17 LUFS.
- Efeitos da biblioteca do HyperFrames (Pixabay Content License, uso comercial livre): riser antes da marca,
  impacto na entrada da marca, whoosh nos cortes, clique no cursor e chime no fechamento.
- O vídeo funciona sem som (LinkedIn reproduz mudo); a trilha é um reforço para quem ativa o áudio.

## Revisões

- 05/10/2026: cena 8 passa a dizer que o painel pode incluir todo e qualquer módulo do Protheus (pedido de Marcos),
  como possibilidade conforme a necessidade da operação; vídeo passa a 50 s.
