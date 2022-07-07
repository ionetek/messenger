import Client from '../../core/client/Client';
import config from '../../config';
import { store } from '../../store';
import { showToast } from '../../utils/toast/Toast';
import router from '../../router';
import { errorHandler } from '../../utils/errorHandler/ErrorHandler';

class AccountController {
  public updateInfo(data: IUserInfoData) {
    return Client
      .put(`${config.API_URL}/user/profile`, {
        data: JSON.stringify(data),

      })
      .then(() => {
        showToast('Information updated', 'success');
        router.go('/account');
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public updatePassword(data: IPasswordUpdateData) {
    return Client
      .put(`${config.API_URL}/user/password`, {
        data: JSON.stringify(data),

      })
      .then(() => {
        showToast('Password updated', 'success');
        router.go('/account');
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public updateAvatar(data: FormData) {
    return Client
      .put(`${config.API_URL}/user/profile/avatar`, {
        headers: false,
        data,

      })
      .then((user) => {
        showToast('Avatar updated', 'success');
        store.setState({
          currentUser: user,
        });
      })
      .catch((e) => {
        errorHandler(e);
      });
  }
}

export default new AccountController();
