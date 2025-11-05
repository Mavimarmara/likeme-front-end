# Integração Auth0 - Frontend e Backend

Este documento descreve a integração do Auth0 entre o frontend (React Native/Expo) e o backend (Node.js).

## Responsabilidades

### Frontend (React Native/Expo)

1. **Autenticação com Auth0**
   - Autentica usuário com Auth0 (email/password ou social)
   - Obtém tokens do Auth0: `accessToken`, `idToken`, `refreshToken`
   - Gerencia refresh token quando necessário

2. **Comunicação com Backend**
   - Envia `idToken` do Auth0 para o backend validar
   - Recebe token de sessão do backend
   - Armazena token de sessão localmente (AsyncStorage)
   - Usa token de sessão do backend para todas as requisições autenticadas

3. **Gerenciamento de Sessão**
   - Armazena token de sessão do backend
   - Remove token ao fazer logout
   - Detecta erros 401 e redireciona para login

### Backend (Node.js)

1. **Validação de Token Auth0**
   - Recebe `idToken` do frontend
   - Valida `idToken` com Auth0 (verifica assinatura e expiração)
   - Extrai informações do usuário do token

2. **Gerenciamento de Usuário**
   - Cria ou atualiza usuário no banco de dados
   - Associa usuário do Auth0 com registro local

3. **Geração de Token de Sessão**
   - Gera token JWT próprio para sessão do usuário
   - Retorna token de sessão para o frontend
   - Valida token de sessão em todas as requisições protegidas

4. **Endpoints Necessários**
   - `POST /api/auth/login` - Valida Auth0 token e retorna token de sessão
   - `POST /api/auth/logout` - Invalida token de sessão (opcional)
   - Todos os endpoints protegidos devem validar o token de sessão

## Fluxo de Autenticação

### 1. Login/Cadastro

```
Frontend                          Auth0                          Backend
   |                                |                                |
   |-- Login/Cadastro ------------->|                                |
   |                                |                                |
   |<-- accessToken, idToken -------|                                |
   |                                |                                |
   |-- idToken + user info -------->|                                |
   |                                |                                |
   |                                |-- Valida idToken ------------->|
   |                                |                                |
   |                                |<-- User info ------------------|
   |                                |                                |
   |                                |-- Cria/Atualiza usuário ----->|
   |                                |                                |
   |<-- Token de sessão ------------|-- Retorna token de sessão ---|
   |                                |                                |
   |-- Armazena token localmente    |                                |
```

### 2. Requisições Autenticadas

```
Frontend                          Backend
   |                                |
   |-- Requisição + token --------->|
   |                                |
   |                                |-- Valida token de sessão
   |                                |
   |<-- Resposta -------------------|
```

### 3. Logout

```
Frontend                          Auth0                          Backend
   |                                |                                |
   |-- Logout Auth0 -------------->|                                |
   |                                |                                |
   |-- Logout backend ------------->|                                |
   |                                |                                |
   |                                |-- Invalida token de sessão --->|
   |                                |                                |
   |-- Remove token local           |                                |
```

## Estrutura de Tokens

### Auth0 Tokens (Frontend obtém do Auth0)

- **accessToken**: Token de acesso do Auth0 (usado para chamar APIs do Auth0)
- **idToken**: Token de identidade (JWT) contendo informações do usuário
- **refreshToken**: Token para renovar accessToken

### Token de Sessão (Backend retorna)

- **token**: Token JWT gerado pelo backend
- Contém informações da sessão do usuário
- Usado para autenticar requisições ao backend

## Endpoints do Backend

### POST /api/auth/login

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

**Headers:**
```
Authorization: Bearer {idToken}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/auth/logout (opcional)

**Headers:**
```
Authorization: Bearer {sessionToken}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## Implementação Frontend

### AuthService

```typescript
// Login com Auth0
const authResult = await AuthService.loginWithEmail({ email, password });

// Enviar para backend e obter token de sessão
const backendResponse = await AuthService.sendToBackend(authResult);
// Token de sessão é automaticamente armazenado

// Fazer requisições autenticadas
const data = await apiClient.get('/api/personal-objectives');
// Token de sessão é automaticamente incluído no header
```

### ApiClient

Todas as requisições através do `apiClient` incluem automaticamente o token de sessão:

```typescript
// Token é automaticamente incluído no header Authorization
const response = await apiClient.get('/api/personal-objectives');
```

## Segurança

1. **idToken**: Enviado apenas uma vez para o backend validar
2. **Token de Sessão**: Armazenado localmente, usado para todas as requisições
3. **Refresh Token**: Mantido no Auth0, usado apenas para renovar accessToken
4. **Validação**: Backend valida todos os tokens antes de processar requisições
5. **Expiração**: Tokens têm tempo de expiração, backend deve retornar 401 quando expirado

## Configuração

### Variáveis de Ambiente (.env)

```env
# Auth0 Configuration
EXPO_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
EXPO_PUBLIC_AUTH0_AUDIENCE=your-api-identifier

# Backend Configuration
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Backend

O backend deve estar configurado para:
- Validar tokens Auth0 usando a SDK do Auth0
- Gerar tokens JWT próprios para sessão
- Validar tokens de sessão em middleware de autenticação
