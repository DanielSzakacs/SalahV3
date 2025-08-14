import { MockSocialProvider } from '../../../social/mock';
import { getMessage } from '../../../lib/i18n';
import template from './Social.html?raw';

const provider = new MockSocialProvider();

/**
 * Renders mock social interactions.
 */
export async function render(container: HTMLElement): Promise<void> {
  container.innerHTML = template;
  const input = container.querySelector('#intention-input') as HTMLInputElement;
  const btn = container.querySelector('#intention-btn') as HTMLButtonElement;
  const list = container.querySelector('#intention-list') as HTMLUListElement;
  const friendsEl = container.querySelector('#friends-list') as HTMLUListElement;
  const messagesEl = container.querySelector('#messages-list') as HTMLUListElement;
  btn.textContent = getMessage('social_share');
  async function load() {
    const items = await provider.listIntentions();
    list.innerHTML =
      items.map(i => `<li>${i.text}</li>`).join('') || `<li>${getMessage('social_empty')}</li>`;
    const friends = await provider.listFriends();
    friendsEl.innerHTML = friends.map(f => `<li>${f.name}</li>`).join('');
    const msgs = await provider.listMessages();
    messagesEl.innerHTML = msgs.map(m => `<li>${m.from}: ${m.text}</li>`).join('');
  }
  btn.onclick = async () => {
    if (input.value) {
      await provider.addIntention(input.value);
      input.value = '';
      await load();
    }
  };
  load();
}
