# Várzea Botucatu

Site para acompanhar o Campeonato Botucatuense de Futebol (Série A) da várzea de Botucatu: classificação, resultados, artilharia, cartões e simulação de rodadas futuras.

Feito em Next.js (App Router) + TypeScript + Tailwind, com export estático para publicação no GitHub Pages.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Dados

Os dados ficam em `data/*.json` e são a fonte de verdade do site — nada é buscado de uma API externa:

- `data/config.json` — nome do campeonato, grupos, nº de classificados, critérios de desempate.
- `data/teams.json` — times por grupo.
- `data/players.json` — jogadores com gols e cartões **acumulados** (espelha as tabelas de Artilharia e Relação de Cartões do BID mais recente).
- `data/matches.json` — todos os jogos (realizados e agendados).

### Atualizando com um novo BID

Os Boletins Informativos Desportivos (BID) da Prefeitura de Botucatu trazem, a cada edição, a lista **acumulada** de resultados, artilharia e cartões até aquele momento (ficam salvos em `docs/bids/`). Ao receber um novo BID:

1. Substitua a tabela de `data/players.json` pelos números atualizados de ARTILHARIA e RELAÇÃO DE CARTÕES do boletim (são acumulados, então é uma troca direta, não uma soma).
2. Adicione ao final de `data/matches.json` os jogos novos que apareceram em "RESULTADO DOS JOGOS" (com `status: "realizado"`).
3. Atualize os jogos agendados (`status: "agendado"`) com a seção "PRÓXIMA RODADA" do boletim.
4. Atualize `data/config.json` → `ultimoBoletim`.

## Deploy

O workflow em `.github/workflows/deploy.yml` builda o site (`next build`, export estático em `out/`) e publica no GitHub Pages a cada push na branch `main`. Para ativar:

1. Repositório: [Thalesh7991/varzea_botucatu](https://github.com/Thalesh7991/varzea_botucatu).
2. Em **Settings → Pages**, selecione a origem "GitHub Actions".
3. Dê push na `main` — o site fica em `https://thalesh7991.github.io/varzea_botucatu/`.

Se o nome do repositório no GitHub mudar, atualize a constante `repoName` em `next.config.ts`.
