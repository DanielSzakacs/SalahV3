# Salah Extension

Chrome extension to display Islamic prayer times, news and Quran passages.

## Development

```bash
npm install
npm run dev
```

Then load the unpacked extension from the `dist` folder in Chrome. UI templates live in `src/ui/popup/sections/*.html` and basic styles are defined in `src/ui/style.csv`.

## Features

- **Prayers** tab shows today's times and the next prayer countdown. Use the "Locate me" button to update location.
- **News** tab lists articles per section. Configure feeds in Options.
- **Quran** tab displays the Al-Fatiha sample and allows font size adjustment.
- **Daily** tab rotates short quotes.
- **Live** tab embeds a YouTube stream if URL provided.
- **Social** tab stores shared intentions locally.

## Configuration

- Add news feed URLs on the Options page, one per line for each section.
- Set an Adhan URL and volume under Audio settings; choose "silent" to disable sound.
- To test alarms in development, use the "Simulate alarm" button on the Options page.
