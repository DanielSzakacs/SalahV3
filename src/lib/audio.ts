/**
 * Plays the adhan from a remote URL at the specified volume.
 */
export async function playAdhan(url: string, volume: number): Promise<void> {
  if (!url) return;
  const audio = new Audio(url);
  audio.volume = volume;
  await audio.play();
}

/**
 * Silent audio mode placeholder.
 */
export async function playSilent(): Promise<void> {
  return Promise.resolve();
}
