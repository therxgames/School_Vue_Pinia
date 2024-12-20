export const generateString = (length = 10, useNumbers= true) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  if (useNumbers) {
    characters += '0123456789';
  }

  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const generateNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateFloat = (min, max) => {};

export class IdGenerator {
  ids = []

  addId(newId) {
    if (newId && this.ids.indexOf(newId) === -1) {
      this.ids.push(newId);
    }
  }

  addIds(newIds) {
    if (newIds) {
      newIds.forEach((id) => {
        this.addId(id);
      });
    }
  }

  removeId(removingId) {
    if (removingId) {
      let index = this.ids.indexOf(removingId);

      if (index !== -1) {
        this.ids.splice(index, 1);
      }
    }
  }

  removeIds(removingIds) {
    if (removingIds) {
      removingIds.forEach((id) => {
        this.removeId(id);
      });
    }
  }

  clear() {
    this.ids = [];
  }

  generate() {
    let id = null;

    do {
      id = generateString();
    } while (this.ids.indexOf(id) !== -1);

    this.ids.push(id);
    return id;
  }
};
