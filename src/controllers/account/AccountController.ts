import Client from '../../core/client/Client';
import config from '../../config';
import { store } from '../../store';
import { showToast } from '../../utils/toast/Toast';
import router from '../../router';

class AccountController {
  public updateInfo(data: IUserInfoData) {
    return Client
      .put(`${config.API_URL}/user/profile`, {
        withCredentials: true,
        data: JSON.stringify(data),

      })
      .then(() => {
        showToast('Information updated', 'success');
        router.go('/account');
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

  public updatePassword(data: IPasswordUpdateData) {
    return Client
      .put(`${config.API_URL}/user/password`, {
        withCredentials: true,
        data: JSON.stringify(data),

      })
      .then(() => {
        showToast('Password updated', 'success');
        router.go('/account');
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

  public updateAvatar(data: FormData) {
    return Client
      .put(`${config.API_URL}/user/profile/avatar`, {
        withCredentials: true,
        headers: {},
        data,

      })
      .then((user) => {
        showToast('Avatar updated', 'success');
        store.setState({
          currentUser: user,
        });
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
}

export default new AccountController();
