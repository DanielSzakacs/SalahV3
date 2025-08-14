import { getSettings, setSettings } from '../lib/storage';
import { setLanguage, getMessage } from '../lib/i18n';
import { applyStyles } from '../ui/style';

interface AdhanSettings {
  audioEnabled: boolean;
  popupEnabled: boolean;
  source: string;
  customUrl: string;
  volume: number;
}

const languages = ['en', 'hu', 'ru', 'ar', 'tr', 'ur'];
const adhanSources = [
  { id: 'silent', key: 'opt_silent', url: '' },
  { id: 'makkah', key: 'opt_adhan_src_makkah', url: 'https://cdn.islamic.network/adhan/mp3/1.mp3' },
  { id: 'medina', key: 'opt_adhan_src_medina', url: 'https://cdn.islamic.network/adhan/mp3/2.mp3' },
  { id: 'custom', key: 'opt_custom', url: '' }
];

const defaultAdhan: AdhanSettings = {
  audioEnabled: false,
  popupEnabled: true,
  source: 'silent',
  customUrl: '',
  volume: 70
};

applyStyles();

async function render() {
  const settings = await getSettings();
  const lang = settings.language || 'en';
  await setLanguage(lang);
  const adhan: AdhanSettings = { ...defaultAdhan, ...(settings.adhan || {}) };

  const langLabel = document.getElementById('lang-label')!;
  const langSelect = document.getElementById('lang-select') as HTMLSelectElement;
  langLabel.textContent = getMessage('opt_language');
  langSelect.innerHTML = languages.map(l => `<option value="${l}">${l}</option>`).join('');
  langSelect.value = lang;

  const adhanTitle = document.getElementById('adhan-title')!;
  adhanTitle.textContent = getMessage('opt_adhan_title');
  const audioEnabled = document.getElementById('audio-enabled') as HTMLInputElement;
  audioEnabled.checked = adhan.audioEnabled;
  document.getElementById('audio-label')!.textContent = getMessage('opt_adhan_audio');
  const popupEnabled = document.getElementById('popup-enabled') as HTMLInputElement;
  popupEnabled.checked = adhan.popupEnabled;
  document.getElementById('popup-label')!.textContent = getMessage('opt_adhan_popup');

  const sourceLabel = document.getElementById('source-label')!;
  sourceLabel.textContent = getMessage('opt_adhan_source');
  const sourceSelect = document.getElementById('audio-source') as HTMLSelectElement;
  sourceSelect.innerHTML = adhanSources
    .map(s => `<option value="${s.id}">${getMessage(s.key)}</option>`)
    .join('');
  sourceSelect.value = adhan.source;

  const customRow = document.getElementById('custom-url-row') as HTMLDivElement;
  customRow.style.display = adhan.source === 'custom' ? 'block' : 'none';
  document.getElementById('custom-url-label')!.textContent = getMessage('opt_adhan_custom_url');
  const customInput = document.getElementById('custom-url') as HTMLInputElement;
  customInput.value = adhan.customUrl;

  const volumeLabel = document.getElementById('volume-label')!;
  volumeLabel.textContent = getMessage('opt_volume');
  const volumeRange = document.getElementById('volume-range') as HTMLInputElement;
  volumeRange.value = String(adhan.volume);

  const closeBtn = document.getElementById('options-close') as HTMLButtonElement | null;
  if (closeBtn) {
    closeBtn.textContent = getMessage('opt_close');
    closeBtn.onclick = () => {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'close-options' }, '*');
      }
    };
  }

  langSelect.onchange = async e => {
    const value = (e.target as HTMLSelectElement).value;
    await setSettings({ language: value });
    await render();
  };

  audioEnabled.onchange = async e => {
    adhan.audioEnabled = (e.target as HTMLInputElement).checked;
    await setSettings({ adhan });
  };

  popupEnabled.onchange = async e => {
    adhan.popupEnabled = (e.target as HTMLInputElement).checked;
    await setSettings({ adhan });
  };

  sourceSelect.onchange = async e => {
    adhan.source = (e.target as HTMLSelectElement).value;
    await setSettings({ adhan });
    render();
  };

  customInput.onchange = async e => {
    adhan.customUrl = (e.target as HTMLInputElement).value;
    await setSettings({ adhan });
  };

  volumeRange.oninput = async e => {
    adhan.volume = parseInt((e.target as HTMLInputElement).value, 10);
    await setSettings({ adhan });
  };
}

render();
