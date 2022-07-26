import Block from '../block/Block';
import Route from '../route/Route';

class Router {
  public routes: Route[];

  public history: History;

  private _currentRoute: Route | null | undefined;

  private _rootQuery: string;

  private _pathnames: string[];

  private _publicPaths: string[];

  private _publicRedirect: string;

  private _protectedPaths: string[];

  private _protectedRedirect: string;

  private _onRouteCallback: () => any;

  static __instance: Router;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this._pathnames = [];

    this._publicPaths = [];
    this._publicRedirect = '/';

    this._protectedPaths = [];
    this._protectedRedirect = '/';

    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;
    this._onRouteCallback = () => {
    };

    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block, access: TAccess = '') {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    this._pathnames.push(pathname);

    if (access === 'public') {
      this._publicPaths.push(pathname);
    }

    if (access === 'protected') {
      this._protectedPaths.push(pathname);
    }

    return this;
  }

  public setPublicRedirect(route: string) {
    this._publicRedirect = route;
    return this;
  }

  public setProtectedRedirect(route: string) {
    this._protectedRedirect = route;
    return this;
  }

  public start() {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string, force: boolean = false) {
    const pathTemplate = this._hasRoute(pathname);
    const route = this.getRoute(pathTemplate);

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    if (route) {
      this._currentRoute = route;
      route.render(force);
    }
    if (this._onRouteCallback()) {
      this._onRouteCallback().then((result: boolean) => {
        if (result) {
          // РЕДИРЕКТ, ЕСЛИ МЫ АВТОРИЗОВАНЫ И ОТКРЫВАЕМ PUBLIC ROOT
          if (this._publicPaths.includes(pathTemplate)) {
            this.go(this._publicRedirect);
          }
        } else {
          // РЕДИРЕКТ, ЕСЛИ МЫ НЕ АВТОРИЗОВАНЫ И ОТКРЫВАЕМ PROTECTED ROOT
          if (this._protectedPaths.includes(pathTemplate)) {
            this.go(this._protectedRedirect);
          }
        }
      });
    }
  }

  public onRoute(callback: () => void) {
    this._onRouteCallback = callback;
    return this;
  }

  private _hasRoute(pathname: string) {
    let route = '*';

    this._pathnames.forEach((path) => {
      const pathParts = path.split('/');
      pathParts.shift();

      // Получаем регулярное выражение для пути роутера, чтобы его можно было сравнить с URL
      let replacedPath = path.replace(/:[A-Za-z0-9][^/]*/g, '[A-Za-z0-9-]*');

      // Убираем звездочку, чтобы регулярка не посыпалась
      replacedPath = replacedPath == '*' ? '' : replacedPath;
      // Проверяем соответствие пути и URL
      const regexp = new RegExp(`^${replacedPath}$`, 'g');

      if (regexp.test(pathname)) {
        route = path;
      }
    });

    return route;
  }

  go(pathname: string | null, force: boolean = false) {
    // Удаляем доменное имя из ссылки
    if (pathname) {
      const pathnameClear = pathname.replace(window.origin, '');
      this.history.pushState({}, '', pathnameClear);
      this._onRoute(pathnameClear, force);
    }
  }

  getParams(): IRouterRarams {
    let path;
    if (this._currentRoute) {
      path = this._currentRoute.getPathname();
    } else {
      path = '';
    }
    const url = window.location.pathname;

    const pathParts = path.split('/');
    pathParts.shift();

    const pathParams: Array<string | boolean> = [];
    // Получаем массив параметров, которые ищем в url
    pathParts.forEach((part) => {
      if (/:[A-Za-z0-9]/.test(part)) {
        pathParams.push(part.replace(':', ''));
      } else {
        pathParams.push(false);
      }
    });
    // Разбиваем url по /, ищем содержимое между / и присваиваем  это содержимое параметрам
    const urlParts = url.split('/');
    urlParts.shift();
    const urlParams: Record<string, any> = {};
    urlParts.forEach((part, index) => {
      if (typeof pathParams[index] === 'string' && pathParams[index] !== false) {
        const key = pathParams[index].toString();
        urlParams[key] = part;
      }
    });
    return urlParams;
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }

  getCurrentRoute() {
    return this._currentRoute;
  }
}

export default Router;
