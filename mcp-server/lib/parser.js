/**
 * parser.js
 *
 * Parses wc-agent.md into a structured, searchable in-memory knowledge base.
 * Each top-level section (# N. TITLE) becomes an entry in the index.
 * Sub-sections (## N.x TITLE) are nested under their parent.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ──────────────────────────────────────────────
// Load & parse wc-agent.md
// ──────────────────────────────────────────────

const MD_PATH = join(__dirname, '..', '..', 'wc-agent.md');

/**
 * @typedef {Object} SubSection
 * @property {string} id        e.g. "3.1"
 * @property {string} title     e.g. "Input Sanitization"
 * @property {string} content   Raw markdown text
 * @property {string[]} tags    Derived keyword tags
 */

/**
 * @typedef {Object} Section
 * @property {number}       number      e.g. 3
 * @property {string}       id          e.g. "3"
 * @property {string}       title       e.g. "SECURITY FRAMEWORK"
 * @property {string}       content     Full raw markdown text of the section
 * @property {SubSection[]} subsections
 * @property {string[]}     tags
 * @property {string[]}     codeBlocks  All fenced code blocks extracted from section
 */

/** @type {Section[]} */
let _sections = [];
let _loaded   = false;

/**
 * Extract all fenced code blocks from a markdown string.
 * @param {string} text
 * @returns {{ lang: string, code: string }[]}
 */
function extractCodeBlocks(text) {
  const blocks = [];
  const regex  = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ lang: match[1] || 'text', code: match[2].trim() });
  }
  return blocks;
}

/**
 * Derive tags from section title + content.
 * @param {string} title
 * @param {string} content
 * @returns {string[]}
 */
function deriveTags(title, content) {
  const keywords = [
    'security', 'performance', 'caching', 'hooks', 'ajax', 'rest',
    'woocommerce', 'gutenberg', 'block', 'plugin', 'theme', 'multisite',
    'sql', 'sanitize', 'escape', 'nonce', 'capability', 'cron', 'email',
    'media', 'i18n', 'translation', 'accessibility', 'wcag', 'testing',
    'phpunit', 'jest', 'deployment', 'git', 'ci', 'cli', 'graphql',
    'cpt', 'taxonomy', 'meta', 'query', 'database', 'php', 'javascript',
    'css', 'elementor', 'acf', 'seo', 'schema', 'owasp', 'xss', 'csrf',
    'injection', 'gdpr', 'privacy', 'roles', 'capabilities', 'webpack',
    'vite', 'composer', 'autoload', 'debugging', 'logging', 'monitoring',
    'pattern', 'singleton', 'repository', 'dependency injection', 'hpos',
    'fse', 'interactivity api', 'wp-cli', 'rewrite', 'customizer', 'widget',
    'shortcode', 'template', 'payment', 'gateway', 'refund', 'email system',
    'heartbeat', 'vip', 'enterprise', 'production', 'rollback', 'symlink',
  ];

  const combined = `${title} ${content}`.toLowerCase();
  return keywords.filter(kw => combined.includes(kw));
}

/**
 * Parse wc-agent.md into structured sections.
 * @returns {Section[]}
 */
export function loadKnowledgeBase() {
  if (_loaded) return _sections;

  const raw   = readFileSync(MD_PATH, 'utf-8');
  const lines = raw.split('\n');

  _sections = [];
  let currentSection    = null;
  let currentSubsection = null;
  let buffer            = [];

  const flushSubsection = () => {
    if (currentSubsection && currentSection) {
      const content = buffer.join('\n').trim();
      currentSubsection.content    = content;
      currentSubsection.codeBlocks = extractCodeBlocks(content);
      currentSubsection.tags       = deriveTags(currentSubsection.title, content);
      currentSection.subsections.push(currentSubsection);
      currentSection.content      += '\n' + content;
    }
    buffer = [];
  };

  const flushSection = () => {
    if (currentSection) {
      flushSubsection();
      currentSection.content     = currentSection.content.trim();
      currentSection.codeBlocks  = extractCodeBlocks(currentSection.content);
      currentSection.tags        = deriveTags(currentSection.title, currentSection.content);
      _sections.push(currentSection);
    }
  };

  for (const line of lines) {
    // Top-level section: # N. TITLE
    const sectionMatch = line.match(/^# (\d+)\.\s+(.+)/);
    if (sectionMatch) {
      flushSection();
      currentSection = {
        number:      parseInt(sectionMatch[1], 10),
        id:          sectionMatch[1],
        title:       sectionMatch[2].trim(),
        content:     '',
        subsections: [],
        tags:        [],
        codeBlocks:  [],
      };
      currentSubsection = null;
      buffer = [];
      continue;
    }

    // Sub-section: ## N.x TITLE
    const subMatch = line.match(/^## (\d+\.\d+)\s+(.+)/);
    if (subMatch && currentSection) {
      flushSubsection();
      currentSubsection = {
        id:          subMatch[1],
        title:       subMatch[2].trim(),
        content:     '',
        codeBlocks:  [],
        tags:        [],
      };
      continue;
    }

    buffer.push(line);
  }

  flushSection();
  _loaded = true;

  console.error(`[WP-MCP] Loaded ${_sections.length} sections from wc-agent.md`);
  return _sections;
}

/**
 * Get a section by number.
 * @param {number} num
 * @returns {Section|undefined}
 */
export function getSectionByNumber(num) {
  return loadKnowledgeBase().find(s => s.number === num);
}

/**
 * Get a sub-section by id (e.g. "41.2").
 * @param {string} id
 * @returns {SubSection|undefined}
 */
export function getSubsectionById(id) {
  for (const section of loadKnowledgeBase()) {
    const sub = section.subsections.find(s => s.id === id);
    if (sub) return sub;
  }
  return undefined;
}

/**
 * Get all sections (metadata only — no full content, for listing).
 * @returns {{ number: number, id: string, title: string, subsectionCount: number, tags: string[] }[]}
 */
export function listSections() {
  return loadKnowledgeBase().map(s => ({
    number:          s.number,
    id:              s.id,
    title:           s.title,
    subsectionCount: s.subsections.length,
    tags:            s.tags.slice(0, 8),
  }));
}

/**
 * Get all code blocks that match a language filter.
 * @param {string} lang
 * @returns {{ sectionId: string, sectionTitle: string, lang: string, code: string }[]}
 */
export function getCodeBlocksByLang(lang) {
  const results = [];
  for (const section of loadKnowledgeBase()) {
    for (const block of section.codeBlocks) {
      if (!lang || block.lang.toLowerCase() === lang.toLowerCase()) {
        results.push({
          sectionId:    section.id,
          sectionTitle: section.title,
          lang:         block.lang,
          code:         block.code,
        });
      }
    }
  }
  return results;
}
