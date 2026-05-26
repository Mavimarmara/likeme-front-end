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
- Cupom de desconto no checkout: aplicar código, ver desconto no resumo e remover antes de pagar
- Label "Recomendado por" e parceiro em detalhes de produto e produto afiliado
- Tela de aquisições no perfil
- Assinatura mensal de protocolos no checkout
- Acesso a protocolos contratados após a compra

### Alterado
- Comunidade e marketplace mais fluidos ao navegar entre telas, com menos recarregamento
- Feed e loja da comunidade com carregamento mais rápido
- Tela de atualização obrigatória do app com visual renovado
- Remoção do preview antigo da comunidade no perfil

### Corrigido
- Comentários e respostas: autor, data relativa, expandir respostas e layout do nome
- Campo de resposta fixo ao comentar em posts, acima da barra inferior
- Loja da comunidade e perfil do profissional alinhados ao anunciante
- Card recomendado na Home abre a comunidade na hora
- Cupom de desconto visível nas etapas de endereço e pagamento do checkout

## [1.4.1] - 2026-05-21

### Alterado
- Remoção do ambiente staging (sync de branch, perfis EAS e documentação obsoleta)

### Corrigido
- Pipeline iOS no CI: assinatura manual com perfil App Store para build e archive em produção

## [1.4.2] - 2026-05-26

### Alterado
- Suporte a .env.production via dotenv-cli nos scripts e config do backend

## [1.4.3] - 2026-05-26

### Corrigido
- Correção do pipeline iOS: extração do xcarchive e export para App Store

## [1.5.0] - 2026-05-26

### Adicionado
- Nova tela de detalhe de protocolo com hero, sessões e próxima live
- Lista de protocolos e serviços com novo layout de cards
- Seção de protocolos na Home com empty state para quem não tem subscription
- Menu de perfil agora abre Meus Protocolos e Serviços

### Alterado
- AcquisitionList substituída por SubscriptionList com design atualizado
