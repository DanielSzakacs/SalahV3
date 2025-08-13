import { getSettings, setSettings, getLocation, setLocation, getNotificationPrefs } from '../lib/storage';

const methods = ['MWL', 'Umm al-Qura', 'ISNA'];
const madhabs = ['Shafi', 'Hanafi'];
const latitudeRules = ['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle'];
const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

async function init() {
  const app = document.getElementById('app')!;
  const settings = await getSettings();
  const loc = await getLocation();
  const notif = await getNotificationPrefs();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  app.innerHTML = `
    <div>Time zone: ${tz}</div>
    <label>Method <select id="method">${methods.map(m=>`<option value="${m}">${m}</option>`).join('')}</select></label>
    <label>Madhab <select id="madhab">${madhabs.map(m=>`<option value="${m}">${m}</option>`).join('')}</select></label>
    <label>Latitude rule <select id="latrule">${latitudeRules.map(l=>`<option value="${l}">${l}</option>`).join('')}</select></label>
    <div>
      <label>City <input id="city" value="${settings.city||''}"></label>
      <label>Lat <input id="lat" value="${loc.lat}"></label>
      <label>Lon <input id="lon" value="${loc.lon}"></label>
    </div>
    <div id="notifs">
      ${prayers.map(p=>`<label><input type="checkbox" data-prayer="${p}" ${notif[p] ? 'checked' : ''}/> ${p}</label>`).join('<br>')}
    </div>
  `;
  (document.getElementById('method') as HTMLSelectElement).value = settings.method;
  (document.getElementById('madhab') as HTMLSelectElement).value = settings.madhab;
  (document.getElementById('latrule') as HTMLSelectElement).value = settings.latitudeRule;

  document.getElementById('method')!.addEventListener('change', e => setSettings({ method: (e.target as HTMLSelectElement).value }));
  document.getElementById('madhab')!.addEventListener('change', e => setSettings({ madhab: (e.target as HTMLSelectElement).value }));
  document.getElementById('latrule')!.addEventListener('change', e => setSettings({ latitudeRule: (e.target as HTMLSelectElement).value }));
  document.getElementById('city')!.addEventListener('change', e => setSettings({ city: (e.target as HTMLInputElement).value }));
  document.getElementById('lat')!.addEventListener('change', e => setLocation({ lat: parseFloat((e.target as HTMLInputElement).value), lon: loc.lon }));
  document.getElementById('lon')!.addEventListener('change', e => setLocation({ lat: loc.lat, lon: parseFloat((e.target as HTMLInputElement).value) }));
  document.querySelectorAll('#notifs input').forEach(el => {
    el.addEventListener('change', ev => {
      const t = ev.target as HTMLInputElement;
      setSettings({ notifications: { ...notif, [t.dataset.prayer!]: t.checked } });
    });
  });
}

init();
