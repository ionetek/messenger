import Block from '../../core/block/Block';
import { store } from '../../store';
import './MessagesList.css';
import config from '../../config';
import PhotoModal from '../photoModal/PhotoModal';

export default class MessagesList extends Block {
  constructor(props: TProps = {}) {
    // CHILDREN

    const defaultValues = {
      currentChat: store.getState().currentChat,
      currentUserId: localStorage.getItem('userId'),
      messages: store.getState().messages,
      isLoading: true,
    };

    const customEvents = [{
      selector: '.image-popup',
      events: {
        click: (e: Event) => {
          const elem = e.currentTarget as HTMLElement;
          const image = elem.getAttribute('data-image');
          this.children.photoModal.setProps({ isOpened: true, image });
        },
      },
    }];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren, customEvents);
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        currentChat: state.currentChat,
        messages: state.messages,
      });
    }, 'messagesList');
  }

  render() {
    this.children.photoModal = new PhotoModal({ image: '' });
    const temp = `<div>
                        <% if (this.messages) { %>
                            <div>
                                <% for (key in this.messages) { %>
                                <div class="dialog__body-message-wrapper <% this.messages[key].user_id == this.currentUserId ? ' message-s' : ' message-r' %>">
                                    <div class="dialog__body-message <% if (this.messages[key].file) { %>dialog__body-message-file<% } %>">
                                        <% if (this.messages[key].file) { %>
                                            <a class="image-popup" data-image="${config.RESOURCES_URL}<% this.messages[key].file.path %>">
                                                <img src="${config.RESOURCES_URL}<% this.messages[key].file.path %>" class="message-file" />
                                            </a>
                                        <% } else { %>
                                        <% this.messages[key].content %>
                                        <% } %>
                                    </div>
                                </div>   
                                <% } %>
                            </div>
                            <% this.photoModal %>
                        <% } %>
                    </div>`;
    return this.compile(temp, this.props);
  }
}
