import Client from '../../core/client/Client';
import config from '../../config';
import { store } from '../../store';
import { showToast } from '../../utils/toast/Toast';
import router from '../../router';

class AuthController {
  public signIn(data: ILoginData) {
    return Client
      .post(`${config.API_URL}/auth/signin`, {
        withCredentials: true,
        data: JSON.stringify(data),

      })
      .then(() => {
        router.go('/messages');
        return true;
      })
      .catch((e) => {
        if (e.reason) {
          showToast(e.reason, 'error');
        } else {
          showToast('Something went wrong', 'error');
        }
        return false;
      });
  }

  public signUp(data: IRegistrationData) {
    return Client
      .post(`${config.API_URL}/auth/signup`, {
        withCredentials: true,
        data: JSON.stringify(data),

      })
      .then(() => {
        router.go('/messages');
        return true;
      })
      .catch((e) => {
        if (e.reason) {
          showToast(e.reason, 'error');
        } else {
          showToast('Something went wrong', 'error');
        }
        return false;
      });
  }

  public signOut() {
    Client
      .post(`${config.API_URL}/auth/logout`, {
        withCredentials: true,

      })
      .then(() => {
        router.go('/login');
      })
      .catch(() => {
        showToast('Something went wrong', 'error');
      });
  }

  public checkAuth() {
    return Client
      .get(`${config.API_URL}/auth/user`, {
        withCredentials: true,

      })
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
