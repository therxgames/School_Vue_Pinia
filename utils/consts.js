export const topicSteps = {
  SELECTION: 'selection',
  INTERACTION: 'interaction',
  RESULT: 'result'
};

const attestations = {
  oge: 'ОГЭ',
  vpr: 'ВПР'
};

const complexities = {
  simple: 'Базовая',
  medium: 'Средняя',
  complex: 'Углубленная'
};

const roles = {
  admin: 'Администратор',
  student: 'Обучающийся',
  user: 'Пользователь ЦОС'
};

const subjects = {
  'История': 'history',
  'Биология': 'biology',
  'Информатика и ИКТ': 'informatics',
  'Литература': 'literature',
  'Математика': 'maths',
  'Русский язык': 'russian'
};

const contentTypes = {
  task: 'задание',
  test: 'тест'
};

const registerSource = {
  '1': 'Моя школа',
  '2': 'ВК'
};

const taskTypes = {
  ENTER_ANSWER: 'Ввести ответ',
  CHOOSE_ANSWER: 'Выбрать ответ',
  FREE_ANSWER: 'Свободный ответ',
  TABLE_ANSWER: 'Таблица',
  ORDER_ANSWER: 'Расположить по порядку',
  GAP_MATCH_TEXT_ANSWER: 'Вставить пропущенное',
  GAP_MATCH_TABLE_ANSWER: 'Установить соответствие'
};

export const taskType = {
  ENTER_ANSWER: 'ENTER_ANSWER',
  CHOOSE_ANSWER: 'CHOOSE_ANSWER',
  FREE_ANSWER: 'FREE_ANSWER',
  TABLE_ANSWER: 'TABLE_ANSWER',
  ORDER_ANSWER: 'ORDER_ANSWER',
  GAP_MATCH_TEXT_ANSWER: 'GAP_MATCH_TEXT_ANSWER',
  GAP_MATCH_TABLE_ANSWER: 'GAP_MATCH_TABLE_ANSWER'
};

export const parallel = {
  CLASS_5: 5,
  CLASS_6: 6,
  CLASS_7: 7,
  CLASS_8: 8,
  CLASS_9: 9
};

export const attestation = {
  VPR: 'vpr',
  OGE: 'oge'
};

export const answerResult = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  SCORING: 'scoring'
};

export const passingTestMode = {
  TRAINING: 'training',
  CONTROL: 'control'
};

export const rolesList = [
  {
    id: 1,
    name: 'admin',
    short: 'Администратор',
    description: 'Администратор Сервиса ЦПУ'
  },
  {
    id: 2,
    name: 'user',
    short: 'Методист',
    description: 'Пользователь ЦОС (цифровой образовательной системы)'
  },
  {
    id: 3,
    name: 'student',
    short: 'Обучающийся',
    description: 'Обучающийся'
  }
];

export const passingTestStatusId = {
  'START': 0,
  'CONTINUE': 1,
  'FINISHED': 2,
  'UNAVAILABLE': 3
};

export const authSource = {
  ETD: 'etd',
  VK_ID: 'vk_id'
};

export const testAction = {
  PAUSE: 'pause',
  FORCE_COMPLETION: 'force_completion',
  COMPLETION: 'completion'
};

export const role = {
  ADMIN: 'admin',
  STUDENT: 'student',
  USER: 'user'
};

export const solutionStatus = {
  WRONG: 'wrong',
  WRONG_AFTER_CONTROL_CORRECT: 'wrong_after_control_correct',
  TRAINING_CORRECT: 'training_correct',
  CONTROL_CORRECT: 'control_correct',
  NONE: 'none'
};

export const lexicon = {
  errors: {
    oge_class_wrong: 'ОГЭ проводится только в 9 классе',
    vpr_class_wrong: 'ВПР не проводится в 9 классе'
  },
  common: {
    task_change_the_filter: 'Для просмотра заданий измените фильтр',
    try_changing_search_criteria: 'Попробуйте изменить критерии поиска',
    reset_filters: 'Сбросить фильтры',
    no_title: 'Нет названия'
  },
  decl: {
    peoples: ['человек', 'человека', 'человек'],
    passed: ['проходил', 'проходили', 'проходило'],
    viewed: ['просмотрел', 'просмотрели', 'просмотрело'],
    tasks: ['задание', 'задания', 'заданий'],
    tests: ['тест', 'теста', 'тестов'],
    variants: ['вариант', 'варианта', 'вариантов'],
    answers: ['вопрос', 'вопроса', 'вопросов'],
    points: ['балл', 'балла', 'баллов']
  },
  tpl: {
    toggleFavoriteDone(id, type, isFavorite) {
      if (type === 'task') {
        return isFavorite
          ? `Задание <b>#${id}</b> добавлено в избранное`
          : `Задание <b>#${id}</b> удалено из избранного`;
      } else if (type === 'test') {
        return isFavorite
          ? `Тест <b>#${id}</b> добавлен в избранное`
          : `Тест <b>#${id}</b> удален из избранного`;
      }
    },
    toggleFavoriteError(id, type, isFavorite) {
      if (type === 'task') {
        return isFavorite
          ? `Ошибка добавления задания <b>#${id}</b> в избранное`
          : `Ошибка удаления задания <b>#${id}</b> из избранного`;
      } else if (type === 'test') {
        return isFavorite
          ? `Ошибка добавления теста <b>#${id}</b> в избранное`
          : `Ошибка удаления теста <b>#${id}</b> из избранного`;
      }
    },
    toggleArchiveDone(id, inArchive) {
      return inArchive
        ? `Тест <b>#${id}</b> добавлен в архив`
        : `Тест <b>#${id}</b> убран из архива`;
    },
    toggleArchiveError(id, inArchive) {
      return inArchive
        ? `Ошибка добавления теста <b>#${id}</b> в архив`
        : `Ошибка удаления теста <b>#${id}</b> из архива`;
    },
    toggleCollectionDone(id, inCollection) {
      return inCollection
        ? `Тест <b>#${id}</b> добавлен в «Мои тесты»`
        : `Тест <b>#${id}</b> убран из набора «Мои тесты»`;
    },
    toggleCollectionError(id, inCollection) {
      return inCollection
        ? `Ошибка добавления теста <b>#${id}</b> в «Мои тесты»`
        : `Ошибка удаления теста <b>#${id}</b> из набора «Мои тесты»`;
    }
  }
};

export const methodGet = {
  method: 'GET'
};

export const methodPost = {
  method: 'POST'
};

export const methodPut = {
  method: 'PUT'
};

export const methodPatch = {
  method: 'PATCH'
};

export const methodDelete = {
  method: 'DELETE'
};

export const publishStatus = {
  PUBLISH: 2,
  UNPUBLISH: 3
};

export const subjectsNames = {
  'Биология': 'biology',
  'Химия': 'chemistry',
  'Немецкий язык': 'german',
  'Английский язык': 'english',
  'Французский язык': 'french',
  'География': 'geography',
  'История': 'history',
  'Информатика': 'informatics',
  'Литература': 'literature',
  'Математика': 'maths',
  'Физика': 'physics',
  'Русский язык': 'russian',
  'Обществознание': 'social',
  'Испанский язык': 'spanish'
};

export const attestationToName = (id) => attestations[id];

export const complexityToName = (id) => complexities[id];

export const roleToName = (id) => roles[id];

export const subjectToId = (name) => subjects[name];

export const contentTypeToName = (id) => contentTypes[id];

export const taskTypeToName = (id) => taskTypes[id];

export const registerSourceToName = (id) => registerSource[id.toString()];

export const pageTitle = (title) => ({
  titleTemplate: (baseTitle) => `${title}`
});

export const pageDescription = (description) => ({
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description}
  ]
});

export const alertContentProps = () => ({
  data: {
    type: Object,
    default() {
      return {};
    }
  },
  context: {
    type: Object,
    required: true
  }
});


