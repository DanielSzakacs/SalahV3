import {
  getLocation,
  setLocation,
  getSettings,
  setSettings,
  AdhanSettings
} from '../../../lib/storage';
import { getMessage, setLanguage } from '../../../lib/i18n';

/**
 * Renders the in-popup settings panel for location and other options.
 * @param onClose callback when panel should be closed
 * @param onSaved callback after location has been saved
 */
export async function render(
  onClose: () => void,
  onSaved: () => void
): Promise<HTMLElement> {
  const card = document.createElement('div');
  card.className = 'card';

  const header = document.createElement('div');
  header.className = 'card-header';
  const title = document.createElement('div');
  title.textContent = getMessage('options_button');
  const closeBtn = document.createElement('button');
  closeBtn.textContent = getMessage('opt_close');
  closeBtn.addEventListener('click', () => onClose());
  header.appendChild(title);
  header.appendChild(closeBtn);
  card.appendChild(header);

  const form = document.createElement('div');
  form.className = 'settings-form';

  // Location
  const loc = await getLocation();
  const latLabel = document.createElement('label');
  latLabel.textContent = getMessage('opt_latitude');
  const latInput = document.createElement('input');
  latInput.type = 'number';
  latInput.value = String(loc.lat || '');
  form.appendChild(latLabel);
  form.appendChild(latInput);

  const lonLabel = document.createElement('label');
  lonLabel.textContent = getMessage('opt_longitude');
  const lonInput = document.createElement('input');
  lonInput.type = 'number';
  lonInput.value = String(loc.lon || '');
  form.appendChild(lonLabel);
  form.appendChild(lonInput);

  const locateBtn = document.createElement('button');
  locateBtn.textContent = getMessage('locate_me');
  locateBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(pos => {
      latInput.value = pos.coords.latitude.toString();
      lonInput.value = pos.coords.longitude.toString();
    });
  });
  form.appendChild(locateBtn);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = getMessage('opt_save');
  saveBtn.addEventListener('click', async () => {
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      await setLocation({ lat, lon });
      onSaved();
    }
  });
  form.appendChild(saveBtn);

  // Options below location
  const settings = await getSettings();
  const languages = ['en', 'hu', 'ru', 'ar', 'tr', 'ur'];
  const adhanSources = [
    { id: 'silent', key: 'opt_silent' },
    { id: 'makkah', key: 'opt_adhan_src_makkah' },
    { id: 'medina', key: 'opt_adhan_src_medina' },
    { id: 'custom', key: 'opt_custom' }
  ];
  const defaultAdhan: AdhanSettings = {
    audioEnabled: false,
    popupEnabled: true,
    source: 'silent',
    customUrl: '',
    volume: 70
  };
  const lang = settings.language || 'en';
  const adhan: AdhanSettings = { ...defaultAdhan, ...(settings.adhan || {}) };

  const langLabel = document.createElement('label');
  langLabel.textContent = getMessage('opt_language');
  const langSelect = document.createElement('select');
  langSelect.innerHTML = languages.map(l => `<option value="${l}">${l}</option>`).join('');
  langSelect.value = lang;
  langSelect.addEventListener('change', async e => {
    const value = (e.target as HTMLSelectElement).value;
    await setSettings({ language: value });
    await setLanguage(value);
    window.location.reload();
  });
  form.appendChild(langLabel);
  form.appendChild(langSelect);

  const adhanTitle = document.createElement('div');
  adhanTitle.textContent = getMessage('opt_adhan_title');
  form.appendChild(adhanTitle);

  const audioLabel = document.createElement('label');
  const audioEnabled = document.createElement('input');
  audioEnabled.type = 'checkbox';
  audioEnabled.checked = adhan.audioEnabled;
  audioEnabled.addEventListener('change', async e => {
    adhan.audioEnabled = (e.target as HTMLInputElement).checked;
    await setSettings({ adhan });
  });
  audioLabel.appendChild(audioEnabled);
  audioLabel.appendChild(document.createTextNode(getMessage('opt_adhan_audio')));
  form.appendChild(audioLabel);

  const popupLabel = document.createElement('label');
  const popupEnabled = document.createElement('input');
  popupEnabled.type = 'checkbox';
  popupEnabled.checked = adhan.popupEnabled;
  popupEnabled.addEventListener('change', async e => {
    adhan.popupEnabled = (e.target as HTMLInputElement).checked;
    await setSettings({ adhan });
  });
  popupLabel.appendChild(popupEnabled);
  popupLabel.appendChild(document.createTextNode(getMessage('opt_adhan_popup')));
  form.appendChild(popupLabel);

  const sourceLabel = document.createElement('label');
  sourceLabel.textContent = getMessage('opt_adhan_source');
  const sourceSelect = document.createElement('select');
  sourceSelect.innerHTML = adhanSources
    .map(s => `<option value="${s.id}">${getMessage(s.key)}</option>`)
    .join('');
  sourceSelect.value = adhan.source;
  form.appendChild(sourceLabel);
  form.appendChild(sourceSelect);

  const customRow = document.createElement('div');
  const customLabel = document.createElement('label');
  customLabel.textContent = getMessage('opt_adhan_custom_url');
  const customInput = document.createElement('input');
  customInput.type = 'text';
  customInput.value = adhan.customUrl;
  customInput.addEventListener('change', async e => {
    adhan.customUrl = (e.target as HTMLInputElement).value;
    await setSettings({ adhan });
  });
  customRow.appendChild(customLabel);
  customRow.appendChild(customInput);
  form.appendChild(customRow);

  const volumeLabel = document.createElement('label');
  volumeLabel.textContent = getMessage('opt_volume');
  const volumeRange = document.createElement('input');
  volumeRange.type = 'range';
  volumeRange.min = '0';
  volumeRange.max = '100';
  volumeRange.value = String(adhan.volume);
  volumeRange.addEventListener('input', async e => {
    adhan.volume = parseInt((e.target as HTMLInputElement).value, 10);
    await setSettings({ adhan });
  });
  form.appendChild(volumeLabel);
  form.appendChild(volumeRange);

  function updateCustomRow() {
    customRow.style.display = adhan.source === 'custom' ? 'block' : 'none';
  }
  sourceSelect.addEventListener('change', async e => {
    adhan.source = (e.target as HTMLSelectElement).value;
    await setSettings({ adhan });
    updateCustomRow();
  });
  updateCustomRow();

  card.appendChild(form);
  return card;
}
