import { DateTime } from 'luxon';
import { newsSources } from './config';
import type { NewsItem, NewsProvider } from './types';

/**
 * Demo provider that fetches simple RSS/JSON feeds.
 */
export class DemoRssProvider implements NewsProvider {
  async fetchLatest(section: 'mecca' | 'medina' | 'global'): Promise<NewsItem[]> {
    const stored = (await chrome.storage.sync.get(['newsSources'])).newsSources || {};
    const urls: string[] = stored[section] || newsSources[section] || [];
    const items: NewsItem[] = [];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('json')) {
          const json = await res.json();
          for (const j of json) {
            items.push({
              title: j.title,
              link: j.link,
              source: j.source || new URL(url).hostname,
              publishedAtISO: j.publishedAtISO || new Date().toISOString()
            });
          }
        } else {
          const text = await res.text();
          const doc = new DOMParser().parseFromString(text, 'text/xml');
          doc.querySelectorAll('item').forEach(el => {
            const title = el.querySelector('title')?.textContent || 'RSS item';
            const link = el.querySelector('link')?.textContent || url;
            const date = el.querySelector('pubDate')?.textContent;
            items.push({
              title,
              link,
              source: new URL(url).hostname,
              publishedAtISO: date ? DateTime.fromJSDate(new Date(date)).toISO()! : new Date().toISOString()
            });
          });
        }
      } catch {
        // ignore bad feeds
      }
    }
    return items;
  }
}
