import { createSelector } from 'reselect';

const getState = state => state;

export const getIsUpdatedGl = createSelector(getState, state => state.isUpdatedGl);
export const getIsImportedGl = createSelector(getState, state => state.isImportedGl);
export const getIsTriggerUpdate = createSelector(getState, state => state.isTriggerUpdate);
