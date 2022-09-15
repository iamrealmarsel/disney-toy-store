import videoCover from '../../public/video/disney-intro.mp4';
import { IDisplayedFilters, IPayload, ISelectedSettings, IState, IToy } from '../types';
import { createElement } from '../utils';
import FiltersView from './filters-view';
import FooterView from './footer-view';
import HeaderView from './header-view';
import ToysView from './toys-view';

class AppView {
  private element: HTMLElement;
  private headerComponent: HeaderView;
  private toysComponent: ToysView;
  private filtersComponent: FiltersView;
  private callback: (payload: IPayload) => void;
  private footerComponent: FooterView;
  private isMuted: boolean;

  constructor(state: IState, callback: (payload: IPayload) => void) {
    this.isMuted = true;
    this.callback = callback;

    this.headerComponent = new HeaderView(
      state.selectedSettings.store,
      state.selectedSettings.favorites,
      this.isMuted
    );
    this.filtersComponent = new FiltersView(state.displayedFilters, state.selectedSettings);
    this.toysComponent = new ToysView(state.displayedToys, state.selectedSettings, this.callback);
    this.footerComponent = new FooterView();

    this.element = this.generateElement();
    this.setVolumeClickHandler();
  }

  public showLimitNotice(id: string): void {
    alert('Sorry, all slots are full');
    this.toysComponent.removeActiveClass(id);
  }

  public redrawToys(displayedToys: IToy[], selectedSettings: ISelectedSettings): void {
    const oldToysElement = this.toysComponent.getElement();
    this.toysComponent = new ToysView(displayedToys, selectedSettings, this.callback);
    oldToysElement.replaceWith(this.toysComponent.getElement());
  }

  public redrawFilters(
    displayedFilters: IDisplayedFilters,
    selectedSettings: ISelectedSettings
  ): void {
    const oldFiltersElement = this.filtersComponent.getElement();
    this.filtersComponent = new FiltersView(displayedFilters, selectedSettings);
    oldFiltersElement.replaceWith(this.filtersComponent.getElement());
  }

  public redrawHeader(store: Set<number>, favorites: Set<number>): void {
    const oldHeaderElement = this.headerComponent.getElement();
    this.headerComponent = new HeaderView(store, favorites, this.isMuted);
    oldHeaderElement.replaceWith(this.headerComponent.getElement());
    this.setVolumeClickHandler();
  }

  private setVolumeClickHandler() {
    const videoCoverElement = this.element.querySelector('.video-cover') as HTMLMediaElement;

    this.element.querySelector('.header__volume')?.addEventListener('click', (e) => {
      (e.currentTarget as HTMLElement).classList.toggle('active');
      videoCoverElement.muted = !videoCoverElement.muted;
      this.isMuted = videoCoverElement.muted;
    });
  }

  public setResetSearchClickHandler(): void {
    this.filtersComponent.setResetSearchClickHandler(this.callback);
  }

  public setResetFiltersClickHandler(): void {
    this.filtersComponent.setResetFiltersClickHandler(this.callback);
  }

  public setResetAllClickHandler(): void {
    this.filtersComponent.setResetAllClickHandler(this.callback);
  }

  public setSortClickHandler(): void {
    this.filtersComponent.setSortClickHandler(this.callback);
  }

  public setFilterValueClickHandler(): void {
    this.filtersComponent.setFilterValueClickHandler(this.callback);
  }

  public setFilterRangeClickHandler(): void {
    this.filtersComponent.setFilterRangeClickHandler(this.callback);
  }

  public setSearchInputHandler(): void {
    this.filtersComponent.setSearchInputHandler(this.callback);
  }

  public destroy(): void {
    this.element.remove();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public generateElement(): HTMLElement {
    const containerElement = createElement(this.makeHTML());
    const contentElement = containerElement.querySelector('.content__container') as HTMLElement;

    contentElement.append(this.headerComponent.getElement());
    contentElement.append(this.filtersComponent.getElement());
    contentElement.append(this.toysComponent.getElement());
    contentElement.append(this.footerComponent.getElement());

    return containerElement;
  }

  private makeHTML(): string {
    return `
    <main>
      <video class="video-cover" autoplay loop muted>
        <source src="${videoCover}" type="video/mp4" />
      </video>
      <div class="content">
        <div class="content__container">
        </div>
      </div>
    </main>
    `;
  }
}

export default AppView;
