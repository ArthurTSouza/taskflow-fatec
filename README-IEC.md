# TaskFlow — Entrega IEC AT2

Esta entrega utiliza exclusivamente o backend do TaskFlow, conforme a atividade IEC: Node.js, Express, TypeScript, PostgreSQL, rota `/api/health`, Dockerfile de produção, GitHub Actions e Deploy Hook do Render.

## 1. Backend e Health Check

A API escuta `process.env.PORT || 3000` e disponibiliza:

```http
GET /api/health
```

Resposta esperada (HTTP 200):

```json
{
  "status": "ok",
  "uptime": 12.34
}
```

A conexão PostgreSQL aceita `DB_SSL=true` para banco gerenciado com SSL.

## 2. Docker

Na raiz:

```bash
docker build -t taskflow-api .
```

O Dockerfile usa Node Alpine, instala dependências de produção no estágio final e executa o JavaScript compilado em `dist/`. `.dockerignore` exclui `.env`, `node_modules`, `.git` e arquivos de teste.

## 3. Render

1. Faça push do repositório público para o GitHub.
2. No Render, crie um PostgreSQL.
3. Anote host, porta, database, usuário e senha fornecidos pelo Render.
4. Crie um **Web Service** conectado ao repositório.
5. Selecione runtime **Docker** e a raiz do repositório.
6. Em Settings, configure **Auto-Deploy = No**.
7. Cadastre as variáveis:
   - `NODE_ENV=production`
   - `PORT=10000` (o Render injeta a porta; o backend respeita `PORT`)
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_SSL=true` quando exigido pelo provedor
8. Em Health Check Path, configure `/api/health`.
9. Em Settings, gere/cop ie o Deploy Hook do serviço.

**Não compartilhe nem versione a URL do Deploy Hook.**

## 4. GitHub Actions

No repositório GitHub, abra Settings → Secrets and variables → Actions → New repository secret:

- Name: `RENDER_DEPLOY_HOOK_URL`
- Secret: URL do Deploy Hook copiada do Render.

O workflow `.github/workflows/deploy.yml` executa em `push` na branch `main`, nesta ordem:

1. Checkout.
2. Node.js e `npm ci`.
3. `npm run typecheck`.
4. `npm run build`.
5. `docker build`.
6. `curl -X POST` no Deploy Hook, validando HTTP 200 ou 201.

O passo de deploy só é executado após o sucesso dos passos anteriores.

## 5. Teste após publicar

```bash
curl https://SUA-API.onrender.com/api/health
curl https://SUA-API.onrender.com/api/tasks
```

Para validar persistência, crie uma tarefa com `POST /api/tasks`, consulte com `GET /api/tasks` e confirme que ela continua disponível após reiniciar/reimplantar o serviço.

## 6. Roteiro do vídeo (3–4 minutos)

1. Apresente brevemente o TaskFlow e o backend.
2. Mostre `Dockerfile` e `.github/workflows/deploy.yml`.
3. Mostre no Render o Web Service ativo e Auto-Deploy como `No`.
4. Faça uma pequena alteração rastreável na rota `/api/health`, commit e push para `main`.
5. Mostre o workflow no GitHub Actions concluído com sucesso.
6. Mostre Events/Logs no Render com o deploy disparado pelo webhook.
7. Teste `/api/health` e uma rota funcional (`/api/tasks`) na URL pública.

## Importante

O código e a esteira estão preparados, mas a publicação depende de recursos e credenciais da sua conta: banco PostgreSQL, Web Service no Render e segredo `RENDER_DEPLOY_HOOK_URL` no GitHub. Esses passos não podem ser concluídos automaticamente sem acesso às contas.
