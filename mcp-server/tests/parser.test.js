import { test } from 'node:test';
import assert from 'node:assert';
import { loadKnowledgeBase, listSections, getSectionByNumber } from '../lib/parser.js';

test('Parser loads exactly 67 sections', () => {
    const sections = loadKnowledgeBase();
    assert.strictEqual(sections.length, 67, 'Expected 67 sections from wc-agent.md');
});

test('Section 67 is Git Deployment', () => {
    const sec = getSectionByNumber(67);
    assert.ok(sec, 'Section 67 should exist');
    assert.strictEqual(sec.title, 'GIT DEPLOYMENT');
});

test('listSections returns metadata without full content', () => {
    const list = listSections();
    assert.strictEqual(list.length, 67);
    assert.ok(list[0].title);
    assert.strictEqual(list[0].content, undefined, 'Content should not be in list output');
});
