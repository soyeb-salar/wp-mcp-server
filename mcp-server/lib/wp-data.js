/**
 * wp-data.js
 * 
 * Provides live WordPress data reading/writing by securely wrapping local WP-CLI commands.
 * Replicates the functionality of Automattic/wordpress-mcp without needing a PHP plugin.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

// Hardcoded path to the WordPress installation where WP-CLI should execute
const WP_PATH = 'C:\\wamp64\\www\\wp-mcp-test';
const WP_CLI_PATH = join(__dirname, 'wp-cli.phar');

/**
 * Executes a WP-CLI command and returns the JSON parsed result.
 */
async function runCliJson(command, args = '') {
  try {
    const fullCommand = `php "${WP_CLI_PATH}" ${command} ${args} --format=json --path="${WP_PATH}" --allow-root`;
    const { stdout, stderr } = await execAsync(fullCommand);

    if (stderr && !stdout) {
      return { error: stderr.trim() };
    }

    if (!stdout.trim()) {
      return [];
    }

    return JSON.parse(stdout);
  } catch (error) {
    return { error: `WP-CLI Execution failed: ${error.message}` };
  }
}

/**
 * Fetch Posts, Pages, or CPTs.
 */
export async function wpGetPosts(postType = 'post', count = 10, search = '') {
  const searchArg = search ? `--search="${search}"` : '';
  return runCliJson('post list', `--post_type="${postType}" --per_page=${count} ${searchArg}`);
}

/**
 * Fetch a single Post by ID to read its full content.
 */
export async function wpGetPost(id) {
  return runCliJson('post get', `${parseInt(id, 10)}`);
}

/**
 * Fetch Users.
 */
export async function wpGetUsers(role = '', count = 10, search = '') {
  const roleArg = role ? `--role="${role}"` : '';
  const searchArg = search ? `--search="${search}"` : '';
  return runCliJson('user list', `--number=${count} ${roleArg} ${searchArg}`);
}

/**
 * Fetch Core Settings (Options).
 */
export async function wpGetSettings(search = '') {
  const searchArg = search ? `--search="${search}"` : '';
  // option list doesn't support --number, use --format=json and limit in code if needed
  return runCliJson('option list', `--autoload=yes ${searchArg}`);
}

/**
 * Fetch WooCommerce Products.
 * Returns error if WooCommerce is not installed.
 */
export async function wpWooProducts(status = 'publish', count = 10) {
  const result = await runCliJson('wc product list', `--status="${status}" --number=${count}`);
  // If wc command not found, provide helpful message
  if (result.error && result.error.includes("'wc' is not a registered wp command")) {
    return { error: 'WooCommerce CLI not available. Ensure WooCommerce plugin is installed and active.' };
  }
  return result;
}

/**
 * Fetch WooCommerce Orders.
 * Returns error if WooCommerce is not installed.
 */
export async function wpWooOrders(status = 'any', count = 10) {
  const result = await runCliJson('wc order list', `--status="${status}" --number=${count}`);
  // If wc command not found, provide helpful message
  if (result.error && result.error.includes("'wc' is not a registered wp command")) {
    return { error: 'WooCommerce CLI not available. Ensure WooCommerce plugin is installed and active.' };
  }
  return result;
}

/**
 * Fetch Terms from a Taxonomy.
 */
export async function wpGetTerms(taxonomy = 'category', count = 10, search = '') {
  const searchArg = search ? `--search="${search}"` : '';
  return runCliJson('term list', `${taxonomy} --number=${count} ${searchArg}`);
}

/**
 * Fetch Custom Post Types.
 */
export async function wpGetPostTypes() {
  return runCliJson('post-type list', '');
}

/**
 * Fetch Taxonomies.
 */
export async function wpGetTaxonomies() {
  return runCliJson('taxonomy list', '');
}
