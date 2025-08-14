import type { SocialProvider } from './api';
import type { Intention, Friend, Message } from './types';

const KEY = 'socialMock';

/**
 * Local mock implementation storing data in chrome storage.
 */
export class MockSocialProvider implements SocialProvider {
  private async load() {
    return (
      (await chrome.storage.sync.get([KEY]))[KEY] || {
        intentions: [],
        friends: [] as Friend[],
        messages: [] as Message[]
      }
    );
  }

  async addIntention(text: string) {
    const data = await this.load();
    const intention: Intention = { id: Date.now(), text };
    data.intentions.push(intention);
    await chrome.storage.sync.set({ [KEY]: data });
  }

  async listIntentions() {
    const data = await this.load();
    return data.intentions as Intention[];
  }

  async listFriends() {
    const data = await this.load();
    return data.friends as Friend[];
  }

  async listMessages() {
    const data = await this.load();
    return data.messages as Message[];
  }
}
