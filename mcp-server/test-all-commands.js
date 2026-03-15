import { wpGetPosts, wpGetPost, wpGetUsers, wpGetSettings, wpWooProducts, wpWooOrders, wpGetTerms, wpGetPostTypes, wpGetTaxonomies } from './lib/wp-data.js';
import { listAgentSkills, getAgentSkill } from './lib/agent-skills.js';
import { searchKnowledge } from './lib/search.js';
import { getSecurityChecklist } from './lib/checklists.js';
import { listSections } from './lib/parser.js';
import fs from 'fs';

async function runTests() {
  const results = [];

  const runPhase = async (name, fn) => {
    try {
      const res = await fn();
      if (res && res.error) {
        results.push({ name, status: 'FAILED', error: res.error });
      } else {
        results.push({ name, status: 'PASSED', data: Array.isArray(res) ? `Array[${res.length}]` : typeof res === 'object' ? 'Object' : typeof res });
      }
    } catch (e) {
      results.push({ name, status: 'ERROR', error: e.message });
    }
  };

  // 1. WP-CLI Live Data Commands
  await runPhase("wpGetPosts", () => wpGetPosts());
  await runPhase("wpGetPost(1)", async () => {
    const posts = await wpGetPosts();
    // Use first post ID if available, else fallback to 1
    const id = (posts && posts.length > 0) ? posts[0].ID : 1;
    return wpGetPost(id);
  });
  await runPhase("wpGetUsers", () => wpGetUsers());
  await runPhase("wpGetSettings", () => wpGetSettings());
  await runPhase("wpWooProducts", () => wpWooProducts());
  await runPhase("wpWooOrders", () => wpWooOrders());
  await runPhase("wpGetTerms", () => wpGetTerms());
  await runPhase("wpGetPostTypes", () => wpGetPostTypes());
  await runPhase("wpGetTaxonomies", () => wpGetTaxonomies());

  // 2. Agent Skills
  await runPhase("listAgentSkills", async () => listAgentSkills());
  await runPhase("getAgentSkill('wp-rest-api')", async () => getAgentSkill('wp-rest-api'));

  // 3. Knowledge Base
  await runPhase("searchKnowledge('security')", async () => searchKnowledge('security'));
  await runPhase("listSections", async () => listSections());
  await runPhase("getSecurityChecklist", async () => getSecurityChecklist());

  // Mark WooCommerce tests as SKIPPED if not available
  const wooResults = results.filter(r => r.name === 'wpWooProducts' || r.name === 'wpWooOrders');
  wooResults.forEach(r => {
    if (r.status === 'FAILED' && r.error.includes('WooCommerce CLI not available')) {
      r.status = 'SKIPPED';
      r.error = 'WooCommerce not installed (run: wp plugin install woocommerce --activate)';
    }
  });

  fs.writeFileSync('test-report.json', JSON.stringify(results, null, 2));
  console.log("Test report saved to test-report.json");
}

runTests();
