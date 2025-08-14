import { LocalSampleProvider } from '../../../quran/providers';
import { getSettings, setSettings } from '../../../lib/storage';
import { getMessage } from '../../../lib/i18n';

const provider = new LocalSampleProvider();

/**
 * Renders a simple Quran reader using local sample data.
 */
export async function render(container: HTMLElement) {
  const settings = await getSettings();
  const fontSize = settings.quranFontSize || 16;
  const surahs = await provider.listSurahs();
  const left = document.createElement('div');
  const right = document.createElement('div');
  left.style.width = '40%';
  left.style.float = 'left';
  right.style.width = '60%';
  right.style.float = 'left';

  surahs.forEach(s => {
    const btn = document.createElement('div');
    btn.textContent = s.name;
    btn.style.cursor = 'pointer';
    btn.onclick = async () => {
      const data = await provider.getSurah(s.id);
      right.innerHTML = data.ayat
        .map(a => `<div style="font-size:${fontSize}px">${a.number}. ${a.text}</div>`) 
        .join('');
    };
    left.appendChild(btn);
  });

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '12';
  slider.max = '36';
  slider.value = String(fontSize);
  slider.oninput = async e => {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    await setSettings({ quranFontSize: v });
  };
  container.appendChild(slider);
  container.appendChild(left);
  container.appendChild(right);
}
