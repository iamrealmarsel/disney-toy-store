import { ActionType, SettingsType } from './constants';

export interface IToy {
  id: number;
  cartoon: string;
  name: string;
  type: string;
  height: number;
  year: number;
  amount: number;
  price: number;
  bestseller: boolean;
  image: string;
}

export interface ISelectedSettings {
  cartoons: Set<string>;
  heights: Set<number>;
  types: Set<string>;
  bestseller: boolean;
  search: string;
  sort: string;
  years: number[];
  amount: number[];
  price: number[];
  store: Set<number>;
  favorites: Set<number>;
}

export interface IDisplayedFilters {
  cartoons: string[];
  types: string[];
  heights: number[];
  years: number[];
  amount: number[];
  price: number[];
}

export interface IState {
  displayedToys: IToy[];
  displayedFilters: IDisplayedFilters;
  selectedSettings: ISelectedSettings;
}

export interface IAction {
  type: ActionType;
  payload: IPayload;
}

export interface IPayload {
  [name: string]: string;
}

export interface IObserver {
  (state: IState, updateType: SettingsType, id?: string): void;
}
