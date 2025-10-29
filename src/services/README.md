# Auth0 Integration

Este projeto está configurado para usar Auth0 como provedor de autenticação, com comunicação direta para o backend `likeme-back-end`.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Auth0 Configuration
EXPO_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
EXPO_PUBLIC_AUTH0_AUDIENCE=your-api-identifier

# Backend Configuration
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

### 2. Configuração do Auth0

No dashboard do Auth0, configure:

- **Application Type**: Native
- **Allowed Callback URLs**: `com.likeme://your-auth0-domain.auth0.com/callback`
- **Allowed Logout URLs**: `com.likeme://your-auth0-domain.auth0.com/callback`
- **Connections**: Habilite Database (Username-Password-Authentication) e Social (Facebook, Google, Apple)

### 3. Configuração do Backend

O backend deve ter um endpoint `/api/v1/auth/login` que recebe:

```json
{
  "accessToken": "string",
  "idToken": "string", 
  "user": {
    "email": "string",
    "name": "string",
    "picture": "string"
  }
}
```

## Funcionalidades Implementadas

### AuthService

- ✅ Login com email/senha
- ✅ Cadastro com email/senha
- ✅ Login social (Facebook, Google, Apple)
- ✅ Logout
- ✅ Refresh token
- ✅ Comunicação com backend

### Telas

- ✅ **RegisterScreen**: Cadastro de novos usuários
- ✅ **LoginScreen**: Login de usuários existentes
- ✅ Validação de formulários
- ✅ Loading states
- ✅ Tratamento de erros

## Fluxo de Autenticação

1. **Cadastro**: Usuário preenche email/senha → Auth0 cria conta → Dados enviados para backend
2. **Login**: Usuário preenche credenciais → Auth0 valida → Dados enviados para backend
3. **Login Social**: Usuário escolhe provedor → Auth0 redireciona → Dados enviados para backend
4. **Sucesso**: Usuário é direcionado para AnamneseScreen

## Estrutura de Arquivos

```
src/
├── services/
│   ├── authService.ts      # Serviço principal do Auth0
│   └── index.ts
├── config/
│   ├── environment.ts      # Configurações de ambiente
│   └── index.ts
└── screens/auth/
    ├── RegisterScreen/     # Tela de cadastro
    ├── LoginScreen/        # Tela de login
    └── ...
```

## Próximos Passos

1. Configurar as variáveis de ambiente com os valores reais
2. Testar a integração com o backend
3. Implementar persistência de sessão
4. Adicionar tratamento de refresh token automático
5. Implementar logout global
