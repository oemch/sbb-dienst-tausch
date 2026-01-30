# Schritt-für-Schritt: Änderungen deployen

Diese Anleitung führt dich von deinem Code bis zur live laufenden App auf Vercel.

---

## Teil 1: Änderungen speichern und hochladen (Git)

**Wo:** Dein Computer – Terminal oder Cursor-Terminal öffnen, in den Projektordner wechseln.

### Schritt 1: In den Projektordner wechseln

```bash
cd /Users/oemch/Documents/Projekte/zesam/dienst-tausch
```

*(Falls du das Terminal schon im Projektordner geöffnet hast, diesen Schritt überspringen.)*

---

### Schritt 2: Prüfen, was geändert wurde

```bash
git status
```

Du siehst eine Liste aller geänderten oder neuen Dateien. So siehst du, was beim nächsten Schritt mitgeht.

---

### Schritt 3: Alle Änderungen zum Commit vorbereiten

```bash
git add .
```

Damit werden **alle** geänderten Dateien für den nächsten Commit markiert.

---

### Schritt 4: Einen Commit mit Nachricht erstellen

```bash
git commit -m "UI-Anpassungen: Welcome, Dashboard, Dienst-Tausch, Kalender"
```

Ersetze die Nachricht in Anführungszeichen gerne durch deine eigene, z.B. „Neue Texte und Bilder“ oder „Bugfix Footer“.

---

### Schritt 5: Änderungen zu GitHub/GitLab hochladen

Zuerst den Branch-Namen prüfen (meist `main` oder `master`):

```bash
git branch
```

Dann pushen:

- Wenn **main** angezeigt wird:
  ```bash
  git push origin main
  ```
- Wenn **master** angezeigt wird:
  ```bash
  git push origin master
  ```

Falls nach Passwort oder Token gefragt wird: Zugangsdaten zu deinem Git-Hosting (z.B. GitHub) eingeben.

**→ Damit sind deine Änderungen im Online-Repository und bei Vercel angekommen (wenn Vercel mit dem Repo verbunden ist).**

---

## Teil 2: Vercel – App zum Laufen bringen

**Wo:** Im Browser auf [vercel.com](https://vercel.com), eingeloggt mit deinem Account.

### Schritt 1: Projekt auf Vercel öffnen

1. Auf [vercel.com](https://vercel.com) einloggen.
2. Dein Projekt **dienst-tausch** (oder wie es bei dir heißt) auswählen und öffnen.

---

### Schritt 2: Umgebungsvariablen prüfen/setzen

Ohne diese Werte schlägt der Build oft fehl.

1. Im Projekt auf **Settings** (Einstellungen) gehen.
2. Links **Environment Variables** wählen.
3. Prüfen, ob diese beiden Variablen existieren:

   | Name                      | Woher du den Wert nimmst        |
   |---------------------------|----------------------------------|
   | `SUPABASE_URL`            | Supabase-Dashboard → Project Settings → API → Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase-Dashboard → Project Settings → API → Service Role Key (geheim halten!) |

4. **Falls sie fehlen:** Auf **Add** klicken, Name und Wert eintragen, Environment **Production** (und ggf. Preview) wählen, speichern.

---

### Schritt 3: Neues Deployment starten

**Option A – Automatisch:**  
Wenn Vercel mit deinem Git-Repository verbunden ist, wird nach jedem `git push` automatisch neu gebaut. Einfach nach dem Push in Vercel unter **Deployments** warten, bis der neueste Eintrag „Ready“ ist.

**Option B – Manuell:**  
1. Oben im Projekt auf **Deployments** gehen.  
2. Beim letzten Deployment auf die drei Punkte (**…**) klicken.  
3. **Redeploy** wählen und bestätigen.

---

### Schritt 4: Prüfen, ob die App läuft

1. Unter **Deployments** auf den neuesten Eintrag mit Status **Ready** klicken.
2. Auf **Visit** (oder den angezeigten Link) klicken – deine App sollte im Browser öffnen.

Falls der Build **fehlschlägt** (rot markiert):  
- Auf den fehlgeschlagenen Deployment klicken und die **Build-Logs** lesen.  
- Sehr oft fehlen dann noch die Umgebungsvariablen (Schritt 2) – diese ergänzen und erneut **Redeploy** ausführen.

---

## Kurz-Checkliste

- [ ] Terminal geöffnet, im Projektordner `dienst-tausch`
- [ ] `git add .` ausgeführt
- [ ] `git commit -m "..."` ausgeführt
- [ ] `git push origin main` (oder `master`) ausgeführt
- [ ] Auf Vercel: Umgebungsvariablen `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` gesetzt
- [ ] Deployment auf Vercel abgeschlossen (Status „Ready“)
- [ ] App im Browser über den Vercel-Link getestet

---

## Häufige Probleme

| Problem | Mögliche Lösung |
|--------|------------------|
| `git push` fragt nach Passwort/Token | Bei GitHub: unter Settings → Developer settings einen **Personal Access Token** erstellen und statt Passwort verwenden. |
| Build auf Vercel schlägt fehl | Build-Logs in Vercel prüfen; fast immer: fehlende oder falsche Umgebungsvariablen (Supabase). |
| „SSL“- oder Netzwerkfehler beim Push | Push im **lokalen** Terminal (nicht in der Cursor-Sandbox) ausführen. |

Wenn du bei einem bestimmten Schritt hängenbleibst, den genauen Schritt und die Fehlermeldung notieren – damit kann man gezielt weiterhelfen.
