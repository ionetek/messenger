import { nanoid } from 'nanoid';
import EventBus from '../eventbus/EventBus';
import Templator from '../templator/Templator';

// Нельзя создавать экземпляр данного класса
class Block {
    static EVENTS = {
      INIT: 'init',
      FLOW_CDM: 'flow:component-did-mount',
      FLOW_CDU: 'flow:component-did-update',
      FLOW_RENDER: 'flow:render',
    } as const;

    protected _element: Nullable<HTMLElement> = null;

    public id = nanoid(6);

    public children: { [id: string]: Block } = {};

    public customEvents: any[] = [];

    protected eventBus: () => EventBus;

    public props: any = {};

    constructor(propsAndChildren: {} = {}, customEvents: any[] = []) {
      // Получаем пропсы и отделяем из них children'ов
      const { children, props } = this._getChildren(propsAndChildren);
      this.children = children;

      if (customEvents.length > 0) {
        this.customEvents = customEvents;
      }

      const eventBus = new EventBus();

      this.props = this._makePropsProxy(props);

      this.eventBus = () => eventBus;

      this._registerEvents(eventBus);
      eventBus.emit(Block.EVENTS.INIT);
    }

    private _getChildren(propsAndChildren: TProps) {
      const children: { [id: string]: Block } = {};
      const props: TProps = {};

      Object.entries(propsAndChildren).forEach(([key, value]) => {
        if (value instanceof Block) {
          children[key] = value;
        } else {
          props[key] = value;
        }
      });

      return { children, props };
    }

    private _registerEvents(eventBus: EventBus) {
      eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
      eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
      eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
      eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _createResources() {
      this._element = this._createDocumentElement('div');
    }

    private _addEvents() {
      const { events = {} } = this.props;

      Object.keys(events).forEach((eventName) => {
        if (eventName === 'blur' || eventName === 'focus') {
          if (this.element!.querySelector('input')) {
                    this.element!.querySelector('input')!.addEventListener(eventName, events[eventName]);
          }
          if (this.element!.querySelector('textarea')) {
                    this.element!.querySelector('textarea')!.addEventListener(eventName, events[eventName]);
          }
        } else {
                this.element!.addEventListener(eventName, events[eventName]);
        }
      });

      this.customEvents.forEach((elem) => {
        Object.keys(elem.events).forEach((eventName) => {
                this.element!.querySelector(elem.selector)!.addEventListener(eventName, elem.events[eventName]);
        });
      });
    }

    // Костыльный метод, блокирующий вызовы blur, при отправке формы
    protected removeChildrenListeners() {
      Object.entries(this.children).forEach((elem) => {
        if (elem[1].props.events) {
          elem[1].setProps({ events: {} });
        }
      });
    }

    protected init() {
      this._createResources();
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    private _componentDidMount() {
      this.componentDidMount();
    }

    protected componentDidMount() {
    }

    protected dispatchComponentDidMount() {
      this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate() {
      const response = this.componentDidUpdate();
      if (!response) {
        return;
      }
      this._render();
    }

    protected componentDidUpdate() {
      return true;
    }

    public setProps = (nextProps: TProps) => {
      if (!nextProps) {
        return;
      }

      Object.assign(this.props, nextProps);
    };

    protected compile(template: string, props: TProps) {
      const propsAndStubs = { ...props };

      Object.entries(this.children).forEach(([key, child]) => {
        propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
      });

      const fragment = this._createDocumentElement('template');

      fragment.innerHTML = new Templator(template).compile(propsAndStubs);

      Object.values(this.children).forEach((child) => {
        // @ts-ignore
        const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
        stub.replaceWith(child.getContent());
      });
      // @ts-ignore
      return fragment.content;
    }

    get element() {
      return this._element;
    }

    private _render() {
      const block = this.render();
      // @ts-ignore
      const newElement = block.firstElementChild;

      if (this._element) {
        this._element.replaceWith(newElement);
      }
      this._element = newElement;
      this._addEvents();
    }

    // Переопределяется пользователем. Необходимо вернуть разметку
    protected render() {

    }

    getContent() {
      return this.element;
    }

    private _makePropsProxy(props: TProps) {
      // Можно и так передать this
      // Такой способ больше не применяется с приходом ES6+
      const self = this;

      return new Proxy(props, {
        get(target, prop: string) {
          const value = target[prop];
          return typeof value === 'function' ? value.bind(target) : value;
        },
        set(target: Record<string, unknown>, prop: string, value: unknown) {
          // eslint-disable-next-line no-param-reassign
          target[prop] = value;
          self.eventBus().emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
          return true;
        },
        deleteProperty() {
          throw new Error('Нет доступа');
        },
      });
    }

    private _createDocumentElement(tagName: string) {
      // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
      const element = document.createElement(tagName);
      return element;
    }
}

export default Block;
