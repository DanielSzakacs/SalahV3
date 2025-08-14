/**
 * Plays an Adhan audio from a remote URL.
 *
 * @param url Remote audio URL or 'silent' for no playback.
 * @param volume Playback volume between 0 and 1.
 */
export async function playAdhan(url: string, volume: number): Promise<void> {
  if (!url || url === 'silent') return;
  const audio = new Audio(url);
  audio.volume = volume;
  await audio.play();
}
