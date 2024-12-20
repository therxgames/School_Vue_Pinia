export const mapSubjectNamesToProps = {
  'русский язык': {
    subjectLogo: 'subject-russian',
    subjectClass: 'russian'
  },
  'математика': {
    subjectLogo: 'subject-maths',
    subjectClass: 'maths'
  },
  'история': {
    subjectLogo: 'subject-history',
    subjectClass: 'history'
  },
  'биология': {
    subjectLogo: 'subject-biology',
    subjectClass: 'biology'
  },
  'обществознание': {
    subjectLogo: 'subject-social',
    subjectClass: 'social'
  },
  'география': {
    subjectLogo: 'subject-geography',
    subjectClass: 'geography'
  },
  'физика': {
    subjectLogo: 'subject-physics',
    subjectClass: 'physics'
  },
  'английский язык': {
    subjectLogo: 'subject-english',
    subjectClass: 'english'
  },
  'французский язык': {
    subjectLogo: 'subject-french',
    subjectClass: 'french'
  },
  'немецкий язык': {
    subjectLogo: 'subject-german',
    subjectClass: 'german'
  },
  'испанский язык': {
    subjectLogo: 'subject-spanish',
    subjectClass: 'spanish'
  },
  'химия': {
    subjectLogo: 'subject-chemistry',
    subjectClass: 'chemistry'
  },
  'информатика и ИКТ': {
    subjectLogo: 'subject-informatics',
    subjectClass: 'informatics'
  },
  'литература': {
    subjectLogo: 'subject-literature',
    subjectClass: 'literature'
  },
  'информатика': {
    subjectLogo: 'subject-informatics',
    subjectClass: 'informatics'
  },
  'алгебра': {
    subjectLogo: 'subject-maths',
    subjectClass: 'maths'
  },
  'вероятность и стат.': {
    subjectLogo: 'subject-maths',
    subjectClass: 'maths'
  },
  'геометрия': {
    subjectLogo: 'subject-maths',
    subjectClass: 'maths'
  },
  'история россии': {
    subjectLogo: 'subject-history',
    subjectClass: 'history'
  }
};

export const adaptItemsForTask = (item) => {
  const subjectName = item?.parent_subjects_name || '';
  return (
    {
      title: item.name,
      subject: item.subject_name || subjectName,
      classes: item.school_class_id,
      link: item.externalContentLink,
      subjectClass: subjectsNames[subjectName] || '',
      subjectLogo: `subject-${subjectsNames[subjectName]}`
    });
};

export const adaptItemsForTest = (item) => {
  const subjectName = item?.parent_subjects_name || '';
  return (
    {
      title: item.name,
      subject: item.subject_name || subjectName,
      classes: item.school_class_id,
      link: item.externalContentLink,
      subjectClass: subjectsNames[subjectName] || '',
      subjectLogo: `subject-${subjectsNames[subjectName]}`
    });
};

export const adaptMaterialToProps = (res) => {
  return res?.content?.map((item) => ({
    ...item
  }));
};
