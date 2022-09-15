import { ActionType } from './constants';
import { IAction, IPayload } from './types';

export const actionCartoon = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_CARTOON,
  payload,
});

export const actionHeight = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_HEIGHT,
  payload,
});

export const actionType = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_TYPE,
  payload,
});

export const actionBestseller = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_BESTSELLER,
  payload,
});

export const actionYears = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_YEARS,
  payload,
});

export const actionAmount = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_AMOUNT,
  payload,
});

export const actionPrice = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_PRICE,
  payload,
});

export const actionSearch = (payload: IPayload): IAction => ({
  type: ActionType.FILTER_BY_SEARCH,
  payload,
});

export const actionSort = (payload: IPayload): IAction => ({
  type: ActionType.SORT,
  payload,
});

export const actionUpdateStore = (payload: IPayload): IAction => ({
  type: ActionType.UPDATE_STORE,
  payload,
});

export const actionUpdateFavorites = (payload: IPayload): IAction => ({
  type: ActionType.UPDATE_FAVORITES,
  payload,
});

export const actionResetSearch = (payload: IPayload): IAction => ({
  type: ActionType.RESET_SEARCH,
  payload,
});

export const actionResetFilters = (payload: IPayload): IAction => ({
  type: ActionType.RESET_FILTERS,
  payload,
});

export const actionResetAll = (payload: IPayload): IAction => ({
  type: ActionType.RESET_ALL,
  payload,
});
