/**
 * Describes a shared intention item.
 */
export interface Intention {
  id: number;
  text: string;
}

/**
 * Simple friend representation.
 */
export interface Friend {
  name: string;
}

/**
 * Simple message representation.
 */
export interface Message {
  from: string;
  text: string;
}
