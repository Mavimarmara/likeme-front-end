# Publicar no Google Play **sem** acesso ao Google Cloud

Se você é **apenas desenvolvedor** na conta do Play (sem Admin, sem Google Cloud) e **não tem** o JSON da Service Account, use **upload manual** do AAB. O `eas submit` e o JSON são necessários só para envio **automático**.

---

## Em resumo

1. **Gerar o AAB** com EAS (você já faz: `npm run build:android`).
2. **Baixar o AAB** no [expo.dev](https://expo.dev) → seu projeto → Builds → build Android concluído → **Download**.
3. **Enviar o AAB** no Play Console: quem tem permissão de **lançamento** faz o upload manual.

---

## 1. Gerar o AAB com EAS

```bash
npm run build:android
```

Ou, se o perfil for outro:

```bash
eas build --platform android --profile production
```

Espere o build terminar no [expo.dev](https://expo.dev). O EAS **não** usa Google Cloud nem Service Account para o **build**; só para o **submit** automático.

---

## 2. Baixar o AAB

1. Acesse [expo.dev](https://expo.dev) e abra o projeto **likeme-front-end**.
2. Vá em **Builds** → filtre por **Android**.
3. Abra o build **concluído** (status Finished).
4. Na página do build, use **Download** para o **.aab** (Android App Bundle).

Guarde o `.aab` e, se você não puder publicar, envie esse arquivo para quem tem permissão de lançamento no Play Console.

---

## 3. Upload manual no Google Play Console

Quem tem permissão de **“Lançar em produção”** / **Release manager** / **Admin** faz:

1. Acesse [Google Play Console](https://play.google.com/console) e selecione o app (LikeMe).
2. No menu: **Produção** (ou **Teste interno** / **Teste fechado**, se for o caso) → **Versões** / **Releases**.
3. **Criar nova versão** / **Create new release**.
4. Em **App bundles**, clique em **Fazer upload** / **Upload** e escolha o `.aab` que você baixou.
5. Preencha **Nome da versão** e **Notas da versão**.
6. **Revisar versão** / **Review release** e, em seguida, **Iniciar implementação** / **Roll out**.

Não é necessário Google Cloud, Service Account nem JSON para esse fluxo.

---

## Quem pode fazer o upload?

| Função no Play Console                      | Pode fazer upload / criar release?                |
| ------------------------------------------- | ------------------------------------------------- |
| **Admin**                                   | Sim                                               |
| **Gerente de lançamento** / Release manager | Sim                                               |
| **Desenvolvedor**                           | Em geral **não** (só em algumas trilhas de teste) |

Se você for **apenas desenvolvedor\*\***:

- **Você:** gera o build com EAS, baixa o `.aab` e envia o arquivo (link, e-mail, Drive, etc.) para o Admin ou Release manager.
- **Admin/Release manager:** faz o upload manual do `.aab` no Play Console, como no passo 3.

---

## Alternativa: Admin cria o JSON

Se o **dono da conta** (Admin) tiver acesso ao Google Cloud:

- Ele pode seguir o [CRIAR_SERVICE_ACCOUNT_JSON.md](./CRIAR_SERVICE_ACCOUNT_JSON.md), criar o JSON e:
  - **Opção A:** rodar `npm run submit:android` no lugar de upload manual, ou
  - **Opção B:** configurar o JSON no EAS (ex.: `eas credentials`) e você passa a poder rodar `npm run submit:android` (ele precisa confiar em compartilhar o JSON).

O upload manual **não** exige JSON nem Google Cloud.

---

## Resumo dos comandos (para você)

```bash
# 1. Gerar AAB
npm run build:android

# 2. Baixar o .aab em expo.dev → Builds → build Android → Download

# 3. Enviar o .aab para Admin/Release manager fazer o upload no Play Console
#    (ou fazer o upload você mesmo, se tiver permissão)
```

**Não use** `npm run submit:android` nesse fluxo; ele depende do JSON da Service Account.
