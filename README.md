# TaskFlow — LDW AT2 + IEC AT2

Aplicação de gerenciamento de tarefas desenvolvida como projeto integrado para as atividades:
- **LDW AT2:** SPA com React, TypeScript, shadcn/ui, Tailwind CSS e CRUD via API REST.
- **IEC AT2:** backend Node.js/Express/TypeScript, PostgreSQL, Docker, GitHub Actions e Deploy Hook do Render.

O projeto mantém frontend e backend no mesmo repositório. A atividade IEC utiliza **somente o backend**, conforme o enunciado.

## Estrutura

```text
taskflow-fatec/
├── backend/                 # API REST Express + TypeScript + Sequelize + PostgreSQL
├── frontend/                # SPA React + TypeScript + Vite + shadcn/ui
├── .github/workflows/       # Pipeline CI/CD do backend
├── Dockerfile               # Imagem de produção da API
├── .dockerignore
├── README.md                # Este guia
└── README-IEC.md            # Guia específico da atividade IEC
```

## Requisitos locais

- Node.js 20 ou superior
- npm
- PostgreSQL 14 ou superior
- Git
- Docker Desktop (para validar a etapa IEC)

## 1. Banco de dados

Crie um banco PostgreSQL chamado `taskflow`. Exemplo usando `psql`:

```sql
CREATE DATABASE taskflow;
```

O backend usa Sequelize e as variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `DB_SSL`.

## 2. Executar o backend

```bash
cd backend
npm install
```

Copie `.env.example` para `.env` e configure as credenciais do PostgreSQL:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_SSL=false
FRONTEND_URL=http://localhost:5173
```

Inicie a API:

```bash
npm run dev
```

A API estará em `http://localhost:3000`.

Rotas:
- `GET /api/health`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## 3. Executar o frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Copie `frontend/.env.example` para `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Execute:

```bash
npm run dev
```

Abra `http://localhost:5173`.

## 4. CRUD para demonstrar a LDW

1. A listagem é carregada por `GET /api/tasks`.
2. Use **Nova tarefa** para criar um registro (`POST`).
3. Use o botão de edição para alterar uma tarefa (`PUT`).
4. Use o botão de exclusão para remover uma tarefa (`DELETE`).
5. Abra DevTools → Network e mostre as quatro requisições.

A interface contempla carregamento, estado vazio e notificações de sucesso/erro via Sonner.

## 5. shadcn/ui

O frontend contém a configuração `components.json`, Tailwind e componentes em `src/components/ui/`. Para inicializar/reconciliar a configuração com a CLI oficial no diretório `frontend`, execute:

```bash
npx shadcn@latest init
```

Os componentes utilizados estão no padrão de composição shadcn/ui e incluem Card, Button, Input, Label, Badge, Dialog e Sonner.

## 6. Validar os comandos

Backend:

```bash
cd backend
npm run typecheck
npm run build
```

Frontend:

```bash
cd frontend
npm run typecheck
npm run build
```

## 7. IEC — Docker

Na raiz do repositório:

```bash
docker build -t taskflow-api .
```

Para executar a imagem, informe as variáveis do banco:

```bash
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=taskflow \
  -e DB_USER=postgres \
  -e DB_PASSWORD=sua_senha \
  -e DB_SSL=false \
  taskflow-api
```

`host.docker.internal` é apropriado para Docker Desktop em Windows/macOS. Em Linux, configure o endereço de rede do PostgreSQL.

## 8. Publicação e CI/CD no Render

Siga `README-IEC.md`. O deploy não é automático pelo Render: o Auto-Deploy deve ficar **No**. O GitHub Actions valida tipos, compila o backend, constrói a imagem Docker e somente então chama `secrets.RENDER_DEPLOY_HOOK_URL`.

## Observações

- Não há autenticação, pois é opcional na atividade LDW.
- A atividade IEC exige que o backend tenha persistência; as tarefas são armazenadas no PostgreSQL.
- Não inclua arquivos `.env`, senhas ou URLs privadas do Deploy Hook no Git.
- O deploy público ainda exige configurar o banco, criar o Web Service no Render, cadastrar as variáveis e adicionar o segredo no GitHub.
