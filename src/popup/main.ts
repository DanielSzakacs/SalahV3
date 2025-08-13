import { getTodayPrayers, getNextPrayer } from '../lib/prayer';
import { getSettings, getLocation, setLocation } from '../lib/storage';
import { getCurrentPosition } from '../lib/geo';

async function render() {
  const app = document.getElementById('app')!;
  app.innerHTML = 'Loading...';
  const settings = await getSettings();
  const loc = await getLocation();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prayers = await getTodayPrayers({
    lat: loc.lat,
    lon: loc.lon,
    tz,
    method: settings.method,
    madhab: settings.madhab,
    latitudeRule: settings.latitudeRule,
    date: new Date()
  });
  const next = getNextPrayer(new Date().toISOString(), prayers);
  let html = '';
  if (next) {
    html += `<div>Next: ${next.name} at ${new Date(next.timeISO).toLocaleTimeString()}</div>`;
  }
  html += '<ul class="prayer-list">' +
    prayers.map(p => `<li>${p.name}: ${new Date(p.timeISO).toLocaleTimeString()}</li>`).join('') +
    '</ul>';
  html += '<button id="locate">Locate me</button>';
  app.innerHTML = html;
  document.getElementById('locate')!.addEventListener('click', async () => {
    try {
      const pos = await getCurrentPosition();
      await setLocation(pos);
      render();
    } catch (e) {
      console.error(e);
    }
  });
}

render();
