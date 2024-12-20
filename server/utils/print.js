import puppeteer from 'puppeteer';
import {PDFDocument} from 'pdf-lib';
import axios from 'axios';
import nunjucks from 'nunjucks';
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {MathML} from 'mathjax-full/js/input/mathml.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import rawTemplates from './templates.js';
import {replaceUrls} from '~/utils/replace-urls.js';
import {truncate} from '~/utils/truncate.js';
import {parseCriteria, parseCriteriaMultiple, checkMultiTask} from '~/utils/parse-criteria.js';
import {parseAnswer} from '~/utils/parse-answer.js';
import {wrapContent} from '~/utils/wrap-content.js';
import {getParts} from '~/utils/get-parts.js';
import {sortTasks} from '~/utils/sort-tasks.js';
import {getNumsText} from '~/utils/get-nums-text.js';
import {getZeroPageTasks} from '~/utils/zero-page-utils.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const mathConverter = mathjax.document('', {InputJax: new MathML(), OutputJax: new SVG()});

nunjucks.configure({
  autoescape: true
});

const env = new nunjucks.Environment();
env.addFilter('process', (content) => processContent(content));

let templates;

const load = () => {
  if (!templates) {
    templates = {
      task: nunjucks.compile(rawTemplates.task, env),
      answers: nunjucks.compile(rawTemplates.answers, env),
      criteria: nunjucks.compile(rawTemplates.criteria, env),
      zeroPage: nunjucks.compile(rawTemplates.zeroPage, env),
      testTask: nunjucks.compile(rawTemplates.testTask, env),
      criteriaTask: nunjucks.compile(rawTemplates.criteriaTask, env)
    };
  }
};

const DEFAULT_OPTIONS = {
  format: 'A4',
  printBackground: true,
  margin: {
    top: '100px',
    right: '0',
    bottom: '50px',
    left: '0'
  },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div></div>'
};

const convertHTMLToPDF = async (html, options) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
    waitUntil: 'networkidle0'
  });

  await page.evaluate(() => {
    document.querySelectorAll('table').forEach((table) => {
      if (table.clientWidth > 650) {
        let fontSize = 16;

        do {
          fontSize--;
          table.style.fontSize = fontSize +'px';
          res = table.clientWidth;
        } while (table.clientWidth > 650 && fontSize > 8);
      }
    });
  });

  const pdf = await page.pdf(options);
  await browser.close();
  const pdfDoc = await PDFDocument.load(pdf);
  pdfDoc.setTitle(options.title);
  return await pdfDoc.save();
};

const fontFamily = `'PT Serif', 'Arial', 'Sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`;

const styles = `
  ${ptSerifFontFace}

  * {
    box-sizing: border-box;
  }

  body {
    font-size: 16px;
    font-family: ${fontFamily};
    margin: 0;
  }

  img {
    max-width: 100%;
  }

  svg {
    font-weight: 400;
  }

  hr {
    border: 0;
    border-top: 1px solid #000;
    margin: 1em 0;
  }

  table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
  }

  table tr {
    break-inside: avoid;
  }

  table td, table th {
    padding: 3px 5px;
    border: 1px solid #000;
  }

  table th {
    font-weight: bold;
    text-align: center;
  }

  table {
    margin: 0 0 1em;
  }

  table:last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0 0 1em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  .list > * {
    margin-bottom: 1em;
  }

  .list > *:last-child {
    margin-bottom: 0;
  }

  .task {
    width: 650px;
    overflow: hidden;
  }

  .task-answer {
    display: flex;
    align-items: center;
    break-inside: avoid;
  }

  .task-answer-cells {
    margin-left: 10px;
    width: auto;
  }

  .task-answer-cell {
    width: 25px;
    height: 1.5em;
    text-align: center;
  }

  .task-result {
    font-weight: bold;
  }

  .task-correctAnswer {
    text-align: center;
    break-before: page;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .task-criteria-score {
    width: 50px;
    text-align: center;
  }

  .test {
    width: 650px;
    overflow: hidden;
  }

  .test-part {
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
  }

  .test-instruction {
    margin-bottom: 30px;
    border: 1px solid #000;
    padding: 3px 5px;
    font-weight: bold;
    font-style: italic;
  }

  .test-task {
    padding-top: 4px;
    margin-bottom: 60px;
  }

  .test-task-info {
    position: absolute;
    margin-left: -50px;
    margin-top: -4px;
    width: 40px;
  }

  .test-task-num {
    padding: 3px 5px;
    text-align: center;
    font-weight: bold;
    border: 1px solid #000;
  }

  .test-task-tag {
    text-align: center;
    font-weight: bold;
    font-size: 10px;
    margin-top: 4px;
  }

  .zeroPage {
    margin-bottom: 60px;
  }

  .zeroPage-title {
    margin-bottom: 30px;
    font-weight: bold;
  }

  .test-correctAnswers {
    text-align: center;
    break-before: page;
    margin-bottom: 30px;
    font-weight: bold;
  }

  .test-correctAnswers-table-2 td {
    width: 50%;
  }

  .test-correctAnswers-table-4 td {
    width: 25%;
  }

  .test-criteria {
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
    break-before: page;
  }

  .test-task--break {
    break-inside: avoid;
    margin-bottom: 30px;
  }
`;

const getPage = (body) => {
  return `
    <!doctype html>
    <html
      <head>
        <meta charset="utf-8">
        <title>Задание</title>
        <style>
          ${styles}
        </style>
      </head>

      <body style="margin-left: 83px; margin-right: 57px;">
        ${body}
      </body>
    </html>
  `;
};

const getHeaderTemplate = (left, right) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <div style="margin: 25px 45px 0 62px; font-size: 9px; font-family: ${fontFamily}; display: flex; width: 100%;">
          <div style="width: 70%;">${left}</div>
          <div style="width: 30%; text-align: right;">${right} &nbsp;&nbsp;&nbsp;&nbsp;<span class="pageNumber"></span>/<span class="totalPages"></span></div>
        </div>
      </body>
    </html>
  `;
};

const alphabet = 'АБВГДЕЗЖИКЛМНОПРСТУФХЦЧШЦЪЫЬЭЮЯ';

const processContent = (content) => {
  content = content.replace(/width="\d+"/g, '');
  content = content.replace(/width="\d+%"/g, '');
  content = content.replace(/>\s+</g, '><');
  content = content.replace(/<source[^<>]*>/g, '');
  content = content.replace(/<audio[^<>]*>[^<>]*<\/audio>/g, '');
  content = content.replace(/lang="EN-US"/g, '');
  content = content.replace(/clear="all"/g, '');
  content = content.replace(/&nbsp;/g, ' ');
  content = content.replace(/<br[^<>]+>/g, '<br/>');
  content = content.replace(/ShowPicture\([^()]*\);/g, '');
  content = content.replace(/<p class=MsoNormal>\s*<\/p>/g, '<p class=MsoNormal>&nbsp;</p>');

  const mathTypeReg = /\sMathType@MTEF.*@\s/g;

  while (mathTypeReg.test(content)) {
    content = content.replace(mathTypeReg, '');
  }

  content = replaceUrls(content);

  const mathRegExp = /<math[^>]*>(.*?)<\/math>/;

  while (content.match(mathRegExp)) {
    const match = content.match(mathRegExp);
    const res = mathConverter.convert(match[0]);
    const svg = adaptor.innerHTML(res);

    content = content.replace(mathRegExp, svg);
  }

  content = wrapContent(content);
  return content;
};

const getResultHtml = (task, answer) => {
  if (answer) {
    switch (answer.result) {
      case 'correct':
        return '<div class="task-result">Верно</div>';
      case 'wrong':
        if (task.variants_multiple
          && answer.answer?.every((value) => task.answer.includes(value))
          && answer.answer?.length < task.answer?.length) {
          return '<div class="task-result">Верно! Но есть еще</div>';
        } else {
          return '<div class="task-result">Неверно</div>';
        }
      case 'scoring':
        return '<div class="task-result">Оценивается</div>';
    }
  }

  return '';
};

const getTaskHtml = async (task, answer = null, withCorrectAnswer = false, withZeroPage = false) => {
  return templates.task.render({
    alphabet,
    task,
    answer,
    result: getResultHtml(task, answer),
    withCorrectAnswer,
    withZeroPage,
    answerText: await getAnswerText(task),
    getGroupIndex: (task, answer, itemValue) => {
      const pair = answer.answer.find((pair) => pair[0] == itemValue);
      const groupValue = pair[1];
      const groupIndex = task.variants_groups.findIndex((group) => group.value === groupValue);
      return groupIndex + 1;
    },
    criteria: await getCriteriaHtml(task)
  });
};

const getAnswerText = async (task) => {
  if (task.type === 'GAP_MATCH_TABLE_ANSWER') {
    return task.answer.map((pair) => {
      const itemValue = pair[0];
      const groupValue = pair[1];
      const itemIndex = task.variants_items.findIndex((item) => item.value == itemValue);
      const groupIndex = task.variants_groups.findIndex((group) => group.value === groupValue);

      return alphabet[itemIndex] + ' - ' + (groupIndex + 1).toString();
    }).join(', ');
  } else if (task.type === 'FREE_ANSWER') {
    return await parseAnswer(task.criteria);
  } else {
    return task.answer.join(', ');
  }
};

const getAnswersHtml = async (tasks) => {
  if (!tasks.length) {
    return '';
  }

  const rows = [];
  const length = Math.ceil(tasks.length / 2);

  for (let i = 0; i < length; i++) {
    const row = [];

    const left = tasks[i * 2];
    const right = tasks[i * 2 + 1];

    row.push({
      num: left.order,
      content: left.answer ? await getAnswerText(left) : ''
    });

    if (right) {
      row.push({
        num: right.order,
        content: right.answer ? await getAnswerText(right) : ''
      });
    }

    rows.push(row);
  }

  return templates.answers.render({
    tasks,
    rows
  });
};

const getCriteriaHtml = async (task) => {
  if (!task.criteria) {
    return '';
  }
  const multiTask = await checkMultiTask(task);
  const parsed = multiTask.number
    ? await parseCriteriaMultiple(task, multiTask.number, Object.keys(multiTask.variants).length, true)
    : await parseCriteria(task.criteria);

  if (!Array.isArray(parsed)) {
    return '';
  }

  return templates.criteria.render({
    criteria: parsed,
    raw: parsed[0].list[0].raw,
    variants: task.variants.length > 0
  });
};

const getCriteriasHtml = async (tasks, tags = false, pageBreaks = false) => {
  if (!tasks.length) {
    return '';
  }

  let html = '<div class="test-criteria">Критерии оценивания выполнения заданий с развёрнутым ответом</div>';

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const pageBreak = i > 0 && pageBreaks && task.page_break;

    if (pageBreak) {
      html += '<div class="test-task--break">';
    }

    html += templates.criteriaTask.render({
      counter: task.order,
      tag: tags ? task.part_name : null,
      task: await getTaskHtml(task),      
      answer: await parseAnswer(task.criteria),
      criteria: await getCriteriaHtml(task)
    });

    if (pageBreak) {
      html += '</div>';
    }
  }

  return html;
};

const getZeroPageHtml = (zeroPageText, tasks) => {
  if (!zeroPageText || !tasks || !tasks.length) {
    return '';
  }

  const titleText = tasks.length > 1
    ? 'Ознакомьтесь с информацией и выполните задания ' + getNumsText(tasks.map((task) => task.order))
    : 'Ознакомьтесь с информацией и выполните задание ' + tasks[0].order;

  return templates.zeroPage.render({
    titleText,
    zeroPageText
  });
};

const getTasksInstructions = (tasks) => {
  let res = '';

  const nums = {};

  tasks.forEach((task) => {
    let type = task.type;

    if (type === 'CHOOSE_ANSWER' && task.variants_multiple) {
      type = 'CHOOSE_ANSWER_MULTIPLE';
    }

    if (type === 'GAP_MATCH_TEXT_ANSWER' || type === 'GAP_MATCH_TABLE_ANSWER') {
      type = 'ORDER_ANSWER';
    }

    if (Object.prototype.hasOwnProperty.call(nums, type)) {
      nums[type].push(task.order);
    } else {
      nums[type] = [task.order];
    }
  });

  if (nums['ENTER_ANSWER']) {
    res += `Ответом к ${nums['ENTER_ANSWER'].length > 1 ? 'заданиям' : 'заданию'} ${getNumsText(nums['ENTER_ANSWER'])} является слово (словосочетание).`;
  }

  if (nums['CHOOSE_ANSWER']) {
    if (res) {
      res += ' ';
    }

    res += `Ответом к ${nums['CHOOSE_ANSWER'].length > 1 ? 'заданиям' : 'заданию'} ${getNumsText(nums['CHOOSE_ANSWER'])} является одна цифра, которая соответствует номеру правильного ответа.`;
  }

  if (nums['CHOOSE_ANSWER_MULTIPLE']) {
    if (res) {
      res += ' ';
    }

    res += `Ответом к ${nums['CHOOSE_ANSWER_MULTIPLE'].length > 1 ? 'заданиям' : 'заданию'} ${getNumsText(nums['CHOOSE_ANSWER_MULTIPLE'])} являются несколько цифр, которые соответствуют номерам правильных ответов.`;
  }

  if (nums['ORDER_ANSWER']) {
    if (res) {
      res += ' ';
    }

    res += `Ответом к ${nums['ORDER_ANSWER'].length > 1 ? 'заданиям' : 'заданию'} ${getNumsText(nums['ORDER_ANSWER'])} является последовательность цифр. Последовательность цифр записывайте без пробелов, запятых и других дополнительных символов.`;
  }

  if (res) {
    res += ` ${tasks.length > 1 ? 'Ответы' : 'Ответ'} запишите в тексте работы.`;
  }

  if (nums['FREE_ANSWER']) {
    if (res) {
      res += ' ';
    }

    res += `Для ${nums['FREE_ANSWER'].length > 1 ? 'ответов на задания' : 'ответа на задание'} ${getNumsText(nums['FREE_ANSWER'])} запишите номер задания, а затем развёрнутый ответ на него. ${nums['FREE_ANSWER'].length > 1 ? 'Ответы' : 'Ответ'} записывайте чётко и разборчиво.`;
  }

  if (res) {
    res = `<div class="test-instruction">${res}</div>`;
  }

  return res;
};

const getTasksHtml = async (parts, answers, tags = false, pageBreaks = false) => {
  let html = '<div class="test">';

  const nonFreeAnswerList = [];
  const freeAnswerList = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    let currentZeroPageGuid = null;

    if (part.name) {
      html += `<div class="test-part">${part.name}</div>`;
    }

    html += getTasksInstructions(part.tasks);

    for (let j = 0; j < part.tasks.length; j++) {
      const task = part.tasks[j];

      if (task.type === 'FREE_ANSWER') {
        freeAnswerList.push(task);
      } else {
        nonFreeAnswerList.push(task);
      }

      const pageBreak = !(i === 0 && j === 0) && pageBreaks && task.page_break;

      if (pageBreak) {
        html += '<div class="test-task--break">';
      }

      if (task.zeropage_guid !== currentZeroPageGuid) {
        currentZeroPageGuid = task.zeropage_guid;

        if (task.zeropage_text) {
          html += getZeroPageHtml(task.zeropage_text, getZeroPageTasks(task, part.tasks));
        }
      }

      const answer = answers ? answers.find((a) => a.task_id === task.id) : null;

      html += templates.testTask.render({
        counter: task.order,
        tag: tags ? task.part_name : null,
        task: await getTaskHtml(task, answer)
      });

      if (pageBreak) {
        html += '</div>';
      }
    }
  }

  if (nonFreeAnswerList.length) {
    html += await getAnswersHtml(nonFreeAnswerList);
  }

  if (freeAnswerList.length) {
    html += await getCriteriasHtml(freeAnswerList, tags, pageBreaks);
  }

  html += '</div>';
  return html;
};

export const printTask = async (id, withCorrectAnswer = true) => {
  load();
  let task;

  const response = await axios.request({
    url: `/api/task/${id}`,
    baseURL: process.env.SITE_URL,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    maxRedirects: 0
  });

  if (response.data.done) {
    task = response.data.task;

    if (task.answer) {
      task.answer = JSON.parse(task.answer);
    }
  }

  const html = getPage(await getTaskHtml(task, null, withCorrectAnswer, true));
  const title = `Задание ${task.id}. Тема: «${task.topic_name}»`;

  return await convertHTMLToPDF(html, {
    ...DEFAULT_OPTIONS,
    title,
    headerTemplate: getHeaderTemplate(truncate(title, 130), `${task.subject_name}, ${task.parallel_id} класс.`),
    timeout: 0
  });
};

export const printTopic = async (id, selectedTasks) => {
  load();
  let topic;

  let response = await axios.request({
    url: `/api/topics/${id}`,
    baseURL: process.env.SITE_URL,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    maxRedirects: 0
  });

  if (response.data.done) {
    topic = response.data.topic;
  }

  response = await axios.request({
    url: `/api/topics/${id}/tasks`,
    baseURL: process.env.SITE_URL,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    maxRedirects: 0
  });

  if (response.data.done) {
    topic.tasks = response.data.tasks.map((task) => {
      if (task.answer) {
        task.answer = JSON.parse(task.answer);
      }

      return task;
    });
  }

  topic.tasks = topic.tasks.filter((task) => {
    return selectedTasks.find((id) => id == task.id);
  });

  const tasks = sortTasks(topic.tasks, 'zeroPage');
  const parts = [{name: null, num: null, tasks}];
  const html = getPage(await getTasksHtml(parts, null, true));
  const title = `Задания на тему: «${topic.name}»`;

  return await convertHTMLToPDF(html, {
    ...DEFAULT_OPTIONS,
    title,
    headerTemplate: getHeaderTemplate(truncate(title, 130), `${topic.subject_name}, ${topic.parallel_id} класс.`),
    timeout: 0
  });
};

export const printTest = async (id, answers) => {
  load();
  let test;

  let response = await axios.request({
    url: `/api/test/${id}`,
    baseURL: process.env.SITE_URL,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    maxRedirects: 0
  });

  if (response.data.done) {
    test = response.data.test;
  }

  response = await axios.request({
    url: `/api/test/${id}/tasks`,
    baseURL: process.env.SITE_URL,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    maxRedirects: 0
  });

  if (response.data.done) {
    test.tasks = response.data.tasks.map((task) => {
      if (task.answer) {
        task.answer = JSON.parse(task.answer);
      }

      return task;
    });
  }

  const tasks = sortTasks(test.tasks, test.type === 'demovariant' ? 'parts' : 'zeroPage');
  const parts = test.type === 'demovariant'
    ? getParts(tasks)
    : [{name: null, num: null, tasks}];
  const html = getPage(await getTasksHtml(parts, answers, test.type !== 'demovariant', test.type === 'demovariant'));
  const title = `Тест «${test.name}»`;

  return await convertHTMLToPDF(html, {
    ...DEFAULT_OPTIONS,
    title,
    headerTemplate: getHeaderTemplate(truncate(title, 130), `${test.subject}, ${test.parallel_id} класс.`),
    timeout: 0
  });
};
