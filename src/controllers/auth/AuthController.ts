import Client from '../../core/client/Client';
import config from '../../config';
import { store } from '../../store';
import { showToast } from '../../utils/toast/Toast';
import router from '../../router';
import { errorHandler } from '../../utils/errorHandler/ErrorHandler';

class AuthController {
  public signIn(data: ILoginData) {
    return Client
      .post(`${config.API_URL}/auth/signin`, {
        data: JSON.stringify(data),

      })
      .then(() => {
        router.go('/messages');
        return true;
      })
      .catch((e) => {
        errorHandler(e);
        return false;
      });
  }

  public signUp(data: IRegistrationData) {
    return Client
      .post(`${config.API_URL}/auth/signup`, {
        data: JSON.stringify(data),

      })
      .then(() => {
        router.go('/messages');
        return true;
      })
      .catch((e) => {
        errorHandler(e);
        return false;
      });
  }

  public signOut() {
    Client
      .post(`${config.API_URL}/auth/logout`)
      .then(() => {
        router.go('/login');
      })
      .catch(() => {
        showToast('Something went wrong', 'error');
      });
  }

  public checkAuth() {
    return Client
      .get(`${config.API_URL}/auth/user`)
      .then((response: any) => {
        const user = response;
        user.isLoading = false;
        store.setState({
          currentUser: user,
        });
        localStorage.setItem('userId', user.id);

        return true;
      })
      .catch(() => {
        localStorage.removeItem('userId');
        return false;
      });
  }
}

export default new AuthController();
