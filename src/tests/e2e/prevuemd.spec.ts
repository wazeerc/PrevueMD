/// <reference types="node" />
import { expect, test } from '@playwright/test';

test('should display the correct title', async ({ page }) => {
  await page.goto('/');
  const title = page.getByRole('link', { name: 'PrevueMD' });

  await expect(title).toBeVisible();
});

test('should capture markdown input properly', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');

  await markdownEditor.fill(mockMarkdownText);

  expect(await markdownEditor.inputValue()).toBe(mockMarkdownText);
});

test('should display editor word and character counts', async ({ page }) => {
  await page.goto('/');
  const markdownEditor = page.locator('textarea');

  await markdownEditor.fill('# Hello World');

  await expect(page.getByText('(3 words, 13 characters)')).toBeVisible();
});

test('should parse markdown input into correct markup', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';
  const parsedMockMarkdownHtml = '<h1>Hello, World!</h1>';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const markdownPreview = page.locator('.prose-markdown');

  await markdownEditor.fill(mockMarkdownText);

  await expect(markdownPreview).not.toBeEmpty();
  expect(await markdownPreview.innerHTML()).toContain(parsedMockMarkdownHtml);
});

test('should not show preview loader for small markdown input', async ({ page }) => {
  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const renderingLoader = page.locator('[role="status"][aria-label="Rendering preview"]');

  await markdownEditor.fill('# Hello, World!');

  await expect(renderingLoader).toHaveCount(0);
});

test('should not show preview loader when re-pasting cached large markdown', async ({ page }) => {
  const largeMarkdown = `# Cached Markdown\n\n${'Cached repeated content.\n\n'.repeat(220)}`;

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const renderingLoader = page.locator('[role="status"][aria-label="Rendering preview"]');
  const markdownPreview = page.locator('.prose-markdown').first();
  const resetBtn = page.locator('button[aria-label="reset Icon"]');

  await markdownEditor.fill(largeMarkdown);
  await expect(markdownPreview).toContainText('Cached repeated content.');

  await resetBtn.click();
  await markdownEditor.fill(largeMarkdown);

  await expect(renderingLoader).toHaveCount(0);
  await expect(markdownPreview).toContainText('Cached repeated content.');
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
  const mockNow = 946684800000;
  await page.addInitScript(`{
    Date.now = () => ${mockNow};
  }`);
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const downloadBtn = page.locator('button[aria-label="download Icon"]');

  await markdownEditor.fill(mockMarkdownText);

  const downloadPromise = page.waitForEvent('download');
  await downloadBtn.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe(`prevued-${mockNow}.md`);
});

test('should import markdown file and populate editor', async ({ page }) => {
  const mockMarkdownText = '# Imported Markdown';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('button[aria-label="upload Icon"]').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: 'test.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from(mockMarkdownText),
  });

  await expect(markdownEditor).toHaveValue(mockMarkdownText);
});

test('should parse imported markdown into correct markup', async ({ page }) => {
  const mockMarkdownText = '# Imported Markdown';
  const parsedHtml = '<h1>Imported Markdown</h1>';

  await page.goto('/');
  const markdownPreview = page.locator('.prose-markdown');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('button[aria-label="upload Icon"]').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: 'test.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from(mockMarkdownText),
  });

  await expect(markdownPreview).not.toBeEmpty();
  expect(await markdownPreview.innerHTML()).toContain(parsedHtml);
});

test('should have manifest and service worker for pwa', async ({ page }) => {
  await page.goto('/');

  await expect.poll(() => page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      return !!registration;
    }
    return false;
  })).toBeTruthy();

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

test('should not show loader inside maximized preview', async ({ page }) => {
  const mockMarkdownText = '# Hello, World!';

  await page.goto('/');
  const markdownEditor = page.locator('textarea');
  const markdownPreview = page.locator('.prose-markdown').first();

  await markdownEditor.fill(mockMarkdownText);
  await expect(markdownPreview).toContainText('Hello, World!');

  const maximizeBtn = page.locator('button[aria-label="maximize Icon"]');
  await maximizeBtn.click();

  const markdownPreviewModal = page.locator('div[role="dialog"]');
  await expect(markdownPreviewModal).toBeVisible();
  await expect(markdownPreviewModal.getByRole('status', { name: /rendering preview/i })).toHaveCount(0);
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

test.describe('Fullscreen preview focus management', () => {
  test('should focus close button when modal opens', async ({ page }) => {
    await page.goto('/');
    await page.locator('textarea').fill('# Focus Test');

    await page.locator('button[aria-label="maximize Icon"]').click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(page.locator('button[aria-label="minimize Icon"]')).toBeFocused();
  });

  test('should close modal on Escape and restore focus', async ({ page }) => {
    await page.goto('/');
    await page.locator('textarea').fill('# Escape Test');

    const maximizeBtn = page.locator('button[aria-label="maximize Icon"]');
    await maximizeBtn.click();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('div[role="dialog"]')).not.toBeVisible();
    await expect(maximizeBtn).toBeFocused();
  });

  test('should set and remove inert on #app', async ({ page }) => {
    await page.goto('/');
    await page.locator('textarea').fill('# Inert Test');

    const maximizeBtn = page.locator('button[aria-label="maximize Icon"]');
    await maximizeBtn.click();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    expect(await page.evaluate(() => document.getElementById('app')?.hasAttribute('inert'))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(page.locator('div[role="dialog"]')).not.toBeVisible();
    expect(await page.evaluate(() => document.getElementById('app')?.hasAttribute('inert'))).toBe(false);
  });

  test('should lock and restore body scroll', async ({ page }) => {
    await page.goto('/');
    await page.locator('textarea').fill('# Scroll Test');

    await page.locator('button[aria-label="maximize Icon"]').click();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(page.locator('div[role="dialog"]')).not.toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });
});
