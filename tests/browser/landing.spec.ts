import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`landing and case studies stay readable without 3D at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/developer_room_concept_v4.glb', (route) =>
      route.abort(),
    );
    await page.goto('/');
    await page.getByRole('link', { name: '프로젝트 살펴보기' }).click();
    const work = page.getByRole('region', { name: '대표 프로젝트' });
    await expect(work).toBeInViewport();
    for (const img of await work.locator('img').all()) {
      await expect(img).toBeVisible();
      expect(
        await img.evaluate((node: HTMLImageElement) => node.naturalWidth),
      ).toBeGreaterThan(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `test-results/landing-work-${width}.png` });
    await page.getByRole('link', { name: 'Jongalab 사례 읽기' }).click();
    await expect(page).toHaveURL(/\/projects\/jongalab$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Jongalab',
    );
    await page
      .getByRole('link', { name: '다음 프로젝트 · SmartOffer' })
      .click();
    await expect(page).toHaveURL(/\/projects\/smartoffer$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'SmartOffer',
    );
  });
}
