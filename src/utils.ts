import { SortType } from './constants';
import { IToy } from './types';

export const createElement = (html: string): HTMLElement => {
  const parentElement = document.createElement('div');
  parentElement.innerHTML = html;

  return parentElement.firstElementChild as HTMLElement;
};

export const selectData = (toys: IToy[], property: keyof IToy) => {
  const selection: Set<number | string | boolean> = new Set();

  toys.forEach((toy) => selection.add(toy[property]));

  return [...selection];
};

export const selectRange = (toys: IToy[], property: keyof IToy): number[] => {
  const nums = selectData(toys, property) as number[];

  return [Math.min(...nums), Math.max(...nums)];
};

export const filterBy = (
  toys: IToy[],
  selectedSettings: Set<number | string | boolean>,
  filterType: keyof IToy
): IToy[] => {
  if (selectedSettings.size === 0) return toys;

  return toys.filter((toy) => selectedSettings.has(toy[filterType]));
};

export const filterByBestseller = (toys: IToy[], isBestseller: boolean): IToy[] => {
  if (!isBestseller) return toys;

  return toys.filter((toy) => toy.bestseller);
};

export const filterByRange = (toys: IToy[], nums: number[], filterType: keyof IToy): IToy[] =>
  toys.filter((toy) => toy[filterType] >= nums[0] && toy[filterType] <= nums[1]);

export const filterBySearch = (toys: IToy[], text: string): IToy[] => {
  if (text === '') return toys;

  return toys.filter((toy) => toy.name.toLowerCase().includes(text.toLowerCase()));
};

export const sortBy = (toys: IToy[], sortType: string) => {
  switch (sortType) {
    case SortType.NAME_UP:
      return toys.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        return 0;
      });

    case SortType.NAME_DOWN:
      return toys.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        }
        return 0;
      });

    case SortType.YEAR_UP:
      return toys.sort((a, b) => a.year - b.year);

    case SortType.YEAR_DOWN:
      return toys.sort((a, b) => b.year - a.year);

    case SortType.PRICE_UP:
      return toys.sort((a, b) => a.price - b.price);

    case SortType.PRICE_DOWN:
      return toys.sort((a, b) => b.price - a.price);

    default:
      return toys;
  }
};
