import Store from '.';

export const setIsUpdatedGl = bol => {
  Store.update(s => {
    s.isUpdatedGl = bol;
  });
};
export const setIsImportedGl = bol => {
  Store.update(s => {
    s.isImportedGl = bol;
  });
};
export const setIsFetched = bol => {
  Store.update(s => {
    s.isFetched = bol;
  });
};
