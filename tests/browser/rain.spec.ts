import { test, expect } from '@playwright/test';

test('rain shader animates, freezes for reduced motion, and clears', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('/#window');
  const environment = page.getByRole('region', { name: 'window', exact: true });
  await expect(environment).toHaveAttribute('aria-busy', 'false');
  await environment.getByRole('button', { name: 'day', exact: true }).click();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  // Allow asset loading and the final demand-rendered frame to settle.
  await page.waitForTimeout(1500);
  const clear = await canvas.screenshot();
  await environment.getByRole('button', { name: 'Weather / Clear' }).click();
  await page.waitForTimeout(300);
  const stillRain = await canvas.screenshot();
  expect(stillRain.equals(clear)).toBe(false);
  await page.waitForTimeout(300);
  expect((await canvas.screenshot()).equals(stillRain)).toBe(true);
  await page.screenshot({ path: 'test-results/rain-day.png' });

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(500);
  const movingRain = await canvas.screenshot();
  await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(movingRain)).toBe(false);
  await environment.getByRole('button', { name: 'night', exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/rain-night.png' });

  await environment.getByRole('button', { name: 'Weather / Rain' }).click();
  await page.waitForTimeout(300);
  const stopped = await canvas.screenshot();
  await page.waitForTimeout(300);
  expect((await canvas.screenshot()).equals(stopped)).toBe(true);
  expect(errors).toEqual([]);
});
