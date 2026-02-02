# Lógica de Exibição do Avatar e Card de Anamnese

Este documento descreve as regras de negócio para exibição do Avatar e do Card de Anamnese na tela `SummaryScreen`.

## 📊 Estados

### `hasAnyAnamnesisAnswers`
- **Origem:** Backend (`GET /api/anamnesis/answers/user/:userId`)
- **True quando:** Usuário tem pelo menos 1 resposta de anamnese no banco
- **False quando:** Usuário não tem nenhuma resposta

### `hasCompletedAnamnesis`
- **Origem:** AsyncStorage local (`@likeme:anamnesis_completed_at`) + validação backend
- **True quando:** 
  - Existe flag `completedAt` no AsyncStorage
  - **E** todas as 11 seções estão 100% respondidas (validado via `getCompletionStatus()`)
- **False quando:**
  - Não existe flag no AsyncStorage
  - **OU** flag existe mas seções estão incompletas (flag é limpo automaticamente)

### `anamnesisScores`
- **Origem:** Backend (`GET /api/anamnesis/scores/user/:userId`)
- **Contém:** `mentalPercentage` e `physicalPercentage`
- **Usado para:** Definir o tamanho de cada avatar (mente e corpo)

## 🎨 Regras de Exibição

### Avatar

| Condição | Exibe Avatar? | Tipo | Scores |
|----------|---------------|------|--------|
| `!hasAnyAnamnesisAnswers && !hasCompletedAnamnesis` | ✅ | Vazio | 0%, 0% |
| `hasAnyAnamnesisAnswers && !hasCompletedAnamnesis` | ✅ | Com scores | mentalPercentage, physicalPercentage |
| `hasCompletedAnamnesis` | ✅ | Com scores | mentalPercentage, physicalPercentage |

**Resumo:** Avatar **sempre aparece**. Se não tem respostas e não completou, aparece vazio. Caso contrário, aparece com os scores calculados.

### Card de Prompt (AnamnesisPromptCard)

| Condição | Exibe Card? | Mensagem |
|----------|-------------|----------|
| `!hasCompletedAnamnesis` | ✅ | "Complete a anamnese" ou "Inicie a anamnese" |
| `hasCompletedAnamnesis` | ❌ | - |

**Resumo:** Card só aparece se a anamnese **não foi completada**. Desaparece quando o usuário finaliza.

## 🔍 Validação de Completude

A validação de completude acontece em `checkAnamnesisStatus()` no `useEffect` da `SummaryScreen`:

```typescript
// 1. Se não tem respostas no backend
if (!hasAnswers) {
  await storageService.setAnamnesisCompletedAt(null); // Limpa flag
  setHasCompletedAnamnesis(false);
}

// 2. Se tem flag completedAt no AsyncStorage
else if (anamnesisCompletedAt) {
  const completionStatus = await anamnesisService.getCompletionStatus();
  
  // 2a. Se todas as seções estão completas
  if (completionStatus.allSectionsComplete) {
    setHasCompletedAnamnesis(true);
  }
  
  // 2b. Se alguma seção está incompleta
  else {
    await storageService.setAnamnesisCompletedAt(null); // Limpa flag
    setHasCompletedAnamnesis(false);
  }
}

// 3. Se não tem flag
else {
  setHasCompletedAnamnesis(false);
}
```

### Seções Validadas

Para considerar a anamnese completa, **todas as 11 seções** devem estar 100% respondidas:

1. **Mente** (`mental`)
2. **Corpo** (`physical`)
3. **Hábitos:**
   - Movimento (`habits_movimento`)
   - Espiritualidade (`habits_espiritualidade`)
   - Sono (`habits_sono`)
   - Alimentação (`habits_nutricao`)
   - Estresse (`habits_estresse`)
   - Autoestima (`habits_autoestima`)
   - Relacionamentos (`habits_relacionamentos`)
   - Saúde bucal (`habits_saude_bucal`)
   - Propósito (`habits_proposito`)

## 📝 Cenários de Uso

### Cenário 1: Usuário Novo
- **Estado:** `hasAnyAnamnesisAnswers = false`, `hasCompletedAnamnesis = false`
- **Exibe:** Avatar vazio + Card "Inicie a anamnese"
- **Objetivo:** Incentivar o usuário a começar

### Cenário 2: Usuário Respondendo
- **Estado:** `hasAnyAnamnesisAnswers = true`, `hasCompletedAnamnesis = false`
- **Exibe:** Avatar com scores parciais + Card "Complete a anamnese"
- **Objetivo:** Mostrar progresso e incentivar conclusão

### Cenário 3: Usuário Completou
- **Estado:** `hasAnyAnamnesisAnswers = true`, `hasCompletedAnamnesis = true`
- **Exibe:** Avatar com scores finais (sem card)
- **Objetivo:** Mostrar resultado final sem mais prompts

### Cenário 4: Flag Antigo Inválido
- **Estado inicial:** Flag `completedAt` existe no AsyncStorage
- **Validação:** `getCompletionStatus()` retorna `allSectionsComplete = false`
- **Ação:** Flag é limpo automaticamente
- **Estado final:** `hasCompletedAnamnesis = false`
- **Exibe:** Avatar com scores parciais + Card "Complete a anamnese"
- **Objetivo:** Garantir consistência entre flag local e dados do backend

## 🧪 Testes

Os testes unitários estão em `__tests__/avatar-display-logic.test.ts` e cobrem:
- Exibição do avatar em cada cenário
- Exibição do card em cada cenário
- Validação de completude
- Cenários completos (avatar + card)
- Lista de seções validadas

Para rodar os testes:
```bash
npm test SummaryScreen
```

## 🔗 Arquivos Relacionados

- **Componente:** `src/screens/home/SummaryScreen/index.tsx`
- **Serviço:** `src/services/anamnesis/anamnesisService.ts` (método `getCompletionStatus`)
- **Storage:** `src/services/auth/storageService.ts` (métodos `getAnamnesisCompletedAt`, `setAnamnesisCompletedAt`)
- **Componentes UI:** 
  - `src/components/sections/avatar/AvatarSection/index.tsx`
  - `src/components/sections/anamnesis/AnamnesisPromptCard/index.tsx`
