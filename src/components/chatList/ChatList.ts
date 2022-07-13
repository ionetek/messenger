import Block from '../../core/block/Block';
import './ChatList.css';
import AccountIcon from './account.svg';
import NewChatIcon from './newChat.svg';
import NewChatModal from '../newChatModal/NewChatModal';
import { store } from '../../store';
import chatController from '../../controllers/chat/ChatController';
import config from '../../config';

export default class ChatList extends Block {
  constructor(props: TProps = {}) {
    const defaultValues = {
      chatList: store.getState().chatList,
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
      this._setChatInfo(this.props.currentChatId);
    });
  }

  private _setChatInfo(chatId: number) {
    const chats = store.getState().chatList;
    chats.forEach((item: TChatInfo) => {
      if (item.id == chatId) {
        store.setState({
          currentChat: item,
        });
      }
    });
  }

  render() {
    this.children.newChatModal = new NewChatModal({});
    const temp = `<div><h1>Messages <a href="/account" class="btn router-link"><img src="${AccountIcon}" /></a></h1>
            <div class="chat-list__header">
                    <div class="input-wrapper">
                        <input class="input-wrapper__form-control-gray" placeholder="Search">
                    </div>
                    <a class="btn" id="create-new-chat"><img src="${NewChatIcon}" title="New chat" /></a>
                </div>
            <div class="chat-list">
                
                <% this.newChatModal %>
                <% if(this.chatList) {  %>
                <% for (key in this.chatList) { %>
                    <a router-force="true" class="chat-list__item router-link <% if (this.currentChatId == this.chatList[key].id) { %> chat-list__item-active<% } %>" href="/messages/<% this.chatList[key].id %>">
                        <div class="chat-list__item-photo">
                            <% if (this.chatList[key].avatar !== null && typeof this.chatList[key].avatar === 'string') { %>
                                <img src="${config.RESOURCES_URL}<% this.chatList[key].avatar %>" />
                            <% } else { %>
                                <img src="/images/avatar.svg" />
                            <% } %>
                        </div>
                        <div class="chat-list__item-message">
                            <div class="chat-list__item-message-name"><% this.chatList[key].title %></div>
                            <% if (this.chatList[key].last_message && this.chatList[key].last_message.user) { %>
                                <div class="chat-list__item-message-text">
                                    <% if (this.chatList[key].last_message && this.chatList[key].last_message.user) { %>
                                        <% this.chatList[key].last_message.user.first_name %>: <% this.chatList[key].last_message.content %>
                                    <% } %>
                                </div>
                            <% } else { %>
                                <div class="chat-list__item-message-text">No messages yet</div>
                            <% } %>
                        </div>
                        <div class="chat-list__item-info">
                            <div class="chat-list__item-message-date">04:20</div>
                            <div class="chat-list__item-message-new">
                                <% if (this.chatList[key].unread_count > 0) { %>
                                    <div class="message-new-count"><% this.chatList[key].unread_count %></div>
                                <% } %>
                            </div>
                        </div>
                       
                    </a>
                <% } %>
            <% } %>
            
            </div>
</div>`;
    return this.compile(temp, this.props);
  }
}
