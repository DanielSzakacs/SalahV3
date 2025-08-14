/**
 * Represents a single news article.
 */
export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAtISO: string;
}

/**
 * Provider interface for fetching news items.
 */
export interface NewsProvider {
  fetchLatest(section: 'mecca' | 'medina' | 'global'): Promise<NewsItem[]>;
}
