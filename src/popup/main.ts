import { DateTime } from 'luxon';
import { render as renderTimeline } from '../ui/popup/sections/Prayers';
import { render as renderDailyQuran } from '../ui/popup/sections/Daily';
import { render as renderNews } from '../ui/popup/sections/News';
import { render as renderLive } from '../ui/popup/sections/Live';
import { render as renderSocial } from '../ui/popup/sections/Social';
import { setLanguage, getMessage } from '../lib/i18n';
import { getSettings } from '../lib/storage';
import { openOptionsPage } from '../lib/options';
import './style.css';

function renderTopBar(): HTMLElement {
  const top = document.createElement('div');
  top.className = 'top-bar';
  const locSpan = document.createElement('span');
  const btn = document.createElement('button');
  btn.className = 'settings-btn';
  btn.textContent = '⚙';
  btn.title = getMessage('options_button');
  btn.addEventListener('click', () => openOptionsPage());
  top.appendChild(locSpan);
  top.appendChild(btn);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  function update() {
    locSpan.textContent = `${tz} ${DateTime.now().toFormat('HH:mm')}`;
  }
  update();
  setInterval(update, 60000);
  return top;
}

async function init(): Promise<void> {
  const settings = await getSettings();
  await setLanguage(settings.language || 'en');
  const app = document.getElementById('app')!;
  app.appendChild(renderTopBar());
  app.appendChild(await renderTimeline());
  app.appendChild(await renderDailyQuran());
  app.appendChild(await renderNews());
  app.appendChild(await renderLive());
  app.appendChild(await renderSocial());
}

init();
