import { getSettings, setSettings, getLocation, setLocation, getNotificationPrefs } from '../lib/storage';
import { getCurrentPosition } from '../lib/geo';
import { getMessage } from '../lib/i18n';
import { applyStyles } from '../ui/style';


const methods = ['MWL', 'UmmAlQura', 'ISNA'];
const madhabs = ['Shafi', 'Hanafi'];
const latitudeRules = ['MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle'];
const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const languages = ['en', 'hu', 'ar', 'tr', 'ur'];

/**
 * Renders the options page and wires simple settings bindings.
 */
async function init() {
  applyStyles();
  const app = document.getElementById('app')!;
  const settings = await getSettings();
  const loc = await getLocation();
  const notif = await getNotificationPrefs();
  const src = settings.newsSources || { mecca: [], medina: [], global: [] };
  app.innerHTML = `
    <div>
      <label>${getMessage('opt_method')}
        <select id="method">${methods.map(m=>`<option value="${m}">${m}</option>`).join('')}</select>
      </label>
      <label>${getMessage('opt_madhab')}
        <select id="madhab">${madhabs.map(m=>`<option value="${m}">${m}</option>`).join('')}</select>
      </label>
      <label>${getMessage('opt_latrule')}
        <select id="latrule">${latitudeRules.map(l=>`<option value="${l}">${l}</option>`).join('')}</select>
      </label>
    </div>
    <div>
      <label>Lat <input id="lat" value="${loc.lat}"></label>
      <label>Lon <input id="lon" value="${loc.lon}"></label>
      <button id="locate">${getMessage('locate_me')}</button>
    </div>
    <div id="notifs">
      ${prayers.map(p=>`<label><input type="checkbox" data-prayer="${p}" ${notif[p] ? 'checked' : ''}/> ${p}</label>`).join('<br/>')}
    </div>
    <div>
      <label>${getMessage('opt_adhan_mode')}
        <select id="adhanMode">
          <option value="silent">${getMessage('opt_silent')}</option>
          <option value="url">URL</option>
        </select>
      </label>
      <label>URL <input id="adhanUrl" value="${settings.adhanUrl || ''}"></label>
      <label>${getMessage('opt_volume')} <input id="adhanVolume" type="range" min="0" max="1" step="0.1" value="${settings.adhanVolume || 0.7}"></label>
    </div>
    <div>
      <label>News Mecca <textarea id="news_mecca">${src.mecca.join('\n')}</textarea></label>
      <label>News Medina <textarea id="news_medina">${src.medina.join('\n')}</textarea></label>
      <label>News Global <textarea id="news_global">${src.global.join('\n')}</textarea></label>
    </div>
    <div>
      <label>Live URL <input id="liveUrl" value="${settings.liveStreamUrl || ''}"></label>
    </div>
    <div>
      <label>${getMessage('opt_language')}
        <select id="lang">${languages.map(l=>`<option value="${l}">${l}</option>`).join('')}</select>
      </label>
    </div>
    <div>
      <label>${getMessage('opt_quran_font')} <input id="quranFont" type="range" min="12" max="36" value="${settings.quranFontSize || 16}"></label>
    </div>
    <button id="simulate">${getMessage('opt_simulate')}</button>
  `;
  (document.getElementById('method') as HTMLSelectElement).value = settings.method || 'MWL';
  (document.getElementById('madhab') as HTMLSelectElement).value = settings.madhab || 'Shafi';
  (document.getElementById('latrule') as HTMLSelectElement).value = settings.latitudeRule || 'MiddleOfTheNight';
  (document.getElementById('adhanMode') as HTMLSelectElement).value = settings.adhanMode || 'silent';
  (document.getElementById('lang') as HTMLSelectElement).value = settings.language || 'en';

  document.getElementById('method')!.addEventListener('change', e => setSettings({ method: (e.target as HTMLSelectElement).value }));
  document.getElementById('madhab')!.addEventListener('change', e => setSettings({ madhab: (e.target as HTMLSelectElement).value }));
  document.getElementById('latrule')!.addEventListener('change', e => setSettings({ latitudeRule: (e.target as HTMLSelectElement).value }));
  document.getElementById('lat')!.addEventListener('change', e => setLocation({ lat: parseFloat((e.target as HTMLInputElement).value), lon: loc.lon }));
  document.getElementById('lon')!.addEventListener('change', e => setLocation({ lat: loc.lat, lon: parseFloat((e.target as HTMLInputElement).value) }));
  document.querySelectorAll('#notifs input').forEach(el => {
    el.addEventListener('change', ev => {
      const t = ev.target as HTMLInputElement;
      setSettings({ notifications: { ...notif, [t.dataset.prayer!]: t.checked } });
    });
  });
  document.getElementById('adhanMode')!.addEventListener('change', e => setSettings({ adhanMode: (e.target as HTMLSelectElement).value }));
  document.getElementById('adhanUrl')!.addEventListener('change', e => setSettings({ adhanUrl: (e.target as HTMLInputElement).value }));
  document.getElementById('adhanVolume')!.addEventListener('input', e => setSettings({ adhanVolume: parseFloat((e.target as HTMLInputElement).value) }));
  document.getElementById('news_mecca')!.addEventListener('change', e => saveNews('mecca', (e.target as HTMLTextAreaElement).value));
  document.getElementById('news_medina')!.addEventListener('change', e => saveNews('medina', (e.target as HTMLTextAreaElement).value));
  document.getElementById('news_global')!.addEventListener('change', e => saveNews('global', (e.target as HTMLTextAreaElement).value));
  document.getElementById('liveUrl')!.addEventListener('change', e => setSettings({ liveStreamUrl: (e.target as HTMLInputElement).value }));
  document.getElementById('lang')!.addEventListener('change', e => setSettings({ language: (e.target as HTMLSelectElement).value }));
  document.getElementById('quranFont')!.addEventListener('input', e => setSettings({ quranFontSize: parseInt((e.target as HTMLInputElement).value, 10) }));
  document.getElementById('locate')!.addEventListener('click', async () => {
    const p = await getCurrentPosition();
    await setLocation(p);
  });
  document.getElementById('simulate')!.addEventListener('click', () => {
    chrome.runtime.sendMessage('simulate');
  });
}

async function saveNews(section: string, value: string) {
  const current = (await getSettings()).newsSources || { mecca: [], medina: [], global: [] };
  current[section] = value.split('\n').filter(Boolean);
  await setSettings({ newsSources: current });
}

init();
