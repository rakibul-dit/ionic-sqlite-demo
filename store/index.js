import { Store as PullStateStore } from 'pullstate';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  isUpdatedGl: undefined,
  isImportedGl: undefined,
});

export default Store;
