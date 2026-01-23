# Testes E2E com Expo Go

Para testar o aplicativo usando **Expo Go** (em vez de um build nativo), você precisa usar o comando `openLink` do Maestro com a URL do servidor Expo.

## Como Funciona

Quando você usa Expo Go, o app não tem um bundle identifier próprio - ele roda dentro do container Expo Go. Por isso, precisamos usar a URL do servidor Expo para abrir o app.

## Passo a Passo

### 1. Iniciar o Servidor Expo

Em um terminal, inicie o servidor de desenvolvimento:

```bash
npx expo start
```

Você verá uma saída similar a:

```
Metro waiting on exp://192.168.1.100:8081
```

**Anote essa URL!** Ela será usada nos testes.

### 2. Abrir o Expo Go no Simulador

No simulador iOS, abra o app **Expo Go**. Se não estiver instalado:

```bash
# Instalar Expo Go no simulador
xcrun simctl install booted com.apple.Preferences
# Depois abra manualmente o Expo Go no simulador
```

### 3. Configurar os Testes

Edite o arquivo de teste e substitua a URL:

```yaml
- openLink: 'exp://192.168.1.100:8081' # ← Use sua URL aqui
```

### 4. Executar os Testes

```bash
# Teste específico para Expo Go
~/.maestro/bin/maestro test maestro/expo-go-test.yaml

# Ou todos os testes (se configurados)
npm run test:e2e
```

## Exemplo de Teste Completo

```yaml
---
# Abrir app no Expo Go
- openLink: 'exp://192.168.1.100:8081'

# Aguardar carregamento
- waitForAnimationToEnd
- waitForAnimationToEnd

# Navegar até Welcome
- assertVisible: 'LIKE YOUR LIFE'
- tapOn: 'Next'

# Testar Welcome Screen
- assertVisible: 'Welcome!'
- tapOn:
    id: 'input-Your name'
- inputText: 'João'
- tapOn: 'Next'
```

## Limitações do Expo Go

⚠️ **Importante**: Alguns recursos podem não funcionar no Expo Go:

- Módulos nativos customizados
- Alguns plugins do Expo podem ter limitações
- Performance pode ser diferente de um build nativo

## Alternativa: Development Build

Para testes mais completos, considere usar um **Development Build**:

```bash
# Criar development build
eas build --profile development --platform ios

# Instalar no simulador
# Depois usar appId: com.likeme.app nos testes
```

## Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "test:e2e:expo": "~/.maestro/bin/maestro test maestro/expo-go-test.yaml",
    "start:expo": "npx expo start"
  }
}
```

## Troubleshooting

### Erro: "Cannot open link"

- Verifique se o Expo Go está aberto no simulador
- Verifique se a URL está correta (formato `exp://IP:PORT`)
- Verifique se o servidor Expo está rodando

### Erro: "App not found"

- Certifique-se de que o Expo Go está instalado
- Tente abrir manualmente o Expo Go e escanear o QR code primeiro

### Testes não encontram elementos

- Aguarde mais tempo com `waitForAnimationToEnd`
- Use `optional: true` em asserts para debug
- Verifique screenshots em `/Users/weber/.maestro/tests/`
