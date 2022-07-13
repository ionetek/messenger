import Block from '../../core/block/Block';
import { store } from '../../store';

export default class MessagesList extends Block {
  constructor(props: TProps = {}) {
    // CHILDREN

    const defaultValues = {
      currentChat: store.getState().currentChat,
      currentUserId: localStorage.getItem('userId'),
      messages: store.getState().messages,
      isLoading: true,
    };

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    super(propsAndChildren);
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
    const temp = `<div>
                        <% if (this.messages) { %>
                            <div>
                                <% for (key in this.messages) { %>
                                <div class="dialog__body-message-wrapper <% this.messages[key].user_id == this.currentUserId ? ' message-s' : ' message-r' %>">
                                    <div class="dialog__body-message">
                                        <% this.messages[key].content %>
                                    </div>
                                </div>   
                                <% } %>
                            </div>
                        <% } %>
                    </div>`;
    return this.compile(temp, this.props);
  }
}
