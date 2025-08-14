import { DateTime } from 'luxon';
import { getMessage } from '../../../lib/i18n';
import template from './Daily.html?raw';


const messages = [
  'Actions are judged by intentions. (Bukhari)',
  'The best of you are those who learn the Quran and teach it. (Bukhari)',
  'Smiling at your brother is charity.',
  'Make things easy and do not make them difficult.',
  'Allah does not burden a soul beyond that it can bear.',
  'Be in this world as a stranger or a traveler.',
  'The strong person is the one who controls himself when angry.',
  'Seek knowledge from cradle to grave.',
  'Kindness is a mark of faith.',
  'Trust in Allah but tie your camel.'
];

let offset = 0;

/**
 * Shows a daily rotating inspirational message.
 */
export function render(container: HTMLElement): void {
  container.innerHTML = template;
  const msgEl = container.querySelector('#daily-message') as HTMLDivElement;
  const btn = container.querySelector('#daily-next') as HTMLButtonElement;
  btn.textContent = getMessage('daily_next');
  function show() {
    const index = (DateTime.now().ordinal + offset) % messages.length;
    msgEl.textContent = messages[index];
  }

  btn.onclick = () => {
    offset++;
    show();
  };
  show();
}
