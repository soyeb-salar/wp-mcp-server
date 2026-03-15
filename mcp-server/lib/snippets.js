/**
 * snippets.js
 *
 * Retrieves topic-specific code snippets from wc-agent.md.
 * Maps common WordPress development topics to specific sections/subsections.
 */

import { getSectionByNumber, getSubsectionById, getCodeBlocksByLang } from './parser.js';

/**
 * Topic → section/subsection mapping
 * Keys are normalized lowercase topic names.
 */
const TOPIC_MAP = {
  // PHP / OOP
  'singleton':            '58.1',
  'dependency injection': '58.2',
  'service container':    '58.2',
  'repository pattern':   '58.3',
  'strategy pattern':     '58.5',
  'observer pattern':     '58.4',

  // Security
  'nonce':                '3.3',
  'sanitize':             '3.1',
  'escape':               '3.2',
  'sql injection':        '41.4',
  'xss':                  '41.2',
  'csrf':                 '41.3',
  'rate limit':           '3.7',
  'file upload':          '41.6',
  'api key':              '41.17',
  'ssrf':                 '41.12',
  'path traversal':       '41.11',
  'open redirect':        '41.8',
  'privilege escalation': '41.7',
  'idor':                 '41.5',
  'security headers':     '41.25',
  'csp':                  '41.2',
  'webhook security':     '41.23',
  'cookie':               '41.18',
  'login security':       '41.21',
  'wp-config':            '41.14',
  'htaccess':             '41.15',
  'nginx':                '41.16',

  // Performance
  'caching':              '4.2',
  'transient':            '4.2',
  'wp_query':             '4.3',
  'query optimization':   '4.3',
  'asset':                '4.4',
  'heartbeat':            '4.6',
  'memory':               '4.7',

  // CPT & Taxonomy
  'cpt':                  '6.1',
  'custom post type':     '6.1',
  'taxonomy':             '6.2',

  // Database
  'custom table':         '7.1',
  'dbdelta':              '7.1',
  'options':              '7.2',
  'prepare':              '41.4',

  // Hooks
  'hooks':                '8.1',
  'custom hooks':         '8.2',
  'action':               '8.2',
  'filter':               '8.2',

  // REST API
  'rest':                 '12',
  'rest route':           '12',
  'rest versioning':      '62.1',
  'rate limiting rest':   '62.3',

  // AJAX
  'ajax':                 '14',

  // Gutenberg
  'block':                '9.1',
  'block.json':           '9.1',
  'block pattern':        '44.1',
  'block style':          '44.2',
  'interactivity':        '63.3',
  'interactivity api':    '63.3',

  // WooCommerce
  'woocommerce':          '10.2',
  'payment gateway':      '53.1',
  'custom order status':  '49.2',
  'wc email':             '49.3',
  'hpos':                 '49.6',
  'woocommerce rest':     '49.5',

  // Cron
  'cron':                 '16',

  // CLI
  'wp-cli':               '15',
  'cli commands':         '15',
  'deploy commands':      '67.12',

  // i18n
  'i18n':                 '19',
  'translation':          '19',
  'pot':                  '64.1',

  // Theme
  'theme support':        '42.1',
  'theme.json':           '42.2',
  'template hierarchy':   '42.3',
  'fse':                  '42.4',
  'customizer':           '54.1',

  // Roles
  'roles':                '43.2',
  'capabilities':         '43.3',

  // Meta boxes
  'meta box':             '55.2',
  'save_post':            '55.2',

  // Widgets
  'widget':               '56.1',
  'sidebar':              '56.2',

  // Rewrite
  'rewrite':              '57.1',
  'rewrite endpoint':     '57.2',

  // Nav menus
  'menu':                 '61.1',
  'nav walker':           '61.2',
  'menu item meta':       '61.3',

  // Multisite
  'multisite':            '59.1',
  'switch_to_blog':       '59.2',
  'network':              '59.4',

  // Comments
  'comments':             '60.1',
  'comment form':         '60.2',

  // Deployment
  'git deploy':           '67.3',
  'github actions':       '67.3',
  'gitignore':            '67.1',
  'rollback':             '67.8',
  'atomic deploy':        '67.5',
  'git hooks':            '67.6',
  'ssh setup':            '67.9',

  // GDPR
  'gdpr':                 '45.1',
  'privacy':              '45.1',

  // PHP 8
  'match':                '47.1',
  'enum':                 '47.2',
  'readonly':             '47.2',
  'nullsafe':             '47.1',

  // Debugging
  'debugging':            '48.1',
  'query monitor':        '48.2',
  'xdebug':               '48.6',
  'slow query':           '48.4',

  // Logging
  'logging':              '48.3',
  'error log':            '48.3',

  // Email
  'email':                '17',
  'wp_mail':              '17',

  // Media
  'media':                '18',
  'image upload':         '18',

  // Settings
  'settings api':         '21',

  // GraphQL
  'graphql':              '13',

  // Site health
  'site health':          '36',

  // VIP
  'vip':                  '65.1',
  'enterprise':           '65.2',

  // WP Filesystem
  'filesystem':           '65.1',
};

/**
 * Get code snippets for a topic.
 *
 * @param {string} topic
 * @param {string} [lang]   Filter by language ('php', 'js', 'yaml', etc.)
 * @returns {{ topic: string, source: string, codeBlocks: { lang: string, code: string }[] }}
 */
export function getSnippetsForTopic(topic, lang) {
  const normalised = topic.toLowerCase().trim();

  // Direct topic map lookup
  const ref = TOPIC_MAP[normalised];
  let blocks = [];
  let source = '';

  if (ref) {
    const isSection = /^\d+$/.test(ref);
    if (isSection) {
      const sec = getSectionByNumber(parseInt(ref, 10));
      if (sec) {
        blocks = sec.codeBlocks;
        source = `§${sec.id} ${sec.title}`;
      }
    } else {
      const sub = getSubsectionById(ref);
      if (sub) {
        blocks = sub.codeBlocks;
        source = `§${sub.id} ${sub.title}`;
      }
    }
  }

  // If still nothing, search by language
  if (blocks.length === 0 && lang) {
    blocks = getCodeBlocksByLang(lang).slice(0, 5).map(b => ({ lang: b.lang, code: b.code }));
    source = `Filtered by language: ${lang}`;
  }

  // Filter by language if requested
  if (lang) {
    blocks = blocks.filter(b => b.lang.toLowerCase() === lang.toLowerCase());
  }

  return {
    topic,
    source: source || 'Unknown',
    codeBlocks: blocks.slice(0, 10),
  };
}

/**
 * List all available topic keys.
 * @returns {string[]}
 */
export function listTopics() {
  return Object.keys(TOPIC_MAP).sort();
}
