import { v4 as uuid } from 'uuid';
import EventBus from '../eventbus/EventBus';
import Templator from '../templator/Templator';
import router from '../../router';

// Нельзя создавать экземпляр данного класса
class Block {
    static EVENTS = {
      INIT: 'init',
      FLOW_CDM: 'flow:component-did-mount',
      FLOW_CDU: 'flow:component-did-update',
      FLOW_RENDER: 'flow:render',
    } as const;

    protected _element: HTMLElement;

    public id = uuid();

    public children: { [id: string]: Block } = {};

    // Дефолтный customEvent для поддержки роутерных ссылок
    public customEvents: ICustomEvent[] = [{
      selector: '.router-link',
      events: {
        click: (e: Event) => {
          e.preventDefault();

          if (e.currentTarget) {
            const element = e.currentTarget as HTMLElement;
            if (element.getAttribute('router-force')) {
              router.go(element.getAttribute('href'), true);
            } else {
              router.go(element.getAttribute('href'));
            }
          }
        },
      },
    }];

    protected eventBus: () => EventBus;

    public props: TObj = {};

    constructor(propsAndChildren: {} = {}, customEvents: ICustomEvent[] = []) {
      // Получаем пропсы и отделяем из них children'ов
      const { children, props } = this._getChildren(propsAndChildren);
      this.children = children;

      if (customEvents.length > 0) {
        this.customEvents = [...this.customEvents, ...customEvents];
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
          if (this.element) {
            if (this.element!.querySelectorAll(elem.selector).length > 0) {
                        this.element!.querySelectorAll(elem.selector).forEach((currentValue) => {
                          currentValue.removeEventListener(eventName, elem.events[eventName], true);
                          // Проверяем, не навесили ли мы на этот элемент eventListener ранее
                          if (!currentValue.getAttribute(`event-${eventName}`)) {
                            currentValue.addEventListener(eventName, elem.events[eventName]);
                          }
                          // Добавляем на элемент специальный атрибут, указывающий на то, что на него навешен eventListener
                          currentValue.setAttribute(`event-${eventName}`, 'true');
                        });
            }
          }
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
      this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidMount() {
      this.componentDidMount();
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
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

      const fragment = this._createDocumentElement('template') as HTMLTemplateElement;

      fragment.innerHTML = new Templator(template).compile(propsAndStubs);

      Object.values(this.children).forEach((child) => {
        const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
        if (stub) {
          stub.replaceWith(child.getContent());
        }
      });
      return fragment.content;
    }

    get element(): HTMLElement {
      return this._element;
    }

    private _render(): any {
      const block = this.render();

      const newElement = block.firstElementChild as HTMLTemplateElement;

      if (this._element) {
        this._element.replaceWith(newElement);
      }
      this._element = newElement;
      this._addEvents();
    }

    // Переопределяется пользователем. Необходимо вернуть разметку
    protected render(): any {
      return document.createElement('div');
    }

    getContent(): HTMLElement {
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

    public show(force: boolean = false) {
      if (force) {
            this.getContent()!.classList.add('route-active');
      } else {
        if (this.getContent()) {
                this.getContent()!.classList.add('route-hidden');

                setTimeout(() => {
                    this.getContent()!.classList.remove('route-hidden');
                    this.getContent()!.classList.add('route-active');
                }, 200);
        }
      }
    }

    public hide() {
        this.getContent()!.classList.remove('route-active');
        this.getContent()!.classList.add('route-hidden');
    }

    public destroy() {
      if (this._element) {
        this._element.remove();
        this.onDestroy();
      }
    }

    public onDestroy() {

    }
}

export default Block;
