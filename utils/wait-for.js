export const waitFor = (callback, throttle = 50) => {
  return new Promise((resolve) => {
    (function _wait() {
      if (callback() === true) {
        return resolve();
      }
      setTimeout(_wait, throttle);
    })();
  });
};
