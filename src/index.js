//PAGES
import Messages from './pages/messages/Messages';
import MessagesEmpty from './pages/messages-empty/MessagesEmpty';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import Account from './pages/account/Account';
import AccountEdit from './pages/account-edit/AccountEdit';
import PasswordEdit from "./pages/password-edit/PasswordEdit";
import Error404 from './pages/404/Error404';
import Error500 from './pages/500/Error500';

//DATA
import {state} from "./state";

//STYLES
import "./styles/Style.css";

let path = document.location.pathname;
let app = document.getElementById('root');

switch (path) {
    case '/login.html':
        app.innerHTML = Login(state);
        break;
    case '/registration.html':
        app.innerHTML = Registration(state);
        break;
    case '/messages.html':
        app.innerHTML = Messages(state);
        break;
    case '/account.html':
        app.innerHTML = Account(state);
        break;
    case '/account-edit.html':
        app.innerHTML = AccountEdit(state);
        break;
    case '/password-edit.html':
        app.innerHTML = PasswordEdit(state);
        break;
    case '/index.html':
        app.innerHTML = MessagesEmpty(state);
        break;
    case '/':
        app.innerHTML = Login(state);
        break;
    case '/500.html':
        app.innerHTML = Error500(state);
        break;
    default:
        app.innerHTML = Error404(state);
}





