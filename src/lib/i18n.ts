/**
 * Retrieves a localized message from extension locales.
 */
export function getMessage(key: string, params?: string[]): string {
  return chrome.i18n.getMessage(key, params) || key;
}
