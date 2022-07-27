import router from '../../router';
import Block from '../../core/block/Block';
import Sidebar from '../../components/sidebar/Sidebar';
import { store } from '../../store';
import chatController from '../../controllers/chat/ChatController';
import messageController from '../../controllers/message/MessageController';
import Dialog from '../../components/dialog/Dialog';

export default class Messages extends Block {
  protected currentChatId: number | null | string;

  constructor(props: TProps) {
    document.title = 'Messages';
    // Получаем ID чата из URL
    const { id = null } = router.getParams();
    const propsAndChildren = { ...props, currentChatId: id };

    super(propsAndChildren);

    // Получаем текущий чат и сообщения
    this.requestChat(id);
  }

  requestMessages(token: string, chatId: number) {
    const userId = store.getState().currentUser.id ?? localStorage.getItem('userId');

    messageController.connect({
      userId,
      chatId,
      token,
    });
  }

  requestChat(chatId: number | null) {
    if (!chatId) {
      return;
    }

    chatController.getToken(chatId)
      .then((token) => {
        if (token) {
          this.requestMessages(token, chatId);
        }
      });
  }

  render() {
    // CHILDREN LIST
    this.children.sidebar = new Sidebar({ currentChatId: this.props.currentChatId });
    this.children.dialog = new Dialog({ currentChatId: this.props.currentChatId });
    const temp = `
        <div class="main">
            <div class="sidebar">
            <% this.sidebar %>
            </div>
            <div class="content">
                <div class="panel">
                    <div class="container">
                        <% this.dialog %>
                    </div>
                </div>
            </div>
        </div>
    `;
    return this.compile(temp, this.props);
  }

  onDestroy() {
    if (store.getState().chatList.length) {
      messageController.closeConnection();
    }
  }
}
