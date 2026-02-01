# GA4 no Android – google-services.json

O **iOS** já está configurado com `GoogleService-Info.plist`. O **Android** está com um `google-services.json` **placeholder** na raiz do projeto (para o prebuild rodar). Para o GA4 funcionar de fato no Android, troque esse arquivo pelo que você baixar do Firebase.

## Passo a passo (você faz no Firebase)

1. Acesse o [Firebase Console](https://console.firebase.google.com) e abra o projeto do app (ex.: **likeme-2a401**).

2. Na visão geral do projeto, clique em **Adicionar app** (ícone Android) ou em **Project settings** → **Your apps** e depois **Add app** → **Android**.

3. Preencha:
   - **Android package name:** `com.likeme.app`  
   - (Nome do app e SHA-1 são opcionais para só Analytics.)

4. Clique em **Register app** e na próxima tela em **Download google-services.json**.

5. Salve o arquivo baixado na **raiz** do projeto `likeme-front-end`, com o nome exato:
   ```
   google-services.json
   ```
   Ou seja, no mesmo nível de `GoogleService-Info.plist` e `app.config.js`.

6. Rode de novo o prebuild para o plugin copiar o arquivo para o projeto Android:
   ```bash
   npx expo prebuild --platform android
   ```
   Ou, para iOS e Android:
   ```bash
   npx expo prebuild
   ```

Depois disso, o GA4 passa a funcionar também no build Android.
