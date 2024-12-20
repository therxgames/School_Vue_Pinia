import {format} from 'date-fns';

const DB_NAME = 'local-db';

let db;

const clone = (target) => target ? JSON.parse(JSON.stringify(target)) : target;

const base64 = async (file) => {
  return new Promise(async (resolve) => {
    const reader = new FileReader();
    reader.onload = function() {
      resolve(this.result);
    };
    reader.readAsDataURL(file);
  });
};

const getBlob = async (url) => {
  return new Promise(async (resolve) => {
    const response = await fetch(url);
    resolve(await response.blob());
  });
};

const checkAnswer = (answer, task) => {
  switch (task.type) {
    case 'CHOOSE_ANSWER':
      if (task.answer.every((a) => answer.includes(a))
        && answer.every((a) => task.answer.includes(a))) {
        return 'correct';
      } else {
        return 'wrong';
      }
    case 'ENTER_ANSWER':
      return task.answer.includes(answer[0]) ? 'correct' : 'wrong';
    case 'FREE_ANSWER':
      return 'scoring';
    case 'ORDER_ANSWER':
      return answer.length === task.answer.length && answer.every((a, idx) => a === task.answer[idx]) ? 'correct' :'wrong';
    case 'GAP_MATCH_TEXT_ANSWER':
      return answer.length === task.answer.length && answer.every((a, idx) => a === task.answer[idx]) ? 'correct' : 'wrong';
    case 'GAP_MATCH_TABLE_ANSWER':
      if (task.answer.length !== answer.length) return 'wrong';
      const isEqual = (arr1, arr2) => {
        let str1 = arr1.sort(([a, b], [c, d]) => a - c).join();
        let str2 = arr2.sort(([a, b], [c, d]) => a - c).join();
        return str1 === str2;
      };
      return isEqual(task.answer, answer) ? 'correct' : 'wrong';
  }
};

export const localServer = {
  load() {
    db = localStorage.getItem(DB_NAME);

    if (db) {
      db = JSON.parse(db);
    } else {
      db = {
        attempts: [],
        answers: []
      };
    }
  },
  save() {
    if (db) {
      localStorage.setItem(DB_NAME, JSON.stringify(db));
    }
  },
  getAnswer(query) {
    return clone(db.answers.find((answer) => {
      return Object.keys(query).every((key) => {
        return query[key] === answer[key];
      });
    }));
  },
  async getAnswers(query) {
    let res = db.answers;

    if (query) {
      res = res.filter((answer) => {
        return Object.keys(query).every((key) => {
          return query[key] === answer[key];
        });
      });
    }

    res = clone(res);

    for (let i = 0; i < res.length; i++) {
      const answer = res[i];

      if (answer.filenames) {
        for (let j = 0; j < answer.filenames.length; j++) {
          const filename = answer.filenames[j];
          const blob = await getBlob(filename.data);

          filename.original_name = filename.name;
          filename.filename = URL.createObjectURL(blob);
          filename.filesize = blob.size;
        }
      }
    }

    return res.sort((a, b) => b.id - a.id);
  },
  async addAnswer(test_id, task_id, task_version_number = 1, answer, files, check = false, task = null) {
    const id = db.answers.length + 1;
    const filenames = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const id = i + 1;

        filenames.push({
          id,
          name: file.name,
          data: await base64(file)
        });
      }
    }

    let result = 'unchecked';

    if (check) {
      result = checkAnswer(answer, task);
    }

    db.answers.push(clone({
      id,
      task_id,
      task_parent_id: task?.parent_id || null,
      task_version_number,
      answer,
      filenames,
      result,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      is_first: false,
      test_id,
      is_active: true,
      day: 0,
      week: 0,
      month: 0,
      year: 0,
      score: 0
    }));

    const attempt = db.attempts.find((a) => a.test_id === test_id && a.is_active);

    if (attempt) {
      if (result === 'correct') {
        attempt.correctness++;
      } else if (result === 'wrong') {
        attempt.wrongness++;
      } else if (result === 'unchecked' || result === 'scoring') {
        attempt.uncheckedness++;
      }
    }

    this.save();
    return {id, result};
  },
  patchAnswer(id, fields, check, task) {
    fields = clone(fields);
    const answer = db.answers.find((answer) => answer.id === id);

    if (answer) {
      Object.keys(fields).forEach((key) => {
        answer[key] = fields[key];
      });

      let scoreCorrectnessUpdate = 0;

      if (check) {
        if (task.type === 'FREE_ANSWER') {
          if (fields.answer.score > 0) {
            answer.result = 'correct';
          } else {
            answer.result = 'wrong';
          }

          answer.score = fields.answer.score;

          if (answer.result === 'scoring') {
            if (fields.answer.score > 0) {
              scoreCorrectnessUpdate = 1;
            }
          } else {
            scoreCorrectnessUpdate = (fields.answer.score > 0) ? 1 : -1;
          }
        } else {
          answer.result = checkAnswer(answer.answer, task);
        }
      }

      const attempt = db.attempts.find((a) => a.test_id === answer.test_id && a.is_active);

      if (attempt) {
        if (typeof fields.answer.score === 'number') {
          attempt.score += fields.answer.score;
        }

        if (typeof fields.answer.maxScore === 'number') {
          attempt.max_score += fields.answer.maxScore;
        }

        attempt.score_correctness += scoreCorrectnessUpdate;

        if (answer.result === 'correct') {
          attempt.correctness++;
          attempt.uncheckedness--;
        } else if (answer.result === 'wrong') {
          attempt.wrongness++;
          attempt.uncheckedness--;
        }
      }

      this.save();
    }
  },
  async postAnswerFiles(id, files, toDelete) {
    const answer = db.answers.find((answer) => answer.id === id);

    if (answer) {
      let filenames = [...answer.filenames];

      if (toDelete) {
        filenames = filenames.filter((file) => !toDelete.includes(file.id));
      }

      let fileId = 1;

      if (answer.filenames.length) {
        const lastFilename = answer.filenames[answer.filenames.length - 1];

        if (lastFilename) {
          fileId = lastFilename.id;
        }
      }

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          filenames.push({
            id: fileId++,
            name: file.name,
            data: await base64(file)
          });
        }
      }

      answer.filenames = filenames;
    }

    this.save();
  },

  getAttempt(query) {
    return clone(db.attempts.find((attempt) => {
      return Object.keys(query).every((key) => {
        return query[key] === attempt[key];
      });
    }));
  },
  getAttempts(query) {
    let res = db.attempts;

    if (query) {
      res = res.filter((attempt) => {
        return Object.keys(query).every((key) => {
          return query[key] === attempt[key];
        });
      });
    }

    return clone(res);
  },
  addAttempt(test_id, test_parent_id, test_version, time, mode) {
    const id = db.attempts.length + 1;

    db.attempts.forEach((attempt) => {
      if (attempt.test_parent_id === test_parent_id) {
        attempt.is_active = false;

        if (!attempt.is_finished) {
          attempt.last_action_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
          attempt.is_finished = true;
        }
      }
    });

    db.answers.forEach((answer) => {
      if (answer.test_id === test_id) {
        answer.is_active = false;
      }
    });

    db.attempts.push(clone({
      id,
      test_id,
      test_parent_id,
      test_version,
      mode,
      started_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      last_action_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      time,
      is_active: true,
      is_finished: false,
      day: 0,
      week: 0,
      month: 0,
      year: 0,
      correctness: 0,
      wrongness: 0,
      uncheckedness: 0,
      score: 0,
      max_score: 0,
      score_correctness: 0
    }));

    this.save();
  },
  patchAttempt(id, fields) {
    fields = clone(fields);
    const attempt = db.attempts.find((attempt) => attempt.id === id);

    if (attempt) {
      Object.keys(fields).forEach((key) => {
        attempt[key] = fields[key];
      });

      attempt.last_action_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.save();
    }
  }
};
