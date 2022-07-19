import Block from '../../core/block/Block';
import './Sidebar.css';
import AccountIcon from './account.svg';
import NewChatIcon from './newChat.svg';
import NewChatModal from '../newChatModal/NewChatModal';
import { store } from '../../store';
import chatController from '../../controllers/chat/ChatController';
import Chats from '../chats/Chats';

export default class Sidebar extends Block {
  constructor(props: TProps = {}) {

    const defaultValues = {
      chatList: store.getState().chatList,
      filterByTitle: '',
    };

    const customEvents = [
      {
        selector: '#create-new-chat',
        events: {
          click: () => {
            this.children.newChatModal.setProps({ isOpened: true });
          },
        },
      },
      {
        selector: '#search',
        events: {
          input: (e: Event) => {
            const target = e.target as HTMLInputElement;
            chatController.getChats(target.value).then(() => {
              chatController.getCurrentChat(this.props.currentChatId);
            });
          },
        },
      },
    ];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren, customEvents);
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        chatList: state.chatList,
      });
    }, 'chatList');
    chatController.getChats().then(() => {
      chatController.getCurrentChat(this.props.currentChatId);

    });
  }


  render() {
    this.children.newChatModal = new NewChatModal({});
    this.children.chats = new Chats({ title: '', currentChatId: this.props.currentChatId });
    const temp = `<div><h1>Messages <a href="/account" class="btn router-link"><img src="${AccountIcon}" /></a></h1>
            <div class="chat-list__header">
                    <div class="input-wrapper">
                        
                        <input id="search" class="input-wrapper__form-control-gray" placeholder="Search by chat name" value="${this.props.filterByTitle}">
                    </div>
                    <a class="btn" id="create-new-chat"><img src="${NewChatIcon}" title="New chat" /></a>
                </div>
            <div class="chat-list">
                
                <% this.newChatModal %>
                <% this.chats %>
            
            </div>
</div>`;
    return this.compile(temp, this.props);

  }
}
