import fs from 'fs';
import * as cheerio from 'cheerio';

test('veille section snapshot', () => {
  const html = fs.readFileSync('veille-tech.html', 'utf8');
  const $ = cheerio.load(html);
  const article = $('article.veille-ia');
  expect(article.html().trim()).toMatchSnapshot();
});
