import { DateTime } from 'luxon';
import { DemoRssProvider } from '../../../news/providers';
import { getMessage } from '../../../lib/i18n';
import type { NewsItem } from '../../../news/types';
import template from './News.html?raw';


const provider = new DemoRssProvider();

/**
 * Renders news items grouped by section.
 */
export async function render(container: HTMLElement): Promise<void> {
  container.innerHTML = template;
  const tabsEl = container.querySelector('#news-tabs') as HTMLDivElement;
  const listEl = container.querySelector('#news-list') as HTMLUListElement;
  const emptyEl = container.querySelector('#news-empty') as HTMLDivElement;
  const tabs = ['mecca', 'medina', 'global'] as const;
  async function load(section: typeof tabs[number]) {
    listEl.innerHTML = '';
    emptyEl.textContent = getMessage('loading');
    const items: NewsItem[] = await provider.fetchLatest(section);
    emptyEl.textContent = '';
    if (!items.length) {
      emptyEl.textContent = getMessage('news_empty');
      return;
    }

    items.forEach(i => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = i.title;
      a.href = i.link;
      a.target = '_blank';
      const span = document.createElement('span');
      const time = DateTime.fromISO(i.publishedAtISO).toRelative();
      span.textContent = ` (${i.source}, ${time})`;
      li.appendChild(a);
      li.appendChild(span);
      listEl.appendChild(li);
    });
  }
  tabs.forEach(t => {
    const btn = tabsEl.querySelector(`button[data-sec="${t}"]`)!;
    btn.textContent = getMessage(`news_${t}`);
    btn.onclick = () => load(t);
  });

  load('mecca');
}
