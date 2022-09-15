import githubLog from '../../public/img/github-logo.png';
import rsschoolLog from '../../public/img/rs_school.svg';
import { createElement } from '../utils';

class FooterView {
  public getElement(): HTMLElement {
    return createElement(this.makeHTML());
  }

  private makeHTML(): string {
    return `
    <footer class="footer">
      <a class="footer__github" href="https://github.com/iamrealmarsel" target="_blank">
        <img src="${githubLog}" alt="github-logo" />
      </a>
      <span>2022</span>
      <a class="footer__rsschool" href="https://rs.school/js/" target="_blank">
        <img src="${rsschoolLog}" alt="rs-school-logo" />
      </a>
    </footer>
  `;
  }
}

export default FooterView;
