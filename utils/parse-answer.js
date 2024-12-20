import cheerio from 'cheerio';

const getChildren = (el) => {
  return el.children.filter((child) => child.type === 'tag');
};

export const parseAnswer = async (content) => {
  if (!content) {
    return content;
  }

  const dom = cheerio.load(content);
  const table = dom('table');

  if (!table) {
    return null;
  }

  const rows = Array.from(table.find('tr'));
  const res = [];

  rows.forEach((row) => {
    const rowChildren = getChildren(row);

    if (rowChildren.length === 1) {
      res.push(dom(rowChildren[0]).html());
    }
  });

  return res.length ? res.join('<div></div>') : null;
};
