# 🔑 Como Criar Keystore de Produção para Android

## ⚠️ Quando Você PRECISA de Keystore de Produção

**SIM, você precisa de keystore de produção para:**

- ✅ **Internal Testing** na Google Play
- ✅ **Alpha/Beta Testing** na Google Play
- ✅ **Production** na Google Play
- ✅ Qualquer upload na Google Play Console

**NÃO precisa de keystore de produção para:**

- ❌ Testes locais (instalar APK diretamente no dispositivo)
- ❌ Desenvolvimento local
- ❌ Testes com emulador

**Resumo**: Se você vai fazer upload na Google Play (mesmo que seja apenas para testes internos), você PRECISA de um keystore de produção. O keystore de debug não pode ser usado para uploads na Google Play.

## 📋 Pré-requisitos

- Java instalado (já está instalado - Java 17)
- Acesso ao terminal

## 🚀 Passo a Passo

### 1. Navegar para a pasta do app

```bash
cd /Users/weber/Projetos/likeme/likeme-front-end/android/app
```

### 2. Gerar o Keystore

Execute o comando abaixo, **substituindo `SUA_SENHA_AQUI`** por uma senha segura:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore likeme-release.keystore \
  -alias likeme-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass SUA_SENHA_AQUI \
  -keypass SUA_SENHA_AQUI
```

**Exemplo com senha real:**

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore likeme-release.keystore \
  -alias likeme-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass MinhaSenhaSegura123! \
  -keypass MinhaSenhaSegura123!
```

### 3. Preencher as Informações

O comando vai pedir algumas informações:

- **Nome e sobrenome**: Seu nome ou nome da empresa
- **Unidade organizacional**: Departamento (ex: "Development")
- **Organização**: Nome da organização (ex: "LikeMe")
- **Cidade**: Sua cidade
- **Estado**: Seu estado (ex: "SP")
- **Código do país**: Código de 2 letras (ex: "BR")

**Exemplo de respostas:**

```
Nome e sobrenome: LikeMe App
Unidade organizacional: Development
Organização: LikeMe
Cidade: São Paulo
Estado: SP
Código do país: BR
```

### 4. Confirmar as Informações

Digite `yes` para confirmar.

### 5. Criar arquivo de propriedades

Após criar o keystore, crie o arquivo `android/keystore.properties`:

```bash
cd /Users/weber/Projetos/likeme/likeme-front-end/android
```

Crie o arquivo com as credenciais:

```bash
cat > keystore.properties << EOF
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=likeme-key-alias
storeFile=likeme-release.keystore
EOF
```

**Substitua `SUA_SENHA_AQUI` pela mesma senha que você usou no passo 2.**

### 6. Verificar se foi criado

```bash
# Verificar se o keystore foi criado
ls -la android/app/likeme-release.keystore

# Verificar se o arquivo de propriedades foi criado
ls -la android/keystore.properties
```

## ⚠️ IMPORTANTE

1. **Guarde a senha em local seguro!** Você precisará dela para todas as atualizações do app.
2. **NÃO commite o keystore ou o arquivo de propriedades no Git!**
3. **Faça backup do keystore!** Se você perder o keystore, não poderá atualizar o app na Google Play.

## 🔒 Segurança

Adicione ao `.gitignore` (se ainda não estiver):

```
android/keystore.properties
android/app/*.keystore
android/app/*.jks
!android/app/debug.keystore
```

## ✅ Verificar se está funcionando

Após criar o keystore, você pode testar se está configurado corretamente tentando gerar um build:

```bash
cd /Users/weber/Projetos/likeme/likeme-front-end
npm run build:android:production
```

Se o build funcionar, o AAB será gerado em:

```
android/app/build/outputs/bundle/release/app-release.aab
```

## 🆘 Problemas Comuns

### Erro: "keytool: command not found"

Certifique-se de que o Java está instalado e no PATH:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
```

### Erro: "Keystore was tampered with, or password was incorrect"

Verifique se as senhas no `keystore.properties` estão corretas e são as mesmas usadas na criação do keystore.

### Esqueci a senha do keystore

Infelizmente, não há como recuperar a senha. Você precisará criar um novo keystore e criar um novo app na Google Play Console (ou usar o keystore antigo se você tiver backup).
