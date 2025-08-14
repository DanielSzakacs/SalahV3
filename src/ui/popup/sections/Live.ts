import { getSettings } from '../../../lib/storage';
import { getMessage } from '../../../lib/i18n';

/**
 * Renders live stream card with configured iframe.
 */
export async function render(): Promise<HTMLElement> {
  const card = document.createElement('div');
  card.className = 'card';
  const header = document.createElement('div');
  header.className = 'card-header';
  const title = document.createElement('span');
  title.textContent = getMessage('live_from_makkah');
  header.appendChild(title);
  card.appendChild(header);
  const body = document.createElement('div');
  const settings = await getSettings();
  const url = settings.liveStreamUrl;
  if (url) {
    body.innerHTML = `<iframe width="100%" height="200" src="${url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    body.textContent = getMessage('no_live_stream');
  }
  card.appendChild(body);
  return card;
}
