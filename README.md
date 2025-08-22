# Assenze Alloggio Universitario (React + Firebase)

Web app per tracciare le assenze dell'alloggio universitario con:
- Stato per giorno: **A** (assenza, conta), **G** (giustificata, non conta), **F** (festivo, non conta).
- **Agosto (1–31)** escluso dal conteggio.
- Limite: **136** assenze tra **1 Ottobre** e **30 Settembre**.
- Barra di avanzamento, grafici mensili, modifiche con un click, notifiche toast.
- **Login Google** e **sincronizzazione in tempo reale** su tutti i dispositivi.
- UI moderna con **React-Bootstrap**.
- Tutto **gratis**: Firebase (Spark), deploy su Netlify/Vercel/GitHub Pages.

## Setup rapido (gratis)

1. **Clona o estrai lo zip** e installa le dipendenze:
   ```bash
   npm i
   ```

2. **Crea un progetto Firebase** (Spark – gratuito) → **Build > Authentication** abilita **Sign-in method: Google**.  
   Vai su **Build > Firestore Database > Create database** (test mode) e poi imposta le regole qui sotto.

3. **Crea una Web App** in Firebase e copia la config nelle variabili `.env`:
   - Duplica `.env.example` in `.env` e incolla i valori della tua app.

4. **Regole Firestore** (vai su Firestore > Rules e incolla):  
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/datasets/{datasetId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. **Avvio in locale**:
   ```bash
   npm run dev
   ```

6. **Build e deploy (gratis)**:  
   - **Netlify**: collega il repo, comando build `npm run build`, publish dir `dist`.  
   - **Vercel**: import del repo, framework `Vite`, build `npm run build`.  
   - **GitHub Pages**: `npm run build` e pubblica la cartella `dist` con GitHub Pages / Pages plugin.

> Non servono Cloud Functions (quindi niente billing). Tutto avviene client-side in modo sicuro tramite regole Firestore.

## Variabili ambiente

Copia `.env.example` → `.env` e popola:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Note di utilizzo
- Clicca sui giorni del calendario per ciclare: **A → G → F → vuoto**.
- Solo i giorni **A** contano al totale; **G** e **F** non contano. **Agosto** è escluso.
- Le modifiche vengono salvate in tempo reale e disponibili su qualsiasi dispositivo dopo il login.

## Struttura dati
- `users/{uid}/datasets/{YYYY}` documento con campo `entries` = mappa `{ 'YYYY-MM-DD': 'A'|'G'|'F' }`.

## Tecnologie
React (Vite), Firebase Auth & Firestore, React-Bootstrap, Recharts, React-Toastify, dayjs.
