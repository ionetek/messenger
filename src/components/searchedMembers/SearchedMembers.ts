import Block from '../../core/block/Block';
import { store } from '../../store';
import config from '../../config';
import ChatController from '../../controllers/chat/ChatController';
import router from '../../router';


export default class SearchedMembers extends Block {
  constructor(props: TProps = {}) {
    const defaultValues = {
      users: store.getState().searchedMembers,
      title: props.title || '',
      parent: props.parent || null,
    };
    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, ...defaultValues };

    const customEvents = [
      {
        selector: '.btn-add',
        events: {
          click: (e: Event) => {
            const target = e.target as HTMLInputElement;
            const userId = parseInt(target.getAttribute('user-id') as string);
            const data = {
              users: [userId],
              chatId: store.getState().currentChat.id,
            };
            ChatController.addMember(data);
            router.go(`/messages/${store.getState().currentChat.id}`, true);
          },
        },
      },
    ];
    super(propsAndChildren, customEvents);
  }

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        users: state.searchedMembers,
      });
    }, 'searchedMembers');
  }

  render() {
    const temp = `<div>
                        <% for (key in this.users) { %>
                            <% if (key < 5) { %>
                                <li class="members-list__item">
                                         <div class="member-photo">
                                            <% if (this.users[key].avatar !== null) {  %>
                                                <img src="${config.RESOURCES_URL}<% this.users[key].avatar %>" alt="<% this.users[key].first_name %>&nbsp;<% this.users[key].second_name %>" />
                                            <% } else { %>
                                                <img src="/images/avatar.svg" alt="<% this.users[key].first_name %>&nbsp;<% this.users[key].second_name %>" />
                                            <% } %>
                                         </div>
                                         <div class="member-info">
                                         <h4 class="p-0 m-0">
                                            <% this.users[key].first_name %>&nbsp;<% this.users[key].second_name %>
                                            <% if (this.users[key].role == 'admin') { %>
                                                <span class="text-success">(Admin)</span>
                                            <% } %>
                                            </h4>
                                         <span class="text-gray">@<% this.users[key].login %></span>
                                         </div>
                                         <div class="member-action">
                                            <button class="btn btn-success-light px-3 btn-add" user-id="<% this.users[key].id %>">Add</button>
                                         </div>
                                </li>
                            <% } %>
                        <% } %>
                  </div>`;
    return this.compile(temp, this.props);
  }
}