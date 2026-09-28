import { test, expect } from '@playwright/test';

test('window landscape is identical on first entry and reload', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.clock.setFixedTime(new Date('2026-09-28T12:00:00'));
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  // Routing disables the HTTP cache; delay the model to exercise a cold load.
  await page.route('**/developer_room_concept_v4.glb', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.goto('/');
  await page.getByRole('button', { name: '작업실 둘러보기' }).click();
  await page.getByRole('button', { name: /LOCAL TIME/ }).click();
  const panel = page.getByRole('region', { name: 'window', exact: true });
  await expect(panel).toHaveAttribute('aria-busy', 'false');
  await page.waitForTimeout(1500);
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  // Compare only the unobstructed glass, excluding panel focus rings and text.
  const clip = { x: 310, y: 220, width: 370, height: 360 };
  const first = await page.screenshot({
    clip,
    path: 'test-results/window-first.png',
  });
  await page.reload();
  await expect(panel).toHaveAttribute('aria-busy', 'false');
  await page.waitForTimeout(1500);
  const reloaded = await page.screenshot({
    clip,
    path: 'test-results/window-reloaded.png',
  });
  expect(first.equals(reloaded)).toBe(true);
  expect(errors).toEqual([]);
});
