/**
 * validator.js
 *
 * Validates WordPress plugin/theme code and structure against
 * the wc-agent.md 15-year senior developer standards.
 */

// ─────────────────────────────────────────────
// Plugin structure validation
// ─────────────────────────────────────────────

const REQUIRED_FILES = [
  { path: 'uninstall.php',  severity: 'error',   message: 'Missing uninstall.php — required for cleanup on deletion' },
  { path: 'readme.txt',     severity: 'warning',  message: 'Missing readme.txt — required for WordPress.org' },
  { path: 'composer.json',  severity: 'info',     message: 'composer.json not found — recommended for dependency management' },
  { path: 'package.json',   severity: 'info',     message: 'package.json not found — recommended for JS build tooling' },
  { path: '.phpcs.xml',     severity: 'info',     message: '.phpcs.xml not found — recommended for coding standards enforcement' },
  { path: 'phpstan.neon',   severity: 'info',     message: 'phpstan.neon not found — recommended for static analysis (Level 8+)' },
  { path: 'CHANGELOG.md',   severity: 'warning',  message: 'CHANGELOG.md not found — required for version history' },
];

const REQUIRED_DIRS = [
  { path: 'inc/',         severity: 'warning', message: 'inc/ directory missing — use inc/ for PHP classes, helpers, services' },
  { path: 'languages/',   severity: 'warning', message: 'languages/ missing — required for i18n support' },
  { path: 'tests/',       severity: 'info',    message: 'tests/ missing — recommended for PHPUnit/Pest test coverage' },
  { path: 'assets/',      severity: 'info',    message: 'assets/ missing — recommended for images, fonts, icons' },
  { path: 'templates/',   severity: 'info',    message: 'templates/ missing — recommended for PHP template files' },
];

/**
 * Validate a plugin file list against required structure.
 *
 * @param {string[]} fileList   Relative file paths in the plugin directory
 * @param {string[]} [dirList]  Relative directory paths
 * @returns {{ issues: { severity: string, message: string, path: string }[], score: number, grade: string }}
 */
export function validatePluginStructure(fileList, dirList = []) {
  if (!Array.isArray(fileList)) {
    return {
      issues: [{ severity: 'error', message: 'No file list provided or invalid format', path: '' }],
      score: 0,
      grade: 'F',
      summary: '1 errors',
    };
  }
  const issues = [];

  for (const req of REQUIRED_FILES) {
    const found = fileList.some(f =>
      f === req.path || f.endsWith('/' + req.path) || f.endsWith('\\' + req.path)
    );
    if (!found) {
      issues.push({ severity: req.severity, message: req.message, path: req.path });
    }
  }

  for (const req of REQUIRED_DIRS) {
    const found = dirList.some(d =>
      d === req.path || d.startsWith(req.path) || d.endsWith(req.path.replace(/\/$/, ''))
    );
    if (!found) {
      issues.push({ severity: req.severity, message: req.message, path: req.path });
    }
  }

  const errors   = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const score    = Math.max(0, 100 - errors * 25 - warnings * 10 - issues.filter(i => i.severity === 'info').length * 3);

  return {
    issues,
    score,
    grade: score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F',
    summary: `${errors} errors, ${warnings} warnings, ${issues.filter(i => i.severity === 'info').length} suggestions`,
  };
}

// ─────────────────────────────────────────────
// PHP code security analysis
// ─────────────────────────────────────────────

const SECURITY_RULES = [
  {
    id:        'NO_RAW_SQL',
    severity:  'error',
    pattern:   /\$wpdb->(query|get_results|get_row|get_var|get_col)\s*\(\s*["'`][^"'`]*\$(?!wpdb)/,
    message:   '❌ Possible raw SQL injection — use $wpdb->prepare() with placeholders',
    reference: '§41.4',
  },
  {
    id:        'NO_EVAL',
    severity:  'error',
    pattern:   /\beval\s*\(/,
    message:   '❌ eval() detected — extremely dangerous, never use with user data',
    reference: '§41.6',
  },
  {
    id:        'NO_SHELL',
    severity:  'error',
    pattern:   /\b(shell_exec|system|exec|passthru|popen|proc_open)\s*\(/,
    message:   '❌ Shell execution function detected — never use with user input',
    reference: '§41.6',
  },
  {
    id:        'NO_UNSERIALIZE',
    severity:  'error',
    pattern:   /\bunserialize\s*\(/,
    message:   '❌ unserialize() detected — use json_decode() instead for untrusted data',
    reference: '§41.6',
  },
  {
    id:        'NO_RAW_GET_POST',
    severity:  'warning',
    pattern:   /echo\s+\$_(GET|POST|REQUEST|SERVER|COOKIE)/,
    message:   '⚠️  Echoing raw superglobal — always sanitize + escape first',
    reference: '§41.2',
  },
  {
    id:        'NO_MISSING_NONCE',
    severity:  'warning',
    pattern:   /add_action\(['"]wp_ajax_/,
    message:   '⚠️  AJAX action detected — ensure check_ajax_referer() or wp_verify_nonce() is present',
    reference: '§41.3',
  },
  {
    id:        'NO_MISSING_CAP_CHECK',
    severity:  'warning',
    pattern:   /add_action\(['"]wp_ajax_/,
    message:   '⚠️  AJAX action detected — ensure current_user_can() capability check is present',
    reference: '§3.4',
  },
  {
    id:        'NO_FILE_INCLUDE',
    severity:  'error',
    pattern:   /(include|require)(_once)?\s*\(\s*\$_(GET|POST|REQUEST|COOKIE)/,
    message:   '❌ File inclusion from user input — path traversal risk',
    reference: '§41.11',
  },
  {
    id:        'NO_DIRECT_REDIRECT',
    severity:  'warning',
    pattern:   /wp_redirect\s*\(\s*\$_(GET|POST|REQUEST)/,
    message:   '⚠️  Open redirect risk — use wp_safe_redirect() with wp_validate_redirect()',
    reference: '§41.8',
  },
  {
    id:        'MISSING_ABSPATH',
    severity:  'warning',
    pattern:   /^<\?php/,
    message:   '⚠️  Check: all PHP files should start with defined(\'ABSPATH\') || exit;',
    reference: '§3.6',
  },
  {
    id:        'NO_ESCAPED_OUTPUT',
    severity:  'warning',
    pattern:   /echo\s+get_post_meta|echo\s+get_option|echo\s+\$post->/,
    message:   '⚠️  Unescaped output from WordPress data — wrap with esc_html(), esc_attr(), etc.',
    reference: '§3.2',
  },
  {
    id:        'NO_PRINT_R_VAR_DUMP',
    severity:  'info',
    pattern:   /\b(var_dump|print_r|var_export)\s*\(/,
    message:   'ℹ️  Debug function detected — remove before production deployment',
    reference: '§48.1',
  },
  {
    id:        'NO_QUERY_POSTS',
    severity:  'error',
    pattern:   /\bquery_posts\s*\(/,
    message:   '❌ query_posts() is deprecated — use WP_Query or pre_get_posts instead',
    reference: '§4.3',
  },
];

/**
 * Analyse PHP code string for security and quality issues.
 *
 * @param {string} code   Raw PHP source code
 * @returns {{ issues: { id: string, severity: string, message: string, line: number, reference: string }[], score: number, grade: string }}
 */
export function analysePhpCode(code) {
  const lines  = code.split('\n');
  const issues = [];

  for (const rule of SECURITY_RULES) {
    for (let i = 0; i < lines.length; i++) {
      if (rule.pattern.test(lines[i])) {
        issues.push({
          id:        rule.id,
          severity:  rule.severity,
          message:   rule.message,
          line:      i + 1,
          lineText:  lines[i].trim().slice(0, 100),
          reference: rule.reference,
        });
        break; // Report each rule once per file
      }
    }
  }

  const errors   = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const score    = Math.max(0, 100 - errors * 20 - warnings * 8 - issues.filter(i => i.severity === 'info').length * 2);

  return {
    issues,
    score,
    grade:   score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F',
    summary: `${errors} security errors, ${warnings} warnings, ${issues.filter(i => i.severity === 'info').length} suggestions`,
  };
}

/**
 * Validate a plugin header comment block.
 *
 * @param {string} headerText
 * @returns {{ valid: boolean, missing: string[], found: Record<string, string> }}
 */
export function validatePluginHeader(headerText) {
  const required = ['Plugin Name', 'Description', 'Version', 'Author', 'License', 'Text Domain'];
  const found    = {};
  const missing  = [];

  for (const field of required) {
    const match = headerText.match(new RegExp(`${field}:\\s*(.+)`));
    if (match) {
      found[field] = match[1].trim();
    } else {
      missing.push(field);
    }
  }

  return {
    valid:   missing.length === 0,
    missing,
    found,
  };
}
