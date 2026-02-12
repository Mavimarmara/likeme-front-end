# RegisterScreen – Pontos de melhoria (visão dev sênior)

Melhorias já aplicadas nesta iteração:
- Tipagem forte: `Props` com `StackScreenProps<RootStackParamList, 'Register'>`
- Tratamento de erro: `catch (error: unknown)` + `Alert` para o usuário + chave `auth.registerError`
- Constantes nomeadas: `SCROLL_FOCUS_OFFSET_PX`, `SCROLL_PADDING_WHEN_KEYBOARD_OPEN`, `KEYBOARD_RESPIRATION`
- Modal de gênero: `onStartShouldSetResponder={() => true}` no conteúdo para não fechar ao tocar na área branca
- `handleNext` e `handleSkip` com `useCallback` e `try/catch` em ambos
- Navegação tipada: `navigation.navigate('PersonalObjectives', { userName })` sem `as never`
- Remoção de variável não usada em `styles.ts` (`width`)

---

## Sugestões futuras

### 1. **findNodeHandle**
- Está deprecated no React. Alternativas: guardar posições com `onLayout` ou usar lib (ex.: `react-native-keyboard-controller`).

### 2. **Código de convite**
- `invitationCode` é coletado mas não enviado em `personData`. Confirmar se deve ir para a API ou ser removido.

### 3. **Validação**
- Validar idade (número, faixa razoável), peso e altura quando preenchidos (formato/range).
- Exibir erros inline (ex.: debaixo do campo) além de `Alert` onde fizer sentido.

### 4. **Estado do formulário**
- Avaliar `useReducer` ou um único objeto de estado para muitos campos (facilita reset e validação centralizada).

### 5. **Componentização**
- Extrair lista de campos para um config + map ou um componente `FormFieldRow` (ref, onFocus, label, etc.) para reduzir repetição.

### 6. **Acessibilidade**
- `accessibilityLabel` e `accessibilityRole` no modal de gênero e no touchable do campo.
- Garantir que o campo de gênero tenha um label acessível associado.

### 7. **Loading no “Pular”**
- Considerar estado de loading em `handleSkip` e desabilitar botão enquanto navega, para evitar duplo toque.

### 8. **Estilos**
- Trocar cores hardcoded (ex.: `#fdfbee`, `#001137`) por tokens de `COLORS` onde já existirem.

### 9. **Testes**
- Testes unitários para `handleNext` (validação, montagem de `personData`, navegação).
- Teste de acessibilidade do modal de gênero.
