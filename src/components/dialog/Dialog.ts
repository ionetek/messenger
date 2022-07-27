import Block from '../../core/block/Block';
import './Dialog.css';
import DialogMenuIcon from './dialogMenuIcon.svg';
import AttachmentIcon from './attachmentIcon.svg';
import RemovePhotoIcon from './removePhotoIcon.svg';
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
import RemoveIcon from './removeIcon.svg';
import UpdateChatAvatarIcon from './updateChatAvatarIcon.svg';
import VideoCallIcon from './videoCallIcon.svg';
import MembersModal from '../membersModal/MembersModal';
import VideoCall from '../videoCall/VideoCall';
import router from '../../router';

export default class Dialog extends Block {
  constructor(props: TProps = {}) {
    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      messageValue: '',
      messageFileId: '',
      messageFilePath: '',
      currentUserId: localStorage.getItem('userId'),
      currentChat: store.getState().currentChat,
      isLoading: true,
      videoCall: store.getState().videoCall,
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
      {
        selector: '#removeChat',
        events: {
          click: (e: Event) => {
            e.preventDefault();
            chatController.removeChat(store.getState().currentChat.id);
          },
        },
      },
      {
        selector: '#updateAvatar',
        events: {
          change: (e: Event) => {
            const formData = new FormData();
            const { files } = <HTMLInputElement>e.target;
            if (!files?.length) {
              return;
            }
            const [file] = files;
            formData.append('avatar', file);
            formData.append('chatId', store.getState().currentChat.id);
            chatController.updateAvatar(formData);
          },
        },
      },
      {
        selector: '#uploadPhoto',
        events: {
          change: (e: Event) => {
            const formData = new FormData();
            const { files } = <HTMLInputElement>e.target;
            if (!files?.length) {
              return;
            }
            const [file] = files;
            formData.append('resource', file);
            chatController.uploadPhoto(formData).then((response) => {

              if (response!.id) {
                this.setProps({
                  messageFileId: response!.id,
                  messageFilePath: response!.path,
                });
              }
            });
          },
        },
      },
      {
        selector: '#removeFile',
        events: {
          click: () => {
            this.setProps({
              messageFileId: '',
              messageFilePath: '',
            });
          },
        },
      },
      {
        selector: '#members',
        events: {
          click: () => {
            this.children.membersModal.setProps({ isOpened: true });
          },
        },
      },
      {
        selector: '#videoCall',
        events: {
          click: () => {
            store.setState({
              videoCall: { peerId: 'outgoing', userId: null },
            });

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
      let isOpenedModal = false;

      if (this.children.membersModal) {
        isOpenedModal = this.children.membersModal.props.isOpened;
      }
      if (!isOpenedModal) {

        // ВЫКЛЮЧАЕМ ВЕБКАМЕРУ ЕСЛИ ВИДЕО_ВЫЗОВА НЕТ
        if (!state.videoCall.peerId) {
          const videoCallModal = this.children.videoCallModal as VideoCall;
          if (videoCallModal) {
            //Выключаем звонок
            if (videoCallModal.melody) {
              videoCallModal.melody.pause();
            }
            const streams = videoCallModal.element.querySelector('#my-video') as HTMLVideoElement;
            const streamsSrc = (<MediaStream>streams.srcObject);


            if (streamsSrc) {
              const tracks = streamsSrc.getTracks();
              tracks.forEach(stream => stream.stop());
            }

          }
        }

        this.setProps({
          videoCall: state.videoCall,
        });

        if (!state.videoCall.peerId) {
          this.setProps({
            messages: state.messages,
            currentChat: state.currentChat,
          });
        }


      }


    }, 'dialog');


    setTimeout(() => {
      this.scrollDown();
      //Предлагаем добавить пользователей, если чат новый
      const { welcome = false } = router.getParams();

      if (welcome) {
        this.children.membersModal.setProps({
          isSearchOpen: true,
          isOpened: true,
        });
      }
    }, 150);
  }

  handleSubmit(formData: IMessageData) {

    let validated = formData!.resource ? true : validate(this, true);

    if (validated) {
      messageController.sendMessage(formData);

      const self = this;
      setTimeout(() => {
        self.scrollDown();
      }, 300);
      this.setProps({
        messageValue: '',
        messageFileId: '',
        messageFilePath: '',
      });

    }
  }

  sendVideoCallRequest(peerId: string) {
    messageController.sendMessage({ message: `{"type" : "videoCall", "peerId" : "${peerId}"}` });
  }

  endVideoCall() {
    let message = '{"type" : "videoCall", "peerId" : ""}';
    messageController.sendMessage({ message });
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
      className: 'bg-gray',
      placeholder: 'Your message',
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
    this.children.messageFile = new Input({
      name: 'resource',
      type: 'hidden',
      errors: this.props.errors,
      value: this.props.messageFileId,
    });
    this.children.membersModal = new MembersModal({ currentChatId: this.props.currentChatId });
    if (this.props.videoCall.peerId) {
      this.children.videoCallModal = new VideoCall({
        sendVideoCallRequest: this.sendVideoCallRequest,
        endVideoCall: this.endVideoCall.bind(this),
        peerId: this.props.videoCall.peerId,
      });

    }
    this.children.messagesList = new MessagesList();

    const membersCount = this.props.currentChat.users.length;
    const membersCountText = membersCount > 1 ? 'Members' : 'Member';

    const temp = `<div class="dialog">
            <% this.membersModal %>
            <% if (this.videoCall.peerId) { %>
                <% this.videoCallModal %>
            <% } %>
            <% if (this.currentChat.id) { %>
            <div class="dialog__header">
                <div class="dialog__header-photo">
                            <% if (this.currentChat.avatar !== null) { %>
                                <img src="${config.RESOURCES_URL}<% this.currentChat.avatar %>" alt=<% this.currentChat.title %>" />
                            <% } else { %>
                                <img src="/images/avatar.svg" alt=<% this.currentChat.title %>" />
                            <% } %>
                </div>
                <div class="dialog__header-title">
                    <h4 class="p-0 m-0"><% this.currentChat.title %></h4>
                    <div class="dialog__header-title_members text-gray">
                    <a id="members">${membersCount} ${membersCountText}</a>
                    </div>
                </div>
                <div>
                    <a class="btn" id="videoCall">
                        <img src="${VideoCallIcon}" class="cursor-pointer" alt="Video call" />
                    </a>
                    <div class="dialog__header-menu">
                      <div class="btn dropdown cursor-auto"><img src="${DialogMenuIcon}" class="cursor-pointer" alt="Dialog menu" />
                          <div class="dropdown-content dropdown-content-top-right" id="dialogDropdown">
                              <ul>
                                  <li>
                                      <label class="cursor-pointer">
                                            <img src="${UpdateChatAvatarIcon}" alt="Update avatar" /> Update avatar
                                            <input id="updateAvatar" type="file" class="d-none"  />
                                      </label>
                                  </li>
                                  <li><a id="removeChat" class="cursor-pointer"><img src="${RemoveIcon}" alt="Remove chat" /> Remove chat</a></li>
                              </ul>
                          </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="dialog__body">
                <% this.messagesList %>
            </div>
            <form id="messageForm">
            <div class="dialog__footer">
                
                  <div class="dialog__footer-attachment">
                      <div class="btn dropdown cursor-auto"><img src="${AttachmentIcon}" class="cursor-pointer" alt="Attachment" />
                      <div class="dropdown-content dropdown-content-bottom-left" id="uploadDropdown">
                          <ul>
                              <li>
                                  <label class="cursor-pointer">
                                        <img src="${UpdateChatAvatarIcon}" alt="Update chat avatar" /> Upload photo
                                        <input id="uploadPhoto" type="file" class="d-none"  />
                                  </label>
                              </li>
                             
                          </ul>
                          
                      </div>
                      </div>
                  </div>
                  <div class="dialog__footer-textarea">
                      <div class="input-wrapper mb-0">
                          <% this.messageInput %>
                          <% if (this.messageFilePath) { %>
                                <div class="attachment-photo">
                                    <img src="${config.RESOURCES_URL}<% this.messageFilePath %>" alt="Attach photo" class="attachment-photo__file" />
                                    <img src="${RemovePhotoIcon}" class="attachment-photo__btn-remove" alt="Remove file" id="removeFile"/>
                                </div>
                          <% }  %>  
                          <% this.messageFile %>
                          
                      </div>
                      
                  </div>
                  <div class="dialog__footer-submit">
                          <button type="submit" class="btn btn-success p-0"><img src="${SubmitIcon}" alt="Send message" /></button>
                  </div>
                
            </div>
            </form>
            <% } else { %>
            <div class="dialog__body dialog__body_empty">
                <div>
                    <img src="${EmptyDialog}" alt="Dialog is empty" />
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
