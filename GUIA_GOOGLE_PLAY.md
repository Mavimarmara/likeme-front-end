# 📱 Guia Completo: Enviar App para Google Play

## ✅ Status Atual

- ✅ Prebuild funcionando
- ⚠️ Build do AAB ainda não está funcionando (Gradle não está configurando o projeto `:app`)

## 🔧 Passos para Enviar para Google Play

### 1. Resolver o Problema do Build

O Gradle não está configurando o projeto `:app`. Isso precisa ser resolvido antes de gerar o AAB.

**Possíveis soluções:**
- Verificar se há problemas com o autolinking do Expo
- Tentar executar o build sem o script: `cd android && ./gradlew bundleRelease`
- Verificar se há erros no `build.gradle`

### 2. Criar Keystore de Produção (Se ainda não tiver)

```bash
cd android/app

# Gerar keystore (substitua SUA_SENHA_AQUI pela senha desejada)
keytool -genkeypair -v -storetype PKCS12 -keystore likeme-release.keystore \
  -alias likeme-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass SUA_SENHA_AQUI \
  -keypass SUA_SENHA_AQUI
```

**⚠️ IMPORTANTE**: Guarde a senha e o alias em local seguro! Você precisará deles para todas as atualizações.

### 3. Configurar Credenciais no Gradle

Crie o arquivo `android/keystore.properties`:

```properties
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=likeme-key-alias
storeFile=likeme-release.keystore
```

**⚠️ IMPORTANTE**: Adicione `keystore.properties` ao `.gitignore` para não commitar as senhas!

### 4. Gerar o AAB

Após resolver o problema do build, execute:

```bash
cd android
./gradlew bundleRelease
```

O AAB será gerado em:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 5. Enviar para Google Play Console

#### Opção A: Upload Manual

1. Acesse [Google Play Console](https://play.google.com/console)
2. Selecione seu app
3. Vá em: **Production** → **Releases** → **Create new release**
4. Faça upload do arquivo `.aab` gerado
5. Preencha as informações da release:
   - Release name (ex: "1.0.0")
   - Release notes (o que mudou nesta versão)
6. Clique em **Review release**
7. Revise e publique

#### Opção B: Usar EAS Submit (Recomendado)

Se você tiver o EAS configurado:

```bash
# Enviar build para Google Play
npm run submit:android

# Ou diretamente
eas submit --platform android --profile production
```

### 6. Checklist Antes de Publicar

- [ ] App criado na Google Play Console
- [ ] Package name configurado: `com.likeme.app`
- [ ] Keystore de produção criado e configurado
- [ ] AAB gerado com sucesso
- [ ] AAB assinado com keystore de produção (não debug)
- [ ] Informações do app preenchidas na Play Console:
  - [ ] Descrição curta
  - [ ] Descrição completa
  - [ ] Screenshots (pelo menos 2)
  - [ ] Ícone do app
  - [ ] Política de privacidade (URL)
- [ ] Testado o build localmente (se possível)

## 🔍 Troubleshooting

### Problema: Gradle não configura o projeto `:app`

**Sintoma**: O build para após executar apenas tarefas dos plugins, sem configurar o projeto `:app`.

**Possíveis causas:**
- Problema com o autolinking do Expo
- Erro silencioso na fase de configuração
- Problema com a configuração do React Native/Expo SDK 54

**Soluções a tentar:**
1. Limpar cache do Gradle:
   ```bash
   cd android
   ./gradlew clean
   rm -rf .gradle build app/build
   ```

2. Verificar se há erros no `build.gradle`:
   ```bash
   cd android
   ./gradlew :app:help --stacktrace
   ```

3. Tentar build sem o script:
   ```bash
   cd android
   ./gradlew bundleRelease --no-daemon --stacktrace
   ```

### Problema: "keystore.properties not found"

Certifique-se de que o arquivo existe em `android/keystore.properties`

### Problema: "Keystore was tampered with, or password was incorrect"

Verifique se as senhas no `keystore.properties` estão corretas

## 📚 Recursos

- [Documentação do Google Play Console](https://support.google.com/googleplay/android-developer)
- [Guia de Build Local](./BUILD_GOOGLE_PLAY_LOCAL.md)
- [Guia de Build com EAS](./BUILD_GOOGLE_PLAY.md)
