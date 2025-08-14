import csvText from './style.csv?raw';

/**
 * Injects styles from a CSV file into the document head.
 */
export function applyStyles(): void {
  const rules = csvText
    .trim()
    .split('\n')
    .slice(1)
    .map(line => line.split(',').map(v => v.trim()))
    .filter(parts => parts.length === 3)
    .map(([sel, prop, val]) => `${sel} { ${prop}: ${val}; }`)
    .join('\n');
  const styleEl = document.createElement('style');
  styleEl.textContent = rules;
  document.head.appendChild(styleEl);
}
