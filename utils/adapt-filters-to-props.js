export const mapFilterIdToSubject = {
  4: {subject: 'Биология'},
  11: {subject: 'Информатика'},
  13: {subject: 'История'},
  30: {subject: 'История'},
  31: {subject: 'История'},
  14: {subject: 'Литература'},
  2: {subject: 'Математика'},
  6: {subject: 'Русский язык'},
  3: {subject: 'География'},
  1: {subject: 'Алгебра'},
  46: {subject: 'Вероятность и стат.'},
  8: {subject: 'Геометрия'}
};

export const adaptFiltersToProps = (materialRes) => {
  return materialRes?.content?.map((item) => ({
    ...item
  }));
};
export const adaptItem = (item) => {
  const subjectName = item?.parent_subjects_name || '';
  return ({
    title: item?.name,
    subject: item?.subject_name || subjectName,
    classes: item?.school_class_id,
    link: item?.externalContentLink,
    subjectClass: subjectsNames[subjectName] || '',
    subjectLogo: `subject-${subjectsNames[subjectName]}`
  });
};

