import { test, expect } from '@playwright/test';
test('boot, scene, camera navigation, theme, environment and history', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const enter = page.getByRole('button', { name: '작업실 둘러보기' });
  await expect(enter).toBeEnabled({ timeout: 30000 });
  await page.screenshot({ path: 'test-results/boot.png' });
  await enter.click();
  await expect(enter).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: '모니터에서 프로젝트 보기' }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/home.png' });
  await page.getByRole('button', { name: '모니터에서 프로젝트 보기' }).click();
  const panel = page.getByRole('region', { name: 'projects', exact: true });
  await expect(panel).toBeVisible({ timeout: 20000 });
  await expect(panel).toHaveAttribute('aria-busy', 'false');
  await expect(
    panel.getByRole('heading', { name: 'Jongalab', exact: true }),
  ).toBeVisible();
  await panel.locator('summary').first().click();
  await expect(
    panel.getByRole('link', { name: '서비스 보기' }),
  ).toHaveAttribute('href', 'https://jongalab.com');
  await expect(
    panel
      .getByRole('heading', { name: 'Technical decisions', exact: true })
      .first(),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/projects.png' });
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#home$/);
  await page.getByRole('button', { name: '조명 전환', exact: true }).click();
  await expect(
    page.getByRole('button', { name: '조명 전환', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '노트에서 소개 보기' }).click();
  await expect(
    page.getByRole('region', { name: 'about', exact: true }),
  ).toBeVisible({ timeout: 20000 });
  await page.screenshot({ path: 'test-results/about.png' });
  await page.goBack();
  await expect(page).toHaveURL(/#home$/);
  await page.getByRole('button', { name: /LOCAL TIME/ }).click();
  const environment = page.getByRole('region', { name: 'window', exact: true });
  await expect(environment).toBeVisible({ timeout: 20000 });
  await environment.getByRole('button', { name: 'day', exact: true }).click();
  await expect(
    environment.getByRole('button', { name: 'day', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await environment.getByRole('button', { name: 'Weather / Clear' }).click();
  await expect(
    environment.getByRole('button', { name: 'Weather / Rain' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '사운드 전환' }).click();
  await expect(
    page.getByRole('button', { name: '사운드 전환' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '사운드 전환' }).click();
  expect(errors).toEqual([]);
});
test('mobile content, reduced motion and deep link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#about');
  await expect(
    page.getByRole('region', { name: 'about', exact: true }),
  ).toBeVisible({ timeout: 20000 });
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-projects')).toBeVisible();
  await expect(
    page.getByRole('button', { name: '모니터에서 프로젝트 보기' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
test('asset failure retains accessible HTML navigation', async ({ page }) => {
  await page.route('**/developer_room_concept_v4.glb', (route) =>
    route.abort(),
  );
  await page.goto('/');
  const skip = page.getByRole('link', {
    name: '프로젝트 바로 보기',
    exact: true,
  });
  await skip.focus();
  await skip.click();
  await expect(
    page.getByRole('region', { name: 'projects', exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole('heading', { name: 'Thoughtfully built. Made to be used.' })
      .first(),
  ).toBeVisible();
});

test('resume content, career details and contacts are available without WebGL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#about');
  const about = page.getByRole('region', { name: 'about', exact: true });
  await expect(
    about.getByRole('link', { name: 'rheeeuro@gmail.com' }),
  ).toHaveAttribute('href', 'mailto:rheeeuro@gmail.com');
  await expect(about.getByText('이유로', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '03 Experience' }).click();
  const experience = page.getByRole('region', {
    name: 'experience',
    exact: true,
  });
  await expect(
    experience.getByRole('heading', { name: '넷스루', exact: true }),
  ).toBeVisible();
  await expect(
    experience.getByText('2021.12 — 2022.06', { exact: true }),
  ).toBeVisible();
  await expect(
    experience.getByText('190 → 14ms', { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/experience-content.png' });
});

test('project texture loads and the night room remains navigable', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  const preview = page.waitForResponse((response) =>
    response.url().endsWith('/assets/projects/smartoffer.webp'),
  );
  await page.goto('/');
  expect((await preview).ok()).toBe(true);
  await page.getByRole('button', { name: '작업실 둘러보기' }).click();
  await page.getByRole('button', { name: /LOCAL TIME/ }).click();
  const environment = page.getByRole('region', { name: 'window', exact: true });
  await environment.getByRole('button', { name: 'night', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: /LOCAL TIME · NIGHT/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '모니터에서 프로젝트 보기' }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/room-night.png' });
  await page.getByRole('button', { name: '모니터에서 프로젝트 보기' }).click();
  await expect(
    page.getByRole('region', { name: 'projects', exact: true }),
  ).toHaveAttribute('aria-busy', 'false');
});
