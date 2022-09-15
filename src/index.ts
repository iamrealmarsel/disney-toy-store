import AppController from './controller/app-controller';
import './sass/main.scss';

const rootElement = document.querySelector(`#root`) as HTMLElement;
const appController = new AppController(rootElement);

appController.init();
