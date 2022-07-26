import Client from '../../core/client/Client';
import config from '../../config';
import router from '../../router';
import { store } from '../../store';
import { errorHandler } from '../../utils/errorHandler/ErrorHandler';
import { showToast } from '../../utils/toast/Toast';
import { getPeerData } from '../../utils/getPeerData/GetPeerData';
import dateFormater from '../../utils/dateFormater/DateFormater';

class ChatController {
  public newChat(data: INewChatData) {
    return Client
      .post(`${config.API_URL}/chats`, {
        data: JSON.stringify(data),

      })
      .then((response: TObj) => {
        if (response!.id) {
          router.go(`/messages/${response!.id}/welcome`, true);
          return response!.id;
        }
        return false;
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public getChats(title = '') {
    return Client
      .get(`${config.API_URL}/chats?title=${title}`)
      .then((chatList: TObj[]) => {

        chatList.forEach((chat: TObj, key: number) => {
          if (chat.last_message !== null) {
            if (getPeerData(chat.last_message.content)) {
              chatList[key].last_message.content = 'Video call';
            }
            chatList[key].last_message.time = dateFormater(chatList[key].last_message.time);
          }

        });


        store.setState({
          chatList,
        });
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public searchMembers(data: ISearchMembers) {

    return Client
      .post(`${config.API_URL}/user/search`, { data: JSON.stringify(data) })
      .then((searchedMembers: TObj) => {
        store.setState({
          searchedMembers,
        });
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public addMember(data: IAddMemeberData) {
    return Client
      .put(`${config.API_URL}/chats/users`, { data: JSON.stringify(data) })
      .then(() => {
        this.getChatUsers(data.chatId);
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public removeMember(data: IAddMemeberData) {
    return Client
      .delete(`${config.API_URL}/chats/users`, { data: JSON.stringify(data) })
      .then(() => {
        this.getChatUsers(data.chatId);
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public getCurrentChat(chatId: number) {

    const chats = store.getState().chatList;
    chats.forEach((item: TChatInfo) => {
      if (item.id == chatId) {
        store.setState({
          currentChat: item,
        });
      }
    });

    //Получение информации о пользователях чата
    if (chatId !== null) {
      this.getChatUsers(chatId);
    }
  }

  public getChatUsers(chatId: number) {
    return Client
      .get(`${config.API_URL}/chats/${chatId}/users`)
      .then((response: TObj) => {
        store.setState({
          currentChat: {
            users: response,
          },
        });
      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public removeChat(chatId: number) {
    return Client
      .delete(`${config.API_URL}/chats`, {
        data: JSON.stringify({ chatId }),

      })
      .then(() => {
        store.setState({
          currentChat: { id: null },
        });
        router.go('/messages', true);

      })
      .catch((e) => {
        errorHandler(e);
      });
  }

  public updateAvatar(data: FormData) {
    return Client
      .put(`${config.API_URL}/chats/avatar`, {
        data,

      })
      .then((chat: TObj) => {
        showToast('Avatar updated', 'success');
        store.setState({
          currentChat: chat,
        });
        this.getChats();
      })
      .catch(errorHandler);
  }

  public uploadPhoto(data: FormData) {
    return Client
      .post(`${config.API_URL}/resources`, {
        data,

      })
      .then((response: TObj) => {
        return response;
      })
      .catch(errorHandler);
  }

  getToken(chatId: number) {
    return Client
      .post(`${config.API_URL}/chats/token/${chatId}`)
      .then((response: TObj) => response!.token)
      .catch((e) => {
        errorHandler(e);
      });
  }
}

export default new ChatController();
