import assert from 'node:assert/strict';
import test from 'node:test';

import { getSiteCopy } from './copy.ts';

test('returns the canonical English site copy for the default locale', () => {
  const copy = getSiteCopy('en');

  assert.equal(copy.nav.links.find(link => link.key === 'about')?.label, 'About');
  assert.equal(copy.listingPages.projects.path, '/projects');
  assert.equal(copy.home.hero.ctaHeading, 'Explore my work');
  assert.equal('primaryCtas' in copy.home.hero, false);
  assert.equal(copy.home.selectedOutput.eyebrow, 'Selected output');
  assert.equal(copy.home.selectedOutput.cards[0]?.href, '/blog');
  assert.equal(copy.home.selectedOutput.cards[0]?.linkText, 'Explore {count} blog posts');
  assert.equal(copy.home.researchInPractice.eyebrow, 'Research focus');
  assert.equal(copy.home.researchInPractice.pillars.length, 4);
  assert.equal(copy.home.researchInPractice.ctaHref, '/about');
  assert.equal(copy.about.intro.title, 'About Pete');
  assert.equal(copy.about.proofPoints.items.length, 3);
  assert.equal(copy.about.focusAreas.items.length, 4);
  assert.ok(copy.about.currentWork.items.length > 0);
  assert.ok(copy.about.currentWork.collaborationPoints.length > 0);
});

test('returns translated Thai copy for the Thai locale', () => {
  const thaiCopy = getSiteCopy('th');

  assert.equal(thaiCopy.nav.links.find(link => link.key === 'about')?.label, 'เกี่ยวกับ');
  assert.equal(thaiCopy.home.hero.title, 'สวัสดีครับ ผมพีท');
  assert.equal(thaiCopy.footer.title, 'งานวิจัย วิศวกรรม และบันทึกจากภาคสนามที่เล่าให้ชัด');
  assert.equal(thaiCopy.home.hero.ctaHeading, 'สำรวจผลงาน');
  assert.equal('primaryCtas' in thaiCopy.home.hero, false);
  assert.equal(thaiCopy.home.selectedOutput.eyebrow, 'ผลงานที่เผยแพร่');
  assert.equal(thaiCopy.home.selectedOutput.cards[0]?.href, '/blog');
  assert.equal(thaiCopy.home.selectedOutput.cards[0]?.linkText, 'สำรวจบทความ {count} รายการ');
  assert.equal(thaiCopy.home.researchInPractice.pillars.length, 4);
  assert.equal(thaiCopy.home.researchInPractice.ctaHref, '/about');
  assert.equal(thaiCopy.about.intro.title, 'เกี่ยวกับพีท');
  assert.equal(thaiCopy.about.proofPoints.items.length, 3);
  assert.equal(thaiCopy.about.focusAreas.items.length, 4);
});
