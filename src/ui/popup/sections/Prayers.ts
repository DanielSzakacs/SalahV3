import { DateTime } from 'luxon';
import { getTodayPrayers, getNextPrayer } from '../../../lib/prayer';
import { getSettings, getLocation, setLocation } from '../../../lib/storage';
import { getCurrentPosition } from '../../../lib/geo';
import { getMessage } from '../../../lib/i18n';

/**
 * Renders today's prayer times and next prayer countdown.
 */
export async function render(container: HTMLElement) {
  container.innerHTML = getMessage('loading');
  try {
    const settings = await getSettings();
    const loc = await getLocation();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const prayers = getTodayPrayers(
      { method: settings.method, madhab: settings.madhab, latitudeRule: settings.latitudeRule },
      { lat: loc.lat, lon: loc.lon, tz }
    );
    const list = document.createElement('ul');
    prayers.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name}: ${DateTime.fromISO(p.timeISO).toFormat('HH:mm')}`;
      list.appendChild(li);
    });
    container.innerHTML = '';
    const next = getNextPrayer(prayers);
    if (next) {
      const nextDiv = document.createElement('div');
      const countdown = document.createElement('span');
      function tick() {
        const diff = DateTime.fromISO(next.timeISO).diffNow(['hours', 'minutes', 'seconds']);
        countdown.textContent = diff.toFormat('hh:mm:ss');
      }
      tick();
      setInterval(tick, 1000);
      nextDiv.textContent = `${getMessage('next_prayer')}: ${next.name} `;
      nextDiv.appendChild(countdown);
      container.appendChild(nextDiv);
    }
    container.appendChild(list);
    const btn = document.createElement('button');
    btn.textContent = getMessage('locate_me');
    btn.onclick = async () => {
      try {
        const pos = await getCurrentPosition();
        await setLocation(pos);
        render(container);
      } catch {
        alert(getMessage('error_location'));
      }
    };
    container.appendChild(btn);
  } catch (e) {
    container.textContent = getMessage('error_generic');
  }
}
