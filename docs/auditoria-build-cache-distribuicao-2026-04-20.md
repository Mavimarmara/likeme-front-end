# Auditoria: build, cache, dependências e distribuição

**Escopo:** `likeme-front-end`  
**Data:** 2026-04-20  
**Método:** leitura de `package.json`, `eas.json`, `app.config.js`, `app.json`, workflows GitHub Actions, Gradle/Podfile amostrais, e execução de `npx expo-doctor@latest`.

**Atualização (mesma data):** agregação de **boas práticas de build e distribuição (React Native + Expo)** frente ao repositório em **§0**; `expo-doctor` revalidado (**15/17**, mesmas duas falhas: config duplicada + `expo-navigation-bar`).

**Atualização (mesma data, complemento):** **§0.1** ampliado; novos **§0.3** e **§0.4**; **§9** com roadmap priorizado (consolidação do levantamento de distribuição/publicação); correção de célula corrompida na tabela do **§2**.

---

## 0. Boas práticas de referência × conformidade no repositório

Consolidação do **resultado** de confrontar práticas recomendadas (alinhamento Expo/SDK, configuração única, EAS, CI, lojas, cache, ambiente dev vs binário release) com o estado atual de `likeme-front-end`. Evidências, impacto e correções por item mantêm-se em **§2**; lacunas e riscos adicionais em **§7**; checklist operacional em **§8**; pontos fortes e roadmap priorizado em **§0.3**, **§0.4** e **§9**.

### 0.1 Práticas de referência (síntese)

| Tema         | Prática recomendada                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependências | `npx expo install` para pacotes do ecossistema Expo; `expo-doctor` sem falhas críticas antes de release.                                        |
| Config       | `app.config.js` dinâmico deve incorporar ou substituir `app.json`; evitar duas listas de plugins divergentes.                                   |
| EAS          | Perfis `development` / preview / `store` com `distribution`, `buildType` e `env` explícitos; credenciais fora do git com caminhos documentados. |
| CI           | Node alinhado às `engines` reais do lockfile; jobs reproduzíveis; falhas visíveis nos logs.                                                     |
| Lojas        | Trilha Play e `releaseStatus` alinhados ao intento; iOS: ASC / API key / team id consistentes.                                                  |
| Release      | Build id guardado; smoke no artefato antes de submit; changelog com commit + build id.                                                          |
| Pipeline     | Perfis EAS explícitos (dev client, preview interno, staging, produção); `distribution` e tipo de artefato Android (`apk` vs `app-bundle`) coerentes com o canal. |
| Paridade env | Uma política clara de origem das `EXPO_PUBLIC_*` (EAS `env` + secrets vs `.env` local); evitar drift silencioso entre Metro dev e binário release. |
| Segredos     | Preferir **EAS Secrets** / variáveis de projeto para valores sensíveis ou repetidos; caminhos a `.p8` / JSON de service account só em máquinas/CI com montagem controlada. |
| Qualidade release | Além de unit tests: smoke em artefato do **build id** que será submetido; e2e (ex.: Maestro) integrado ao processo de release quando o risco justificar. |
| Observabilidade | Crash/analytics e flags por ambiente; correlacionar incidentes a **build id** e versão da loja. |
| OTA (futuro) | Se passar a usar `expo-updates`: canais, `runtimeVersion` e compatibilidade com binário nativo entram no checklist (ver **§7.3**). |

### 0.2 Matriz: prática × estado em `likeme-front-end`

| Prática                                    | Estado                                                                                                                   | Onde detalhar |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------- |
| Pacotes alinhados ao Expo SDK 54           | **Gap:** `expo-navigation-bar` 55.x vs esperado ~5.x (P0); vários `expo-*` e `datetimepicker` fora do conjunto do doctor | §2 P0/P2; §3  |
| `expo-doctor` limpo                        | **Gap:** 2 checks falham (config + versões)                                                                              | §3            |
| Config única (`app.config` ↔ `app.json`)   | **Gap:** `app.json` não integrado ao dinâmico                                                                            | §2 P1; §3     |
| Node CI ≥ requisitos Metro / expo-server   | **Gap:** workflows em Node **18**                                                                                        | §2 P2         |
| `postinstall` + Linux sem CocoaPods        | **Gap:** `SKIP_IOS_POD_INSTALL` não definido no job `test` / install antes do EAS nos mesmos workflows                   | §2 P2         |
| CI não mascarar erro do `eas build`        | **Gap:** `2>/dev/null \|\| true` no parse JSON do build                                                                  | §2 P2         |
| Submit explícito vs corrida com `--latest` | **Risco:** submit usa `--latest`; build id em output mas não obrigatório na cadeia                                       | §7.1; §8.4    |
| Trilha Play vs nome “production”           | **Atenção:** `track: internal` nos submits; comentários podem dizer outra coisa                                          | §2 P3         |
| Política de cache EAS                      | **Consciente:** `--clear-cache` frequente (trade-off tempo vs higiene)                                                   | §7.2          |
| Versão Android local                       | **Atenção:** `versionCode` fixo em Gradle se build local sem EAS                                                         | §2 P3         |
| Aliases TS / Metro / Jest                  | **Risco baixo:** `@/assets` pode divergir entre camadas                                                                  | §2 P3         |
| DevDeps ESLint/Metro RN                    | **Gap:** pacotes 0.72.x com RN 0.81                                                                                      | §2 P3         |
| DRY de `env` no `eas.json`                 | **Atenção:** blocos `env` repetidos entre perfis (`staging`, `production`, `production-apk`) — risco de divergência acidental | §9 P2       |
| Segredos só em arquivo local               | **Parcial:** caminhos a chaves no `eas.json` + ignore no git é comum; ideal evoluir para secrets no EAS onde couber      | §7.1; §9 P2 |

### 0.3 Pontos fortes atuais (distribuição / publicação)

- **EAS Build** com perfis distintos: `development`, `preview`, `staging`, `production`, `production-internal`, `production-apk`.
- **Android produção** em **AAB** (`app-bundle`, `bundleRelease`) e **Hermes** explícito nos perfis de loja.
- **`appVersionSource`: `remote`** e **`autoIncrement`** nos perfis de loja — alinhado a versionamento centralizado no EAS.
- **Scripts Maestro** (`test:e2e*`) e gate **`npm run build`** (`tsc` + ESLint) no `package.json`.
- **Resolução de env em runtime** (`src/config/environment.ts`): `process.env` + `expo-constants` — adequado para variáveis embutidas no binário.
- **Governança de submit**: job com `environment: store-submit` no workflow (aprovação humana antes da loja) — ver **§7.1**.

### 0.4 Síntese de gaps vs. práticas (visão rápida)

| Tema | Situação resumida |
|------|-------------------|
| Dependências / SDK | `expo-navigation-bar` incompatível com o esperado pelo SDK 54; demais pacotes fora do conjunto do `expo-doctor`. |
| Config Expo | `app.json` sem integração com `app.config.js` — risco de config “fantasma”. |
| CI | Node 18 vs requisitos Metro/Expo; possível `pod install` no Linux; mascaramento de erro em `eas build --json`. |
| Submit | Uso de `--latest` sem obrigar **build id** na cadeia do workflow. |
| Loja Android | `track: internal` com nome de profile `production` — ok se intencional; documentação e comentários devem refletir. |
| Higiene `eas.json` | Duplicação de `env` entre perfis; oportunidade de `extends` + secrets. |

---

## 1. Resumo executivo

O ponto mais grave é **`expo-navigation-bar` na versão `55.0.9`**: o `expo-doctor` indica que, para o **Expo SDK 54**, o esperado é **`~5.0.10`** — ou seja, a versão instalada parece um desvio numérico enorme (55 em vez de 5) e é tratada como **incompatibilidade de major**. Isso pode quebrar build nativo, prebuild ou comportamento em runtime no Android (barra de navegação / edge-to-edge).

Em segundo lugar, coexistem **`app.json` e `app.config.js`** sem integração. Com **`app.config.js` presente, o Expo prioriza o dinâmico**; o `app.json` tende a ficar **sem efeito ou redundante** (o próprio `expo-doctor` avisa). No repo, **`expo-navigation-bar` (plugin) e `androidNavigationBar` aparecem só no `app.json`**, enquanto `app.config.js` define outro conjunto de plugins (Firebase, vídeo, `expo-splash-screen`, etc.) — risco de **manter “config fantasma”** no `app.json` e de **diferença entre o que a equipe acha que está ativo e o que o build usa** (parte do comportamento da barra ainda pode vir de `App.tsx` via `expo-navigation-bar` em JS).

Há também **atraso em vários pacotes `expo-*`** em relação ao conjunto recomendado do SDK 54 (incluindo **`expo` ~54.0.33 vs 54.0.22** e **`@react-native-community/datetimepicker`** fora do patch esperado), **CI em Node 18** enquanto dependências transitivas pedem **Node ≥ 20** (ex.: **`expo-server`** `>= 20.16.0`; pacotes **`metro` 0.83.x** sob `@expo/metro` com **`>= 20.19.4`** no `package-lock`), risco de **`pod install` no `postinstall` em runners Linux** sem `SKIP_IOS_POD_INSTALL`, e pontos de **distribuição/CI** (mascaramento de erro no job EAS, comentário do workflow citando “production track” vs **`track: internal`** no `eas.json`).

---

## 2. Achados

| Sev | Área                    | Evidência                                                                                                                                                                                          | Impacto                                                                                                                                 | Correção sugerida                                                                                                       | Como validar                                                            |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| P0  | Dependências / Expo SDK | `expo-doctor`: `expo-navigation-bar` **esperado `~5.0.10`**, **encontrado `55.0.9`**; `package.json` — `"expo-navigation-bar": "^55.0.9"`                                                          | Build EAS/local ou módulo nativo inconsistente; APIs erradas                                                                            | `npx expo install expo-navigation-bar` (ou fixar `~5.0.10` conforme doctor) e revisar `package-lock.json`               | `npx expo-doctor`; build Android perfil staging/production              |
| P1  | Config Expo             | `expo-doctor`: _app.json existe mas app.config.js não usa os valores_; com `app.config.js`, o estático costuma ser **ignorado** na prática                                                         | Plugins/`androidNavigationBar` só no `app.json` vs config real no `app.config.js`; PRs podem “corrigir” o arquivo errado                | Remover `app.json` **ou** fundir tudo no `app.config.js` (incl. plugin/`androidNavigationBar` se ainda forem desejados) | `npx expo-doctor`; diff de `plugins` + `android` entre os dois arquivos |
| P2  | Dependências            | Doctor: **12 pacotes** fora do esperado (ex.: `expo` 54.0.22 vs ~54.0.33, `expo-dev-client`, etc.)                                                                                                 | Bugs corrigidos em patchs; drift acumulado                                                                                              | `npx expo install --check` e alinhar versões                                                                            | `expo-doctor` até passar todas as checagens                             |
| P2  | Toolchain / CI          | `.github/workflows/build.yml` — **Node 18**; no lock, **`metro` (via `@expo/metro`)** com **`engines`: `node >= 20.19.4`** e **`expo-server`** com **`>= 20.16.0`**                                | Avisos/falhas futuras com `engine-strict`, ou CLI desatualizada vs deps                                                                 | Subir CI (e documentar) para **Node 20 LTS** (ideal **≥ 20.19.4** para alinhar ao Metro empacotado)                     | `npm ci` com `engine-strict=true` opcional                              |
| P2  | Build CI / postinstall  | `package.json` `postinstall` roda `pod install` se existir `ios/`; workflows **não definem `SKIP_IOS_POD_INSTALL`**                                                                                | `npm ci` pode falhar em Ubuntu se `pod` não estiver disponível                                                                          | Exportar `SKIP_IOS_POD_INSTALL=true` nos jobs que só precisam de Node/npm (test + trigger EAS)                          | Job `test` em runner limpo sem CocoaPods                                |
| P2  | CI / observabilidade    | `build.yml` — passos “Build Android/iOS” (**~L79–86** e **~L117–124**): `eas build ... --json 2>/dev/null \|\| true`                                                                               | Primeira execução pode mascarar falha; saída JSON vazia sem diagnóstico                                                                 | Remover `2>/dev/null` e `|| true`; não suprimir stderr; falhar cedo se o JSON não trouxer o id do build                 | Simular falha de rede/token e ver falha explícita do job |
| P3  | TypeScript / resolução  | `tsconfig.json` — paths explícitos `@/assets`, `@/assets/auth`, … → `src/assets/...`; `metro.config.js` / `babel.config.js` — alias `@/assets` → pasta raiz `assets/` (SVGs/PNGs); `@/*` → `src/*` | Risco de ambiguidade ao adicionar novos imports; Jest mapeia `@/assets/(.*)` → `assets/$1` (alinha ao Metro, não ao path TS de barrels) | Unificar aliases (TS = Metro = Babel = Jest) ou documentar a regra (“barrels em `src/assets`, binários em `assets/`”)   | Buscar `@/assets` e validar bundle + tipos após mudanças                |
| P3  | DevDeps                 | `@react-native/eslint-config` **^0.72.2** e `@react-native/metro-config` **^0.72.11** com **RN 0.81.5**                                                                                            | Regras/config Metro desalinhadas com a versão do app                                                                                    | Alinhar à família 0.81 ou remover se não usado                                                                          | ESLint/Metro sem warnings estranhos                                     |
| P3  | Higiene                 | `overrides.react-native-appwrite` em `package.json` sem dependência `react-native-appwrite`                                                                                                        | Ruído; overrides inesperados em futuros installs                                                                                        | Remover override morto ou documentar motivo                                                                             | `npm ls react-native-appwrite`                                          |
| P3  | Android empacotamento   | `android/app/build.gradle` — `versionCode 1` fixo                                                                                                                                                  | Play Store exige incremento; EAS `autoIncrement` costuma corrigir no cloud — risco em Gradle local                                      | Confirmar que só EAS injeta versionCode ou que script local atualiza                                                    | `./gradlew` release local + Play Console                                |
| P3  | Distribuição / docs     | `eas.json` — submit Android `track: "internal"`; comentário no workflow cita “production track”                                                                                                    | Confusão operacional                                                                                                                    | Alinhar comentário ou track conforme processo real                                                                      | Revisar `eas submit`                                                    |

### Segurança / distribuição (informativo)

- `eas.json` referencia caminhos locais de chaves (`.p8`, `google-service-account.json`); entradas correspondentes no `.gitignore` reduzem risco de versionamento acidental (há `AuthKey_*.p8` e `google-service-account.json` ignorados).
- IDs públicos Auth0 em `eas.json` são comuns em app móvel; manter consistência com `app.config.js` ao rotacionar.

---

## 3. Saída do `expo-doctor` (referência)

Execução: `npx expo-doctor@latest` em **2026-04-20** (revalidado na mesma data contra o repo atual).

- **15/17** checks passaram; **2** falharam.
- **Config:** `app.json` presente sem integração com `app.config.js` (mensagem do doctor; na prática o dinâmico prevalece — ver §1 e P1).
- **Versões:** mismatch **major** em `expo-navigation-bar` (**esperado `~5.0.10`**, **encontrado `55.0.9`**); **minor** em `@react-native-community/datetimepicker` (**esperado `8.4.4`**, **encontrado `8.5.1`**); **patch** em `expo` (**~54.0.33** vs **54.0.22**) e nos demais pacotes listados pelo doctor (**12** pacotes fora do esperado).

Recomendação oficial do doctor: `npx expo install --check`.

---

## 4. Plano de validação (comandos)

Na raiz `likeme-front-end`:

1. `npx expo-doctor` ou `npx expo-doctor@latest` — objetivo: **0 falhas** após corrigir `expo-navigation-bar` e config duplicada.
2. `npx expo install --check` — revisar upgrades sugeridos pelo SDK 54.
3. `npm run build` — `tsc --noEmit` + ESLint.
4. `npm test -- --watchAll=false` — alinhado ao CI.
5. `eas build --platform android --profile production --non-interactive` (ou `staging`) após alinhar dependências.
6. Opcional local: `npx expo prebuild --clean` e `./gradlew :app:bundleRelease` / archive Xcode — validar nativo fora do EAS.

**Cache:** usar `npm run start:clear` / `start:reset`, `npm run clean` / `clean:all`, e builds EAS com `--clear-cache` quando houver sintomas de cache inconsistente.

---

## 5. Itens não confirmados nesta auditoria

- Resultado real dos jobs **GitHub Actions** (se `pod install` no `postinstall` falha no runner atual).
- Builds **EAS** na nuvem (credenciais, fila, logs completos).
- Política da **Play Console** para `versionCode` em builds gerados apenas pelo EAS vs Gradle local.
- **Ordem efetiva** de resolução Metro entre os aliases `@` → `src` e `@/assets` → `assets/` para cada forma de import (validar com um import novo ou com `expo start` após alteração de aliases).

### 5.1 Mapa de cenários (onde o repo define comportamento)

| Cenário                                      | Onde está definido                                                                                    | Notas rápidas                                                                                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev: Expo + Metro                            | `package.json` (`start`, `start:dev:tunnel`, `start:staging` / `production` com `env-cmd`)            | Variáveis `EXPO_PUBLIC_*` via `.env*` + `app.config.js`; difere de binário EAS.                                                                                                           |
| Dev Client (simulador)                       | `eas.json` → `build.development` (`developmentClient`, iOS simulator)                                 | Binário interno; não é loja.                                                                                                                                                              |
| Preview interno                              | `eas.json` → `build.preview` (estende `staging`, `distribution: internal`, `EXPO_NO_CAPABILITY_SYNC`) | iOS sem sync de capabilities.                                                                                                                                                             |
| Staging (loja / AAB/APK conforme plataforma) | `eas.json` → `build.staging`                                                                          | `distribution: store`, Android **`apk`**, `autoIncrement`, env staging, `SKIP_IOS_POD_INSTALL`.                                                                                           |
| Produção loja (AAB)                          | `eas.json` → `build.production`                                                                       | Android **`app-bundle`**, `gradleCommand: :app:bundleRelease`, Hermes, env prod.                                                                                                          |
| Produção APK                                 | `eas.json` → `build.production-apk`                                                                   | Mesmo backend/Auth que production, artefato APK.                                                                                                                                          |
| Produção binário interno (iOS)               | `eas.json` → `build.production-internal`                                                              | Estende production com `distribution: internal`, `autoIncrement: false`.                                                                                                                  |
| CI: lint + test                              | `.github/workflows/build.yml` → job `test`                                                            | `npm ci` → lint + `jest --coverage`; **Node 18**; sem `SKIP_IOS_POD_INSTALL` (postinstall pode rodar `pod install` se `ios/` existir no checkout).                                        |
| CI: EAS build Android/iOS                    | `build.yml` → `build-android` / `build-ios`                                                           | Sempre **`--clear-cache`**; JSON + `2>/dev/null \|\| true` (ver achado P2).                                                                                                               |
| CI: aprovação + submit                       | `build.yml` → `approve` (`environment: store-submit`), `submit-android`, `submit-ios`                 | **`--latest`** no submit; step Android menciona “production track” mas **`eas.json`** usa **`track: internal`** e, no submit production Android, também **`releaseStatus: "completed"`**. |
| CI: sync branch                              | `.github/workflows/sync-staging.yml`                                                                  | Push em `main` → `git push origin main:staging`.                                                                                                                                          |
| Dispatch manual                              | `build.yml` `workflow_dispatch`                                                                       | `skip_tests`, `submit_to_stores` alteram ramos do pipeline.                                                                                                                               |
| Build local Android/iOS                      | `package.json` + scripts `build-android*.sh`, `build-ios*.sh`, `expo prebuild`                        | Cenário separado do EAS cloud; Gradle local ainda tem `versionCode` fixo no `build.gradle`.                                                                                               |
| Pós-install / patches                        | `package.json` `postinstall`                                                                          | `patch-slider-podspec.js`, `patch-rn-third-party-components-provider.js`, Pods condicionais.                                                                                              |
| E2E                                          | `package.json` (`test:e2e*`, Maestro)                                                                 | Não roda no `build.yml`; qualidade release depende de processo manual ou outro pipeline.                                                                                                  |

---

## 6. Conclusão

Priorizar correção de **`expo-navigation-bar`** (alinhar à linha **5.x** do SDK 54) e decisão sobre **`app.json`** vs **`app.config.js`** (evitar config estática **ignorada** ou duplicada, incluindo plugin/`androidNavigationBar` que hoje só constam no `app.json`). Em seguida, alinhar **Node no CI** com a cadeia Expo/Metro (**≥ 20.19.4** recomendado) e endurecer o **job EAS** no workflow (sem mascarar erros; revisar comentário de **track** no submit). O roadmap acionável por prioridade está em **§9**.

---

## 7. Lacunas do relatório original: riscos adicionais

Esta secção lista temas que **não estavam detalhados** na auditoria inicial e que podem causar falhas, comportamento diferente em produção ou incidentes de distribuição.

### 7.1 GitHub Actions (além do que já foi citado)

- **`eas-version: latest`**: o CLI muda ao longo do tempo; builds reproduzíveis pedem **versão fixa** do EAS CLI (ou intervalo documentado).
- **Sem `concurrency` / cancelamento in-flight**: vários pushes seguidos na `main` podem disparar **vários pipelines** em paralelo (builds EAS duplicados, submits concorrentes, custo e race no `--latest`).
- **Cadeia “build na nuvem → submit local no runner”**: o submit usa `eas submit ... --latest`; o “latest” é o artefato mais recente na **conta/projeto EAS**, não necessariamente o build deste commit se outro workflow ou dev publicou entre o build e o submit. Falta **ligação explícita build_id → submit**.
- **Job de aprovação (`environment: store-submit`)**: bom para governança, mas o documento não cobre **quem aprova**, expiração, nem falha se ninguém aprovar (fila bloqueada).
- **`sync-staging.yml`**: ao cada push em `main`, faz `git push origin main:staging`. Não é “cache”, mas pode **sobrescrever staging** sem merge; se staging deveria divergir, há risco de processo.
- **`paths-ignore` no `build.yml`**: alterações só em Markdown não disparam o workflow; **não significa** que dependências ou `eas.json` seguros — só reduz ruído.
- **Escrita de segredos em disco** (`echo '${{ secrets... }}' > arquivo`): se o formato do secret estiver errado (aspas, JSON multilinha), o arquivo pode ficar **corrompido** e o submit falhar de forma opaca; risco baixo de **vazamento em logs** se algum step imprimir o arquivo (hoje não auditado passo a passo).
- **Default `working-directory`**: o workflow assume que a raiz do checkout **é** o app; em monorepo real (checkout na raiz do mono) os comandos precisariam de `defaults.run.working-directory` — hoje não documentado.

### 7.2 Caching (técnicas e armadilhas)

- **No Actions, só `cache: npm` no `setup-node`**: acelera `npm ci`, mas **não** cacheia Gradle (`.gradle`), `android/build`, Metro, Babel, nem Pods. CI de “só lint/test” não sofre tanto; quem roda **Gradle no runner** (não é o caso do EAS build) se beneficiaria de `actions/cache` por chave (`gradle-wrapper.properties`, `build.gradle`).
- **Jobs EAS no `build.yml`**: usam **`--clear-cache` em todo disparo** de `eas build` — trade-off explícito (menos risco de cache “podre” na Expo, mais tempo/custo na nuvem).
- **`--clear-cache` no EAS**: evita **cache ruim na infra Expo**, mas também **invalida** ganhos de build incremental na nuvem (tempo/custo maiores); uso constante pode mascarar bug de config em vez de corrigir a causa.
- **Cache local (Metro / Babel / `.expo`)**: divergência típica “passa no CI, quebra no dev” ou o contrário; o documento citou scripts de limpeza, mas não **política** (quando limpar após upgrade de SDK/native).
- **`npm ci` + `package-lock.json`**: se o lock estiver **desatualizado** ou gerado com outra versão de npm, CI e EAS podem instalar **árvores diferentes** de um dev com `npm install` local.

### 7.3 Distribuição final (lojas e EAS)

- **Phased release / rollout** na Play Store e **TestFlight grupos** não passam pelo repo; erro humano na loja não aparece no `expo-doctor`.
- **`track: internal`** no `eas.json` (perfis **`submit.staging`** e **`submit.production`** para Android) vs comentário no workflow (“production track”): risco de **subir para a faixa errada** ou achar que “profile production” = trilha pública na Play.
- No `eas.json`, **`submit.production.android`** inclui ainda **`releaseStatus: "completed"`** (comportamento de publicação na faixa escolhida — alinhar expectativa com o time e com a doc EAS).
- **Requisitos de review Apple / Data safety Google**: não auditados no markdown.
- **EAS Update (OTA)**: não há `expo-updates` / canal no `package.json` desta auditoria; se no futuro existir, **canal**, `runtimeVersion` e compatibilidade com binário nativo precisam entrar no checklist de release.

### 7.4 Disparidade produção vs localhost

- **Origem das variáveis `EXPO_PUBLIC_*`**: em dev, `app.config.js` + `.env` + cópia para `cwd`; em EAS, `eas.json` `env` + possivelmente secrets. **Ordem de precedência** e defaults em `getEnvVar` podem fazer **staging/prod diferentes** do que o dev vê com `.env.local`.
- **Dev Client vs binário release**: scripts como `start:dev:tunnel` usam **expo-dev-client**; loja usa bundle **release** sem dev menu, sem proxy de auth da mesma forma, Hermes otimizado — classes de bug só em release (minify, timing, `__DEV__`).
- **`Constants.expoConfig.extra.env`** vs `process.env` no `environment.ts`: em runtime no dispositivo, **só** o que foi embutido no build conta; testar só com Metro em modo dev **não** valida o mesmo caminho que produção.
- **Auth0 / proxy (`EXPO_PUBLIC_USE_AUTH_PROXY`)**: URL de proxy Expo Auth em produção vs fluxo local pode divergir (deep link, scheme, Universal Links) — não coberto no doc original.
- **Firebase / `google-services.json` e `GoogleService-Info.plist`**: arquivos no repo para um ambiente; se houver **outro projeto Firebase** para staging, a disparidade não foi auditada.
- **Minificação / R8 / Proguard** (Android): `enableMinifyInReleaseBuilds` no Gradle pode expor bugs **só** no AAB da loja.
- **Testes Jest** usam preset `react-native` e mocks: **verde no CI** não implica que o **bundle release** com todos os nativos está correto.

### 7.5 Paridade nativa (iOS/Android)

- **`SKIP_IOS_POD_INSTALL=true` no EAS** vs dev local rodando `pod install`: o lock `Podfile.lock` versionado ajuda a aproximar; se não estiver alinhado, **EAS ≠ máquina do dev**.
- **`expo prebuild --clean`** vs pastas `ios/`/`android/` já commitadas: drift entre “gerado” e “editado manualmente” pode causar **regressão só no próximo prebuild**.

### 7.6 Scripts de `postinstall` (fora do “cache” clássico)

- O `postinstall` aplica **patches em Podspec/RN** antes do `pod install` condicional; falhas aqui afetam **qualquer** `npm ci` (local, CI, runner que instale deps antes do EAS). Vale tratar como parte da matriz de build, não só dependências npm.

### 7.7 Segurança e compliance (fora do escopo técnico curto)

- **SBOM / dependabot / CVEs** em cadeia nativa (Gradle, CocoaPods) não foram avaliados.
- **Bitrise/Fastlane legado** — não aplicável aqui, mas qualquer segundo pipeline duplicaria risco de config divergente.

---

Para incorporar novas auditorias: repetir `expo-doctor`, atualizar a **matriz do §0.2** e a tabela do **§2**, diff de `eas.json` vs `.env` de referência, diff **`app.config.js` vs `app.json`** (evitar config fantasma), checklist “build EAS id → submit id” no release notes (**§8**), e revisar o **§9** (prioridades podem mudar após correções).

---

## 8. Checklist operacional de release (build → submit → loja)

Uso: copiar para **notas do release** (commit SHA, autor, data) e ir marcando. Perfis abaixo referem-se ao `eas.json` deste repositório.

### 8.1 Antes de disparar build

- [ ] `git status` limpo; branch correta (ex.: `main` para produção).
- [ ] `package-lock.json` commitado e alinhado com `package.json` (`npm ci` local ou no CI).
- [ ] `npx expo-doctor` sem falhas críticas (especialmente versões SDK / `expo-navigation-bar`).
- [ ] `npm run build` e `npm test -- --watchAll=false` ok (ou justificativa documentada se pular).
- [ ] Versão em `app.config.js` / `package.json` coerente com o que se pretende na loja (EAS pode usar `appVersionSource: remote` — confirmar no dashboard se a versão remota está correta).
- [ ] Variáveis do perfil EAS (`staging`, `production`, etc.) conferidas: `EXPO_PUBLIC_BACKEND_URL`, Auth0, flags (`EXPO_PUBLIC_USE_AUTH_PROXY`, …).
- [ ] Se alterou nativo ou plugins: considerar build **sem** `--clear-cache` só depois de um build limpo bem-sucedido (evitar mascarar problema de cache).

### 8.2 Build (EAS)

- [ ] Comando / perfil anotados, por exemplo:
  - Android produção loja (AAB): `eas build --platform android --profile production`
  - Android produção APK: `eas build --platform android --profile production-apk`
  - iOS produção loja: `eas build --platform ios --profile production`
  - iOS produção distribuição interna: `eas build --platform ios --profile production-internal`
  - Dev client / simulador: `eas build --profile development`
  - Preview (interno, herda staging): `eas build --profile preview`
  - Staging (loja; Android APK no perfil atual): `eas build --profile staging` (`buildType: apk` no `eas.json`)
- [ ] **Build ID** guardado (saída do CLI ou página do projeto no Expo): `________________`
- [ ] Plataforma: Android / iOS / ambas — `________________`
- [ ] Link ou nome do artefacto no EAS (opcional): `________________`

### 8.3 Validação do binário (antes do submit)

- [ ] Instalar o artefacto desse **build id** (internal distribution / TestFlight interno / APK) em dispositivo físico ou emulador conforme política do time.
- [ ] Smoke mínimo: login, chamada a API real do ambiente desse perfil, push/deep link se aplicável.
- [ ] Confirmar que **não** é um build antigo (comparar versão visível na app com a esperada).

### 8.4 Submit (lojas)

- [ ] Preferir amarrar ao build explícito quando possível: `eas submit --id <BUILD_ID> ...` em vez de confiar só em `--latest` (evita corrida com outro pipeline ou build manual).
- [ ] Perfil de submit alinhado ao intento:
  - `eas submit --platform android --profile production` → no `eas.json`, Android está em track **`internal`** com **`releaseStatus: "completed"`** no submit de production (não assumir trilha “production” pública só pelo nome do profile).
  - iOS: mesmo profile `production` no submit; confirmar destino no App Store Connect (TestFlight vs revisão).
- [ ] Ficheiros locais de credenciais (máquina humana): `AuthKey_*.p8`, `google-service-account.json` presentes e válidos **ou** segredos injetados no CI conforme o run.
- [ ] Após submit, anotar **submission id** / estado na Play Console e App Store Connect: `________________`

### 8.5 Depois do submit

- [ ] Play Console: track real (**internal** vs open testing vs production) e rollout coerentes com o comunicado ao time.
- [ ] App Store Connect: build processado, grupos de testadores, submissão para revisão se for o caso.
- [ ] Tag git ou entrada no changelog com: **commit** + **build id** + **versão app** + **tracks**.

### 8.6 Se algo correr mal

- [ ] Não reenviar `--latest` sem confirmar qual build ficou “latest” na conta EAS.
- [ ] Guardar logs do job (GitHub Actions) e do `eas build` / `eas submit` para análise.
- [ ] Se suspeita de cache: repetir **um** build com `--clear-cache`, documentar o resultado antes de generalizar como solução permanente.

---

## 9. Proposta de adequação priorizada (roadmap consolidado)

Síntese acionável alinhada a **§0–§2**, **§7** e **§8**. Ordem sugerida para PRs ou ciclos de trabalho.

### P0 — Estabilidade de release

1. Corrigir **`expo-navigation-bar`** para a faixa indicada pelo Expo SDK 54 (`expo-doctor`); em seguida `npx expo install --check` até reduzir ou eliminar avisos críticos de versão.
2. **Unificar config Expo:** migrar o que ainda for necessário de `app.json` para `app.config.js` (ou import explícito) e eliminar redundância/“config fantasma”.

### P1 — Pipeline e lojas

3. **CI:** Node **≥ 20.19.4** (ou mínimo exigido pelo lockfile/`engines` da cadeia Metro/Expo); `SKIP_IOS_POD_INSTALL=true` nos jobs que não precisam de CocoaPods.
4. **Workflow EAS:** remover mascaramento de erro no parse JSON do `eas build` (**§2** P2); falhar se não houver id de build.
5. **Submit:** propagar **`eas submit --id <BUILD_ID>`** (ou equivalente) a partir do build concluído no mesmo pipeline, em vez de depender só de `--latest` quando houver risco de corrida (**§7.1**, **§8.4**).

### P2 — Segurança e manutenção

6. Mover variáveis repetidas/sensíveis do `eas.json` para **EAS Secrets** (ou variáveis de projeto), mantendo no repositório apenas o mínimo documentado; chaves `.p8` / JSON de conta de serviço continuam fora do git (bloco **Segurança / distribuição** no **§2**, **§7.1**).
7. **DRY no `eas.json`:** perfil base com `env` comum estendido por `staging` / `production` / `production-apk` (onde fizer sentido), para reduzir drift entre URLs e flags Auth0.

### P3 — Higiene e operação

8. Alinhar **comentários do workflow** e expectativa do time com **`track: internal`** vs trilha pública na Play (**§2** P3, **§7.3**).
9. **Runbook** curto (pode viver neste doc ou wiki): qual perfil gera qual artefato; ordem *build → QA interno → submit*; quando usar `--clear-cache` vs build normal (**§7.2**).
10. Alinhar **devDependencies** `@react-native/eslint-config` e `@react-native/metro-config` à família **0.81** do React Native em uso (**§2** P3).

**Critério de “feito” sugerido:** `expo-doctor` sem falhas críticas; CI verde em Node alinhado; pelo menos um release documentado com o **mesmo build id** do artefacto validado **referenciado explicitamente** no submit (e submission id na loja); matriz **§0.2** atualizada na próxima auditoria.
