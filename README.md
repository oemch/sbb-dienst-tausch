# Dienst-Tausch Demo App

Eine Demo-App für Workforce Management, die das Verschieben von Diensten zeigt. Diese App demonstriert einen kleinen Funktionsausschnitt einer größeren Anwendung.

## 🚀 Features

- **Welcome Screen**: Begrüßungsseite mit Illustration
- **Dashboard**: Übersicht über Dienste, Feriensaldo und Ereignisse
- **Dienst tauschen**: Funktion zum Verschieben von Diensten
- **Wochenkalender**: Übersicht über die Woche mit Diensten
- **Formular**: Erfassung von Benutzerdaten (Name, E-Mail, Firma)
- **Interaktive Overlays**: Schritt-für-Schritt Anleitungen mit Sprechblasen

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **Deployment**: Vercel

## 📋 Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Supabase Account (für Datenbank)

## 🔧 Installation

1. Repository klonen:
```bash
git clone https://github.com/oemch/dienst-tausch.git
cd dienst-tausch
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
```bash
cp .env.example .env.local
```

4. `.env.local` mit deinen Supabase-Credentials füllen:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Development Server starten:
```bash
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## 📝 Scripts

- `npm run dev` - Startet den Development Server
- `npm run build` - Erstellt Production Build
- `npm run start` - Startet Production Server
- `npm run lint` - Führt ESLint aus
- `npm run type-check` - Prüft TypeScript-Typen

## 🗂️ Projektstruktur

```
app/
├── api/
│   └── users/          # API Route für Benutzerdaten
├── components/          # React Components
│   ├── DashboardOverlay.tsx
│   ├── DienstTauschOverlay.tsx
│   └── WochenkalenderOverlay.tsx
├── dashboard/          # Dashboard Seite
├── dienst-tausch/      # Dienst tauschen Seite
├── request-approved/   # Anfrage angenommen Seite
├── request-denied/     # Anfrage abgelehnt Seite
├── success/            # Erfolgsseite
├── welcome/            # Welcome Seite
└── wochenkalender-1/   # Wochenkalender Seite
```

## 🗄️ Datenbank

Die App verwendet Supabase für die Datenspeicherung. Die Tabelle `users` benötigt folgende Spalten:

- `id` (uuid, primary key)
- `first_name` (text)
- `last_name` (text)
- `email` (text)
- `firma` (text)
- `created_at` (timestamp)

## 🚢 Deployment

**→ Ausführliche Schritt-für-Schritt-Anleitung:** [ANLEITUNG-DEPLOYMENT.md](./ANLEITUNG-DEPLOYMENT.md)

Die App ist für Vercel optimiert:

1. Repository mit Vercel verbinden
2. Umgebungsvariablen in Vercel Settings setzen
3. Automatisches Deployment bei jedem Push auf `main`

## 📄 Lizenz

Private Projekt - Alle Rechte vorbehalten
