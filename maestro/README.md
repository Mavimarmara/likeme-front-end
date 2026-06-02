# Testes E2E com Maestro

Este diretório contém testes end-to-end (E2E) usando Maestro para simular interações reais de usuário no simulador iOS.

## Pré-requisitos

1. Maestro CLI instalado (já instalado via script)
2. Simulador iOS rodando
3. App instalado no simulador **OU** Expo Go instalado (para desenvolvimento)

## Modos de Teste

### 1. Teste com Build Nativo (Recomendado para CI/CD)

Use quando o app está instalado como build nativo no simulador:

```bash
npm run ios:xcode:build:debug   # compila o binário Debug (simulador)
# Depois: abrir ios/LikeMe.xcworkspace no Xcode e Product → Run (⌘R) para instalar no simulador
npm run test:e2e  # executa os testes
```

Os testes usam `appId: com.likeme.app` para identificar o app.

### 2. Teste com Expo Go (Recomendado para desenvolvimento rápido)

Use quando você está desenvolvendo e quer testar rapidamente sem fazer build:

```bash
# Terminal 1: Iniciar servidor Expo
npx expo start

# Terminal 2: Executar testes
npm run test:e2e:expo-go
```

Os testes usam `openLink` com a URL do Expo (formato `exp://IP:PORT`). O IP/porta vêm do terminal onde o Metro está rodando (`npm run start:clear`).

## Estrutura dos Testes

- `welcome-screen.yaml` - Testa a tela de boas-vindas
- `personal-objectives.yaml` - Testa a seleção de objetivos pessoais
- `onboarding-flow.yaml` - Testa o fluxo completo de onboarding
- `complete-user-journey.yaml` - Testa a jornada completa do usuário
- `export-screenshots.yaml` - Exporta telas de auth como screenshots (PNG)
- `export-screenshots-app.yaml` - Exporta telas do app autenticado (requer login prévio)

## Exportar Screenshots das Telas

Para exportar todas as telas do app como imagens PNG:

**Telas de auth (sem login):**

```bash
npm run export:screenshots
```

**Telas do app autenticado (Summary, Atividades, Marketplace, etc.):**

1. Execute o app e faça login manualmente
2. Complete o onboarding
3. Feche o app e execute:

```bash
npm run export:screenshots:app
```

Os screenshots são salvos em `.maestro/screenshots/`. Para converter para JPG:

```bash
cd .maestro/screenshots/screens
for f in *.png; do sips -s format jpeg "$f" --out "${f%.png}.jpg"; done
```

## Executando os Testes

### Executar um teste específico:

```bash
~/.maestro/bin/maestro test maestro/welcome-screen.yaml
```

### Executar todos os testes:

```bash
~/.maestro/bin/maestro test maestro/
```

### Executar em um dispositivo específico:

```bash
~/.maestro/bin/maestro test maestro/welcome-screen.yaml --device <DEVICE_ID>
```

### Verificar dispositivos disponíveis:

```bash
xcrun simctl list devices
```

## Instalando o App no Simulador

Antes de executar os testes, certifique-se de que o app está instalado:

```bash
npm run ios:xcode:build:debug
# em seguida instale no simulador com Xcode: LikeMe.xcworkspace → Run (⌘R)
```

## Debugging

Para ver logs detalhados durante a execução:

```bash
~/.maestro/bin/maestro test maestro/welcome-screen.yaml --verbose
```

Para ver o que o Maestro está fazendo em tempo real:

```bash
~/.maestro/bin/maestro test maestro/welcome-screen.yaml --debug-output
```
