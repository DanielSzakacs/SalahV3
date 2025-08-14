/**
 * Simple runtime i18n loader with English fallback.
 */
let messages: Record<string, { message: string }> = {};

/**
 * Loads locale messages for the given language and merges with English as fallback.
 */
export async function setLanguage(lang: string): Promise<void> {
  const base = await fetch(chrome.runtime.getURL('_locales/en/messages.json')).then(r => r.json());
  let override = {} as typeof base;
  if (lang !== 'en') {
    try {
      override = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`)).then(r => r.json());
    } catch {
      override = {} as typeof base;
    }
  }
  messages = { ...base, ...override };
}

/**
 * Retrieves a localized message by key with optional parameter substitution.
 */
export function getMessage(key: string, params?: string[]): string {
  const entry = messages[key];
  if (!entry) return key;
  let msg = entry.message;
  if (params) {
    params.forEach((p, i) => {
      msg = msg.replace(`$${i + 1}`, p);
    });
  }
  return msg;
}
