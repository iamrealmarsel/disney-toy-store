export const STORE_LIMIT = 20;

export enum SettingsType {
  CARTOON = 'cartoon',
  TYPE = 'type',
  HEIGHT = 'height',
  BESTSELLER = 'bestseller',
  YEARS = 'year',
  AMOUNT = 'amount',
  PRICE = 'price',
  SEARCH = 'search',
  SORT = 'sort',
  STORE = 'store',
  FAVORITE = 'favorite',
  RESET_SEARCH = 'resetSearch',
  RESET_FILTERS = 'resetFilters',
  RESET_ALL = 'resetAll',
  STORE_LIMIT = 'storeLimit',
}

export enum SortType {
  NAME_UP = 'name_up',
  NAME_DOWN = 'name_down',
  YEAR_UP = 'year_up',
  YEAR_DOWN = 'year_down',
  PRICE_UP = 'price_up',
  PRICE_DOWN = 'price_down',
}

export enum ResetType {
  SEARCH = 'search',
  FILTERS = 'filters',
  ALL = 'all',
}

export enum ActionType {
  FILTER_BY_CARTOON = 'FILTER_BY_CARTOON',
  FILTER_BY_HEIGHT = 'FILTER_BY_HEIGHT',
  FILTER_BY_TYPE = 'FILTER_BY_TYPE',
  FILTER_BY_BESTSELLER = 'FILTER_BY_BESTSELLER',
  FILTER_BY_YEARS = 'FILTER_BY_YEARS',
  FILTER_BY_AMOUNT = 'FILTER_BY_AMOUNT',
  FILTER_BY_PRICE = 'FILTER_BY_PRICE',
  FILTER_BY_SEARCH = 'FILTER_BY_SEARCH',
  SORT = 'SORT',
  UPDATE_STORE = 'UPDATE_STORE',
  UPDATE_FAVORITES = 'UPDATE_FAVORITES',
  RESET_SEARCH = 'RESET_SEARCH',
  RESET_FILTERS = 'RESET_FILTERS',
  RESET_ALL = 'RESET_ALL',
}
