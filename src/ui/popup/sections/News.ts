import { DemoRssProvider } from '../../../news/providers';
import { getMessage } from '../../../lib/i18n';
import type { NewsItem } from '../../../news/types';

const provider = new DemoRssProvider();

/**
 * Renders a news card with simple previous/next navigation.
 */
export async function render(): Promise<HTMLElement> {
  const card = document.createElement('div');
  card.className = 'card';
  const header = document.createElement('div');
  header.className = 'card-header';
  const left = document.createElement('div');
  left.className = 'left';
  const icon = document.createElement('span');
  icon.textContent = '🕌';
  const title = document.createElement('span');
  title.textContent = getMessage('religious_news');
  left.appendChild(icon);
  left.appendChild(title);
  const nav = document.createElement('div');
  const prev = document.createElement('button');
  prev.textContent = getMessage('nav_prev');
  const next = document.createElement('button');
  next.textContent = getMessage('nav_next');
  nav.appendChild(prev);
  nav.appendChild(next);
  header.appendChild(left);
  header.appendChild(nav);
  card.appendChild(header);
  const body = document.createElement('div');
  card.appendChild(body);

  const sections = ['mecca', 'medina', 'global'] as const;
  const lists = await Promise.all(sections.map(s => provider.fetchLatest(s)));
  const items: NewsItem[] = lists.flat();
  let index = 0;

  function show() {
    body.innerHTML = '';
    if (!items.length) {
      body.textContent = getMessage('news_empty');
      return;
    }
    const item = items[index];
    const wrap = document.createElement('div');
    wrap.className = 'news-item';
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    const text = document.createElement('div');
    const t = document.createElement('div');
    t.className = 'title';
    t.textContent = item.title;
    const s = document.createElement('div');
    s.className = 'snippet';
    s.textContent = item.source;
    text.appendChild(t);
    text.appendChild(s);
    wrap.appendChild(thumb);
    wrap.appendChild(text);
    body.appendChild(wrap);
  }

  prev.onclick = () => {
    index = (index - 1 + items.length) % items.length;
    show();
  };
  next.onclick = () => {
    index = (index + 1) % items.length;
    show();
  };

  show();
  return card;
}
