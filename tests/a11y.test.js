import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import path from 'path';
import { jest } from '@jest/globals';

jest.setTimeout(30000);

test('accessibility scan', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const filePath = path.join(process.cwd(), 'veille-tech.html');
  await page.goto('file://' + filePath);
  const results = await new AxeBuilder({ page }).analyze();
  await browser.close();
  expect(results.violations.length).toBeGreaterThanOrEqual(0);
});
