import EventBus from '../eventbus/EventBus';
import isEqual from '../../utils/isEqual/IsEqual';
import merge from '../../utils/mergeDeep/MergeDeep';
import deepClone from '../../utils/deepClone/deepClone';

class Store {
  private _state: TState;

  private _oldState: TState;

  public _subscribers: TObj;

  private eventBus: () => EventBus;
  

  static EVENTS = {
    INIT: '@@init',
    STORE_DM: '@@store-did-mount',
    STORE_DU: '@@store-did-update',
    USE: '@@use',
  };

  constructor(initialState: TState = {}) {
    const eventBus = new EventBus();
    this._state = this._makeStateProxy(initialState);
    this._oldState = { ...this._state };
    this._subscribers = {};
    this.eventBus = () => eventBus;

    // Регистрируем события жизненного цикла
    eventBus.on(Store.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Store.EVENTS.STORE_DM, this._storeDidMount.bind(this));
    eventBus.on(Store.EVENTS.STORE_DU, this._storeDidUpdate.bind(this));
    eventBus.on(Store.EVENTS.USE, this._use.bind(this));

    eventBus.emit(Store.EVENTS.INIT);
  }

  private _init() {
    this.eventBus().emit(Store.EVENTS.STORE_DM);
  }

  private _storeDidMount() {
    this.storeDidMount();
  }

  public storeDidMount() {
  }

  private _storeDidUpdate(oldState: TState, newState: TState) {
    const response = this.storeDidUpdate(oldState, newState);
    if (response) {
      this.eventBus().emit(Store.EVENTS.USE);
    }
  }

  public storeDidUpdate(oldState: TState = {}, newState: TState = {}) {
    return !isEqual(oldState, newState);
  }

  private _use() {
    for (const id in this._subscribers) {
      if (this._subscribers[id]) {
        this._subscribers[id](this._state);
      }
    }
  }

  public subscribe(subscriber: (state: TState) => void, id = '') {
    if (id) {
      this._subscribers[id] = subscriber;
      subscriber(this._state);
    }
  }

  public setState(newState: TState) {

    if (!newState) {
      return;
    }
    const merged = merge(deepClone(this._state), newState);
    Object.assign(this._state, merged);
  }

  public getState() {
    return this._state;
  }

  private _makeStateProxy(state: TState) {
    const self = this;
    return new Proxy(state, {
      set: (target: TState, item: string, value: unknown) => {
        const t = target;
        t[item] = value;
        this.eventBus().emit(Store.EVENTS.STORE_DU, self._oldState, t);
        self._oldState = { ...t };
        return true;
      },
      deleteProperty: () => {
        throw new Error('Нет доступа');
      },
    });
  }
}

export default Store;
