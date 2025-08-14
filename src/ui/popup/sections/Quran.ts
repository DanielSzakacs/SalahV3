import { LocalSampleProvider } from '../../../quran/providers';
import { getSettings, setSettings } from '../../../lib/storage';
import template from './Quran.html?raw';


const provider = new LocalSampleProvider();

/**
 * Renders a simple Quran reader using local sample data.
 */
export async function render(container: HTMLElement): Promise<void> {
  const settings = await getSettings();
  const fontSize = settings.quranFontSize || 16;
  container.innerHTML = template;
  const listEl = container.querySelector('#surah-list') as HTMLUListElement;
  const contentEl = container.querySelector('#surah-content') as HTMLDivElement;
  const slider = container.querySelector('#font-size') as HTMLInputElement;
  slider.value = String(fontSize);
  slider.oninput = async e => {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    await setSettings({ quranFontSize: v });
    contentEl.style.fontSize = `${v}px`;
  };
  const surahs = await provider.listSurahs();
  surahs.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s.name;
    li.style.cursor = 'pointer';
    li.onclick = async () => {
      const data = await provider.getSurah(s.id);
      contentEl.innerHTML = data.ayat.map(a => `<div>${a.number}. ${a.text}</div>`).join('');
      contentEl.style.fontSize = `${slider.value}px`;
    };
    listEl.appendChild(li);
  });

}
