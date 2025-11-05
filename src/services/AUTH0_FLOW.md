# Como o Frontend Obtém o idToken do Auth0

## Fluxo Completo

### 1. Configuração do Auth0

O Auth0 precisa estar configurado com:
- **Application Type**: Native
- **API Identifier**: Definido no Auth0 (usado como `audience`)
- **Allowed Callback URLs**: `com.likeme://your-auth0-domain.auth0.com/callback`

### 2. Variáveis de Ambiente

No arquivo `.env` do frontend:

```env
EXPO_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
EXPO_PUBLIC_AUTH0_AUDIENCE=your-api-identifier  # IMPORTANTE: Necessário para obter idToken
```

### 3. Como o idToken é Obtido

#### Login com Email/Senha

```typescript
// 1. Usuário preenche email e senha
const result = await auth0.auth.passwordRealm({
  username: credentials.email,
  password: credentials.password,
  realm: 'Username-Password-Authentication',
  scope: 'openid profile email',
  audience: AUTH0_CONFIG.audience, // ⚠️ ESSENCIAL: Sem isso, idToken será null
});

// 2. O Auth0 retorna:
// - accessToken: Para chamar APIs do Auth0
// - idToken: JWT com informações do usuário (usado para validar no backend)
// - refreshToken: Para renovar tokens

// 3. O idToken já está disponível em result.idToken
```

#### Login Social (Facebook, Google, Apple)

```typescript
// 1. Usuário escolhe provedor social
const result = await auth0.webAuth.authorize({
  scope: 'openid profile email',
  connection: provider, // 'facebook', 'google' ou 'apple'
  audience: AUTH0_CONFIG.audience, // ⚠️ ESSENCIAL: Sem isso, idToken será null
});

// 2. O Auth0 abre o navegador para autenticação
// 3. Após autenticação, retorna os mesmos tokens
```

### 4. Envio para o Backend

```typescript
// O idToken é automaticamente enviado para o backend
const backendResponse = await AuthService.sendToBackend(authResult);

// Onde authResult contém:
// {
//   accessToken: "...",
//   idToken: "...",  // ← Este é o token enviado para o backend
//   refreshToken: "...",
//   user: { ... }
// }
```

### 5. O que o Backend Faz

1. Recebe o `idToken` do frontend
2. Valida o token usando JWKS do Auth0
3. Extrai informações do usuário (email, name, etc.)
4. Cria ou atualiza usuário no banco
5. Retorna token de sessão próprio

## Por que o `audience` é Importante?

O `audience` é o identificador da API no Auth0. Sem ele:
- ❌ O Auth0 não retorna `idToken` (retorna `null`)
- ❌ Apenas `accessToken` é retornado
- ❌ O backend não consegue validar o token

Com `audience` configurado:
- ✅ O Auth0 retorna `idToken` válido
- ✅ O `idToken` contém informações do usuário
- ✅ O backend pode validar o token

## Verificação

Para verificar se o `idToken` está sendo obtido:

```typescript
const authResult = await AuthService.loginWithEmail({ email, password });
console.log('idToken:', authResult.idToken); // Deve ter um valor, não null
```

Se `idToken` for `null`, verifique:
1. ✅ `EXPO_PUBLIC_AUTH0_AUDIENCE` está configurado no `.env`
2. ✅ O `audience` está sendo passado nas requisições do Auth0
3. ✅ A API foi criada no Auth0 Dashboard
4. ✅ O `audience` corresponde ao "Identifier" da API no Auth0

## Debug

Se o `idToken` não estiver sendo retornado:

1. Verifique o console do Auth0:
   ```typescript
   console.log('Auth0 Config:', {
     domain: AUTH0_CONFIG.domain,
     clientId: AUTH0_CONFIG.clientId,
     audience: AUTH0_CONFIG.audience,
   });
   ```

2. Verifique a resposta do Auth0:
   ```typescript
   const result = await auth0.auth.passwordRealm({...});
   console.log('Auth0 Response:', {
     hasAccessToken: !!result.accessToken,
     hasIdToken: !!result.idToken, // Deve ser true
     hasRefreshToken: !!result.refreshToken,
   });
   ```

3. Se `idToken` for `null`, o problema está na configuração do Auth0 ou no `audience`

