function parseIsFavourite(isFavourite) {
  if (typeof isFavourite === 'boolean') {
    return isFavourite;
  }
  if (typeof isFavourite === 'string') {
    if (isFavourite.toLowerCase() === 'true') return true;
    if (isFavourite.toLowerCase() === 'false') return false;
  }
  return undefined;
}

function parseContactType(contactType) {
  if (typeof contactType !== 'string') {
    return;
  }
  const parsedContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (parsedContactType(contactType)) return contactType;
}

export const parseFilterParams = (query) => {
  const { isFavourite, type } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(type);

  return {
    isFavourite: parsedIsFavourite,
    type: parsedContactType,
  };
};
