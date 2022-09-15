import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { ResetType, SortType } from '../constants';
import { IDisplayedFilters, IPayload, ISelectedSettings } from '../types';
import { createElement } from '../utils';

class FiltersView {
  private element: HTMLElement;

  constructor(displayedFilters: IDisplayedFilters, selectedSettings: ISelectedSettings) {
    this.element = this.generateElement(displayedFilters, selectedSettings);
    this.initFilterRange(displayedFilters, selectedSettings);
  }

  public setResetAllClickHandler(callback: (payload: IPayload) => void): void {
    const resetClickHandler = (e: Event) => {
      const value = (e.currentTarget as HTMLElement).dataset.resetAll;

      if (value === undefined) return;

      callback({ resetAll: value });
    };

    (this.element.querySelector('[data-reset-all]') as HTMLElement).addEventListener(
      'click',
      resetClickHandler
    );
  }

  public setResetFiltersClickHandler(callback: (payload: IPayload) => void): void {
    const resetClickHandler = (e: Event) => {
      const value = (e.currentTarget as HTMLElement).dataset.resetFilters;

      if (value === undefined) return;

      callback({ resetFilters: value });
    };

    (this.element.querySelector('[data-reset-filters]') as HTMLElement).addEventListener(
      'click',
      resetClickHandler
    );
  }

  public setResetSearchClickHandler(callback: (payload: IPayload) => void): void {
    const resetClickHandler = (e: Event) => {
      const value = (e.currentTarget as HTMLElement).dataset.resetSearch;

      if (value === undefined) return;

      (this.element.querySelector('input[data-search]') as HTMLInputElement).value = '';
      callback({ resetSearch: value });
    };

    (this.element.querySelector('[data-reset-search]') as HTMLElement).addEventListener(
      'click',
      resetClickHandler
    );
  }

  public setSortClickHandler(callback: (payload: IPayload) => void): void {
    const sortClickHandler = (e: Event) => {
      const currentTarget = e.currentTarget as HTMLElement;
      const value = currentTarget.dataset.sort;

      if (value === undefined) return;

      sortElements.forEach((element) => {
        element.classList.remove('active');
      });
      currentTarget.classList.add('active');
      callback({ sort: value });
    };

    const sortElements = this.element.querySelectorAll('[data-sort]');
    sortElements.forEach((element) => {
      element.addEventListener('click', sortClickHandler);
    });
  }

  public setSearchInputHandler(callback: (payload: IPayload) => void): void {
    const searchClickHandler = (e: Event) => {
      callback({ search: (e.currentTarget as HTMLInputElement).value });
    };
    (this.element.querySelector('input[data-search]') as HTMLInputElement).addEventListener(
      'input',
      searchClickHandler
    );
  }

  public setFilterValueClickHandler(callback: (payload: IPayload) => void): void {
    const filterClickHandler = (e: Event) => {
      const currentTarget = e.currentTarget as HTMLElement;
      const value =
        currentTarget.dataset.cartoon ||
        currentTarget.dataset.height ||
        currentTarget.dataset.type ||
        currentTarget.dataset.bestseller;

      if (value === undefined) return;

      currentTarget.classList.toggle('active');
      callback({ ...(currentTarget.dataset as IPayload) });
    };

    (this.element.querySelector('[data-bestseller]') as HTMLElement).addEventListener(
      'click',
      filterClickHandler
    );
    this.element.querySelectorAll('[data-cartoon]').forEach((element) => {
      element.addEventListener('click', filterClickHandler);
    });
    this.element.querySelectorAll('[data-height]').forEach((element) => {
      element.addEventListener('click', filterClickHandler);
    });
    this.element.querySelectorAll('[data-type]').forEach((element) => {
      element.addEventListener('click', filterClickHandler);
    });
  }

  public setFilterRangeClickHandler(callback: (payload: IPayload) => void): void {
    const rangeYear = this.element.querySelector('[data-range-year]') as noUiSlider.target;
    const rangeOutputYearMin = this.element.querySelector('[data-range-year-min]') as HTMLElement;
    const rangeOutputYearMax = this.element.querySelector('[data-range-year-max]') as HTMLElement;

    if (rangeYear.noUiSlider !== undefined) {
      rangeYear.noUiSlider.on('update', (values: (string | number)[]) => {
        rangeOutputYearMin.innerHTML = `${values[0]}`;
        rangeOutputYearMax.innerHTML = `${values[1]}`;
      });
      rangeYear.noUiSlider.on('change', (values: (string | number)[]) => {
        callback({ year: values.join('-') });
      });
    }

    const rangePrice = this.element.querySelector('[data-range-price]') as noUiSlider.target;
    const rangeOutputPriceMin = this.element.querySelector('[data-range-price-min]') as HTMLElement;
    const rangeOutputPriceMax = this.element.querySelector('[data-range-price-max]') as HTMLElement;

    if (rangePrice.noUiSlider !== undefined) {
      rangePrice.noUiSlider.on('update', (values: (string | number)[]) => {
        rangeOutputPriceMin.innerHTML = `${values[0]}`;
        rangeOutputPriceMax.innerHTML = `${values[1]}`;
      });
      rangePrice.noUiSlider.on('change', (values: (string | number)[]) => {
        callback({ price: values.join('-') });
      });
    }
  }

  private initFilterRange(
    displayedFilters: IDisplayedFilters,
    selectedSettings: ISelectedSettings
  ) {
    const rangeYear = this.element.querySelector('[data-range-year]') as HTMLElement;
    const rangePrice = this.element.querySelector('[data-range-price]') as HTMLElement;

    noUiSlider.create(rangeYear, {
      start: selectedSettings.years,
      connect: true,
      step: 1,
      format: {
        to: (value) => value.toFixed(),
        from: (value) => +value,
      },
      tooltips: true,
      range: {
        min: displayedFilters.years[0],
        max: displayedFilters.years[1],
      },
    });

    noUiSlider.create(rangePrice, {
      start: selectedSettings.price,
      connect: true,
      step: 1,
      format: {
        to: (value) => value.toFixed(),
        from: (value) => +value,
      },
      tooltips: true,
      range: {
        min: displayedFilters.price[0],
        max: displayedFilters.price[1],
      },
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private generateElement(filtersData: IDisplayedFilters, selectedSettings: ISelectedSettings) {
    return createElement(this.makeHTML(filtersData, selectedSettings));
  }

  private makeHTML(
    displayedFilters: IDisplayedFilters,
    selectedSettings: ISelectedSettings
  ): string {
    let cartoonItemHTML = '';
    let heightItemHTML = '';
    let typeItemHTML = '';

    displayedFilters.cartoons.forEach((cartoon) => {
      const activeClass = selectedSettings.cartoons.has(cartoon) ? 'active' : '';
      cartoonItemHTML += `<li class="cartoons__item ${activeClass}" data-cartoon="${cartoon}">${cartoon}</li>`;
    });

    displayedFilters.heights.forEach((height) => {
      const activeClass = selectedSettings.heights.has(height) ? 'active' : '';
      heightItemHTML += `<li class="heights__item ${activeClass}" data-height="${height}">${height} inch</li>`;
    });

    displayedFilters.types.forEach((type) => {
      const activeClass = selectedSettings.types.has(type) ? 'active' : '';
      typeItemHTML += `<li class="types__item ${activeClass}" data-type="${type}">${type}</li>`;
    });

    const bestseller = selectedSettings.bestseller ? 'checked' : '';

    return `
  <section class="settings">
    <div class="settings__row1">
      <div class="settings__row1-col1">
        <div class="cartoons">
          <h3 class="title-h3">Cartoon</h3>
          <ul class="cartoons__list">
            ${cartoonItemHTML}
          </ul>
        </div>
        <div class="heights">
          <h3 class="title-h3">Height</h3>
          <ul class="heights__list">
            ${heightItemHTML}
          </ul>
        </div>
        <div class="types">
          <h3 class="title-h3">Type</h3>
          <ul class="types__list">
            ${typeItemHTML}
          </ul>
        </div>
      </div>
      <div class="settings__row1-col2">
        <div class="range">
          <h3 class="title-h3">Release year</h3>
          <div class="range__wrapper range__wrapper_year">
            <div class="range__output" data-range-year-min></div>
            <div class="range__slider" data-range-year></div>
            <div class="range__output" data-range-year-max></div>
          </div>
          <h3 class="title-h3">Price</h3>
          <div class="range__wrapper">
            <div class="range__output" data-range-price-min></div>
            <div class="range__slider" data-range-price></div>
            <div class="range__output" data-range-price-max></div>
          </div>
        </div>
        <div class="bestseller">
          <label class="bestseller__label">
            <h3 class="title-h3">Best-seller</h3>
            <input
              class="bestseller__checkbox-hidden"
              type="checkbox"
              data-bestseller="${selectedSettings.bestseller}"
              ${bestseller} 
            />
            <div class="bestseller__checkbox">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:svgjs="http://svgjs.com/svgjs"
                version="1.1"
                width="512"
                height="512"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style="enable-background: new 0 0 512 512"
                xml:space="preserve"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M1.51,6.079a1.492,1.492,0,0,1,1.06.44l7.673,7.672a2.5,2.5,0,0,0,3.536,0L21.44,6.529A1.5,1.5,0,1,1,23.561,8.65L15.9,16.312a5.505,5.505,0,0,1-7.778,0L.449,8.64A1.5,1.5,0,0,1,1.51,6.079Z"
                    fill="#ffffff"
                    data-original="#000000"
                  />
                </g>
              </svg>
            </div>
          </label>
        </div>
        <div class="search">
          <label class="search__label" for="search-input">
            <h3 class="title-h3">Search</h3>
          </label>
          <div class="search__field">
            <input class="input" id="search-input" type="text" value="${
              selectedSettings.search
            }" placeholder="enter the title" autofocus autocomplete="off" data-search />
            <span class="search__reset" data-reset-search="${ResetType.SEARCH}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:svgjs="http://svgjs.com/svgjs"
                version="1.1"
                width="512"
                height="512"
                x="0"
                y="0"
                viewBox="0 0 512.021 512.021"
                style="enable-background: new 0 0 512 512"
                xml:space="preserve"
              >
                <g>
                  <g xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"
                      fill="#f9ca2e"
                      data-original="#000000"
                    />
                  </g>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <div class="sort">
          <h3 class="title-h3">Sort</h3>
          <div class="sort__wrapper sort__wrapper_name">
            <span class="sort__caption">by name</span>
            <span class="sort__up ${
              selectedSettings.sort === SortType.NAME_UP ? 'active' : ''
            }" data-sort="${SortType.NAME_UP}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:svgjs="http://svgjs.com/svgjs"
                version="1.1"
                width="15"
                height="15"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style="enable-background: new 0 0 15 15"
                xml:space="preserve"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M18.427,4.911,14.508.992a3.583,3.583,0,0,0-4.95,0L5.639,4.911A1.5,1.5,0,0,0,7.76,7.032l2.78-2.78.023,18.25a1.5,1.5,0,0,0,1.5,1.5h0a1.5,1.5,0,0,0,1.5-1.5L13.54,4.266l2.766,2.766a1.5,1.5,0,1,0,2.121-2.121Z"
                    fill="#ffffff"
                    data-original="#000000"
                  />
                </g></svg
            ></span>
            <span class="sort__down ${
              selectedSettings.sort === SortType.NAME_DOWN ? 'active' : ''
            }" data-sort="${SortType.NAME_DOWN}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:svgjs="http://svgjs.com/svgjs"
                version="1.1"
                width="15"
                height="15"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style="enable-background: new 0 0 15 15"
                xml:space="preserve"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M18.427,16.935a1.5,1.5,0,0,0-2.121,0l-2.781,2.779L13.5,1.5A1.5,1.5,0,0,0,12,0h0a1.5,1.5,0,0,0-1.5,1.5l.023,18.2L7.76,16.935a1.5,1.5,0,0,0-2.121,2.121l3.919,3.919a3.5,3.5,0,0,0,4.949,0l3.92-3.919A1.5,1.5,0,0,0,18.427,16.935Z"
                    fill="#ffffff"
                    data-original="#000000"
                  />
                </g>
              </svg>
            </span>
          </div>
          <div class="sort__wrapper">
            <span class="sort__caption">by price</span>
            <span class="sort__up ${
              selectedSettings.sort === SortType.PRICE_UP ? 'active' : ''
            }" data-sort="${SortType.PRICE_UP}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:svgjs="http://svgjs.com/svgjs"
                version="1.1"
                width="15"
                height="15"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style="enable-background: new 0 0 15 15"
                xml:space="preserve"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M18.427,4.911,14.508.992a3.583,3.583,0,0,0-4.95,0L5.639,4.911A1.5,1.5,0,0,0,7.76,7.032l2.78-2.78.023,18.25a1.5,1.5,0,0,0,1.5,1.5h0a1.5,1.5,0,0,0,1.5-1.5L13.54,4.266l2.766,2.766a1.5,1.5,0,1,0,2.121-2.121Z"
                    fill="#ffffff"
                    data-original="#000000"
                  />
                </g>
              </svg>
            </span>
            <span class="sort__down ${
              selectedSettings.sort === SortType.PRICE_DOWN ? 'active' : ''
            }" data-sort="${SortType.PRICE_DOWN}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:svgjs="http://svgjs.com/svgjs"
                version="1.1"
                width="15"
                height="15"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style="enable-background: new 0 0 15 15"
                xml:space="preserve"
              >
                <g>
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M18.427,16.935a1.5,1.5,0,0,0-2.121,0l-2.781,2.779L13.5,1.5A1.5,1.5,0,0,0,12,0h0a1.5,1.5,0,0,0-1.5,1.5l.023,18.2L7.76,16.935a1.5,1.5,0,0,0-2.121,2.121l3.919,3.919a3.5,3.5,0,0,0,4.949,0l3.92-3.919A1.5,1.5,0,0,0,18.427,16.935Z"
                    fill="#ffffff"
                    data-original="#000000"
                  />
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="settings__row2">
      <div class="reset">
        <button class="reset__filters button" type="button" data-reset-filters="${
          ResetType.FILTERS
        }">
          reset filters
        </button>
        <button class="reset__all button" type="button" data-reset-all="${ResetType.ALL}">
          reset all
        </button>
      </div>
    </div>
  </section>
  `;
  }
}

export default FiltersView;
