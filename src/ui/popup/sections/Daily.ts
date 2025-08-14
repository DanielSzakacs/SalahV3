import { DateTime } from 'luxon';
import { getMessage } from '../../../lib/i18n';

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
export function render(container: HTMLElement) {
  function show() {
    const index = (DateTime.now().ordinal + offset) % messages.length;
    container.textContent = messages[index];
  }
  const btn = document.createElement('button');
  btn.textContent = getMessage('daily_next');
  btn.onclick = () => {
    offset++;
    show();
  };
  container.innerHTML = '';
  container.appendChild(btn);
  show();
}
