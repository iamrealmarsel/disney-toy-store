import {
  actionAmount,
  actionBestseller,
  actionCartoon,
  actionHeight,
  actionPrice,
  actionResetAll,
  actionResetFilters,
  actionResetSearch,
  actionSearch,
  actionSort,
  actionType,
  actionUpdateFavorites,
  actionUpdateStore,
  actionYears,
} from '../actionCreators';
import { SettingsType } from '../constants';
import AppModel from '../model/app-model';
import { IPayload, IState } from '../types';
import AppView from '../view/app-view';

class AppController {
  private appComponent: AppView;
  private containerElement: HTMLElement;
  private appModel: AppModel;
  private state: IState;

  constructor(containerElement: HTMLElement) {
    this.updateSettingsHandler = this.updateSettingsHandler.bind(this);

    this.containerElement = containerElement;
    this.appModel = new AppModel();
    this.appModel.addObserver(this.redraw.bind(this));
    this.state = this.appModel.getState();
    this.appComponent = new AppView(this.state, this.updateSettingsHandler);
    this.setSettingHandlers();
  }

  public init(): void {
    this.containerElement.append(this.appComponent.getElement());
  }

  private setSettingHandlers() {
    this.appComponent.setFilterValueClickHandler();
    this.appComponent.setFilterRangeClickHandler();
    this.appComponent.setSearchInputHandler();
    this.appComponent.setSortClickHandler();
    this.appComponent.setResetSearchClickHandler();
    this.appComponent.setResetFiltersClickHandler();
    this.appComponent.setResetAllClickHandler();
  }

  private redraw(state: IState, updateType: SettingsType, id?: string): void {
    if (
      updateType === SettingsType.CARTOON ||
      updateType === SettingsType.HEIGHT ||
      updateType === SettingsType.TYPE ||
      updateType === SettingsType.BESTSELLER ||
      updateType === SettingsType.SEARCH ||
      updateType === SettingsType.RESET_SEARCH ||
      updateType === SettingsType.YEARS ||
      updateType === SettingsType.AMOUNT ||
      updateType === SettingsType.PRICE ||
      updateType === SettingsType.SORT
    ) {
      this.appComponent.redrawToys(state.displayedToys, state.selectedSettings);
    } else if (updateType === SettingsType.RESET_FILTERS) {
      this.appComponent.redrawFilters(state.displayedFilters, state.selectedSettings);
      this.appComponent.redrawToys(state.displayedToys, state.selectedSettings);
      this.setSettingHandlers();
    } else if (updateType === SettingsType.RESET_ALL) {
      this.appComponent.destroy();
      this.appComponent = new AppView(state, this.updateSettingsHandler);
      this.setSettingHandlers();
      this.containerElement.append(this.appComponent.getElement());
    } else if (updateType === SettingsType.STORE || updateType === SettingsType.FAVORITE) {
      this.appComponent.redrawHeader(
        state.selectedSettings.store,
        state.selectedSettings.favorites
      );
    } else if (updateType === SettingsType.STORE_LIMIT) {
      this.appComponent.showLimitNotice(id as string);
    }
  }

  private updateSettingsHandler(payload: IPayload): void {
    switch (Object.keys(payload)[0]) {
      case SettingsType.CARTOON:
        this.appModel.dispatch(actionCartoon(payload));

        break;
      case SettingsType.HEIGHT:
        this.appModel.dispatch(actionHeight(payload));

        break;
      case SettingsType.TYPE:
        this.appModel.dispatch(actionType(payload));

        break;
      case SettingsType.BESTSELLER:
        this.appModel.dispatch(actionBestseller(payload));

        break;
      case SettingsType.YEARS:
        this.appModel.dispatch(actionYears(payload));

        break;
      case SettingsType.AMOUNT:
        this.appModel.dispatch(actionAmount(payload));

        break;
      case SettingsType.PRICE:
        this.appModel.dispatch(actionPrice(payload));

        break;
      case SettingsType.SEARCH:
        this.appModel.dispatch(actionSearch(payload));

        break;
      case SettingsType.SORT:
        this.appModel.dispatch(actionSort(payload));

        break;
      case SettingsType.STORE:
        this.appModel.dispatch(actionUpdateStore(payload));

        break;
      case SettingsType.FAVORITE:
        this.appModel.dispatch(actionUpdateFavorites(payload));

        break;
      case SettingsType.RESET_SEARCH:
        this.appModel.dispatch(actionResetSearch(payload));

        break;
      case SettingsType.RESET_FILTERS:
        this.appModel.dispatch(actionResetFilters(payload));

        break;
      case SettingsType.RESET_ALL:
        this.appModel.dispatch(actionResetAll(payload));

        break;
    }
  }
}

export default AppController;
