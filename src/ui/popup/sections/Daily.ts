import { DateTime } from 'luxon';
import { LocalSampleProvider } from '../../../quran/providers';
import { getMessage } from '../../../lib/i18n';

const provider = new LocalSampleProvider();

/**
 * Renders a Daily Quran card showing one ayah.
 */
export async function render(): Promise<HTMLElement> {
  const card = document.createElement('div');
  card.className = 'card';
  const header = document.createElement('div');
  header.className = 'card-header';
  const left = document.createElement('div');
  left.className = 'left';
  const icon = document.createElement('span');
  icon.textContent = '📖';
  const title = document.createElement('span');
  title.textContent = getMessage('daily_quran');
  left.appendChild(icon);
  left.appendChild(title);
  header.appendChild(left);
  card.appendChild(header);

  const body = document.createElement('div');
  const surah = await provider.getSurah(1);
  const index = DateTime.now().ordinal % surah.ayat.length;
  const ayah = surah.ayat[index];
  const ar = document.createElement('div');
  ar.className = 'quran-ar';
  ar.textContent = ayah.ar;
  const en = document.createElement('div');
  en.className = 'quran-en';
  en.textContent = ayah.en;
  const ref = document.createElement('div');
  ref.className = 'quran-ref';
  ref.textContent = `Quran 1:${ayah.number} (Al-Fatiha)`;
  body.appendChild(ar);
  body.appendChild(en);
  body.appendChild(ref);
  card.appendChild(body);
  return card;
}
