import { Store as PullStateStore } from 'pullstate';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  isUpdatedGl: undefined,
  isImportedGl: undefined,
  isTriggerUpdate: false,
});

export default Store;
