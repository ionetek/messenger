import Client from '../../core/client/Client';
import config from '../../config';
import router from '../../router';
import { store } from '../../store';
import { errorHandler } from '../../utils/errorHandler/ErrorHandler';

class ChatController {
  public newChat(data: INewChatData) {
    return Client
      .post(`${config.API_URL}/chats`, {
        data: JSON.stringify(data),

      })
      .then((e: TObj) => {
        if (e!.id) {
          router.go(`/messages/${e!.id}`, true);
          return e!.id;
        }
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public getChats() {
    console.log('ПОЛУЧАЕМ ЧАТЫ');
    return Client
      .get(`${config.API_URL}/chats`)
      .then((chatList) => {
        store.setState({
          chatList,
        });
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  getToken(chatId: number) {
    console.log(`ПОЛУЧАЕМ ТОКЕН ДЛЯ ЧАТА ${chatId}`);
    return Client
      .post(`${config.API_URL}/chats/token/${chatId}`)
      .then((e: TObj) => {
        console.log(`ТОКЕН ПОЛУЧЕН  : ${e!.token}`);
        return e!.token;
      })
      .catch((e) => {
        errorHandler(e);
      });
  }
}

export default new ChatController();
