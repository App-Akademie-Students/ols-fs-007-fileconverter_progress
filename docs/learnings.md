# AI Collaboration Learnings

Hier halten wir Erkenntnisse aus der Zusammenarbeit mit AI fest.

## Gute Ergebnisse

- Design-First mit festem Umsetzungsplan (`implementation-plan.md`): Die Schritte 0–9 ließen sich ohne Rückfragen und ohne Architekturbrüche abarbeiten.
- Strategy, Factory und Dependency Injection (Composition Root) machten den Kern ohne Next.js testbar; die 41 Unit-Tests laufen in unter einer Sekunde.
- Die API-Route blieb ein dünner Adapter (Request lesen, Service aufrufen, Fehler auf Status abbilden).
- Die UI enthält keine Konvertierungslogik, sie lädt hoch, zeigt an und löst den Download aus.

## Probleme

- `CLAUDE.md` weist darauf hin, dass diese Next.js-Version von bekannten APIs abweichen kann. Die Docs in `node_modules/next/dist/docs/` müssen vor Next.js-Code geprüft werden, nicht aus dem Gedächtnis.
- Die API-Route und die UI sind laut Standards nicht automatisch getestet. Fehler dort fallen nur beim manuellen Test auf.

## Änderungen am Projektkontext

- Manueller Ende-zu-Ende-Test (Schritt 9) per `curl` gegen `next dev`: CSV→JSON und JSON→CSV liefern korrekte Ergebnisse (Komma und Umlaute im Wert bleiben erhalten), Quelle = Ziel liefert 400 mit verständlicher Meldung, die Startseite antwortet mit 200.
- Offen: Der Browser-Ablauf (Dateiauswahl, Anzeige, Download-Button) wurde noch nicht von Hand im Browser geprüft.
