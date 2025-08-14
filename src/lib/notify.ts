/**
 * Displays a basic chrome notification.
 */
export async function showNotification(title: string, message: string) {
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title,
    message
  });
}
