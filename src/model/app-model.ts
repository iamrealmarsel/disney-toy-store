import { ActionType, ResetType, SettingsType, STORE_LIMIT } from '../constants';
import toysData from '../toys.json';
import { IAction, IDisplayedFilters, IObserver, ISelectedSettings, IState, IToy } from '../types';
import {
  filterBy,
  filterByBestseller,
  filterByRange,
  filterBySearch,
  selectData,
  selectRange,
  sortBy,
} from '../utils';

class AppModel {
  private toys: IToy[];
  private displayedFilters: IDisplayedFilters;
  private displayedToys: IToy[];
  private selectedSettings: ISelectedSettings;
  private observers: IObserver[];

  constructor() {
    this.observers = [];

    this.toys = toysData;
    this.displayedFilters = {
      cartoons: selectData(this.toys, SettingsType.CARTOON) as string[],
      types: selectData(this.toys, SettingsType.TYPE) as string[],
      heights: (selectData(this.toys, SettingsType.HEIGHT) as number[]).sort((a, b) => a - b),
      years: selectRange(this.toys, SettingsType.YEARS),
      amount: selectRange(this.toys, SettingsType.AMOUNT),
      price: selectRange(this.toys, SettingsType.PRICE),
    };

    this.selectedSettings = this.getSettings();
    this.displayedToys = [];
    this.updateToys();
  }

  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  private notify(state: IState, updateType: SettingsType, id?: string): void {
    this.observers.forEach((observer) => observer(state, updateType, id));
  }

  private getSettings(): ISelectedSettings {
    const settingsFromLS = localStorage.getItem('selected-settings');

    if (settingsFromLS) {
      const parsedSettingsFromLS = JSON.parse(settingsFromLS);

      return {
        ...parsedSettingsFromLS,
        cartoons: new Set(parsedSettingsFromLS.cartoons),
        heights: new Set(parsedSettingsFromLS.heights),
        types: new Set(parsedSettingsFromLS.types),
        store: new Set(parsedSettingsFromLS.store),
        favorites: new Set(parsedSettingsFromLS.favorites),
      };
    } else {
      return {
        cartoons: new Set(),
        heights: new Set(),
        types: new Set(),
        bestseller: false,
        search: '',
        sort: '',
        years: this.displayedFilters.years,
        amount: this.displayedFilters.amount,
        price: this.displayedFilters.price,
        store: new Set(),
        favorites: new Set(),
      };
    }
  }

  public getState(): IState {
    return {
      displayedToys: this.displayedToys,
      displayedFilters: this.displayedFilters,
      selectedSettings: this.selectedSettings,
    };
  }

  private updateToys(): void {
    const updateByCartoon = filterBy(
      this.toys,
      this.selectedSettings.cartoons,
      SettingsType.CARTOON
    );
    const updateByHeight = filterBy(
      updateByCartoon,
      this.selectedSettings.heights,
      SettingsType.HEIGHT
    );
    const updateByType = filterBy(updateByHeight, this.selectedSettings.types, SettingsType.TYPE);
    const updateByBestSeller = filterByBestseller(updateByType, this.selectedSettings.bestseller);
    const updateByYears = filterByRange(
      updateByBestSeller,
      this.selectedSettings.years,
      SettingsType.YEARS
    );
    const updateByAmount = filterByRange(
      updateByYears,
      this.selectedSettings.amount,
      SettingsType.AMOUNT
    );
    const updateByPrice = filterByRange(
      updateByAmount,
      this.selectedSettings.price,
      SettingsType.PRICE
    );
    const updateBySearch = filterBySearch(updateByPrice, this.selectedSettings.search);
    const finalUpdateBySort = sortBy(updateBySearch, this.selectedSettings.sort);

    this.displayedToys = finalUpdateBySort;
  }

  private updateLocalStorage(): void {
    const adaptToLS = {
      ...this.selectedSettings,
      cartoons: [...this.selectedSettings.cartoons],
      heights: [...this.selectedSettings.heights],
      types: [...this.selectedSettings.types],
      store: [...this.selectedSettings.store],
      favorites: [...this.selectedSettings.favorites],
    };

    localStorage.setItem('selected-settings', JSON.stringify(adaptToLS));
  }

  private resetFilters(): void {
    this.selectedSettings.cartoons.clear();
    this.selectedSettings.heights.clear();
    this.selectedSettings.types.clear();
    this.selectedSettings.years = this.displayedFilters.years;
    this.selectedSettings.amount = this.displayedFilters.amount;
    this.selectedSettings.price = this.displayedFilters.price;
    this.selectedSettings.bestseller = false;
    this.selectedSettings.search = '';
  }

  private resetSettings(resetType: string): void {
    switch (resetType) {
      case ResetType.FILTERS:
        this.resetFilters();
        this.updateLocalStorage();

        break;
      case ResetType.SEARCH:
        this.selectedSettings.search = '';
        this.updateLocalStorage();

        break;
      case ResetType.ALL:
        this.resetFilters();
        this.selectedSettings.sort = '';
        this.selectedSettings.store = new Set();
        this.selectedSettings.favorites = new Set();
        localStorage.removeItem('selected-settings');

        break;
    }
  }

  public dispatch(action: IAction): void {
    switch (action.type) {
      case ActionType.FILTER_BY_CARTOON:
        this.selectedSettings.cartoons.has(action.payload.cartoon)
          ? this.selectedSettings.cartoons.delete(action.payload.cartoon)
          : this.selectedSettings.cartoons.add(action.payload.cartoon);

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.CARTOON);

        break;
      case ActionType.FILTER_BY_HEIGHT:
        this.selectedSettings.heights.has(+action.payload.height)
          ? this.selectedSettings.heights.delete(+action.payload.height)
          : this.selectedSettings.heights.add(+action.payload.height);

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.HEIGHT);

        break;
      case ActionType.FILTER_BY_TYPE:
        this.selectedSettings.types.has(action.payload.type)
          ? this.selectedSettings.types.delete(action.payload.type)
          : this.selectedSettings.types.add(action.payload.type);

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.TYPE);

        break;
      case ActionType.FILTER_BY_BESTSELLER:
        this.selectedSettings.bestseller = !this.selectedSettings.bestseller;

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.BESTSELLER);

        break;
      case ActionType.FILTER_BY_YEARS:
        this.selectedSettings.years = action.payload.year.split('-').map((value) => +value);

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.YEARS);

        break;
      case ActionType.FILTER_BY_AMOUNT:
        this.selectedSettings.amount = action.payload.amount.split('-').map((value) => +value);

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.AMOUNT);

        break;
      case ActionType.FILTER_BY_PRICE:
        this.selectedSettings.price = action.payload.price.split('-').map((value) => +value);

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.PRICE);

        break;
      case ActionType.FILTER_BY_SEARCH:
        this.selectedSettings.search = action.payload.search;

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.SEARCH);

        break;
      case ActionType.SORT:
        this.selectedSettings.sort = action.payload.sort;

        this.updateLocalStorage();
        this.updateToys();
        this.notify(this.getState(), SettingsType.SORT);

        break;
      case ActionType.UPDATE_STORE:
        if (this.selectedSettings.store.has(+action.payload.store)) {
          this.selectedSettings.store.delete(+action.payload.store);
          this.updateLocalStorage();
          this.notify(this.getState(), SettingsType.STORE);
        } else {
          if (this.selectedSettings.store.size < STORE_LIMIT) {
            this.selectedSettings.store.add(+action.payload.store);
            this.updateLocalStorage();
            this.notify(this.getState(), SettingsType.STORE);
          } else {
            this.notify(this.getState(), SettingsType.STORE_LIMIT, action.payload.store);
          }
        }

        break;
      case ActionType.UPDATE_FAVORITES:
        this.selectedSettings.favorites.has(+action.payload.favorite)
          ? this.selectedSettings.favorites.delete(+action.payload.favorite)
          : this.selectedSettings.favorites.add(+action.payload.favorite);

        this.updateLocalStorage();
        this.notify(this.getState(), SettingsType.FAVORITE);

        break;
      case ActionType.RESET_SEARCH:
        this.resetSettings(action.payload.resetSearch);
        this.updateToys();
        this.notify(this.getState(), SettingsType.RESET_SEARCH);

        break;
      case ActionType.RESET_FILTERS:
        this.resetSettings(action.payload.resetFilters);
        this.updateToys();
        this.notify(this.getState(), SettingsType.RESET_FILTERS);

        break;
      case ActionType.RESET_ALL:
        this.resetSettings(action.payload.resetAll);
        this.updateToys();
        this.notify(this.getState(), SettingsType.RESET_ALL);

        break;
    }
  }
}

export default AppModel;
