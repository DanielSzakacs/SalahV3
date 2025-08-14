/**
 * Opens the extension's Options page in a new browser tab.
 */
export function openOptionsPage(): void {
  chrome.runtime.openOptionsPage();
}
