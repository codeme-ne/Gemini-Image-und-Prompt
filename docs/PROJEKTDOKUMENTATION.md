# Projektdokumentation – PagetoPic

**Typ:** Full-Stack SaaS-Webanwendung  
**Technologiebereich:** KI-Automatisierung, Generative AI, Webentwicklung  
**Zeitraum:** 2025–2026  
**Repository:** [github.com/codeme-ne/PagetoPic](https://github.com/codeme-ne/PagetoPic)

---

## 1. Projektname & Kurzbeschreibung

**PagetoPic** ist eine KI-gestützte Webanwendung, die beliebige URLs vollautomatisch in hochwertige Bilder umwandelt. Der gesamte Prozess – vom Website-Scraping über KI-gestützte Prompt-Generierung bis zur finalen Bildgenerierung – läuft in einer durchgängigen Automatisierungspipeline ab, ohne manuellen Eingriff.

**Kernfunktion:** URL eingeben → Stil auswählen → KI generiert Bild (< 30 Sekunden)

**Zielgruppen:**
- Solo-Gründer & Marketer: schnelle Social-Media-Visuals aus Landing Pages oder Blog-Posts
- Agenturen: skalierbare Bilderstellung aus Kunden-URLs für Kampagnenvarianten
- Entwickler: KI-Content-Tooling mit eingebauter Kostenkontrolle und Missbrauchsschutz

---

## 2. Projektziele

| # | Ziel | Status |
|---|------|--------|
| 1 | Vollautomatische URL-zu-Bild-Pipeline ohne manuelle Schritte | ✅ Umgesetzt |
| 2 | Produktionsreife SaaS-Anwendung mit Authentication & Billing | ✅ Umgesetzt |
| 3 | Kosteneffiziente KI-Nutzung durch Credit-System & Limits | ✅ Umgesetzt |
| 4 | Skalierbare Architektur für mehrere gleichzeitige Nutzer | ✅ Umgesetzt |
| 5 | Sicherheit gegen Missbrauch (SSRF, Rate-Limiting, Betrug) | ✅ Umgesetzt |
| 6 | Mehrere KI-Stile & optimiertes Prompt-Engineering | ✅ Umgesetzt |
| 7 | Transparente KI-Denkprozesse für Endnutzer sichtbar machen | ✅ Umgesetzt |

---

## 3. Technologie-Stack

### 3.1 Kernframework
| Technologie | Version | Einsatz |
|-------------|---------|---------|
| Next.js | 15.5 | Full-Stack-Framework (App Router, API Routes, Edge Runtime) |
| React | 19 | UI-Bibliothek |
| TypeScript | 5 | Typsicherheit, strikte Moduseinstellung |
| Tailwind CSS | 4 | Utility-First-Styling mit CSS-Custom-Properties |

### 3.2 KI & Automatisierung (Kernkompetenzen)
| Technologie | Einsatz |
|-------------|---------|
| **Google Gemini 2.5 Flash** | Prompt-Generierung mit Reasoning-Tokens (Chain-of-Thought); Streaming-Output |
| **Fal.ai Imagen 4** | State-of-the-Art Bildgenerierung; asynchrone Verarbeitung mit Base64-Rückgabe |
| **Firecrawl** | KI-gestütztes Web-Scraping; wandelt beliebige Websites in strukturiertes Markdown um |
| **Jina Reader** | Fallback-Scraper (kostenlos, kein API-Key nötig); erhöht Ausfallsicherheit |

### 3.3 Backend & Infrastruktur
| Technologie | Einsatz |
|-------------|---------|
| **Upstash Redis** | Verteilter Cache für Credits, Sessions, Rate-Limiting & Idempotenz-Keys |
| **Stripe** | Zahlungsabwicklung; Credit-Packs (Starter/Creator/Pro) mit Webhook-Verarbeitung |
| **NextAuth v5** | Passwortlose Authentifizierung via E-Mail-Magic-Links (JWT-Strategie, Edge-kompatibel) |
| **Resend** | Transaktionale E-Mail-Zustellung für Magic Links |
| **Vercel** | Hosting & Deployment (Edge Functions + Node.js Serverless) |

### 3.4 Testing & Qualitätssicherung
| Technologie | Einsatz |
|-------------|---------|
| **Vitest** | Unit- & Integrationstests für `lib/` und API-Logik |
| **ESLint** | Code-Qualitätsprüfung mit Next.js-Regelwerk |

---

## 4. Architektur & Umsetzung

### 4.1 Automatisierungs-Pipeline (6 Schritte)

```
Schritt 1: URL-Eingabe
    └─→ SSRF-Validierung (blockiert private IPs, Cloud-Metadaten, localhost)

Schritt 2: Stilauswahl
    └─→ 11 KI-Bildstile (Ghibli, LEGO, Claymation, Logo, Whimsical, Sumi-e,
                          Minimal Corporate, 3D, Photorealistic, Glassmorphic, Brutalist)

Schritt 3: Content-Extraktion (/api/scrape)
    └─→ Firecrawl oder Jina Reader → Website zu Markdown
    └─→ Provider-Fallback für hohe Verfügbarkeit

Schritt 4: KI-Prompt-Generierung (/api/gemini) [Edge Runtime, Streaming]
    └─→ Gemini 2.5 Flash analysiert Markdown + Stil
    └─→ Reasoning-Tokens werden live an den Nutzer gestreamt
    └─→ Ausgang: optimierter 15-25-Wörter-Bildprompt

Schritt 5: Bildgenerierung (/api/imagen4) [Node Runtime]
    └─→ 1 Credit wird atomisch abgezogen (Lua-Skript, Race-Condition-sicher)
    └─→ Fal.ai Imagen 4 generiert das Bild
    └─→ Bei Provider-Fehler: automatische Credit-Rückerstattung
    └─→ Tages-Cap: max. 100 Bilder/Nutzer/Tag

Schritt 6: Ausgabe & Download
    └─→ Base64-Bild wird angezeigt
    └─→ Download als PNG, Prompt kopieren, bis zu 3 Regenerierungen
```

### 4.2 Edge vs. Node Runtime-Aufteilung

| API-Route | Runtime | Begründung |
|-----------|---------|------------|
| `/api/gemini` | **Edge** | Streaming, geringe Latenz, zustandslos |
| `/api/credits` | **Edge** | Leichtgewichtig, kein schweres SDK |
| `/api/scrape` | **Node** | Firecrawl-SDK benötigt Node.js |
| `/api/imagen4` | **Node** | Fal.ai-SDK, binäre Bildverarbeitung |
| `/api/webhooks/stripe` | **Node** | Stripe-SDK + Lua-Skripte für Redis |

### 4.3 Credit-System (Automatisiertes Billing-Backend)

```
Nutzererstellung → Trial-Credit (1x kostenlos, Redis NX-Flag verhindert Doppelvergabe)
    ↓
Bildgenerierung → Atomischer Debit via Lua-Skript (Race-Condition-sicher)
    ↓
Stripe Checkout → Webhook → awardCredits() → Idempotenz via Redis (7 Tage)
    ↓
Provider-Fehler → Automatische Rückerstattung (refund())
    ↓
DLQ (Dead-Letter-Queue) → Fehlgeschlagene Events für 30 Tage gespeichert
```

### 4.4 Sicherheitsarchitektur

| Maßnahme | Implementierung | Schutzwirkung |
|----------|-----------------|---------------|
| **SSRF-Schutz** | IP-Range-Validierung in `lib/validateUrl.ts` | Blockiert 10.x, 172.16-31.x, 192.168.x, 169.254.x, localhost |
| **Rate-Limiting** | Upstash-Redis + `@upstash/ratelimit` | 50 Req/IP/Tag pro Endpoint |
| **Auth-Middleware** | NextAuth JWT + `middleware.ts` | Schützt alle Hauptrouten |
| **Webhook-Verifikation** | Stripe-Signatur-Check | Verhindert gefälschte Credit-Aufbuchungen |
| **Atomic Debit** | Redis-Lua-Skript | Verhindert negative Credits durch Race Conditions |
| **Regenerierungs-Limit** | Rolling-24h-Counter per Prompt-Hash | Max. 4 Bilder pro Prompt |
| **Fail-Open** | Rate-Limiter ohne Redis → erlaubt Anfragen | Dev-freundlich, kein Hard-Fail |

---

## 5. KI-Automatisierung im Detail

### 5.1 Prompt-Engineering-Pipeline

Der intelligenteste Teil der Anwendung ist die automatische Transformation von beliebigem Websiteinhalt in einen optimierten Bildprompt:

1. **Rohinput:** Website-HTML aller Art (SaaS-Landing-Pages, Blogs, Events, Shops)
2. **Vorverarbeitung:** Firecrawl/Jina wandelt HTML → sauberes Markdown
3. **Chain-of-Thought:** Gemini 2.5 Flash denkt schrittweise über Inhalt & Stil nach (Reasoning-Tokens sichtbar für Nutzer)
4. **Ausgabe:** Präziser 15-25-Wörter-Prompt, optimiert für Imagen 4

**Beispiel-Transformation:**
```
Input URL: https://example-saas.com/pricing
Stil: Ghibli

Gemini Reasoning: "Die Seite zeigt Preistabellen für ein 
  Projektmanagement-Tool. Ghibli-Stil bedeutet: sanfte Farben, 
  Natur-Elemente, handgezeichnetes Feeling..."

Output Prompt: "Whimsical Studio Ghibli-style illustration of a 
  cozy workspace with floating price cards among cherry blossoms, 
  soft pastel blue sky, hand-drawn feel"

Imagen 4 → Fertiges Bild
```

### 5.2 Streaming-Architektur für Echtzeit-Feedback

```typescript
// Edge Runtime: Gemini-Streaming an Client weitergeleitet
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of result.fullStream) {
      if (chunk.type === "reasoning")  // Thinking-Steps
        controller.enqueue({ type: "thinking", text: chunk.text });
      if (chunk.type === "text-delta") // Finaler Prompt
        controller.enqueue({ type: "text-delta", text: chunk.textDelta });
    }
  }
});
```

Nutzerperspektive: Der KI-Denkprozess wird live getippt angezeigt → **Transparenz & Vertrauen**.

### 5.3 Fehlerresilienz durch Provider-Abstraktion

```
Scraper-Auswahl (automatisch oder konfigurierbar):
  SCRAPER_PROVIDER=auto → Jina (kostenlos, kein API-Key)
                        → Fallback: Firecrawl (paid, höhere Qualität)

Vorteil: Zero-Downtime bei Ausfall eines Providers
```

---

## 6. Vorher/Nachher-Ergebnisse

### 6.1 Prozessvergleich: Manuell vs. PagetoPic-Automatisierung

| Aufgabe | Manuell (vorher) | PagetoPic (nachher) |
|---------|-----------------|---------------------|
| LinkedIn-Visual für Produktlaunch | 2-4 Stunden (Designer, Briefing, Revisionen) | **< 30 Sekunden** |
| Newsletter-Cover aus Blog-Post | 1-2 Stunden (Canva, AI-Prompting, Export) | **< 30 Sekunden** |
| Event-Poster aus Veranstaltungsseite | 3-8 Stunden (Grafikdesign) | **< 30 Sekunden** |
| Variantentest (5 Stile) | 15-40 Stunden | **2,5 Minuten** |
| Kosten pro Bild | 50–500 € (Freelancer/Agentur) | **< 0,05 €** (API-Kosten) |

### 6.2 Technische Vorher/Nachher (vs. Proof-of-Concept-Ausgangsbasis)

| Dimension | Proof-of-Concept (vorher) | PagetoPic (nachher) |
|-----------|--------------------------|---------------------|
| Authentifizierung | ❌ Keine | ✅ Passwortlos (Magic Links) |
| API-Key-Handling | ❌ Nutzer gibt Keys manuell ein | ✅ Serverseitig, kein Client-Exposure |
| Bildstile | 3 hartcodierte Stile | 11 KI-optimierte Stile |
| Skalierbarkeit | Single-User-Demo | Multi-User-SaaS mit Redis-Sessions |
| Billing | ❌ Keine | ✅ Stripe + automatisches Credit-System |
| Rate-Limiting | Einfach | Multi-Layer (IP + User + Prompt-Hash) |
| Fehlerresilienz | ❌ Provider-Ausfall = App down | ✅ Provider-Fallback + Credit-Refund |
| Transparenz | ❌ Keine Einsicht in KI-Prozess | ✅ Live-Streaming der KI-Reasoning-Tokens |
| Testing | ❌ Keine Tests | ✅ Unit + Integrationstests (Vitest) |
| Security | Minimal | SSRF-Schutz, Webhook-Verifikation, GDPR |
| Deployment | Lokal | Vercel Edge + Node Serverless |

### 6.3 Beispiel-Transformationen (Input → Output)

```
Input:  https://stripe.com/pricing
Stil:   LEGO
Output: Bunte LEGO-Stadtlandschaft mit Preisschildern als LEGO-Türme,
        bright primary colors, blocky brick construction aesthetic

Input:  https://openai.com
Stil:   SUMI-E
Output: Traditionelles Sumi-e-Tuschemalerei mit abstrakten KI-Gehirn-
        Strukturen, sparse black strokes on white, meditative atmosphere

Input:  https://github.com
Stil:   GHIBLI
Output: Ghibli-Illustration eines magischen Code-Waldes mit glühenden
        Commit-Bäumen und freundlichen Octocat-Geistern
```

---

## 7. Implementierungsdetails & Erkenntnisse

### 7.1 Herausforderungen & Lösungen

**Challenge 1: Race Conditions im Credit-System**
- Problem: Bei gleichzeitigen Anfragen könnte ein Nutzer mehr Credits ausgeben als vorhanden
- Lösung: Atomisches Lua-Skript in Redis → prüft Saldo und debitiert in einer unteilbaren Operation

**Challenge 2: Streaming über Edge Runtime**
- Problem: Next.js Edge Runtime unterstützt kein Node.js nativ
- Lösung: NDJSON-Streaming-Protokoll mit Event-Typen (`thinking`, `text-delta`, `done`) im Response-Body

**Challenge 3: Missbrauchsschutz ohne Degradation**
- Problem: Zu restriktive Limits beeinträchtigen legitime Nutzer; zu großzügig → Kostenexplosion
- Lösung: Multi-Layer-Approach: IP-Rate-Limit + User-Credit-Cap + Prompt-Hash-Regen-Limit

**Challenge 4: Provider-Ausfälle in der Live-Pipeline**
- Problem: Wenn Imagen 4 ausfällt, hat Nutzer Credits verloren ohne Ergebnis
- Lösung: Credit-Refund-Mechanismus bei Provider-Fehler → Vertrauensaufbau beim Nutzer

### 7.2 Architekturentscheidungen mit Begründung

| Entscheidung | Begründung |
|--------------|------------|
| Redis statt SQL-Datenbank | Edge-kompatibel, atomische Operationen, sub-Millisekunden-Latenz für Credits |
| JWT-Session (kein DB-Session) | Edge-Middleware kann Token ohne DB-Lookup validieren |
| NDJSON Streaming statt WebSocket | Einfacher, HTTP-kompatibel, kein Upgrade-Handshake nötig |
| Fail-Open Rate Limiting | Dev-Produktivität; Redis-Ausfall blockt keine legitimen Nutzer |
| Jina als Default-Scraper | Kostenlos, kein API-Key nötig → niedrige Einstiegshürde |

### 7.3 Learnings

1. **KI-Prompting ist Engineering:** Kleine Änderungen im System-Prompt führen zu drastisch unterschiedlichen Bildprompts → systematisches Testen notwendig
2. **Streaming verbessert UX messbar:** Nutzer warten toleranter wenn sie sehen, dass etwas passiert (Gemini Reasoning visible)
3. **Atomic Operations in Redis:** Lua-Skripte sind essentiell für finanzielle Operationen in verteilten Systemen
4. **Provider-Abstraktion zahlt sich aus:** Firecrawl-Ausfall hat in Produktion keinen Nutzer-Impact durch Jina-Fallback

---

## 8. Relevanz für Automation & KI-Expertise

### Automatisierungskompetenz demonstriert durch:

- **End-to-End-Pipeline-Design:** Vollautomatische Kette von URL-Eingabe bis Bild ohne manuelle Schritte
- **KI-Modell-Integration:** Praktische Erfahrung mit Gemini, Imagen 4, Firecrawl-KI-Scraping
- **Fehlerresilienz:** Provider-Fallback, automatische Credit-Rückerstattung, DLQ für Webhooks
- **Streaming-Architekturen:** Echtzeit-Datenverarbeitung mit Next.js Edge Runtime

### KI-Expertise demonstriert durch:
- **Prompt-Engineering:** Systematische Stilprompts für 11 verschiedene Bildstile
- **Chain-of-Thought-Nutzung:** Gemini Reasoning-Tokens für transparente, qualitativ hochwertige Ergebnisse
- **Multimodale AI:** Text-zu-Bild-Pipeline mit mehreren KI-Modellen in Serie
- **KI-Kostenoptimierung:** Credit-System, Daily-Caps, Regenerierungslimits für kontrollierte KI-Ausgaben

### Relevanz für Veritas (Daten-/Enterprise-Kontext):
- **Datenautomatisierung:** Extraktion, Transformation und Verarbeitung von Webinhalten in strukturierte Daten
- **Skalierbare Architektur:** Multi-User, verteilte Systeme, Produktionsreife
- **Sicherheit & Compliance:** SSRF-Schutz, GDPR-Datenschutzseite, Webhook-Verifikation, Impressum
- **Observability:** Strukturiertes Error-Handling, Debug-Logging, DLQ für fehlgeschlagene Events

---

## 9. Technische Metriken

| Metrik | Wert |
|--------|------|
| API-Routen | 8 (scrape, gemini, imagen4, credits, billing, webhooks, auth, check-env) |
| Bildstile | 11 KI-optimierte Preset-Stile |
| Pipeline-Latenz | ~10–25 Sekunden gesamt (inkl. KI-Generierung) |
| Rate-Limit | 50 Req/IP/Tag pro Endpoint |
| Credit-Packs | 3 Stufen: Starter (20), Creator (60), Pro (200) |
| Daily-Cap | 100 Bilder/Nutzer/Tag |
| Regen-Limit | Max. 4 Bilder pro Prompt (24h Rolling-Window) |
| Test-Coverage | Unit-Tests + 3 Integrations-Testsuiten |
| Externe Services | 6 (Firecrawl, Jina, Gemini, Fal.ai, Stripe, Upstash) |
| Codebase | ~3.500 Lines of Code (TypeScript) |

---

## 10. Projektstruktur (Übersicht)

```
PagetoPic/
├── app/
│   ├── page.tsx              # Haupt-App (6-Schritt-Workflow)
│   ├── landing/              # Marketing-Landing-Page (public)
│   ├── gallery/              # Bild-Galerie mit Filterung
│   ├── pricing/              # Stripe Credit-Packs
│   ├── use-cases/            # Rollenbasierte Inhalte
│   ├── auth/                 # Magic-Link-Login
│   ├── (legal)/              # DSGVO, AGB, Impressum
│   └── api/
│       ├── scrape/           # Firecrawl/Jina Web-Scraping
│       ├── gemini/           # Gemini Prompt-Generierung (Edge, Streaming)
│       ├── imagen4/          # Fal.ai Bildgenerierung + Credit-Debit
│       ├── credits/          # Credit-Abfrage (Edge)
│       ├── billing/checkout/ # Stripe Checkout-Session
│       ├── webhooks/stripe/  # Stripe Webhook + Credit-Vergabe
│       └── check-env/        # Konfigurationsvalidierung
├── lib/
│   ├── credits.ts            # Atomisches Credit-System (Lua/Redis)
│   ├── scraper.ts            # Provider-Abstraktion (Firecrawl/Jina)
│   ├── validateUrl.ts        # SSRF-Schutz
│   ├── rate-limit.ts         # IP-basiertes Rate-Limiting
│   └── error-handler.ts      # Zentralisiertes Error-Handling
├── components/               # React-Komponenten (shadcn/ui + Radix UI)
├── docs/                     # Architekturdokumentation
└── tests/                    # Unit- & Integrationstests (Vitest)
```

---

## 11. Fazit

PagetoPic zeigt die praktische Anwendung moderner KI-Automatisierungstechnologien in einer produktionsreifen SaaS-Architektur. Das Projekt demonstriert:

- **Tiefes Verständnis von KI-APIs** (Gemini, Imagen 4, Firecrawl) und deren produktiver Integration
- **Automatisierungsdenken** durch durchgängige, fehlerresistente Pipelines
- **Systemdesign-Kompetenz** mit Fokus auf Skalierbarkeit, Sicherheit und Nutzererfahrung
- **Pragmatisches Problemlösen**: jede Architekturentscheidung hat eine klare Begründung

Dieses Projekt eignet sich als Referenz für Positionen im Bereich **KI-Automatisierung, AI-Integration und Full-Stack-Engineering** – insbesondere in Enterprise-Umgebungen, die Wert auf Zuverlässigkeit, Sicherheit und skalierbare Datenverarbeitung legen.

---

*Letzte Aktualisierung: März 2026*
