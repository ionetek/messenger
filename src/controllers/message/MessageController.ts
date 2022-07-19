import { showToast } from '../../utils/toast/Toast';
import config from '../../config';
import { store } from '../../store';
import { ABNORMAL_CLOSURE } from '../../utils/wsEventCodes/WsEventCodes';
import { errorHandler } from '../../utils/errorHandler/ErrorHandler';
import ChatController from '../chat/ChatController';
import { getPeerData } from '../../utils/getPeerData/GetPeerData';
import UserController from '../user/UserController';

class MessageController {
  private _ws: WebSocket;

  private _userId: number;

  private _chatId: number;

  private _token: string;

  private _ping: any;

  constructor() {
    this._onOpen = this._onOpen.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onError = this._onError.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  private _addEvents() {
    this._ws.addEventListener('open', this._onOpen);
    this._ws.addEventListener('message', this._onMessage);
    this._ws.addEventListener('error', this._onError);
    this._ws.addEventListener('close', this._onClose);
  }

  private _removeEvents() {
    this._ws.removeEventListener('open', this._onOpen);
    this._ws.removeEventListener('message', this._onMessage);
    this._ws.removeEventListener('error', this._onError);
    this._ws.removeEventListener('close', this._onClose);
  }

  private _onOpen() {
    this.getMessages({ offset: 0 });
    this._ping = setInterval(() => {
      this._ws.send('');
    }, 15000);
  }

  private _onMessage(response: MessageEvent) {

    let data = JSON.parse(response.data);


    if (Array.isArray(data)) {
      if (!data.length) {
        store.setState({ messages: [] });
      } else {
        data = data.filter((message: TObj) => !getPeerData(message.content));
        store.setState({
          messages: data.reverse(),
        });
      }
    } else if (typeof data === 'object' && (data.type === 'message' || data.type === 'file')) {

      let result = getPeerData(data.content);

      if (result) {
        let peerData = result as TObj;
        if (peerData.id) {
          if (store.getState().currentUser.id !== data.user_id) {
            UserController.getUser(data.user_id).then(user => {

              store.setState({
                videoCall: { user, peerId: peerData.id },
              });
            });
          }
        } else {
          //Звонок завершен
          store.setState({
            videoCall: { peerId: null, user: {} },
          });
        }
      } else {
        const messages = [...store.getState().messages, data];
        store.setState({ messages });
        ChatController.getChats();
      }
    }

  }

  private _onError(event: ErrorEvent) {
    errorHandler(event);
  }

  private _onClose(event: CloseEventInit) {
    this._removeEvents();
    if (event.wasClean) {
      showToast('Connection closed', 'error');
    } else {
      showToast('Network error', 'error');
    }

    // OTHER CODES https://www.iana.org/assignments/websocket/websocket.xhtml#table-close-code-number-range
    if (event.code === ABNORMAL_CLOSURE) {
      this._reconnect();
    }
  }

  private _reconnect() {
    this.connect({
      userId: this._userId,
      chatId: this._chatId,
      token: this._token,
    });
  }

  public connect(options: IWSOptions) {
    this._userId = options.userId;
    this._chatId = options.chatId;
    this._token = options.token;
    this._ws = new WebSocket(`${config.API_WS_URL}/chats/${options.userId}/${options.chatId}/${options.token}`);
    this._addEvents();
  }

  public getMessages(options: IGetMessagesOptions) {
    this._ws.send(JSON.stringify({
      content: options.offset.toString(),
      type: 'get old',
    }));
  }

  public closeConnection() {
    clearInterval(this._ping);
    if (this._ws) {
      this._ws.close();
      this._removeEvents();
    }
  }

  public sendMessage(data: IMessageData) {
    if (data.message) {
      this._ws.send(JSON.stringify({
        content: data.message,
        type: 'message',
      }));
    }
    if (data.resource) {
      this._ws.send(JSON.stringify({
        content: data.resource,
        type: 'file',
      }));
    }
  }
}

export default new MessageController();
