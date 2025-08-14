import { getSettings } from '../../../lib/storage';
import { getMessage } from '../../../lib/i18n';
import template from './Live.html?raw';

/**
 * Renders live stream iframe if URL is configured.
 */
export async function render(container: HTMLElement): Promise<void> {
  container.innerHTML = template;
  const frame = container.querySelector('#live-container') as HTMLDivElement;
  const hint = container.querySelector('#live-hint') as HTMLDivElement;
  const settings = await getSettings();
  const url = settings.liveStreamUrl;
  if (url) {
    frame.innerHTML = `<iframe width="100%" height="200" src="${url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    hint.textContent = getMessage('live_hint');
  }
}
