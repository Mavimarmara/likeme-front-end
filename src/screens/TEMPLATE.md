# Template para Nova Tela

Use este template para criar novas telas seguindo o padrão estabelecido.

## Estrutura de Arquivos

```
src/screens/[domain]/[ScreenName]/
├── index.tsx              # Componente principal (não [ScreenName].tsx)
├── styles.ts              # Estilos da tela
├── [ScreenName].spec.tsx  # Testes da tela
└── README.md              # Documentação (opcional)
```

## Template do index.tsx

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { COLORS } from '../../../constants';

interface [ScreenName]Props {
  // Props específicas da tela
}

const [ScreenName]: React.FC<[ScreenName]Props> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>[ScreenName]</Text>
        {/* Conteúdo da tela */}
      </View>
    </SafeAreaView>
  );
};

export default [ScreenName];
```

## Template do styles.ts

```typescript
import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
});
```

## Template do [ScreenName].spec.tsx

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import [ScreenName] from './index';

describe('[ScreenName]', () => {
  it('renders correctly', () => {
    const { getByText } = render(<[ScreenName] />);
    
    expect(getByText('[ScreenName]')).toBeTruthy();
  });

  // Adicione mais testes conforme necessário
});
```

## Passos para Criar Nova Tela

1. **Criar pasta**: `src/screens/[domain]/[ScreenName]/`
2. **Copiar templates**: Use os templates acima
3. **Substituir placeholders**: `[ScreenName]`, `[domain]`, etc.
4. **Implementar lógica**: Adicionar funcionalidades específicas
5. **Atualizar index.ts**: Adicionar export no arquivo de índice do domínio
6. **Testar**: Executar testes e verificar funcionamento

## Exemplo Prático

Para criar uma tela `ProfileScreen` no domínio `auth`:

```bash
mkdir -p src/screens/auth/ProfileScreen
# Copiar templates e substituir [ScreenName] por ProfileScreen
```

## Benefícios desta Estrutura

- **Coesão**: Arquivos relacionados ficam juntos
- **Manutenibilidade**: Fácil encontrar e editar arquivos
- **Testabilidade**: Testes próximos ao código
- **Escalabilidade**: Padrão consistente para toda equipe
- **Organização**: Estrutura clara e previsível
- **Convenção**: Uso de `index.tsx` evita redundância de nomes
