# Proposta de Reorganização de Componentes

## 📋 Análise Atual

Atualmente temos uma mistura de componentes genéricos e específicos:

### ✅ Componentes Genéricos (Design System)
- `ui/buttons/` - Button, Primary, Secondary, Toggle
- `ui/cards/` - Card (base), BlurCard
- `ui/inputs/` - TextInput, Checkbox, SearchBar
- `ui/badge/` - Badge genérico
- `ui/feedback/` - Loading, Chip
- `ui/layout/` - Background, Header, Title
- `ui/menu/` - FloatingMenu
- `ui/modals/shared/` - ModalBase, SelectButton, SubmitButton

### ⚠️ Componentes de Seção/Feature (Específicos)
- `ui/community/components/` - NextEventsSection, PopularProvidersSection, etc.
- `ui/carousel/` - ProductsCarousel, PlansCarousel (são seções completas)
- `ui/lists/` - SocialList, PostsSection (são seções completas)
- `ui/program/` - ActivityContent, ModuleAccordion (são seções)
- `marketplace/` - ProductHeroSection, ProductInfoTabs, WeekHighlightCard

## 🎯 Proposta: Estrutura Híbrida

```
components/
├── ui/                          # Design System (genéricos e reutilizáveis)
│   ├── buttons/
│   ├── cards/                   # Card base, BlurCard
│   ├── inputs/
│   ├── badge/
│   ├── feedback/
│   ├── layout/
│   └── modals/
│
└── sections/                    # Seções completas (aglomeram UI)
    ├── marketplace/
    │   ├── ProductHeroSection/
    │   ├── ProductInfoTabs/
    │   └── WeekHighlightCard/
    │
    ├── community/
    │   ├── NextEventsSection/
    │   ├── PopularProvidersSection/
    │   ├── RecommendedCommunitiesSection/
    │   ├── YourCommunitiesSection/
    │   ├── OtherCommunitiesSection/
    │   ├── SocialList/
    │   ├── PostsSection/
    │   ├── LiveBanner/
    │   ├── PostCard/
    │   ├── EventCard/
    │   ├── PollCard/
    │   └── ProviderChatCard/
    │
    ├── product/
    │   ├── ProductsCarousel/
    │   ├── PlansCarousel/
    │   ├── ProductCard/
    │   └── PlanCard/
    │
    └── program/
        ├── ActivityContent/
        ├── ModuleAccordion/
        ├── ProgramSelector/
        └── VideoContent/
```

## 📝 Critérios de Classificação

### UI (Design System) ✅
- Componente genérico e reutilizável
- Não tem lógica de negócio específica
- Pode ser usado em qualquer contexto
- Faz parte do design system
- **Exemplos**: Button, Card, Input, Badge, Loading

### Sections (Seções/Features) ✅
- Aglomera múltiplos componentes de UI
- Tem lógica específica de uma feature/domínio
- Monta uma seção completa de uma screen
- Pode ter dependências de hooks/services específicos
- **Exemplos**: ProductHeroSection, NextEventsSection, SocialList, ProductsCarousel

## 🎯 Benefícios

1. **Clareza**: Fica óbvio o que é genérico vs específico
2. **Reutilização**: Design system isolado facilita reutilização
3. **Manutenção**: Seções específicas organizadas por domínio
4. **Escalabilidade**: Fácil adicionar novas seções sem poluir UI
5. **Onboarding**: Novos devs entendem a estrutura rapidamente

## 🔄 Próximos Passos

1. Criar pasta `components/sections/`
2. Mover componentes de seção de `ui/` para `sections/`
3. Mover `marketplace/` para `sections/marketplace/`
4. Atualizar imports em todo o projeto
5. Atualizar exports em `components/index.ts`
