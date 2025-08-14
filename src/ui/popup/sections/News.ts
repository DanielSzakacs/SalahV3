import { DateTime } from 'luxon';
import { DemoRssProvider } from '../../../news/providers';
import { getMessage } from '../../../lib/i18n';
import type { NewsItem } from '../../../news/types';

const provider = new DemoRssProvider();

/**
 * Renders news items grouped by section.
 */
export async function render(container: HTMLElement) {
  container.innerHTML = '';
  const tabs = ['mecca', 'medina', 'global'] as const;
  const tabBar = document.createElement('div');
  const listDiv = document.createElement('div');
  async function load(section: typeof tabs[number]) {
    listDiv.textContent = getMessage('loading');
    const items = await provider.fetchLatest(section);
    listDiv.innerHTML = '';
    if (!items.length) {
      listDiv.textContent = getMessage('news_empty');
      return;
    }
    const ul = document.createElement('ul');
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
      ul.appendChild(li);
    });
    listDiv.appendChild(ul);
  }
  tabs.forEach(t => {
    const btn = document.createElement('button');
    btn.textContent = getMessage(`news_${t}`);
    btn.onclick = () => load(t);
    tabBar.appendChild(btn);
  });
  container.appendChild(tabBar);
  container.appendChild(listDiv);
  load('mecca');
}
