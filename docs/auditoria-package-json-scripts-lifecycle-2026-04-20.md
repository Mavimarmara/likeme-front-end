# Auditoria: `package.json` scripts e lifecycle (2026-04-20)

Fonte: `likeme-front-end/package.json`, `eas.json`, `.github/workflows/build.yml`, `.github/workflows/sync-staging.yml`. Não há `turbo.json`/`nx.json` nem `Makefile` no front-end; `Dockerfile` do monorepo está no back-end.

---

## 1) Inventário resumido dos `scripts`

| Script | Comando (papel) | Dependências implícitas |
|--------|------------------|-------------------------|
| `start` | Abre Simulator **e** sobe Expo com tunnel | macOS, `open`, ordem fixa (iOS-first) |
| `start:*` | Variantes Expo (`--clear`, `--reset-cache`, `.env.*`) | `env-cmd`, arquivos `.env*` |
| `android` / `ios` / `web` | `expo run:*` / web | SDKs nativos conforme plataforma |
| `test*` | Jest / Maestro / shell | Maestro em `~/.maestro/bin` (não portátil) |
| `build` | `tsc --noEmit` + `lint` | TypeScript + ESLint |
| `lint` / `format*` | ESLint / Prettier | — |
| `doctor` | `expo-doctor` | rede às vezes |
| `prebuild` | `expo prebuild` | **Nome conflita com lifecycle npm** (ver §3) |
| `build:*` | EAS / shell / Gradle | conta Expo, perfis `eas.json` |
| `submit:*` | EAS submit / scripts | credenciais locais ou CI |
| `clean*` | `rm`, Gradle, CocoaPods | disco; `clean:ios` destrutivo |
| `postinstall` | patches + `pod install` condicional | `SKIP_IOS_POD_INSTALL`, CocoaPods |
| `prepare` | `husky \|\| true` | husky pode falhar em silêncio |

---

## 2) Coerência, redundância e riscos

### P0 — conflito de lifecycle: `prebuild`

No npm, **`prebuild` roda automaticamente antes de `npm run build`**. No `package.json`:

```json
"build": "npx tsc --noEmit && npm run lint",
"prebuild": "expo prebuild",
```

**Efeito:** `npm run build` tende a executar **`expo prebuild` antes** do typecheck/lint. Isso é pesado, pode alterar `android/`/`ios/`, e foge da intenção usual de “validar TypeScript + lint”. O CI em `.github/workflows/build.yml` chama `lint` e `test` diretamente, então **o problema aparece sobretudo no fluxo local** (documentação, onboarding, hooks que usem `npm run build`).

**Sugestão:** renomear para algo como `native:prebuild` ou `expo:prebuild` e manter `prebuild:clean` alinhado a esse nome.

### P0 — Maestro com path fixo em `~/.maestro`

```json
"test:e2e": "~/.maestro/bin/maestro test maestro/",
```

Em **Linux (CI)** e em máquinas sem instalação nesse caminho, isso quebra. O workflow atual **não** roda e2e; scripts ficam “meio documentados”, meio executáveis.

**Sugestões:** `npx maestro@<versão>` (se aplicável ao projeto), wrapper `scripts/maestro.sh` que resolve PATH, ou `MAESTRO_BIN` com mensagem clara se ausente.

### P1 — `build` vs significado de “build”

Hoje `build` = **validação estática**, não artefato de app. Isso confunde com `build:android` / `build:ios` (EAS). Vale um nome explícito no `package.json`, por exemplo `validate` / `check` / `ci`, e opcionalmente `build` como alias documentado (ou o contrário, desde que o lifecycle `prebuild` seja corrigido primeiro).

### P1 — `--clear-cache` em quase todo EAS local

Exemplos: `build:android`, `build:ios`, `build:all` com `--clear-cache`.

O próprio workflow de produção usa `--clear-cache` nos jobs de build. **Custo e tempo** sobem; cache só ajuda quando não é limpo sempre. **Sugestão:** scripts “debug” com `--clear-cache`; default sem clear; perfil/documentação explicando quando limpar (mudança nativa, dependência nativa flaky, etc.).

### P1 — `start` acoplado a iOS + tunnel

```json
"start": "npm run run:emulator:ios && npm run start:dev:tunnel",
```

Quem está em Android/Linux ou não quer Simulator fica com fluxo ruim. Melhor: `start` neutro (`expo start --dev-client`) e `start:ios` / `start:ios+tunnel` como variantes.

### P2 — `submit:android` vs CI

- `package.json`: `eas submit --platform android --latest --profile production`
- CI: `eas submit ... --id "$BUILD_ID"`

`--latest` é útil manualmente, mas **não é o mesmo contrato** do pipeline (reprodutibilidade por id). Documentar ou alinhar scripts “manual” vs “CI”.

### P2 — `prepare`: `husky || true`

Falhas do Husky somem. Preferível falhar em dev com mensagem ou checar `CI` e pular explicitamente.

### P2 — `postinstall` + `pod install`

É intencional para DX, mas lento. Já existe `SKIP_IOS_POD_INSTALL` — bom. Garantir que documentação/CI sempre setem isso (o workflow de build já define `SKIP_IOS_POD_INSTALL: 'true'` no nível do workflow).

---

## 3) Melhorias por estágio do lifecycle

**Dev:** separar `start` padrão de “Simulator + tunnel”; padronizar env (`start:staging` etc.) sem copiar `.env` de forma implícita sem aviso (`start:local` sobrescreve `.env`).

**Validate (local + PR):** um script único `ci` / `validate`: `tsc --noEmit`, `lint`, `format:check`, `test --watchAll=false` (e opcionalmente `expo-doctor` em job agendado ou manual). Hoje o CI não roda `npm run build` nem `format:check` nem `tsc` isolado — só `lint` e `test`.

**Build:** corrigir nome `prebuild`; revisar `--clear-cache`; alinhar perfis EAS (`production`, `preview`, etc.) com scripts (`build:ios:preview` já existe).

**Release/publish:** manter `submit` com `--id` quando vier de pipeline; scripts npm podem ser wrappers finos que chamam os mesmos comandos do workflow.

**Caching:** Metro (flags `--clear`/`reset-cache` já existem — usar com critério); CI já usa `actions/setup-node` com `cache: npm`; EAS cache está sendo invalidado pelo `--clear-cache` frequente.

**Hygiene:** `clean:all` remove `Pods`/`Podfile.lock` — documentar como “último recurso”; está ok como ferramenta de socorro.

**Falhas:** workflows já usam `set -euo pipefail` e checagem de `build_id` — bom padrão para replicar em scripts shell locais críticos.

---

## 4) Matriz script → estágio → onde roda

| Script | Estágio | Dev | CI (build.yml) |
|--------|---------|-----|----------------|
| `start`, `start:*` | dev | sim | não |
| `test`, `test:watch`, `test:coverage` | validate | sim | sim (parcial: test+coverage) |
| `lint` | validate | sim | sim |
| `format:check` | validate | sim | **não** roda hoje |
| `build` (tsc+lint) | validate | sim (com ressalva do `prebuild`) | **não** usado |
| `doctor` | validate/diagnóstico | sim | não |
| `test:e2e*` | validate e2e | sim (Maestro) | não |
| `build:android/ios/...` | build artefato | sim (EAS) | EAS inline no YAML |
| `submit:*` | publish | sim | EAS submit no YAML |

---

## 5) Priorização

### P0

1. Renomear `prebuild` para evitar lifecycle antes de `npm run build` (ou remover o script `build` do npm e usar só nomes como `validate` — o importante é **não** manter `prebuild` + `build` com esse significado atual).
2. Tornar Maestro portável ou documentar binário obrigatório + falha explícita (sem `~/.maestro` fixo).

### P1

3. Adicionar ao CI (ou a um script `ci`): `npx tsc --noEmit` e `npm run format:check`.
4. Revisar política de `--clear-cache` (default sem clear).
5. Desacoplar `start` de iOS-only.

### P2

6. Diferenciar scripts de submit “manual” (`--latest`) vs “pipeline” (`--id`).
7. `prepare` / Husky: comportamento explícito em CI vs local.

---

## 6) Gap CI vs `package.json` (test job)

No job de testes do workflow rodam apenas `lint` e `test` — não há `tsc` nem Prettier check:

```yaml
- name: Run linter
  run: npm run lint

- name: Run tests
  run: npm test -- --coverage --watchAll=false
```

---

## Próximos passos (opcional)

Implementar no repo: renomear scripts, ajustar CI, wrapper do Maestro — definir escopo (`package.json` apenas, CI apenas, ou ambos).
