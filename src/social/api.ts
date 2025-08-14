import type { Intention, Friend, Message } from './types';

/**
 * Abstraction for social interactions.
 */
export interface SocialProvider {
  addIntention(text: string): Promise<void>;
  listIntentions(): Promise<Intention[]>;
  listFriends(): Promise<Friend[]>;
  listMessages(): Promise<Message[]>;
}
