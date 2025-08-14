import { MockSocialProvider } from '../../../social/mock';
import { getMessage } from '../../../lib/i18n';

const provider = new MockSocialProvider();

/**
 * Renders community card with intentions, friends and messages.
 */
export async function render(): Promise<HTMLElement> {
  const card = document.createElement('div');
  card.className = 'card';
  const header = document.createElement('div');
  header.className = 'card-header';
  const title = document.createElement('span');
  title.textContent = getMessage('community');
  header.appendChild(title);
  card.appendChild(header);
  const body = document.createElement('div');
  card.appendChild(body);

  // Intentions
  const intentions = document.createElement('div');
  intentions.className = 'social-section';
  const intTitle = document.createElement('div');
  intTitle.className = 'section-title';
  intTitle.textContent = getMessage('prayer_intentions');
  const list = document.createElement('ul');
  list.className = 'list';
  list.id = 'intention-list';
  const input = document.createElement('input');
  input.id = 'intention-input';
  const btn = document.createElement('button');
  btn.id = 'intention-btn';
  btn.textContent = getMessage('social_share');
  intentions.appendChild(intTitle);
  intentions.appendChild(list);
  intentions.appendChild(input);
  intentions.appendChild(btn);
  body.appendChild(intentions);

  // Friends
  const friendsSection = document.createElement('div');
  friendsSection.className = 'social-section';
  const friendsTitle = document.createElement('div');
  friendsTitle.className = 'section-title';
  friendsTitle.textContent = getMessage('social_friends');
  const friendsList = document.createElement('ul');
  friendsList.className = 'list';
  friendsList.id = 'friends-list';
  friendsSection.appendChild(friendsTitle);
  friendsSection.appendChild(friendsList);
  body.appendChild(friendsSection);

  // Messages
  const msgSection = document.createElement('div');
  msgSection.className = 'social-section';
  const msgTitle = document.createElement('div');
  msgTitle.className = 'section-title';
  msgTitle.textContent = getMessage('social_messages');
  const msgList = document.createElement('ul');
  msgList.className = 'list';
  msgList.id = 'messages-list';
  msgSection.appendChild(msgTitle);
  msgSection.appendChild(msgList);
  body.appendChild(msgSection);

  async function load() {
    const items = await provider.listIntentions();
    list.innerHTML =
      items.map(i => `<li>${i.text}</li>`).join('') || `<li>${getMessage('social_empty')}</li>`;
    const friends = await provider.listFriends();
    friendsList.innerHTML = friends.map(f => `<li>${f.name}</li>`).join('');
    const msgs = await provider.listMessages();
    msgList.innerHTML = msgs.map(m => `<li>${m.from}: ${m.text}</li>`).join('');
  }

  btn.onclick = async () => {
    if (input.value) {
      await provider.addIntention(input.value);
      input.value = '';
      await load();
    }
  };

  await load();
  return card;
}
