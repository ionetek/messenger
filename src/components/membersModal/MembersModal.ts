import Block from '../../core/block/Block';
import './MembersModal.css';
import CloseIcon from './closeIcon.svg';
import AddIcon from './addIcon.svg';
import { store } from '../../store';
import config from '../../config';
import Input from '../input/Input';
import SearchedMembers from '../searchedMembers/SearchedMembers';
import BackIcon from './backIcon.svg';
import chatController from '../../controllers/chat/ChatController';

export default class MembersModal extends Block {
  constructor(props: TProps) {
    // CHILDREN
    const errors: any = [];


    const defaultValues = {
      isOpened: false,
      isLoading: false,
      isSearchOpen: false,
      title: '',
      users: store.getState().currentChat.users,
    };

    const customEvents = [
      {
        selector: '.btn-close',
        events: {
          click: () => {
            this.setProps({ isOpened: false, isSearchOpen: false });

          },
        },
      },
      {
        selector: '.btn-back',
        events: {
          click: () => {
            this.setProps({ isSearchOpen: false });
          },
        },
      },
      {
        selector: '#addMembers',
        events: {
          click: () => {
            this.setProps({ isSearchOpen: true });
          },
        },
      },

    ];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, errors, ...defaultValues };

    super(propsAndChildren, customEvents);
  }


  render() {

    let isOpenedClass;

    if (this.props.isOpened) {
      isOpenedClass = 'modal-opened';
    } else {
      isOpenedClass = '';
    }

    this.children.memberLoginInput = new Input({
      label: 'Search by login',
      name: 'login',
      type: 'text',
      errors: this.props.errors,
      value: this.props.title,
      events: {
        input: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.value.length > 0) {
            chatController.searchMembers({ login: target.value });
          } else {
            store.setState({
              searchedMembers: [],
            });

          }

        },
      },
    });
    this.children.searchedMembers = new SearchedMembers({ parent: this });

    const temp = `<div class="modal-wrapper ${isOpenedClass}">
                       <div class="modal">
                            <div class="modal__header">
                            <% if (!this.isSearchOpen) { %>
                                <h2 class="m-0">Chat members</h2>
                                <a class="btn btn-nav btn-close">
                                    <img src="${CloseIcon}" />
                                </a>
                                <% } else { %>
                                <h2 class="m-0">
                                  <a class="btn btn-nav btn-back mr-2">
                                      <img src="${BackIcon}" />
                                  </a>
                                Add members
                                </h2>
                                <a class="btn btn-nav btn-close">
                                    <img src="${CloseIcon}" />
                                </a>
                                <% } %>
                            </div>
                            <div class="modal__body">
                                <% if (!this.isSearchOpen) { %>
                                <div>  
                                <a class="btn btn-success-light mb-2" style="width: 200px" id="addMembers"><img src="${AddIcon}" />Add memebers</a>
                                <div class="h-delimiter"></div>
                                <ul class="members-list">
                                    <% for (key in this.users) { %>
                                    <li class="members-list__item">
                                         <div class="member-photo">
                                            <% if (this.users[key].avatar !== null) {  %>
                                                <img src="${config.RESOURCES_URL}<% this.users[key].avatar %>" />
                                            <% } else { %>
                                                <img src="/images/avatar.svg" />
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
                                         <div class="member-action"></div>
                                    </li>
                                    <% } %>
                                </ul>
                               </div>
                               <% } else { %>
                                    <% this.memberLoginInput %>
                                    <% this.searchedMembers %>
                               <% } %>
                            </div>
                       </div>
                  </div>`;
    return this.compile(temp, this.props);
  }
}
