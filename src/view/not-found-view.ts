import crying from '../../public/img/crying.png';
import { createElement } from '../utils';

class NotFoundView {
  private element: HTMLElement;

  constructor() {
    this.element = this.generateElement();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private generateElement(): HTMLElement {
    return createElement(this.makeHTML());
  }

  private makeHTML(): string {
    return `
      <div class="not-found">
        <p class="not-found__msg">No matches found</p>
        <img class="not-found__img" src="${crying}" alt="not found">
      </div>
    `;
  }
}

export default NotFoundView;
