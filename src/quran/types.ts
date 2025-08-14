/**
 * Describes a Quran provider capable of listing and retrieving surahs.
 */
export interface QuranProvider {
  listSurahs(): Promise<{ id: number; name: string; translit?: string }[]>;
  getSurah(id: number): Promise<{ ayat: { number: number; text: string }[] }>;
}
