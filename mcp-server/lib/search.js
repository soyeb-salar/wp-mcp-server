/**
 * search.js
 *
 * Full-text + fuzzy search across the wc-agent.md knowledge base.
 * Uses Fuse.js for fuzzy matching and supports tag filtering.
 */

import Fuse from 'fuse.js';
import { loadKnowledgeBase } from './parser.js';

/** @type {Fuse|null} */
let _fuse = null;

function getFuse() {
  if (_fuse) return _fuse;

  const sections = loadKnowledgeBase();

  // Build a flat search corpus (sections + subsections)
  const corpus = [];

  for (const section of sections) {
    corpus.push({
      id:      section.id,
      title:   section.title,
      content: section.content,
      tags:    section.tags.join(' '),
      type:    'section',
      ref:     section,
    });

    for (const sub of section.subsections) {
      corpus.push({
        id:      sub.id,
        title:   sub.title,
        content: sub.content,
        tags:    sub.tags.join(' '),
        type:    'subsection',
        ref:     sub,
        parent:  section,
      });
    }
  }

  _fuse = new Fuse(corpus, {
    keys: [
      { name: 'title',   weight: 0.5 },
      { name: 'tags',    weight: 0.3 },
      { name: 'content', weight: 0.2 },
    ],
    threshold:         0.35,
    includeScore:      true,
    includeMatches:    false,
    minMatchCharLength: 2,
    ignoreLocation:    true,
  });

  return _fuse;
}

/**
 * Search the knowledge base.
 *
 * @param {string}   query
 * @param {object}   [opts]
 * @param {number}   [opts.limit=5]
 * @param {string}   [opts.type]       'section' | 'subsection' | undefined (both)
 * @param {string[]} [opts.tags]       Filter results to those containing ALL of these tags
 * @returns {{ id: string, title: string, type: string, score: number, excerpt: string, sectionTitle?: string }[]}
 */
export function searchKnowledge(query, opts = {}) {
  const { limit = 5, type, tags } = opts;
  const fuse    = getFuse();
  const results = fuse.search(query);

  return results
    .filter(r => !type || r.item.type === type)
    .filter(r => {
      if (!tags || tags.length === 0) return true;
      const itemTags = r.item.tags.toLowerCase();
      return tags.every(t => itemTags.includes(t.toLowerCase()));
    })
    .slice(0, limit)
    .map(r => ({
      id:           r.item.id,
      title:        r.item.title,
      type:         r.item.type,
      score:        Math.round((1 - (r.score ?? 0)) * 100),
      sectionTitle: r.item.parent?.title ?? null,
      excerpt:      buildExcerpt(r.item.content, query),
      content:      r.item.content,
    }));
}

/**
 * Build a short excerpt from content matching query.
 * @param {string} content
 * @param {string} query
 * @returns {string}
 */
function buildExcerpt(content, query) {
  const lines  = content.split('\n').filter(l => l.trim());
  const lower  = query.toLowerCase();
  const match  = lines.find(l => l.toLowerCase().includes(lower));
  const source = match ?? lines[0] ?? '';
  return source.slice(0, 200).replace(/[`*#]/g, '').trim();
}
