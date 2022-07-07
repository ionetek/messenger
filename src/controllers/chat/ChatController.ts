import Client from '../../core/client/Client';
import config from '../../config';
import { showToast } from '../../utils/toast/Toast';
import router from '../../router';
import { store } from '../../store';

class ChatController {
  public newChat(data: INewChatData) {
    return Client
      .post(`${config.API_URL}/chats`, {
        withCredentials: true,
        data: JSON.stringify(data),

      })
      .then((e: TObj) => {
        if (e.id) {
          router.go(`/messages/${e.id}`, true);
          return e.id;
        }
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

  public getChats() {
    console.log('ПОЛУЧАЕМ ЧАТЫ');
    return Client
      .get(`${config.API_URL}/chats`, {
        withCredentials: true,

      })
      .then((chatList) => {
        store.setState({
          chatList,
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

  getToken(chatId: number) {
    console.log(`ПОЛУЧАЕМ ТОКЕН ДЛЯ ЧАТА ${chatId}`);
    return Client
      .post(`${config.API_URL}/chats/token/${chatId}`, {
        withCredentials: true,
      })
      .then((e: TObj) => {
        console.log(`ТОКЕН ПОЛУЧЕН  : ${e.token}`);
        return e.token;
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

export default new ChatController();
