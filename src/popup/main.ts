import { render as renderPrayers } from '../ui/popup/sections/Prayers';
import { render as renderNews } from '../ui/popup/sections/News';
import { render as renderQuran } from '../ui/popup/sections/Quran';
import { render as renderDaily } from '../ui/popup/sections/Daily';
import { render as renderLive } from '../ui/popup/sections/Live';
import { render as renderSocial } from '../ui/popup/sections/Social';
import { getMessage } from '../lib/i18n';

const sections: Record<string, (el: HTMLElement) => void | Promise<void>> = {
  prayers: renderPrayers,
  news: renderNews,
  quran: renderQuran,
  daily: renderDaily,
  live: renderLive,
  social: renderSocial
};

const app = document.getElementById('app')!;
const tabBar = document.createElement('div');
const content = document.createElement('div');
app.appendChild(tabBar);
app.appendChild(content);

Object.keys(sections).forEach(key => {
  const btn = document.createElement('button');
  btn.textContent = getMessage(`tab_${key}`);
  btn.onclick = () => sections[key](content);
  tabBar.appendChild(btn);
});

sections.prayers(content);
