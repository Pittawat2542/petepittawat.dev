// Run with: playwright-cli run-code --filename scripts/verify-static-ui.js
// Start the local site first; this check uses the current page's origin.
async function verifyStaticUi(page) {
  const origin = new URL(page.url()).origin;
  const failures = [];
  async function check(name, run) {
    try {
      await run();
      console.log(`PASS: ${name}`);
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
    }
  }
  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }
  await check('reading progress moves with normal motion', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`${origin}/blog/the-common-language-of-knowledge/`);
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(150);
    const scale = await page
      .locator('[data-reading-progress]')
      .evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a);
    assert(scale > 0 && scale < 1, 'visible reading progress does not follow scroll position');
  });
  await check('scroll controls work without React hydration', async () => {
    await page.goto(`${origin}/blog/the-common-language-of-knowledge/`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(250);
    const button = page.locator('[data-scroll-top]');
    assert(
      (await button.getAttribute('data-visible')) === 'true',
      'back-to-top stays hidden after scrolling'
    );
    const progress = page.getByRole('progressbar', { name: 'Reading progress' });
    const before = Number(await progress.getAttribute('aria-valuenow'));
    assert(before > 0 && before < 100, 'reading progress does not expose the current percentage');
    await page.evaluate(() => {
      const extra = document.createElement('div');
      extra.style.height = '10000px';
      extra.dataset['testExtraHeight'] = '';
      document.querySelector('main').append(extra);
    });
    await page.waitForTimeout(250);
    assert(
      Number(await progress.getAttribute('aria-valuenow')) < before,
      'progress ignores document-height changes'
    );
    await button.click();
    await page.waitForTimeout(100);
    assert(
      (await page.evaluate(() => window.scrollY)) === 0,
      'reduced-motion back-to-top is not immediate'
    );
    assert(
      (await button.getAttribute('data-visible')) === 'false',
      'back-to-top remains active at the top'
    );
  });
  await check('featured transitions honor card-provided overflow limits', async () => {
    await page.goto(`${origin}/projects/`);
    const title = await page.evaluate(() => {
      const item = [...document.querySelectorAll('[data-grid-list] [data-listing-item]')].find(
        node => JSON.parse(node.dataset['meta']).tags.length >= 4
      );
      const row = item.querySelector('[data-adaptive-overflow]');
      row.dataset['overflowMax'] = '2';
      row.dataset['overflowFeaturedMax'] = '3';
      return JSON.parse(item.dataset['meta']).title;
    });
    await page.locator('[data-listing-query] input').fill(title);
    await page.waitForTimeout(100);
    const row = page.locator('[data-featured-list] [data-adaptive-overflow]');
    assert(
      (await row.locator('[data-card-overflow-item]:visible').count()) === 2,
      'featured limit is hard-coded instead of read from the card'
    );
    assert(
      (await row.locator('[data-card-overflow-more]').innerText()) === '+2 more',
      'featured overflow count is wrong'
    );
    await page.locator('[data-listing-query] input').fill('');
    await page.waitForTimeout(100);
    const demoted = page
      .locator('[data-grid-list] [data-listing-item]')
      .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
    assert(
      (await demoted
        .locator('[data-adaptive-overflow] [data-card-overflow-item]:visible')
        .count()) === 1,
      'normal overflow limit is ignored after demotion'
    );
  });
  for (const route of ['projects', 'publications', 'talks']) {
    await check(`${route} details have one dialog owner and restore focus`, async () => {
      await page.goto(`${origin}/${route}/`);
      const trigger = page
        .locator('[data-listing-item] button[data-details-trigger]:visible')
        .first();
      await trigger.focus();
      await trigger.press('Enter');
      const dialog = page.locator('[data-listing-dialog]');
      assert(await dialog.evaluate(el => el.open), 'keyboard activation did not open details');
      assert(
        (await trigger.getAttribute('aria-controls')) === (await dialog.getAttribute('id')),
        'trigger references the wrong dialog'
      );
      assert(
        (await trigger.getAttribute('aria-expanded')) === 'true',
        'trigger does not reflect open state'
      );
      assert(
        await dialog.locator('[data-close-details]').evaluate(el => el === document.activeElement),
        'close button did not receive focus'
      );
      assert(
        (await page.evaluate(() => document.documentElement.style.overflow)) === 'hidden',
        'page scroll was not locked'
      );
      await page.keyboard.press('Escape');
      await page.waitForFunction(
        el => el.getAttribute('aria-expanded') === 'false',
        await trigger.elementHandle()
      );
      assert(!(await dialog.evaluate(el => el.open)), 'Escape did not close details');
      assert(await trigger.evaluate(el => el === document.activeElement), 'focus was not restored');
      assert(
        (await trigger.getAttribute('aria-expanded')) === 'false',
        'closed state was not restored'
      );
      assert(
        (await page.evaluate(() => document.documentElement.style.overflow)) === '',
        'scroll lock leaked after close'
      );
      await trigger.click();
      await dialog.locator('[data-close-details]').click();
      await trigger.click();
      await page.mouse.click(2, 2);
      assert(!(await dialog.evaluate(el => el.open)), 'backdrop did not dismiss details');
      const link = page.locator('[data-listing-item] a:not([data-details-trigger])').first();
      const canceled = await link.evaluate(el => {
        let prevented;
        document.addEventListener(
          'click',
          event => {
            prevented = event.defaultPrevented;
            event.preventDefault();
          },
          { once: true }
        );
        el.click();
        return prevented;
      });
      assert(canceled === false, 'resource link was intercepted by the dialog controller');
      assert(!(await dialog.evaluate(el => el.open)), 'resource link opened details');
      if (route !== 'projects') {
        const card = page.locator('[data-featured-list] .media-card');
        await card.focus();
        await card.press('Space');
        assert(
          await dialog.evaluate(el => el.open),
          'card keyboard activation did not open details'
        );
        await page.keyboard.press('Escape');
      }
    });
  }
  await check('publication deep links open the correct item', async () => {
    await page.goto(`${origin}/publications/`);
    const id = await page
      .locator('[data-grid-list] [data-listing-item]')
      .first()
      .getAttribute('id');
    await page.goto(`${origin}/publications/?q=unmatched#${id}`);
    assert(
      await page.locator('[data-listing-dialog]').evaluate(el => el.open),
      'deep link did not open details'
    );
    assert(
      await page.locator(`[id="${id}"]`).isVisible(),
      'deep-linked item remained filtered out'
    );
    await page.keyboard.press('Escape');
  });
  await check('listing filtering, sorting, tags, and URL state survive reload', async () => {
    await page.goto(`${origin}/projects/`);
    const input = page.locator('[data-listing-query] input');
    await input.fill('zzzz-unmatched');
    await page.waitForTimeout(50);
    assert(await page.locator('[data-listing-empty]').isVisible(), 'empty state is missing');
    assert(
      new URL(page.url()).searchParams.get('q') === 'zzzz-unmatched',
      'query is missing from URL'
    );
    await page.reload();
    assert((await input.inputValue()) === 'zzzz-unmatched', 'URL query was not restored');
    await page.locator('[data-clear-query]').click();
    await page.locator('[data-toggle-filters]').click();
    await page.locator('[data-menu-trigger="listing-menu-sort"]').click();
    await page.locator('[data-filter-key="sort"] [data-value="oldest"]').click();
    const dates = await page
      .locator('[data-listing-item]:not([hidden])')
      .evaluateAll(nodes => nodes.map(node => JSON.parse(node.dataset['meta']).date));
    assert(
      dates.every((date, i) => !i || date >= dates[i - 1]),
      'oldest sorting is incorrect'
    );
    const tagTrigger = page.locator('[data-menu-trigger="listing-tag-menu"]');
    await tagTrigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await tagTrigger.click();
    await page.locator('[data-tag]').first().click();
    assert(new URL(page.url()).searchParams.has('tag'), 'selected tag was not written to the URL');
    await page.keyboard.press('Escape');
    await page.locator('[data-clear-all]:visible').first().click();
    assert(!new URL(page.url()).searchParams.has('tag'), 'clear-all left tag state behind');
    await page.goto(`${origin}/tags/ai/`);
    const tags = await page
      .locator('[data-listing-item]:not([hidden])')
      .evaluateAll(nodes => nodes.map(node => JSON.parse(node.dataset['meta']).tags));
    assert(
      tags.length > 0 && tags.every(values => values.includes('AI')),
      'tag route defaults are not applied'
    );
    await page.locator('[data-clear-all]:visible').first().click();
    await page.reload();
    assert(
      (await page.locator('[data-listing-item]:not([hidden])').count()) > tags.length,
      'cleared tag route resets on reload'
    );
  });
  await check('language switching preserves featured presentation and URL preference', async () => {
    await page.goto(`${origin}/blog/?lang=en`);
    await page.locator('[data-locale="th"]').click();
    await page.waitForFunction(
      () =>
        new URL(location.href).searchParams.get('lang') === 'th' &&
        document.querySelector('[data-locale-status]').hidden
    );
    assert(
      (await page.locator('[data-featured-list] .blog-card--featured-essay').count()) === 1,
      'Thai featured card is missing'
    );
    assert(
      await page
        .locator('[data-featured-list] .blog-card')
        .getAttribute('href')
        .then(href => href.startsWith('/th/blog/')),
      'Thai cards use the wrong locale'
    );
    await page.locator('[data-locale="en"]').click();
    await page.waitForFunction(() => new URL(location.href).searchParams.get('lang') === 'en');
    await page.reload();
    assert(
      await page
        .locator('[data-featured-list] .blog-card')
        .getAttribute('href')
        .then(href => href.startsWith('/blog/')),
      'English URL preference was not restored'
    );
    const title = await page.locator('[data-grid-list] [data-listing-item] h3').first().innerText();
    await page.locator('[data-listing-query] input').fill(title);
    await page.waitForTimeout(50);
    assert(
      (await page.locator('[data-featured-list] .blog-card--featured-essay').count()) === 1,
      'filtered blog card was not promoted'
    );

    await page.locator('[data-listing-query] input').fill('');
    await page.waitForTimeout(50);
    assert(
      (await page.locator('[data-grid-list] .blog-card--featured-essay').count()) === 0,
      'demoted blog card retains featured styling'
    );
  });
  if (failures.length) throw new Error(failures.join('\n'));
}
