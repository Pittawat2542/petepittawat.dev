import assert from 'node:assert/strict';
import test from 'node:test';

import { getSiteCopy } from './copy.ts';

test('returns the canonical English site copy for the default locale', () => {
  const copy = getSiteCopy('en');

  assert.equal(copy.nav.links.find(link => link.key === 'about')?.label, 'About');
  assert.equal(copy.listingPages.projects.path, '/projects');
  assert.equal(copy.home.hero.primaryCtas[0]?.href, '/projects');
});

test('returns translated Thai copy for the Thai locale', () => {
  const thaiCopy = getSiteCopy('th');

  assert.equal(thaiCopy.nav.links.find(link => link.key === 'about')?.label, 'เกี่ยวกับ');
  assert.equal(thaiCopy.home.hero.title, 'สวัสดีครับ ผมพีท');
  assert.equal(
    thaiCopy.footer.summary,
    'ผมทำงานคร่อมระหว่างโมเดลภาษา การประเมินผล และการสร้างระบบ แล้วเผยแพร่เครื่องมือ งานบรรยาย และงานเขียนเชิงเทคนิคเพื่อให้ผู้อื่นนำไปต่อยอดได้ง่ายขึ้น'
  );
});
