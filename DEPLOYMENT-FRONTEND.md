# Deploy do frontend — Kenia Pinheiro Studio

Este projeto é um frontend Vue 3 com Vite. O deploy é feito exclusivamente pelo GitHub Actions usando a Vercel CLI.

O fluxo é:

```text
Pull Request → build de validação, sem deploy
push em develop → build → Preview via Vercel CLI
push em main → build → Production via Vercel CLI
```

A integração Git nativa da Vercel deve permanecer ignorada pelo campo **Ignored Build Step**.

## Arquivos de infraestrutura adicionados

Os arquivos adicionados ou ajustados para deploy são:

```text
.env.example
.gitignore
.github/workflows/ci.yml
scripts/ignore-vercel-git.sh
vercel.json
DEPLOYMENT-FRONTEND.md
```

Nenhum arquivo em `src/` foi alterado. O arquivo `.env` local não é distribuído porque pode conter configuração específica da máquina.

## 1. Criar o projeto frontend na Vercel

Crie um projeto separado para o frontend, por exemplo:

```text
site-kenia-pinheiro-studio
```

O projeto frontend deve ser diferente do projeto da API:

```text
API      → api-kenia-pinheiro-studio
Frontend → site-kenia-pinheiro-studio
```

O repositório conectado deve ser o repositório do frontend.

Na configuração do projeto, confirme:

```text
Framework Preset: Vite
Root Directory: ./
```

Como o deploy automático será bloqueado depois, o primeiro deploy pode ser apenas usado para criar o projeto e confirmar sua configuração.

## 2. Configurar o build da Vercel

O arquivo `vercel.json` contém:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

As configurações significam:

```text
npm ci          → instala exatamente o package-lock.json
npm run build   → executa o build Vite
 dist           → saída publicada
 rewrite        → permite atualizar rotas do Vue Router sem 404
```

O rewrite é necessário porque o frontend usa `createWebHistory`. Sem ele, acessar diretamente `/services`, `/gallery` ou `/login` pode retornar 404 na Vercel.

## 3. Variável `VITE_API_URL`

O frontend usa:

```javascript
import.meta.env.VITE_API_URL
```

Como essa variável é incorporada durante o build, ela precisa existir na Vercel antes do comando `vercel build`.

### Production

Na Vercel:

```text
Project → Settings → Environment Variables → Add New
```

Cadastre:

```text
Name: VITE_API_URL
Value: https://api-kenia-pinheiro-studio.vercel.app
Environment: Production
```

Use a URL pública estável da API de produção.

### Preview

Cadastre uma variável separada:

```text
Name: VITE_API_URL
Value: URL estável da API de desenvolvimento
Environment: Preview
```

A URL Preview da API deve ser estável. Uma URL de deployment individual pode mudar a cada execução do backend. O ideal é usar um domínio ou alias estável para a API de desenvolvimento, por exemplo:

```text
https://api-dev.seudominio.com
```

Se ainda não houver alias estável para a API Preview, use temporariamente a URL Preview atual do backend, sabendo que será necessário atualizá-la quando o endereço mudar.

O valor de `VITE_API_URL` deve ser somente a origem, sem barra final:

```text
Correto:   https://api-kenia-pinheiro-studio.vercel.app
Evite:     https://api-kenia-pinheiro-studio.vercel.app/
```

## 4. Configurar os secrets do GitHub

No repositório do frontend:

```text
Settings → Secrets and variables → Actions → New repository secret
```

Crie:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Esses IDs são do projeto frontend, não da API.

### `VERCEL_TOKEN`

Na Vercel:

```text
Account Settings → Tokens → Create Token
```

O token deve ter acesso à conta ou equipe que possui o projeto frontend.

### `VERCEL_PROJECT_ID`

Na Vercel:

```text
Frontend Project → Settings → General → Project ID
```

Copie o valor que começa normalmente com `prj_`.

### `VERCEL_ORG_ID`

Use o ID da conta ou equipe que possui o projeto frontend. Em uma equipe, normalmente começa com `team_`.

Uma forma segura de obter os dois IDs é:

```powershell
npm install --global vercel
vercel login
vercel link
Get-Content .vercel/project.json
```

Não faça commit da pasta `.vercel/`.

## 5. Bloquear o deploy Git nativo

O arquivo:

```text
scripts/ignore-vercel-git.sh
```

contém:

```bash
#!/usr/bin/env bash

# Este projeto publica exclusivamente pelo GitHub Actions usando a Vercel CLI.
# Qualquer deployment iniciado pela integração Git nativa deve ser ignorado.
exit 0
```

Na Vercel, configure:

```text
Project → Settings → Git → Ignored Build Step
```

Com o comando:

```bash
bash scripts/ignore-vercel-git.sh
```

A regra da Vercel é:

```text
exit 0 → ignora o deployment Git nativo
exit 1 → permite continuar o build nativo
```

Como o script sempre retorna `0`, nenhum push criará deploy pela integração Git nativa.

O deploy efetivo será feito somente pelo GitHub Actions.

## 6. Workflow do GitHub Actions

O arquivo `.github/workflows/ci.yml` possui três jobs:

```text
checks
 deploy-preview
 deploy-production
```

### Pull Request

Em Pull Requests para `main` ou `develop`, executa somente:

```text
npm ci
npm run build
```

Não publica nada.

### Push em `develop`

Executa:

```text
npm ci
npm run build
vercel pull --environment=preview
vercel build
vercel deploy --prebuilt
```

A variável usada será a de ambiente Preview, incluindo `VITE_API_URL` do backend dev.

### Push em `main`

Executa:

```text
npm ci
npm run build
vercel pull --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

A variável usada será a de ambiente Production, incluindo `VITE_API_URL` da API de produção.

## 7. Enviar os arquivos ao GitHub

Na raiz do frontend:

```powershell
git checkout develop
git pull origin develop

git add .env.example .gitignore vercel.json scripts/ignore-vercel-git.sh .github/workflows/ci.yml DEPLOYMENT-FRONTEND.md
git commit -m "ci: configure frontend CLI deployment"
git push origin develop
```

Não adicione:

```text
.env
node_modules/
dist/
.vercel/
```

## 8. Testar o Preview

Faça um commit controlado em `develop`:

```powershell
Add-Content DEPLOYMENT-FRONTEND.md "`nPreview pipeline validated."
git add DEPLOYMENT-FRONTEND.md
git commit -m "chore: trigger frontend preview"
git push origin develop
```

No GitHub:

```text
Actions → CI/CD Frontend
```

O fluxo esperado é:

```text
Build frontend
    ↓
Deploy Preview (develop)
```

Abra a URL exibida pelo comando `vercel deploy --prebuilt` no log do job.

## 9. Testar o Production

Depois de validar o Preview:

```text
Pull Request develop → main
→ aprovação
→ merge
→ Build frontend
→ Deploy Production (main)
```

A URL final será a URL de produção do projeto frontend, por exemplo:

```text
https://site-kenia-pinheiro-studio.vercel.app
```

## 10. Proteger `main`

No GitHub, proteja `main` com:

- Pull Request obrigatório;
- aprovação obrigatória;
- check `Build frontend` obrigatório;
- push direto bloqueado;
- branch atualizada antes do merge.

Opcionalmente, em:

```text
Settings → Environments → production
```

adicione aprovação obrigatória para o ambiente `production`. Nesse caso, o job `Deploy Production (main)` aguardará aprovação antes de publicar.

## 11. Compatibilidade com a API

O frontend chama a API por `VITE_API_URL`. Portanto, a API precisa permitir a origem pública do frontend no CORS.

Atualmente, a API anexada possui origens locais fixas. Se o navegador apresentar erro de CORS depois da publicação, a API precisará ser configurada para aceitar a origem do frontend. Isso é uma alteração na API, não no código do site, e não foi feita neste pacote por causa da restrição solicitada.

Também existe uma referência local no código do site para:

```text
http://localhost:8000/upload/perfil/...
```

Essa referência pertence ao código original do site e não foi alterada. Ela pode fazer uma imagem específica da área de perfil continuar apontando para localhost em produção. Corrigi-la exigiria alterar código em `src/`, portanto fica como pendência explícita.

## 12. Validação realizada

O build existente do site foi executado sem alterações no código-fonte:

```text
npm ci
npm run build
```

Resultado:

```text
Vite build concluído com sucesso
saída gerada em dist/
```
