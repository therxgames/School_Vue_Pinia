export const mapNamesToProps = {
  'русский язык': {
    backgroundColor: '#F1DDEC',
    subjectPic: 'subject-russian'
  },
  'математика': {
    backgroundColor: '#EDDDE0',
    subjectPic: 'subject-maths'
  },
  'история': {
    backgroundColor: '#FFF3C7',
    subjectPic: 'subject-history'
  },
  'биология': {
    backgroundColor: '#D7F9D4',
    subjectPic: 'subject-biology'
  },
  'обществознание': {
    backgroundColor: '#FFE6D4',
    subjectPic: 'subject-social'
  },
  'география': {
    backgroundColor: '#E9F4D1',
    subjectPic: 'subject-geography'
  },
  'физика': {
    backgroundColor: '#BBEBE8',
    subjectPic: 'subject-physics'
  },
  'английский язык': {
    backgroundColor: '#FFDBDC',
    subjectPic: 'subject-english'
  },
  'французский язык': {
    backgroundColor: '#FCCECF',
    subjectPic: 'subject-french'
  },
  'немецкий язык': {
    backgroundColor: '#FCD5DE',
    subjectPic: 'subject-german'
  },
  'испанский язык': {
    backgroundColor: '#FFC6E8',
    subjectPic: 'subject-spanish'
  },
  'химия': {
    backgroundColor: '#B5F2E3',
    subjectPic: 'subject-chemistry'
  },
  'информатика и ИКТ': {
    backgroundColor: '#C7ECF6',
    subjectPic: 'subject-informatics'
  },
  'литература': {
    backgroundColor: '#F0DEE0',
    subjectPic: 'subject-literature'
  },
  'информатика': {
    backgroundColor: '#D2E6F4',
    subjectPic: 'subject-informatics'
  }
};

export const adaptPic = (item) => {
  return {
    subjectName: item.name,
    ...mapNamesToProps[item.name.toLowerCase()]
  };
};
