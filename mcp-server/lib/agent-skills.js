/**
 * agent-skills.js
 * 
 * Provides MCP access to the official WordPress/agent-skills repository.
 * Reads the 'SKILL.md' files from the cloned repository.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, 'skills');

/**
 * List all available official WordPress agent skills.
 * @returns {string[]} Array of skill folder names.
 */
export function listAgentSkills() {
  if (!existsSync(SKILLS_DIR)) {
    return [];
  }
  
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
}

/**
 * Get the verbatim content of a specific SKILL.md.
 * @param {string} skillName 
 * @returns {{ skill: string, content: string } | { error: string }}
 */
export function getAgentSkill(skillName) {
  const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
  
  if (!existsSync(skillPath)) {
    return { error: `Skill '${skillName}' not found. Ensure the directory exists and contains a SKILL.md file.` };
  }
  
  try {
    const content = readFileSync(skillPath, 'utf-8');
    return { skill: skillName, content };
  } catch (error) {
    return { error: `Failed to read skill '${skillName}': ${error.message}` };
  }
}
