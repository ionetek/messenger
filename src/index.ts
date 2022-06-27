// PAGES
import Messages from './pages/messages/Messages';
import MessagesEmpty from './pages/messages-empty/MessagesEmpty';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import Account from './pages/account/Account';
import AccountEdit from './pages/account-edit/AccountEdit';
import PasswordEdit from './pages/password-edit/PasswordEdit';
import Error404 from './pages/404/Error404';
import Error500 from './pages/500/Error500';
import render from './core/renderDOM/RenderDOM';

// DATA
import { state } from './state';

// STYLES
import './styles/Style.css';

// ROUTER
const path: string = document.location.pathname;
let app: any = {};

switch (path) {
  case '/login.html':
    app = new Login(state);
    break;
  case '/registration.html':
    app = new Registration(state);
    break;
  case '/messages.html':
    app = new Messages(state);
    break;
  case '/account.html':
    app = new Account(state);
    break;
  case '/account-edit.html':
    app = new AccountEdit(state);
    break;
  case '/password-edit.html':
    app = new PasswordEdit(state);
    break;
  case '/index.html':
    app = new MessagesEmpty(state);
    break;
  case '/':
    app = new Login(state);
    break;
  case '/500.html':
    app = new Error500(state);
    break;
  default:
    app = new Error404(state);
}

render(app);
