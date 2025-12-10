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
npm run ios  # Instala o app nativo
npm run test:e2e  # Executa os testes
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

Os testes usam `openLink` com a URL do Expo (formato `exp://IP:PORT`).

📖 **Veja mais detalhes em:** [README-EXPO-GO.md](./README-EXPO-GO.md)

## Estrutura dos Testes

- `welcome-screen.yaml` - Testa a tela de boas-vindas
- `personal-objectives.yaml` - Testa a seleção de objetivos pessoais
- `onboarding-flow.yaml` - Testa o fluxo completo de onboarding
- `complete-user-journey.yaml` - Testa a jornada completa do usuário

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
npm run ios
# ou
npx expo run:ios
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