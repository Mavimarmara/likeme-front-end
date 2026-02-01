# Analytics GA4 – LikeMe

Camada centralizada de **Google Analytics 4 (GA4)** para o app React Native (Expo). Inclui `screen_view` em todas as telas e helpers para eventos (cliques, formulários, abas, erros, etc.).

## Estrutura

- **`constants.ts`** – Nomes de eventos (GA4 recomendados + customizados), parâmetros e mapeamento de telas.
- **`types.ts`** – Tipos para parâmetros e provedor de analytics.
- **`AnalyticsService.ts`** – Serviço que envia eventos (usa Firebase Analytics quando disponível; senão no-op).
- **`useScreenTracking.ts`** – Hook `useAnalyticsScreen` para disparar `screen_view` ao entrar na tela.
- **`index.ts`** – Reexporta constantes, tipos, serviço e hook.

## Configuração do Firebase (GA4)

**Já configurado no projeto:**
- Pacotes `@react-native-firebase/app` e `@react-native-firebase/analytics` instalados.
- Plugins do Firebase no `app.config.js`.
- **iOS:** `GoogleService-Info.plist` na raiz do projeto; `ios.bundleIdentifier` = `com.likeme.app`; Analytics habilitado no plist.

**O que falta (se quiser GA4 no Android):**

1. No [Firebase Console](https://console.firebase.google.com), no mesmo projeto, adicione o app **Android** (package: `com.likeme.app`).
2. Baixe o arquivo **`google-services.json`** e coloque na **raiz** do projeto (junto do `GoogleService-Info.plist`).
3. Rode `npx expo prebuild` (ou `npx expo prebuild --platform android`) para o plugin copiar o arquivo para `android/app/`.

**Para gerar o build nativo (iOS e/ou Android):**

```bash
npx expo prebuild
```

Depois: `npx expo run:ios` ou `npx expo run:android`. O `AnalyticsService` envia eventos para o GA4 quando o Firebase está disponível (plist no iOS, google-services.json no Android).

## Uso nas telas

### 1. Screen view (obrigatório em toda tela)

No topo do componente da tela:

```tsx
import { useAnalyticsScreen } from '@/analytics';

const MinhaTela: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'MinhaTela', screenClass: 'MinhaTelaScreen' });
  // ...
};
```

`screenName` deve ser o **nome da rota** (ex: `'Welcome'`, `'ProductDetails'`). O módulo converte para o `screen_name` do GA4 (ex: `welcome`, `product_details`) via `getScreenName()` em `constants.ts`. Se a rota não estiver mapeada, adicione em `SCREEN_NAMES` em `constants.ts`.

### 2. Clique em botão

```tsx
import { logButtonClick, logNavigation } from '@/analytics';

// Botão "Voltar"
logButtonClick({
  screen_name: 'welcome',
  button_label: 'back',
  action_name: 'go_back',
});
logNavigation({ source_screen: 'welcome', destination_screen: 'unauthenticated', action_name: 'go_back' });
navigation.goBack();
```

### 3. Submissão de formulário

```tsx
import { logFormSubmit } from '@/analytics';

// Sucesso
logFormSubmit({
  screen_name: 'welcome',
  form_name: 'welcome_name',
  success: true,
});

// Erro de validação
logFormSubmit({
  screen_name: 'welcome',
  form_name: 'welcome_name',
  success: false,
  error_type: 'validation_empty_name',
});
```

### 4. Seleção de aba/tab

```tsx
import { logTabSelect } from '@/analytics';

logTabSelect({
  screen_name: 'product_details',
  tab_id: 'description',
  item_name: 'Descrição',
});
setActiveTab('description');
```

### 5. Add to cart (evento recomendado GA4)

```tsx
import { logAddToCart } from '@/analytics';

logAddToCart({
  item_id: product.id,
  item_name: product.title,
  item_category: 'Program',
  value: 99.9,
});
handleAddToCart();
```

### 6. Conteúdo selecionado (produto relacionado, perfil, etc.)

```tsx
import { logSelectContent } from '@/analytics';

logSelectContent({
  content_type: 'related_product',
  item_id: product.id,
  item_name: product.title,
  screen_name: 'product_details',
});
```

### 7. Erro visível ao usuário

```tsx
import { logError } from '@/analytics';

logError({
  screen_name: 'product_details',
  error_type: 'product_not_found',
});
```

### 8. Evento genérico

```tsx
import { logEvent } from '@/analytics';
import { ANALYTICS_PARAMS } from '@/analytics';

logEvent('custom_event_name', {
  [ANALYTICS_PARAMS.SCREEN_NAME]: 'product_details',
  [ANALYTICS_PARAMS.ACTION_NAME]: 'share',
  item_id: product.id,
});
```

## Como adicionar novos eventos no futuro

1. **Nome do evento**  
   Preferir eventos recomendados do GA4 em `GA4_EVENTS`. Se for customizado, usar `snake_case` e adicionar em `CUSTOM_EVENTS` em `constants.ts`.

2. **Parâmetros**  
   Usar as chaves de `ANALYTICS_PARAMS` quando fizer sentido. Não enviar PII (email, nome completo, etc.).

3. **Helpers reutilizáveis**  
   Se o mesmo tipo de ação aparecer em várias telas, criar uma função em `AnalyticsService.ts` (ex: `logShare`, `logSearch`) e exportar no `index.ts`.

4. **Nova tela**  
   - Registrar o `screen_name` em `SCREEN_NAMES` em `constants.ts` (se a rota ainda não existir).  
   - Na tela, chamar `useAnalyticsScreen({ screenName: 'NomeDaRota', screenClass: 'NomeDaTelaScreen' })`.  
   - Instrumentar botões, formulários, abas e erros com os helpers acima.

## Boas práticas

- **Eventos recomendados GA4** – Use `screen_view`, `select_content`, `add_to_cart`, `login`, `sign_up`, etc. quando couber no fluxo.
- **Sem duplicar** – Não dispare o mesmo evento duas vezes para a mesma ação (ex: um único `screen_view` por entrada na tela).
- **Baixo acoplamento** – Telas só importam `@/analytics`; a implementação (Firebase ou no-op) fica no serviço.
- **Sem PII** – Não enviar email, telefone, nome completo ou outros dados que identifiquem o usuário nos parâmetros.
