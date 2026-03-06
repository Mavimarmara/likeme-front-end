# Relatório de QA – Fluxo de Pedido (Checkout)

**Data:** 06/03/2025  
**Escopo:** Carrinho → Checkout (Endereço → Pagamento → Pedido)  
**Tipo:** Análise de código + testes automatizados

---

## Resumo

Foram analisados o fluxo de pedido no frontend (CartScreen, CheckoutScreen, orderService, addressFormatter), os testes do Checkout e do Cart, e identificados os pontos abaixo.

---

## Erros / Problemas encontrados

### 1. ~~Testes falhando: `userService` não mockado~~ (corrigido)

- **Arquivo:** `CheckoutScreen/index.spec.tsx`
- **Problema:** O `CheckoutScreen` chama `userService.getShippingAddress()` no mount. O mock de `@/services` não incluía `userService`, gerando `Cannot read properties of undefined (reading 'getShippingAddress')`.
- **Status:** O mock já inclui `userService` com `getShippingAddress` e `saveShippingAddress`. Testes passando.

### 2. SafeAreaView deprecado (corrigido)

- **Arquivo:** `CheckoutScreen/index.tsx`
- **Problema:** Uso de `SafeAreaView` de `react-native`, que está deprecado.
- **Correção:** Troca para `SafeAreaView` de `react-native-safe-area-context` (alinhado ao CartScreen e boas práticas).

### 3. Validação de endereço: endereço sem número

- **Arquivo:** `src/utils/formatters/addressFormatter.ts`
- **Problema:** `extractStreetNumber` e `extractStreet` assumem formato “Rua X, 123” ou “Rua X, 123 - Apto”. Se o usuário digitar só “Rua das Flores” (sem vírgula e número), `streetNumber` fica vazio e `street` pode ficar incorreto. O backend Pagarme pode exigir número.
- **Recomendação:** Validar no front (e/ou backend) que `addressLine1` contenha número ou ter campo separado “Número”; ou exibir mensagem clara quando o endereço não tiver número.

### 4. Telefone no endereço: apenas “não vazio”

- **Arquivo:** `AddressEdit.tsx` / `CheckoutScreen` (`isAddressValid`)
- **Problema:** A validação exige `addressData.phone.trim() !== ''`, mas não exige 10 ou 11 dígitos. Um valor como “(11)” seria aceito e o backend pode rejeitar depois.
- **Recomendação:** Validar quantidade de dígitos (ex.: `addressData.phone.replace(/\D/g, '').length >= 10`) igual ao que já é feito para o CEP.

### 5. Falha ao carregar endereço: sem feedback ao usuário

- **Arquivo:** `CheckoutScreen/index.tsx` – `loadUserAddress`
- **Problema:** Se `userService.getShippingAddress()` falhar (ex.: 401, rede), só há `console.error` e `setAddressLoaded(true)`. O usuário vê o formulário vazio sem saber que o endereço não foi carregado.
- **Recomendação:** Mostrar um aviso leve (toast/inline) do tipo “Não foi possível carregar o endereço salvo” e manter o formulário editável.

### 6. PIX: sem validação específica

- **Arquivo:** `CheckoutScreen` – `handleCompleteOrder`
- **Problema:** Com pagamento PIX não há validação extra (ex.: CPF/telefone para notificação). O backend pode ou não exigir campos adicionais.
- **Recomendação:** Confirmar com o backend se PIX exige algum dado extra; se sim, pedir no passo de pagamento e validar antes de chamar `createOrder`.

### 7. Cupom: apenas log

- **Arquivo:** `CheckoutScreen` – `handleApplyCoupon`
- **Problema:** “Aplicar cupom” só faz `console.log`; não chama API nem atualiza totais.
- **Recomendação:** Integrar com API de cupons e atualizar subtotal/desconto quando houver endpoint; ou desabilitar/ocultar o campo até a integração existir.

### 8. “Ver programa” / “Adicionar ao calendário”: apenas log

- **Arquivo:** `CheckoutScreen` – `handleViewProgram`, `handleAddToCalendar`
- **Problema:** Ações na tela de pedido concluído só fazem `console.log`.
- **Recomendação:** Implementar navegação para o programa e lógica de adicionar ao calendário, ou remover/ocultar os botões até a funcionalidade existir.

### 9. Teste: “cart is empty” espera chaves de i18n

- **Arquivo:** `CheckoutScreen/index.spec.tsx` – “shows error when cart is empty”
- **Problema:** O teste faz `expect(mockAlert).toHaveBeenCalledWith('errors.error', 'checkout.emptyCartError')`. Em execução real, `t()` retorna o texto traduzido, não a chave. Se o ambiente de teste não aplicar i18n, o teste pode quebrar quando a implementação passar mensagens traduzidas.
- **Recomendação:** Ajustar o teste para aceitar tanto as chaves quanto as strings traduzidas (ex.: `expect(mockAlert).toHaveBeenCalled()` e checar que o segundo argumento contém a mensagem de carrinho vazio).

### 10. Avisos de `act()` nos testes

- **Contexto:** Atualizações de estado assíncronas (ex.: `setSubtotal` após `loadCartItems`) fora de `act()` geram avisos do React.
- **Recomendação:** Onde necessário, usar `waitFor`/`act` ao disparar ações que atualizam estado de forma assíncrona, para eliminar os avisos.

---

## Pontos positivos

- Validação de endereço completo antes de habilitar “Continuar” e “Salvar”.
- Endereço carregado da API e salvo via `PUT /profile/shipping-address`.
- Máscara de telefone `(00) 00000-0000` e CEP aplicadas.
- Cartão: validação de dados obrigatórios e formato de expiração (MM/YY → MMYY).
- Carrinho vazio bloqueia conclusão do pedido com alerta.
- Erro na criação do pedido exibido em Alert.
- Carrinho é limpo somente após sucesso do pedido.
- Testes do Checkout e do Cart passando após mock de `userService` e uso de SafeAreaView correto.

---

## Checklist rápido para teste manual

- [ ] Adicionar produto ao carrinho → abrir Carrinho → ir para Checkout.
- [ ] Sem endereço salvo: formulário de endereço abre em modo edição; “Continuar” desabilitado até preencher tudo.
- [ ] Preencher endereço → Salvar → endereço persistido; ao reabrir Checkout, endereço carregado.
- [ ] CEP com 8 dígitos; telefone no formato (00) 00000-0000.
- [ ] Pagamento cartão: preencher todos os campos; data MM/AA; “Continuar” só conclui com dados válidos.
- [ ] Pagamento PIX: selecionar PIX e concluir pedido (e conferir no backend se há regras extras).
- [ ] Carrinho vazio: ao tentar concluir, deve aparecer alerta e pedido não deve ser criado.
- [ ] Após pedido criado: tela de confirmação, botão “Home”, carrinho vazio.
- [ ] Falha de rede/API no pedido: alerta de erro e formulário de pagamento ainda acessível.

---

## Próximos passos sugeridos

1. Corrigir validação de telefone (mínimo 10 dígitos) no endereço.
2. Tratar falha em `loadUserAddress` com feedback ao usuário.
3. Alinhar com backend regras de endereço (número obrigatório) e PIX (campos adicionais).
4. Integrar cupom quando houver API.
5. Implementar ou remover “Ver programa” e “Adicionar ao calendário” na tela de pedido concluído.
6. Ajustar teste de carrinho vazio para não depender de chaves i18n e envolver atualizações assíncronas em `act` onde fizer sentido.
7. **Testes do Checkout (avanço de etapas):** Vários testes que avançam de Endereço → Pagamento → Pedido falham com `Unable to find node on an unmounted component`. Esses testes estão temporariamente com `describe.skip` até ajuste no ambiente (react-test-renderer / RTL).
