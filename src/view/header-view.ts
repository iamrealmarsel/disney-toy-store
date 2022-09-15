import cartFull from '../../public/img/cart_full.svg';
import volume from '../../public/img/volume.svg';
import volumeMuted from '../../public/img/volume_muted.svg';
import { createElement } from '../utils';

class HeaderView {
  private element: HTMLElement;

  constructor(store: Set<number>, favorites: Set<number>, isMuted: boolean) {
    this.element = this.generateElement(store, favorites, isMuted);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private generateElement(
    store: Set<number>,
    favorites: Set<number>,
    isMuted: boolean
  ): HTMLElement {
    return createElement(this.makeHTML(store, favorites, isMuted));
  }

  private makeHTML(store: Set<number>, favorites: Set<number>, isMuted: boolean): string {
    return `
    <header class="header">
      <h1 class="header__title">
        <span class="header__color">Disney</span> Toy Store
      </h1>
      <div class="header__favorites">
        <img src="" alt="favorites" />
        <span class="header__favorites-count" >${favorites.size}</span>
      </div>
      <div class="header__volume ${isMuted ? '' : 'active'}">
        <img class="header__volume-muted" src="${volumeMuted}" alt="volume muted" />
        <img class="header__volume-on" src="${volume}" alt="volume" />
      </div>
      <div class="header__store">
        <img src="${cartFull}" alt="cart" />
        <span class="header__store-count">${store.size}</span>
      </div>
    </header>
    `;
  }
}

export default HeaderView;
