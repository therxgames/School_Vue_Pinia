import cheerio from 'cheerio';

const getChildren = (el) => {
  return el.children.filter((child) => child.type === 'tag');
};

export const parseCriteria = async (content) => {
  if (!content) {
    return content;
  }

  content = content.replace(/<\/?script[^<>]*>/g, '');

  const dom = cheerio.load(content);
  let criteriaTable = dom('body');
  const tables = dom('table');

  if (tables?.length > 1) {
    const targetTable = Array.from(tables).find((t) => dom(t).html().includes('Указания по оцениванию'));

    if (targetTable) {
      criteriaTable = dom(targetTable);
    }
  }

  let td = criteriaTable.find('table td:nth-child(2)');

  if (!td) {
    return content;
  }

  const table = td.closest('table');

  if (!table) {
    return content;
  }

  const multiTr = td.closest('tr')[0];
  const rows = Array.from(table.find('tr'));
  const index = rows.indexOf(multiTr);

  const res = [];

  let currentMaxScore = 0;

  let group = {
    list: [],
    number: null,
    maxScore: 0,
    instructions: null
  };

  let current = {
    id: 0,
    name: null,
    variants: [],
    note: null
  };

  let variant;
  let note;

  for (let i = index; i < rows.length; i++) {
    const row = rows[i];
    const rowChildren = getChildren(row);

    if (rowChildren.length < 2) {
      continue;
    }

    let contentCell;
    let scoreCell;

    if (rowChildren.length === 3) {
      contentCell = rowChildren[1];
      scoreCell = rowChildren[2];
    } else if (rowChildren.length === 2) {
      contentCell = rowChildren[0];
      scoreCell = rowChildren[1];
    } else {
      continue;
    }

    const scoreText = dom(scoreCell).text().trim();
    const score = parseInt(scoreText);

    if (Number.isInteger(score)) {
      if (variant) {
        current.variants.push(variant);
      }

      variant = {
        content: dom(contentCell).html(),
        score
      };

      if (score > currentMaxScore) {
        currentMaxScore = score;
      }
    } else {
      const text = dom(contentCell).text();
      const match = text.match(/[1-9]\.([1-9])/);

      if (match) {
        group.number = match[1];
      } else if (!scoreText.toLowerCase().includes('баллы')) {
        if (!current.name && dom(contentCell).find('b:first-child')) {
          current.name = dom(contentCell).html();
        } else {
          if (variant) {
            variant.content += '<div></div>' + dom(contentCell).html() + '<div></div>' + dom(scoreCell).html();
          } else {
            note = dom(contentCell).html();
          }
        }
      }
    }

    if (score === 0) {
      if (note) {
        current.note = note;
      }

      if (variant) {
        current.variants.push(variant);
      }

      group.list.push(current);
      group.maxScore += currentMaxScore;
      currentMaxScore = 0;

      current = {
        id: current.id + 1,
        name: null,
        variants: [],
        note: null
      };

      variant = undefined;
      note = undefined;

      const nextRow = rows[i + 1];

      let next = false;

      if (nextRow) {
        const nextRowChildren = getChildren(nextRow);
        const scoreCell = nextRowChildren[nextRowChildren.length - 1];
        const score = parseInt(dom(scoreCell).text().trim());

        if (Number.isInteger(score)) {
          next = true;
        }
      } else {
        next = true;
      }

      if (next) {
        let instructions = '';
        let stop = false;
        const table = dom(row).closest('table');
        let next = table;

        do {
          next = next.next();
          const text = dom(next).text();
          const textTable = text.trim().match(/Таблица \d+/);
          const includesNumber = text.match(/[1-9]\.([1-9])/);

          if (!next.length || textTable || includesNumber || next[0].name.toLowerCase() === 'table') {
            stop = true;
          } else {
            if (text.trim() && (text.length !== 1 || text.charCodeAt(0) !== 160)) {
              instructions += next.prop('outerHTML');
            }
          }
        } while (!stop);

        if (instructions) {
          group.instructions = instructions;
        }

        i++;
        res.push(group);

        group = {
          list: [],
          number: null,
          maxScore: 0,
          instructions: null
        };
      }
    }
  }

  return res;
};

export const parseCriteriaMultiple = async (task, taskNumber, count, print = false) => {
  const dom = cheerio.load(task.criteria);
  const res = [];
  let maxScore = 0;
  const regAnswers = new RegExp(`<span>[${taskNumber}]\.[1-9]<\/span>`, 'g');
  const regCriterias = new RegExp(`<p[^>]*><span>[${taskNumber}]\.[1-9]<`, 'g');
  const answers = task.criteria.match(regAnswers);
  const criterias = task.criteria.match(regCriterias);
  if (answers) {
    answers.forEach((a) => {
      const name = a.match(/\d\.\d/)[0];
      const el = dom(`span:contains(${name})`);
      const tr = el.closest('tr');
      const td = tr.find('td p span');
      const answer = dom(td[1]).text();
      if (answer?.length) {
        const current = {
          id: res.length,
          name: `Задание ${name}`,
          note: null,
          variants: [
            {
              content: `<p class="MsoNormalCxSpMiddle">Вы ответили "${answer}"<span></span></p>`,
              score: 1
            },
            {
              content: '<p class="MsoNormalCxSpMiddle">Была допущена ошибка<span></span></p>',
              score: 0
            }
          ]
        };
        res.push(current);
        maxScore++;
      }
    });
  }
  if (criterias) {
    await criterias.forEach(async (c) => {
      const name = c.match(/\d\.\d/)[0];
      const el = dom(`p:contains(${name})`).next();
      if (el[0]?.type === 'tag' && el[0].name === 'table' && el.html().includes('Баллы')) {
        const taskCriteria = await parseCriteria(`<table>${el.html()}</table>`);
        const item = Array.isArray(taskCriteria) && taskCriteria.length ? taskCriteria[0].list[0] : null;

        const current = {
          id: res.length,
          name: `Задание ${name}`,
          note: item ? item.note : null,
          variants: item ? item.variants : []
        };
        res.push(current);
        maxScore += item ? Math.max(...item.variants.map((v) => v.score)) : 0;
      }
    });
  }
  const defaultRes = {
    id: 0,
    name: null,
    note: task.criteria,
    raw: true,
    variants: [
      {
        content: '<p class="MsoNormalCxSpMiddle">Все ответы верные<span></span></p>',
        score: 1
      },
      {
        content: '<p class="MsoNormalCxSpMiddle">Были допущены ошибки<span></span></p>',
        score: 0
      }
    ]
  };

  const list = res.length !== count
    ? [defaultRes]
    : res.sort((a, b) => +a.name[a.name.length - 1] - +b.name[b.name.length - 1]);
  if (res.length === count && print) {
    list.forEach((el) => {
      const item = el;
      item.name = `<b>${el.name}</b>`;
      return item;
    });
  }
  maxScore = res.length !== count ? 1 : maxScore;

  return [{
    list,
    number: null,
    maxScore,
    instructions: null
  }];
};

export const checkMultiTask = async (task) => {
  const {question, criteria} = task;
  let multiTask = null;
  const regQuestions = /<p[^>]*>[1-9]\.[1-9]\.\s[^<]*/g;
  const regQuestion = /<p[^>]*>(?<task>[1-9])\.(?<number>[1-9])\.\s(?<question>[^<]*)/;
  const questions = question.match(regQuestions);
  const regAnswers = />([1-9](?:(<\/span><\/b><b(?:(\s>)|(>))<span>\.)|(\.))[1-9])[^<]*/g;
  const regAnswer = /(?<task>[1-9])[^\.]*\.(?<number>[1-9])/;
  const answers = criteria.match(regAnswers);
  const multiTasks = {};
  if (questions && answers && questions?.length === answers?.length) {
    questions.forEach((q) => {
      const variant = q.match(regQuestion);
      const {task, number, question} = variant.groups;
      if (multiTask === null) {
        multiTask = +task;
      } else if (multiTask !== +task) {
        multiTask = false;
      }
      multiTasks[number] = question;
    });
    answers.forEach((a) => {
      const answer = a.match(regAnswer);
      const {task, number} = answer.groups;
      if (+task !== multiTask || !multiTasks[number]) {
        multiTask = false;
      }
    });
  }
  return {number: multiTask, variants: multiTasks};
};
