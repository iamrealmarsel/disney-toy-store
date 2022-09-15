import cartEmpty from '../../public/img/cart_empty.svg';
import cartFull from '../../public/img/cart_full.svg';
import { IPayload, ISelectedSettings, IToy } from '../types';
import { createElement } from '../utils';

class ToyView {
  private element: HTMLElement;

  constructor(toy: IToy, path: string, selectedSettings: ISelectedSettings) {
    this.element = this.generateElement(toy, path, selectedSettings);
  }

  public setStoreClickHandler(callback: (payload: IPayload) => void): void {
    const storeClickHandler = (e: Event) => {
      const currentTarget = e.currentTarget as HTMLElement;
      const value = currentTarget.dataset.store;

      if (value === undefined) return;

      currentTarget.classList.toggle('active');
      callback({ store: value });
    };

    (this.element.querySelector('[data-store]') as HTMLElement).addEventListener(
      'click',
      storeClickHandler
    );
  }

  public setFavoriteClickHandler(callback: (payload: IPayload) => void): void {
    const favoriteClickHandler = (e: Event) => {
      const currentTarget = e.currentTarget as HTMLElement;
      const value = currentTarget.dataset.favorite;

      if (value === undefined) return;

      currentTarget.classList.toggle('active');
      callback({ favorite: value });
    };

    (this.element.querySelector('[data-favorite]') as HTMLElement).addEventListener(
      'click',
      favoriteClickHandler
    );
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private generateElement(
    toy: IToy,
    path: string,
    selectedSettings: ISelectedSettings
  ): HTMLElement {
    return createElement(this.makeHTML(toy, path, selectedSettings));
  }

  private makeHTML(toy: IToy, path: string, selectedSettings: ISelectedSettings): string {
    return `
    <div class="toys__col">
      <div class="toy toy_${toy.name.split(' ').join('-').toLowerCase()} ${
      toy.bestseller ? 'toy_best' : ''
    }">
        <div class="toy__desc">
          <span class="toy__cartoon">${toy.cartoon}</span>
          <h2 class="toy__title title-h2">${toy.name}</h2>
          <ul class="toy__features">
            <li class="toy__feature">${toy.type}</li>
            <li class="toy__feature">${toy.height} inch</li>
            <li class="toy__feature">${toy.year} year</li>
            <li class="toy__feature toy__price">$${toy.price}</li>
          </ul>
          <div class="toy__buttons">
            <span class="toy__store ${selectedSettings.store.has(toy.id) ? 'active' : ''}" 
              data-store="${toy.id}">
              <img class="toy__store_empty" src="${cartEmpty}" alt="add to cart" />
              <img class="toy__store_full" src="${cartFull}" alt="added to cart" />
            </span>
            <span class="toy__favorite ${selectedSettings.favorites.has(toy.id) ? 'active' : ''}" 
              data-favorite="${toy.id}">
              <img class="toy__favorite_empty" src="" alt="add to favorite" />
              <img class="toy__favorite_full" src="" alt="added to favorite" />
            </span>
          </div>
        </div>
        <div class="toy__img">
          <img src="${path}" alt="${toy.name}" />
        </div>
        <div class="toy__ribbon"><span class="toy__ribbon-text">best</span></div>
      </div>
    </div>
  `;
  }
}

export default ToyView;
