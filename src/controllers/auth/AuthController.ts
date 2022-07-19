import Client from '../../core/client/Client';
import config from '../../config';
import { store } from '../../store';
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
      })
      .catch(errorHandler);
  }

  public signUp(data: IRegistrationData) {
    return Client
      .post(`${config.API_URL}/auth/signup`, {
        data: JSON.stringify(data),

      })
      .then(() => {
        router.go('/messages');
      })
      .catch(errorHandler);
  }

  public signOut() {
    Client
      .post(`${config.API_URL}/auth/logout`)
      .then(() => {
        router.go('/login');
      })
      .catch(errorHandler);
  }

  public checkAuth() {
    return Client
      .get(`${config.API_URL}/auth/user`)
      .then((response: TObj) => {
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
