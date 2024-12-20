import cheerio from 'cheerio';

export const wrapContent = (content) => {
  if (!content) {
    return content;
  }

  const dom = cheerio.load(content);
  return dom('body').html();
};
