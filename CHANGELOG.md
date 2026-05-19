# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.3.2] - 2026-05-19

### Adicionado
- CachedImage (expo-image) com cache em disco e prefetch nas listas
- Feed da comunidade virtualizado com skeleton no carregamento inicial
- Cache do feed ao voltar à tela de comunidade (até ~5 min)
- Cache global de perfis públicos para avatares e nomes em posts/comentários
- Lista virtualizada no marketplace, chat e carrinho

### Alterado
- Startup mais rápido com refresh de token em paralelo à política de release e i18n
- Marketplace e comunidade preservam scroll e dados ao retornar à tela
- Detalhes de produto exibem dados da navegação enquanto o fetch completa
- Transições de navegação mais leves (fade) e app aguarda fontes antes de montar

### Corrigido
- Padding horizontal duplicado na lista do marketplace
- Tela de produto sem loading full-screen quando há dados de fallback na rota

## [1.4.0] - 2026-05-19

### Adicionado
- Label "Recomendado por" e parceiro em detalhes de produto e produto afiliado
- Tela de aquisições no perfil (AcquisitionListScreen)
- Assinatura de protocolo no checkout com billingPeriod mensal
- Cliente HTTP para assinatura de protocolo e verificação de acesso

### Alterado
- Remoção do CommunityPreview do fluxo de perfil

### Corrigido
- Comentários e respostas: autor, data relativa, expandir e layout sem duplicação de nome
- Preservação da capitalização do displayName vindo do payload
- ReplyInput fixo no PostDetail com suporte acima do dock inferior
