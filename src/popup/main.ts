import { render as renderPrayers } from '../ui/popup/sections/Prayers';
import { render as renderNews } from '../ui/popup/sections/News';
import { render as renderQuran } from '../ui/popup/sections/Quran';
import { render as renderDaily } from '../ui/popup/sections/Daily';
import { render as renderLive } from '../ui/popup/sections/Live';
import { render as renderSocial } from '../ui/popup/sections/Social';
import { getMessage } from '../lib/i18n';
import { applyStyles } from '../ui/style';

const sections: Record<string, (el: HTMLElement) => void | Promise<void>> = {
  prayers: renderPrayers,
  news: renderNews,
  quran: renderQuran,
  daily: renderDaily,
  live: renderLive,
  social: renderSocial
};

const content = document.getElementById('content')!;
applyStyles();

document.querySelectorAll('#tab-bar button').forEach(btn => {
  const key = btn.getAttribute('data-tab')!;
  btn.textContent = getMessage(`tab_${key}`);
  btn.addEventListener('click', () => sections[key](content));
});

sections.prayers(content);
