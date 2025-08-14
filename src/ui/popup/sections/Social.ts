import { MockSocialProvider } from '../../../social/mock';
import { getMessage } from '../../../lib/i18n';

const provider = new MockSocialProvider();

/**
 * Renders mock social interactions.
 */
export async function render(container: HTMLElement) {
  container.innerHTML = '';
  const input = document.createElement('input');
  const btn = document.createElement('button');
  btn.textContent = getMessage('social_share');
  btn.onclick = async () => {
    if (input.value) {
      await provider.addIntention(input.value);
      input.value = '';
      load();
    }
  };
  const listDiv = document.createElement('div');
  async function load() {
    const items = await provider.listIntentions();
    listDiv.innerHTML = items.map(i => `<div>${i.text}</div>`).join('') || getMessage('social_empty');
  }
  container.appendChild(input);
  container.appendChild(btn);
  container.appendChild(listDiv);
  const friendsDiv = document.createElement('div');
  friendsDiv.textContent = getMessage('social_friends');
  const msgsDiv = document.createElement('div');
  msgsDiv.textContent = getMessage('social_messages');
  container.appendChild(friendsDiv);
  container.appendChild(msgsDiv);
  load();
}
