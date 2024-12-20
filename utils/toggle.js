import useCommonStore from '~/stores/common';

export const toggleFavorite = async (id, type, isFavorite) => {
  const res = await useCommonStore().patchItemStatus(id, type, {is_favorite: isFavorite});

  if (res) {
    eventBus.emit('toast:show', {text: lexicon.tpl.toggleFavoriteDone(id, type, isFavorite)});
  } else {
    eventBus.emit('toast:show', {text: lexicon.tpl.toggleFavoriteError(id, type, isFavorite)});
  }

  return res;
};

export const toggleArchive = async (id, inArchive) => {
  const res = await useCommonStore().patchItemStatus(id, 'test', {in_archive: inArchive});

  if (res) {
    eventBus.emit('toast:show', {text: lexicon.tpl.toggleArchiveDone(id, inArchive)});
  } else {
    eventBus.emit('toast:show', {text: lexicon.tpl.toggleArchiveError(id, inArchive)});
  }

  return res;
};

export const toggleCollection = async (id, inCollection) => {
  const res = await useCommonStore().putTestInCollection(id, inCollection);

  if (res) {
    eventBus.emit('toast:show', {text: lexicon.tpl.toggleCollectionDone(id, inCollection)});
  } else {
    eventBus.emit('toast:show', {text: lexicon.tpl.toggleCollectionError(id, inCollection)});
  }

  return res;
};
