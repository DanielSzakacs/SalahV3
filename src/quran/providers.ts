import { sampleSurahs } from './local-sample';
import type { QuranProvider } from './types';

/**
 * Simple provider serving surahs from local sample data.
 */
export class LocalSampleProvider implements QuranProvider {
  async listSurahs() {
    return sampleSurahs.map(s => ({ id: s.id, name: s.name, translit: s.translit }));
  }

  async getSurah(id: number) {
    const surah = sampleSurahs.find(s => s.id === id);
    return { ayat: surah ? surah.ayat : [] };
  }
}
