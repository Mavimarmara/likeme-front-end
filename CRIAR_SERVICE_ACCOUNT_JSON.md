# Como criar o JSON da Service Account (Google Play)

Esse JSON é usado pelo **EAS** e pelo **Google Play Console** para fazer upload do app (AAB) **automaticamente** (`eas submit` / `npm run submit:android`). Siga estes passos.

> **Não tem acesso ao Google Cloud (só é desenvolvedor no Play)?**  
> Use **upload manual** do AAB: veja [PUBLICAR_SEM_GOOGLE_CLOUD.md](./PUBLICAR_SEM_GOOGLE_CLOUD.md).

---

## “Só tenho Play Console, não tenho Google Cloud”

O **Google Cloud Console** usa o **mesmo login do Google** que o Play Console. Não é outro produto pago.

- Acesse [console.cloud.google.com](https://console.cloud.google.com/) com o **mesmo e‑mail** que usa no [play.google.com/console](https://play.google.com/console).
- Na primeira vez, o Google pode pedir para **aceitar os termos** do Cloud. É gratuito para o que vamos fazer.
- Você precisa **criar um projeto** no Cloud (ou escolher um existente): no topo, **“Selecionar projeto”** → **“Novo projeto”** → dê um nome (ex. `likeme-play`) → **Criar**. **Não exige cartão de crédito** para projeto, API nem conta de serviço.
- Depois de criar o projeto, use-o nos passos abaixo. No **Play Console** (Configuração → Acesso à API) você vai **vincular** esse projeto do Cloud à sua conta do Play.

Resumo: **Cloud = mesmo Google, projeto gratuito**. O JSON é gerado no Cloud; o Play Console só associa esse JSON ao seu app.

---

## 1. Google Cloud Console – habilitar a API

1. Acesse: [Google Cloud Console](https://console.cloud.google.com/)
2. No topo, clique em **“Selecionar projeto”** e crie um novo ou escolha o que já está ligado ao seu app na Play Console.
3. No menu (☰), abra **APIs e serviços** → **Biblioteca**.
4. Busque por **“Google Play Android Developer API”**.
5. Abra e clique em **Ativar** (se ainda não estiver ativada).

---

## 2. Google Cloud Console – criar a Service Account e o JSON

**Link direto:** [Contas de serviço](https://console.cloud.google.com/iam-admin/serviceaccounts) (confirme o **projeto** no topo da página.)

1. No menu (☰), vá em **IAM e administração** → **Contas de serviço**.
2. Clique em **+ CRIAR CONTA DE SERVIÇO**.
3. **Nome**: ex. `eas-play-upload` (pode ser outro).
4. Clique em **Criar e continuar**.
5. Em “Conceder acesso”: pode pular (**Concluir**) ou, se quiser, adicionar uma função (ex. “Editor”). Para EAS/Play, o que importa são as permissões no Play Console.
6. Clique em **Concluir**.
7. Na lista, **clique no e‑mail** da conta (ex. `eas-play-upload@seu-projeto.iam.gserviceaccount.com`) para abrir os **detalhes**.
8. Na página de detalhes, abra a aba **Chaves** / **Keys** (no topo).
9. Clique em **ADICIONAR CHAVE** / **ADD KEY** — é um **menu em gota (▼)**: escolha **Criar nova chave** / **Create new key**.
10. Tipo: **JSON** → **Criar** / **Create**. O `.json` será **baixado**. **Guarde em local seguro** (ex. `~/likeme-google-play-key.json`) e **não faça commit** no repositório.

> **Dica:** O Google só permite baixar a chave **uma vez**. Se perder o arquivo, crie outra chave.

### Alternativa: criar o JSON pelo terminal (gcloud)

Se tiver o [gcloud CLI](https://cloud.google.com/sdk/docs/install) instalado e autenticado (`gcloud auth login`):

```bash
# Troque PROJETO e NOME_DA_CONTA pelos seus. Ex.:
# PROJETO=meu-projeto-123
# NOME_DA_CONTA=eas-play-upload
gcloud iam service-accounts keys create ~/likeme-google-play-key.json \
  --iam-account=NOME_DA_CONTA@PROJETO.iam.gserviceaccount.com
```

O arquivo será salvo em `~/likeme-google-play-key.json`. Depois, siga o **passo 3** para vincular no Play Console.

---

## 3. Google Play Console – vincular a Service Account e dar permissão

1. Acesse: [Google Play Console](https://play.google.com/console)
2. Selecione seu app (LikeMe).
3. No menu da esquerda, vá em **Configuração** (ou **Setup**) → **Acesso à API** (ou **API access**).
4. Em “Contas de serviço” (ou “Service accounts”), clique em **Vincular conta de serviço existente** / **Link existing service account**.
5. Escolha o **projeto do Google Cloud** em que você criou a conta (passo 1).
6. Selecione a **conta de serviço** que você criou (ex. `eas-play-upload@seu-projeto.iam.gserviceaccount.com`).
7. Clique em **Conceder acesso** / **Grant access** (ou equivalente).
8. Na tela de permissões, marque ao menos:
   - **“Lançar em produção, excluir dispositivos e usar Play App Signing”**  
     ou  
   - **“Liberar apps em produção, dispositivos de teste e trilhas de teste”**
   - Se existir **“Admin (todas as permissões)”** ou **“Release Manager”**, pode usar para simplificar.
9. Salve/Concluir.

---

## 4. Usar o JSON no EAS

No seu Mac, no terminal, dentro do projeto:

```bash
# Opção A: configurar nas credenciais do EAS (recomendado)
eas credentials
# Escolha: Android → Set up Google Play credentials
# Quando pedir, informe o caminho do JSON, ex.:
# /Users/weber/likeme-google-play-key.json

# Opção B: ao rodar o submit, o EAS pede o caminho do JSON na primeira vez
npm run submit:android
# Quando pedir "Path to Google Service Account file:", cole o caminho do .json
```

Exemplo de caminho do arquivo:

- `~/likeme-google-play-key.json`, ou  
- `/Users/weber/Projetos/likeme/likeme-google-play-key.json`  
  (desde que o arquivo **não** esteja dentro da pasta do projeto, para não ir para o Git).

---

## Resumo rápido

| Onde                | O que fazer                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Google Cloud**    | Ativar “Google Play Android Developer API”; criar conta de serviço; gerar chave JSON. |
| **Play Console**    | Configuração → Acesso à API → Vincular essa conta e dar permissão de release. |
| **EAS / terminal**  | `eas credentials` ou `npm run submit:android` e informar o caminho do `.json`. |

---

## Se não achar “Acesso à API” no Play Console

- O caminho pode ser: **Configuração** (ícone de engrenagem) → **Acesso à API** / **API access**.
- Ou: **Todos os aplicativos** → seu app → **Configuração** / **Setup** → **Acesso à API**.

---

## Links diretos

- [Google Cloud – Contas de serviço](https://console.cloud.google.com/iam-admin/serviceaccounts)
- [Contas de serviço – walkthrough “criar chave”](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1#step_index=1) (abre o passo a passo no Console)
- [Google Play Android Developer API – ativar](https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com)
- [Google Play Console](https://play.google.com/console)
