import { getSettings } from '../../../lib/storage';
import { getMessage } from '../../../lib/i18n';

/**
 * Renders live stream iframe if URL is configured.
 */
export async function render(container: HTMLElement) {
  const settings = await getSettings();
  const url = settings.liveStreamUrl;
  if (url) {
    container.innerHTML = `<iframe width="100%" height="200" src="${url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    container.textContent = getMessage('live_hint');
  }
}
