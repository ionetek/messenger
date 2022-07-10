import Block from '../../core/block/Block';
import './Dialog.css';
import DialogMenuIcon from './dialogMenuIcon.svg';
import AttachmentIcon from './attachmentIcon.svg';
import SubmitIcon from './submitIcon.svg';
import EmptyDialog from './empty.svg';
import validate from '../../utils/validate/Validate';
import { store } from '../../store';
import messageController from '../../controllers/message/MessageController';
import Input from '../input/Input';
import MessagesList from '../messagesList/MessagesList';
import chatController from '../../controllers/chat/ChatController';
import config from '../../config';
import { getFormData } from '../../utils/getFormData/GetFormData';

export default class Dialog extends Block {
  constructor(props: TProps = {}) {
    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      messageValue: '',
      currentUserId: localStorage.getItem('userId'),
      currentChat: store.getState().currentChat,
      isLoading: true,
    };

    const customEvents = [
      {
        selector: '#messageForm',
        events: {
          submit: (e: Event) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const formData = getFormData([...target]);
            // Костыльный метод, блокирующий вызовы blur, при отправке формы
            this.removeChildrenListeners();
            this.handleSubmit(formData);
          },
        },
      },
    ];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, errors, ...defaultValues };

    super(propsAndChildren, customEvents);
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        messages: state.messages,
        currentChat: state.currentChat,
      });
    });
  }

  handleSubmit(formData: IMessageData) {
    if (validate(this, true)) {
      messageController.sendMessage(formData);

      const self = this;
      setTimeout(() => {
        self.scrollDown();
      }, 300);
      this.setProps({ messageValue: '' });
      chatController.getChats();
    }
  }

  public scrollDown() {
    const dialogBody = this.getContent()!.querySelector('.dialog__body');
        dialogBody!.scrollTo({
          top: dialogBody!.scrollHeight,
        });
  }

  render() {
    this.children.messageInput = new Input({
      name: 'message',
      type: 'text',
      errors: this.props.errors,
      value: this.props.messageValue,
      events: {
        blur: (e: any) => {
          this.setProps({ messageValue: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Введите сообщение',
        rules: {
          min: 1,
        },
      },
    });
    this.children.messagesList = new MessagesList();

    const temp = `<div class="dialog">
            
            <% if (this.currentChat.id) { %>
            <div class="dialog__header">
                <div class="dialog__header-photo">
                    <% if (this.currentChat.avatar !== null) { %>
                                <img src="${config.RESOURCES_URL}<% this.currentChat.avatar %>" />
                            <% } else { %>
                                <img src="/images/avatar.svg" />
                            <% } %>
                </div>
                <div class="dialog__header-title">
                    <% this.currentChat.title %>
                </div>
                <div class="dialog__header-menu">
                    <a class="btn" onclick="alert('Пока не работаю. Лето все-таки 😎')"><img src="${DialogMenuIcon}" /></a>
                </div>
            </div>
            <div class="dialog__body">
                <% this.messagesList %>
            </div>
            <form id="messageForm">
            <div class="dialog__footer">
                
                  <div class="dialog__footer-attachment">
                      <a class="btn" onclick="alert('Пока не работаю. И вам не советую 😎')"><img src="${AttachmentIcon}" /></a>
                  </div>
                  <div class="dialog__footer-textarea">
                      <div class="input-wrapper mb-0">
                          <% this.messageInput %>
                      </div>
                      
                  </div>
                  <div class="dialog__footer-submit">
                          <button type="submit" class="btn btn-success p-0"><img src="${SubmitIcon}" /></button>
                  </div>
                
            </div>
            </form>
            <% } else { %>
            <div class="dialog__body dialog__body_empty">
                <div>
                    <img src="${EmptyDialog}" />
                </div>
                <div>
                    <p class="text-gray">Select a chat or create new to send a message</p>
                </div>
            </div>
            <% }  %>
        </div>`;
    return this.compile(temp, this.props);
  }
}
