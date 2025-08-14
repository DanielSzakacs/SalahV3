import { getLocation, setLocation } from '../../../lib/storage';
import { getMessage } from '../../../lib/i18n';

/**
 * Renders the in-popup settings panel allowing location update.
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

  card.appendChild(form);
  return card;
}
