import { IPayload, ISelectedSettings, IToy } from '../types';
import { createElement } from '../utils';
import NotFoundView from './not-found-view';
import ToyView from './toy-view';

class ToysView {
  private data: IToy[];
  private element: HTMLElement;
  private selectedSettings: ISelectedSettings;

  constructor(
    data: IToy[],
    selectedSettings: ISelectedSettings,
    callback: (payload: IPayload) => void
  ) {
    this.data = data;
    this.selectedSettings = selectedSettings;
    this.element = this.generateElement(callback);
  }

  public removeActiveClass(id: string): void {
    this.element.querySelector(`[data-store='${id}']`)?.classList.remove('active');
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private generateElement(callback: (payload: IPayload) => void): HTMLElement {
    const toyListElement = createElement(this.makeHTML());

    if (this.data.length === 0) {
      toyListElement.append(new NotFoundView().getElement());

      return toyListElement;
    }

    this.data.forEach(async (item) => {
      const image = await import(/* webpackMode: "eager" */ `../../public/img/toys/${item.image}`);
      const toyComponent = new ToyView(item, image.default, this.selectedSettings);
      toyComponent.setStoreClickHandler(callback);
      toyComponent.setFavoriteClickHandler(callback);

      toyListElement.append(toyComponent.getElement());
    });

    return toyListElement;
  }

  private makeHTML(): string {
    return `
    <section class="toys">
    </section>
    `;
  }
}

export default ToysView;
