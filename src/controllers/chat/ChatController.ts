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
      .then((response: TObj) => {
        if (response!.id) {
          router.go(`/messages/${response!.id}`, true);
          return response!.id;
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
      .then((chatList: TObj) => {
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
      .then((response: TObj) => {
        console.log(`ТОКЕН ПОЛУЧЕН  : ${response!.token}`);
        return response!.token;
      })
      .catch((e) => {
        errorHandler(e);
      });
  }
}

export default new ChatController();
