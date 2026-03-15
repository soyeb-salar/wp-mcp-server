/**
 * checklists.js
 *
 * Extracts and returns structured checklists from the wc-agent.md knowledge base:
 *  - Security checklist (§41.1)
 *  - Code Review checklist (§50)
 *  - Production Readiness checklist (§66)
 */

import { getSectionByNumber, getSubsectionById } from './parser.js';

/**
 * Parse a markdown checklist block into a structured array.
 * @param {string} text
 * @returns {{ item: string, checked: boolean }[]}
 */
function parseChecklist(text) {
  return text
    .split('\n')
    .filter(l => l.trim().startsWith('[ ]') || l.trim().startsWith('[x]') || l.trim().startsWith('[X]'))
    .map(l => {
      const checked = l.trim().startsWith('[x]') || l.trim().startsWith('[X]');
      const item    = l.replace(/^\s*\[.?\]\s*/, '').trim();
      return { item, checked };
    });
}

/**
 * Get the Security Checklist (§41.1 — pre-ship checklist).
 * @returns {{ title: string, items: { item: string, checked: boolean }[], source: string }}
 */
export function getSecurityChecklist() {
  const sub = getSubsectionById('41.1');
  return {
    title:  'Security Checklist — Run on Every Feature (§41.1)',
    source: '§41.1 Advanced Security Hardening',
    items:  sub ? parseChecklist(sub.content) : [],
  };
}

/**
 * Get the full OWASP Top 10 WordPress mapping (§41.26).
 */
export function getOwaspMapping() {
  const sub = getSubsectionById('41.26');
  if (!sub) return { title: 'OWASP Top 10 WordPress Mapping', rows: [] };

  // Parse markdown table
  const rows = sub.content
    .split('\n')
    .filter(l => l.startsWith('|') && !l.startsWith('|---'))
    .slice(1) // skip header
    .map(l => {
      const cols = l.split('|').map(c => c.trim()).filter(Boolean);
      return {
        risk:        cols[0] ?? '',
        wordpressContext: cols[1] ?? '',
        mitigation:  cols[2] ?? '',
      };
    });

  return {
    title: 'OWASP Top 10 — WordPress Mapping (§41.26)',
    rows,
  };
}

/**
 * Get Code Review Checklist (§50).
 * @returns {{ title: string, categories: { name: string, items: { item: string, checked: boolean }[] }[] }}
 */
export function getCodeReviewChecklist() {
  const section = getSectionByNumber(50);
  if (!section) return { title: 'Code Review Checklist', categories: [] };

  const categories = section.subsections.map(sub => ({
    name:  sub.title,
    items: parseChecklist(sub.content),
  }));

  return {
    title:      'WordPress Code Review Checklist (§50)',
    source:     '§50 — Run on every Pull Request before merging',
    categories,
  };
}

/**
 * Get Production Readiness Checklist (§66).
 * @returns {{ title: string, categories: { name: string, items: { item: string, checked: boolean }[] }[] }}
 */
export function getProductionChecklist() {
  const section = getSectionByNumber(66);
  if (!section) return { title: 'Production Readiness Checklist', categories: [] };

  const categories = section.subsections.map(sub => ({
    name:  sub.title,
    items: parseChecklist(sub.content),
  }));

  return {
    title:      'Production Readiness Checklist (§66)',
    source:     '§66 — Final gate before going live',
    categories,
  };
}

/**
 * Get Security Headers reference table (§41.25).
 */
export function getSecurityHeaders() {
  const sub = getSubsectionById('41.25');
  if (!sub) return { title: 'Security Headers', headers: [] };

  const headers = sub.content
    .split('\n')
    .filter(l => l.startsWith('|') && !l.startsWith('|---'))
    .slice(1)
    .map(l => {
      const cols = l.split('|').map(c => c.trim()).filter(Boolean);
      return { header: cols[0] ?? '', value: cols[1] ?? '' };
    });

  return {
    title:   'Security Headers Reference (§41.25)',
    headers,
  };
}

/**
 * Get WP-CLI post-deploy commands reference (§67.12).
 */
export function getDeployCommands() {
  const sub = getSubsectionById('67.12');
  if (!sub) return { title: 'WP-CLI Deploy Commands', commands: [] };

  const commands = sub.codeBlocks.length > 0
    ? sub.codeBlocks[0].code.split('\n').filter(l => l.trim() && !l.startsWith('#'))
    : [];

  return {
    title:    'WP-CLI Post-Deploy Commands (§67.12)',
    commands,
    raw:      sub.codeBlocks[0]?.code ?? '',
  };
}
