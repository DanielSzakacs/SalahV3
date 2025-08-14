## Cél

Manifest V3-as Chrome-bővítmény muszlim imaidők megjelenítésére és jelzésére, hírek olvasására, Korán olvasására, napi idézet/hadísz üzenetekre, többnyelvű UI-val.  
**Első mérföldkő**: működő imaidő-számítás + jelzés + popup UI + alap hírszekció + Korán olvasó alapszint + i18n keret + élő stream beágyazás + közösségi funkciókhoz API/adapter réteg (stub).

## Nem-célok ebben a PR-ban

- Nincsenek bináris fájlok (se hangfájlok, se képek a placeholder ikonokon túl).
- Nem készül “éles” hírszolgáltatói integráció (csak bővíthető provider-interface + 1 demo).
- Közösségi funkciók: csak UX + API-interface + lokális mock (nincs valódi backend).
- Nincs felhasználói fiók/auth — későbbi PR.

## Tech stack

- MV3, TypeScript, Vite + `@crxjs/vite-plugin`
- Idő: `luxon`
- Imaidők: `adhan`
- Tárolás: `chrome.storage.sync`
- Ütemezés/értesítés: `chrome.alarms`, `chrome.notifications`
- Geolokáció: `navigator.geolocation` (+ manuális override Options oldalon)
- UI: egyszerű vanilla/TS + minimal CSS (keret, később cserélhető)

## jogosultságok (manifest)

```
"permissions": ["storage", "alarms", "notifications", "geolocation"],
"host_permissions": ["https://*/", "http://*/"]
```

## Kódstílus & minőség

- Minden **exportált függvényhez rövid, informatív JSDoc/TS docstring** (1–2 mondat).
- Moduláris rétegek: `lib/` (üzleti logika), `ui/` (render), `news/`, `quran/`, `social/`.
- Hibakezelés: felhasználóbarát toast/üzenet a popupban.
- Nincs bináris asset a PR-ban. Hangok **URL-ről** jönnek, defaultként “csendes” opció.

## Funkciók és elfogadási kritériumok

### 1) Napi imaidő kijelzése (popup)

- Popup tetején: **következő ima neve + időpont** (+ visszaszámláló).
- Alatta: **mai nap** összes időpontja (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha).
- Forrás: `adhan` + `luxon`.
- Elfogadás: manuális lat/lon + időzóna és automatikus (GPS). Rossz engedélyre barátságos fallback.

### 2) Pontos helyi számítás (GPS / manuális)

- “Locate me” gomb → `navigator.geolocation`.
- Options oldalon manuális lat/lon + számítási metódus (MWL, Umm al-Qura, ISNA…), madhab, latitude rule.
- Tárolás `chrome.storage.sync`-ben.
- Elfogadás: váltás után azonnali újraszámítás.

### 3) Értesítés imaidő kezdetekor

- `chrome.alarms` napi ütemezés + `chrome.notifications`.
- Options: melyik imákhoz kér értesítést.
- Elfogadás: értesítés megjelenik, és a következő napra automatikus újraszámítás.

### 4) Popup hangjelzés (adhan/mu’azzin)

- Beállításban több **előre definiált adhan URL** (remote), + “Néma (csak értesítés)”.
- Lejátszás **URL-ről**, nincs csomagolt hangfájl.
- Elfogadás: értesítéskor (ha engedélyezett) elindul a lejátszás, hangerő állítható.

### 5) Muszlim hírek

- Popup/fül: “Hírek” → 3 szekció: **Mekka**, **Medina**, **Globális**.
- Bővíthető `NewsProvider` interface; alap **RSS/JSON fetch** demo provider(ek) + forráslista konfigurálható az Optionsban (URL-ek).
- Elfogadás: legalább 3 cikk mock/demo forrásból listázva (cím, forrás, idő, link).

### 6) Korán olvasás

- Popup/fül: “Korán”.
- Minimál: surák listája + egy sura megnyitása (alapvető navigáció).
- Forrás: lokális **kis JSON minta** (pl. al-Fátiha) + **provider interface** külső API-hoz (későbbi PR-ban bővítjük).
- Elfogadás: al-Fátiha olvasható, görgethető, betűméret állítható.

### 7) Üzenetek a felhasználónak (napi idézet/hadísz, tippek)

- Napi egyszer felugró kis kártya a popupban (“Daily”).
- Forrás: lokális rövid JSON lista (idézetek/hadíszok) + később cserélhető API-ra.
- Elfogadás: naponta másik elem jelenik meg (egy egyszerű napi index hash alapján).

### 8) Nyelvi lokalizáció (i18n)

- `_locales/en|hu` megvan, bővítjük: `ar`, `tr`, `ur` **kulcsokkal** (kezdetben angol fordítás duplikálva).
- Minden új UI sztring i18n kulccsal megy.
- Elfogadás: nyelvváltó az Optionsban, újranyitáskor alkalmazódik.

### 9) Élő közvetítés Mekkából (YouTube embed)

- Popup/fül: “Live” — iframe beágyazás **konfigurálható YouTube URL-ből** (Options).
- Elfogadás: ha van URL, látszik és lejátszható; ha nincs, barátságos üres állapot.

### 10) Közösségi funkciók (stub)

- Popup/fül: “Közösség” — “Ima szándék” megosztása (lokálisan tárolt lista), barátlista és üzenetek **lokális mock**.
- Külön `social/api.ts` interface a későbbi valódi backendhez.
- Elfogadás: UX működik lokálisan; minden hálózati hívás mockolt.

## Fájl-/modulpontok (újak / bővülnek)

```
src/
  ui/
    popup/
      sections/{Prayers,News,Quran,Daily,Live,Social}.ts
      components/{Card,List,Toggle,Select,Toast}.ts
  lib/{prayer.ts,geo.ts,schedule.ts,storage.ts,notify.ts,audio.ts,i18n.ts}
  news/{providers.ts,config.ts,types.ts}
  quran/{providers.ts,local-sample.ts,types.ts}
  social/{api.ts,mock.ts,types.ts}
  types/{settings.ts,prayer.ts,news.ts,quran.ts,social.ts}
  background/service-worker.ts
options/ főbb beállítások UI-ja
```

## Tesztelés/QA (manuális)

1. Options: állíts be metódust + “Locate me” → popupban frissülnek az idők.
2. Engedélyezd értesítést legalább egy imára → dev módban állítsd közelire.
3. Válts hangot “Néma” ↔️ “Adhan URL” → értesítéskor viselkedés ellenőrzés.
4. Add meg hírcsatorna URL-jét → jelenjen meg a lista.
5. Korán → al-Fátiha megnyitása.
6. Napi üzenet → másik elem naponta.
7. Live → YouTube URL → lejátssza.
8. Social → lokális ima szándék hozzáadása.

## PR elvárások

- **Cím**: `feat(core): MVP prayers, notifications, news demo, Quran sample, i18n, live embed, social stubs`
- **Leírás**: Mi került be + hogyan tesztelhető.
- Nincsenek bináris fájlok.
- Minden exportált függvénynek van rövid docstringje.
