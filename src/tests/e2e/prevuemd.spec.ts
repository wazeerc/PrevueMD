import { expect, test } from '@playwright/test';

test('should display the correct title', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('h1');

  await expect(title).toContainText('PrevueMD');
});

test('should capture markdown input properly', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');

  await markdownEditor.fill(mockMarkdownText);

  expect(await markdownEditor.inputValue()).toBe(mockMarkdownText);
});

test('should parse markdown input into correct markup', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';
  const parsedMockMarkdownHtml = '<h1>Hello, World!</h1>';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const markdownPreview = page.locator('.prose');

  await markdownEditor.fill(mockMarkdownText);

  await expect(markdownPreview).not.toBeEmpty();
  expect(await markdownPreview.innerHTML()).toContain(parsedMockMarkdownHtml);
});

test('should reset markdown editor when reset button is clicked', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const resetBtn = page.locator('button[aria-label="reset Icon"]');

  await markdownEditor.fill(mockMarkdownText);
  await resetBtn.click();

  expect(await markdownEditor.inputValue()).toBe('');
});

test('should copy markdown to clipboard when copy button is clicked', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const copyBtn = page.locator('button[aria-label="clipboard Icon"]');

  await markdownEditor.fill(mockMarkdownText);
  await copyBtn.click();
  await page.waitForTimeout(251);

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(mockMarkdownText);
});

test('should download markdown file when download button is clicked', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const downloadBtn = page.locator('button[aria-label="download Icon"]');

  await markdownEditor.fill(mockMarkdownText);

  const downloadPromise = page.waitForEvent('download');
  await downloadBtn.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('prevued.md');
});

test('should have manifest and service worker for pwa', async ({ page }) => {
  await page.goto('/');

  const serviceWorkerRegistration = await page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      return !!registration;
    }
    return false;
  });

  expect(serviceWorkerRegistration).toBeTruthy();

  const manifestLink = await page.$('link[rel="manifest"]');
  expect(manifestLink).toBeTruthy();
});

test('should open preview in maximized mode when maximize button is clicked', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  await markdownEditor.fill(mockMarkdownText);

  const maximizeBtn = page.locator('button[aria-label="maximize Icon"]');
  await maximizeBtn.click();

  const markdownPreviewModal = page.locator('div[role="dialog"]');
  await expect(markdownPreviewModal).toBeVisible();
});

test('should toggle theme from dark to light when theme button is clicked', async ({ page }) => {
  await page.goto('/');
  
  // Check initial state (dark mode)
  const htmlElement = page.locator('html');
  await expect(htmlElement).toHaveClass(/dark/);
  
  // Click theme toggle button (should be sun icon initially)
  const themeToggleBtn = page.locator('button[aria-label="sun Icon"]');
  await themeToggleBtn.click();
  
  // Check that theme switched to light mode
  await expect(htmlElement).not.toHaveClass(/dark/);
  
  // Check that button now shows moon icon
  const moonBtn = page.locator('button[aria-label="moon Icon"]');
  await expect(moonBtn).toBeVisible();
});

test('should toggle theme from light to dark when theme button is clicked', async ({ page }) => {
  await page.goto('/');
  
  // First switch to light mode
  const sunBtn = page.locator('button[aria-label="sun Icon"]');
  await sunBtn.click();
  
  // Now switch back to dark mode
  const moonBtn = page.locator('button[aria-label="moon Icon"]');
  await moonBtn.click();
  
  // Check that theme switched back to dark mode
  const htmlElement = page.locator('html');
  await expect(htmlElement).toHaveClass(/dark/);
  
  // Check that button now shows sun icon again
  await expect(sunBtn).toBeVisible();
});

test('should persist theme preference in localStorage', async ({ page }) => {
  await page.goto('/');
  
  // Switch to light mode
  const themeToggleBtn = page.locator('button[aria-label="sun Icon"]');
  await themeToggleBtn.click();
  
  // Check localStorage
  const themeValue = await page.evaluate(() => localStorage.getItem('theme'));
  expect(themeValue).toBe('light');
  
  // Reload page
  await page.reload();
  
  // Check that light mode persisted
  const htmlElement = page.locator('html');
  await expect(htmlElement).not.toHaveClass(/dark/);
});
