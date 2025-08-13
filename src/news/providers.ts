import type { NewsItem } from './types';

export interface NewsProvider {
  fetchLatest(): Promise<NewsItem[]>;
}

export class DummyProvider implements NewsProvider {
  async fetchLatest(): Promise<NewsItem[]> {
    const now = new Date().toISOString();
    return [
      { title: 'Item 1', link: '#', source: 'Dummy', publishedAt: now },
      { title: 'Item 2', link: '#', source: 'Dummy', publishedAt: now },
      { title: 'Item 3', link: '#', source: 'Dummy', publishedAt: now }
    ];
  }
}
