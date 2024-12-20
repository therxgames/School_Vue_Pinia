let hasFile = function(e) {
  let result = false;

  if (e.dataTransfer && e.dataTransfer.items && e.dataTransfer.items.length) {
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === 'file') {
        result = true;
      }
    }
  }

  return result;
};

let targetIsInputFile = function(e) {
  return e.target
    && e.target.tagName === 'INPUT'
    && e.target.type === 'file';
};

export default function() {
  window.addEventListener('dragover', (e) => {
    if (hasFile(e) && !targetIsInputFile(e)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'none';
    }
  });

  window.addEventListener('drop', (e) => {
    if (hasFile(e) && !targetIsInputFile(e)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'none';
    }
  });
};
