# 📱 Build e Deploy para Google Play Console

Este guia explica como gerar e publicar builds do LikeMe na Google Play Console usando EAS Build.

## 📋 Pré-requisitos

1. ✅ Conta no [Expo](https://expo.dev) (já configurada)
2. ✅ Conta na [Google Play Console](https://play.google.com/console)
3. ✅ App criado na Google Play Console
4. ✅ EAS CLI instalado: `npm install -g eas-cli`
5. ✅ Login no EAS: `eas login`

## 🔑 Configuração Inicial

### 1. Configurar Credenciais do Google Play no EAS

O EAS precisa de acesso à sua conta do Google Play para fazer upload automático:

```bash
# Configurar credenciais do Google Play
eas credentials
```

Selecione:
- **Platform**: Android
- **Project**: likeme-front-end
- **Action**: Set up Google Play credentials

Você precisará:
- **Service Account JSON**: Baixe o arquivo JSON da Google Play Console
  - Vá em: Google Play Console → Setup → API access
  - Crie um Service Account
  - Baixe o arquivo JSON
  - Faça upload no EAS quando solicitado

### 2. Verificar Configuração do App

O app já está configurado com:
- **Package Name**: `com.likeme.app`
- **Version Code**: Auto-incrementado pelo EAS
- **Build Type**: `app-bundle` (formato necessário para Google Play)

## 🚀 Gerar Build para Produção

### Opção 1: Build na Nuvem (Recomendado)

```bash
# Build para produção
npm run build:android

# Ou diretamente com EAS
eas build --platform android --profile production
```

O EAS irá:
1. ✅ Gerar o keystore automaticamente (na primeira vez)
2. ✅ Compilar o app-bundle
3. ✅ Fazer upload para o EAS
4. ✅ Disponibilizar o download

### Opção 2: Build Local

```bash
# Build local (requer Android SDK configurado)
npm run build:android:local
```

## 📤 Enviar para Google Play Console

### Opção 1: Upload Automático (Recomendado)

**Imediatamente após o build completar**, rode no terminal (é interativo na primeira vez):

```bash
# Enviar o último build para produção
npm run submit:android
```

Na **primeira vez** o EAS vai pedir o **Google Service Account (JSON)**:
- Se ainda não configurou: rode `eas credentials` → Android → *Set up Google Play credentials* → informe o caminho do JSON.
- Guia do Google: [Expo - Creating Google Service Account](https://expo.fyi/creating-google-service-account)  
  Resumo: Google Play Console → **Setup** → **API access** → criar Service Account → baixar JSON.

Depois de configurado, `npm run submit:android` envia o build mais recente direto para a track **production**.

O EAS irá:
1. ✅ Pegar o build mais recente
2. ✅ Fazer upload para a Google Play Console
3. ✅ Publicar na track de produção (ou internal, conforme configurado)

### Opção 2: Upload Manual (sem Google Cloud / sem JSON)

Se você **não tem acesso ao Google Cloud** ou é apenas **desenvolvedor** no Play, use o upload manual. Guia completo: [PUBLICAR_SEM_GOOGLE_CLOUD.md](./PUBLICAR_SEM_GOOGLE_CLOUD.md).

1. Baixe o `.aab` do [EAS / expo.dev](https://expo.dev) → Builds → build Android → Download
2. Acesse [Google Play Console](https://play.google.com/console)
3. Vá em: **Production** → **Releases** → **Create new release**
4. Faça upload do arquivo `.aab`
5. Preencha as informações da release
6. Clique em **Review release**

## 📝 Configuração do eas.json

O arquivo `eas.json` já está configurado:

```json
{
  "build": {
    "production": {
      "distribution": "store",
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "production"
      }
    }
  }
}
```

### Tracks Disponíveis

- **production**: Produção (público)
- **internal**: Teste interno
- **alpha**: Teste fechado (alpha)
- **beta**: Teste fechado (beta)

Para mudar a track, edite o `eas.json`:

```json
"submit": {
  "production": {
    "android": {
      "track": "internal"  // ou "alpha", "beta"
    }
  }
}
```

## 🔄 Versionamento

O EAS gerencia automaticamente o `versionCode`:
- Cada build incrementa automaticamente
- Não precisa editar manualmente

Para atualizar a versão do app (`version` no `app.config.js`):

```bash
# Edite app.config.js
version: '1.0.1',  # Atualize aqui
```

## ✅ Checklist Antes de Publicar

- [ ] App criado na Google Play Console
- [ ] Package name configurado: `com.likeme.app`
- [ ] Credenciais do Google Play configuradas no EAS
- [ ] Build de produção gerado com sucesso
- [ ] Testado o build localmente (se possível)
- [ ] Informações do app preenchidas na Play Console:
  - [ ] Descrição curta
  - [ ] Descrição completa
  - [ ] Screenshots
  - [ ] Ícone do app
  - [ ] Categoria
  - [ ] Classificação de conteúdo
  - [ ] Política de privacidade (URL)

## 🐛 Troubleshooting

### Erro: "No credentials found"

```bash
# Configure as credenciais
eas credentials
```

### Erro: "Keystore not found"

O EAS cria o keystore automaticamente na primeira vez. Se necessário:

```bash
# Verificar credenciais
eas credentials

# Se necessário, criar novo keystore
eas credentials --platform android
```

### Erro: "Package name already exists"

- Verifique se o package name `com.likeme.app` está disponível
- Se não estiver, altere em `app.config.js`:
  ```javascript
  android: {
    package: 'com.likeme.app.novo',  // Use um package único
  }
  ```

### Build falha

1. Verifique os logs no EAS Dashboard
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Verifique se o `.env` está correto

## 📚 Comandos Úteis

```bash
# Ver builds anteriores
eas build:list --platform android

# Ver detalhes de um build
eas build:view [BUILD_ID]

# Cancelar build em andamento
eas build:cancel [BUILD_ID]

# Ver credenciais configuradas
eas credentials

# Ver status do submit
eas submit:list --platform android
```

## 🔗 Links Úteis

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Expo Dashboard](https://expo.dev)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no EAS Dashboard
2. Consulte a [documentação do Expo](https://docs.expo.dev)
3. Verifique os [fóruns do Expo](https://forums.expo.dev)

