// Run against the built site with playwright-cli run-code --filename scripts/verify-review-ui.js.
async function verifyReviewUi(page) {
  const origin = new URL(page.url()).origin;
  const failures = [];
  const matchesDestination = href => {
    const expected = new URL(href, origin);
    const normalize = path => path.replace(/\/$/, '');
    return url =>
      url.origin === expected.origin &&
      normalize(url.pathname) === normalize(expected.pathname) &&
      url.search === expected.search &&
      url.hash === expected.hash;
  };
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const check = async (name, run) => {
    try {
      await run();
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
    }
  };
  const openSearch = async () => {
    await page.goto(origin);
    await page.getByRole('button', { name: 'Open search' }).click();
    await page.getByRole('link', { name: 'Home', exact: true }).waitFor();
    return page
      .getByRole('combobox', { name: 'Universal search' })
      .or(page.getByRole('searchbox', { name: 'Universal search' }));
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  await check('search filter owns Enter', async () => {
    await openSearch();
    const filter = page.getByRole('button', { name: /^Blog \d/ });
    await filter.press('Enter');
    assert(page.url() === origin + '/', 'Enter on filter navigated');
    assert(
      (await filter.getAttribute('aria-pressed', { timeout: 2000 })) === 'false',
      'filter stayed active'
    );
  });

  await check('search opens only displayed results and supports more', async () => {
    const input = await openSearch();
    await input.fill('a');
    const options = page.getByRole('row');
    await options.first().waitFor();
    const selected = async (count, field = input) => {
      await page.waitForFunction(
        expected =>
          document.querySelectorAll('#site-search-results [role=row]').length === expected,
        count,
        { timeout: 2500 }
      );
      await field.press('ArrowDown');
      await field.press('End');
      const id = await field.getAttribute('aria-activedescendant');
      assert(
        id && id === (await options.last().getAttribute('id')),
        'active result is missing or is not the last displayed row'
      );
      assert(
        (await options.last().getAttribute('aria-selected')) === 'true',
        'announced row is not selected'
      );
      return options.last().getByRole('link').getAttribute('href');
    };
    const firstDestination = await selected(50);
    assert(await page.getByText(/^50 of \d+ results$/).isVisible(), 'result count hides the cap');
    await page.getByRole('button', { name: 'Show more' }).click();
    const destination = await selected(100);
    await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
    await input.dispatchEvent('keydown', { key: 'Enter', keyCode: 229 });
    assert(page.url() === origin + '/', 'IME confirmation navigated');
    await input.press('Enter');
    await page.waitForURL(matchesDestination(destination), { timeout: 7500 });

    const modified = await openSearch();
    await modified.fill('a');
    await selected(50, modified);
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      modified.press('Control+Enter'),
    ]);
    await popup.waitForURL(matchesDestination(firstDestination), { timeout: 7500 });
    await popup.close();
    assert(page.url() === origin + '/', 'modified Enter navigated the opener');

    const narrowed = await openSearch();
    await narrowed.fill('a');
    await page.getByRole('button', { name: 'Show more' }).click();
    await narrowed.fill('common language of knowledge');
    assert(
      (await options.count()) > 0 && (await options.count()) < 50,
      'narrow query did not replace results'
    );
    assert(
      (await narrowed.getAttribute('aria-activedescendant')) ===
        (await options.first().getAttribute('id')),
      'selection did not reset'
    );
    await narrowed.fill('zzzxqvnomatches');
    await narrowed.press('Enter');
    assert(
      page.url() === origin + '/' && !(await narrowed.getAttribute('aria-activedescendant')),
      'empty search can activate a result'
    );
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await check('mobile menu keeps focus visible', async () => {
    await page.goto(origin);
    const toggle = page.locator('#menu-toggle');
    const links = page.locator('#mobile-menu a');
    const focused = locator => locator.evaluate(el => document.activeElement === el);
    await toggle.press('Enter');
    assert(await focused(links.first()), 'first link does not receive focus');
    await page.keyboard.press('Shift+Tab');
    assert(await focused(toggle), 'reverse tab did not reach toggle');
    await page.keyboard.press('Shift+Tab');
    assert(await focused(links.last()), 'reverse tab escaped menu');
    await page.keyboard.press('Tab');
    assert(await focused(toggle), 'forward tab escaped menu');
    await page.keyboard.press('Tab');
    assert(await focused(links.first()), 'forward tab did not return to first link');
    await page.keyboard.press('Escape');
    assert(
      (await focused(toggle)) && (await toggle.getAttribute('aria-expanded')) === 'false',
      'Escape did not return focus'
    );
    await toggle.click();
    await page.keyboard.press('Control+k');
    await page.getByRole('dialog', { name: 'Site Search' }).waitFor();
    assert((await toggle.getAttribute('aria-expanded')) === 'false', 'search left the menu open');
    await page.keyboard.press('Escape');
    await toggle.click();
    await page.setViewportSize({ width: 960, height: 844 });
    await page.waitForFunction(
      () =>
        document.activeElement?.getAttribute('href') === '/blog' &&
        document.activeElement.closest('#nav-list')
    );
    assert(
      await page.evaluate(() => !document.documentElement.style.overflow),
      'scroll lock survived desktop resize'
    );
  });

  await check('mobile archive titles and homepage work links fit the first screen', async () => {
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      for (const path of [
        '/',
        '/blog/?lang=en',
        '/blog/?lang=th',
        '/projects/',
        '/publications/',
        '/talks/',
      ]) {
        await page.goto(origin + path);
        if (path.endsWith('lang=th')) {
          await page.waitForFunction(() =>
            document.querySelector('[data-featured-list] a[href^="/th/blog/"]')
          );
        }
        await page.evaluate(() => document.fonts.ready.then(() => true));
        const target =
          path === '/'
            ? page.locator('main a').first()
            : page.locator('[data-featured-list] h3').first();
        const box = await target.boundingBox();
        if (width === 390)
          assert(
            box && box.y + box.height <= 844,
            `${path} title or work link starts below first screen`
          );
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth === innerWidth),
          `${path} overflows at ${width}px`
        );
      }
    }
  });
  if (failures.length) throw new Error(failures.join('\n'));
}
