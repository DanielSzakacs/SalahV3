import { render as renderPrayers } from '../ui/popup/sections/Prayers';
import { render as renderNews } from '../ui/popup/sections/News';
import { render as renderQuran } from '../ui/popup/sections/Quran';
import { render as renderDaily } from '../ui/popup/sections/Daily';
import { render as renderLive } from '../ui/popup/sections/Live';
import { render as renderSocial } from '../ui/popup/sections/Social';
import { setLanguage, getMessage } from '../lib/i18n';
import { getSettings } from '../lib/storage';
import { applyStyles } from '../ui/style';


const sections: Record<string, (el: HTMLElement) => void | Promise<void>> = {
  prayers: renderPrayers,
  news: renderNews,
  quran: renderQuran,
  daily: renderDaily,
  live: renderLive,
  social: renderSocial
};

async function init() {
  const settings = await getSettings();
  await setLanguage(settings.language || 'en');
  const content = document.getElementById('content')!;
  const optionsFrame = document.getElementById('options-frame') as HTMLIFrameElement;
  applyStyles();

  const optionsBtn = document.getElementById('options-btn')!;
  optionsBtn.textContent = getMessage('options_button');
  optionsBtn.addEventListener('click', () => {
    content.style.display = 'none';
    optionsFrame.style.display = 'block';
  });

  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'close-options') {
      optionsFrame.style.display = 'none';
      content.style.display = 'block';
    }
  });

  document.querySelectorAll('#tab-bar button').forEach(btn => {
    const key = btn.getAttribute('data-tab')!;
    btn.textContent = getMessage(`tab_${key}`);
    btn.addEventListener('click', () => sections[key](content));
  });

  sections.prayers(content);
}

init();
