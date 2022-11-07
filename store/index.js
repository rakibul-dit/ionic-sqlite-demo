import { Store as PullStateStore } from 'pullstate';
import { tafsir200 } from '../data/tmpData';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  isUpdatedGl: undefined,
  isImportedGl: undefined,
  isTriggerUpdate: false,
  tafsir200,
});

export default Store;
