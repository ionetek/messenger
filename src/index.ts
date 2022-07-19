import router from './router';
import authController from './controllers/auth/AuthController';

// PAGES
import Messages from './pages/messages/Messages';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import Account from './pages/account/Account';
import AccountEdit from './pages/account-edit/AccountEdit';
import PasswordEdit from './pages/password-edit/PasswordEdit';
import Error404 from './pages/404/Error404';
import Error500 from './pages/500/Error500';

// STYLES
import './styles/Style.css';

// ROUTER

router
  .setPublicRedirect('/messages')
  .setProtectedRedirect('/login')
  .onRoute(authController.checkAuth)
  .use('/', Login, 'public')
  .use('/login', Login, 'public')
  .use('/registration', Registration, 'public')
  .use('/messages', Messages, 'protected')
  .use('/messages/:id', Messages, 'protected')
  .use('/messages/:id/:welcome', Messages, 'protected')
  .use('/account', Account, 'protected')
  .use('/account-edit', AccountEdit, 'protected')
  .use('/password-edit', PasswordEdit, 'protected')
  .use('/500', Error500)
  .use('*', Error404)
  .start();
