import Block from '../../core/block/Block';
import './ChatList.css';
import AccountIcon from './account.svg';

export default class ChatList extends Block {
  render() {
    const temp = `<div><h1>Messages <a href="account.html" class="btn"><img src="${AccountIcon}" /></a></h1>
            <div class="input-wrapper">
          
                <input class="input-wrapper__form-control-gray" placeholder="Поиск">
            </div>
            <div class="chat-list">
            <% if(this.items) {  %>
                <% for (key in this.items) { %>
                    <a class="chat-list__item" href="messages.html">
                        <div class="chat-list__item-photo">
                            <img src="<% this.items[key].photo %>" />
                        </div>
                        <div class="chat-list__item-message">
                            <div class="chat-list__item-message-name"><% this.items[key].name %></div>
                            <div class="chat-list__item-message-text"><% this.items[key].message %></div>
                        </div>
                        <div class="chat-list__item-info">
                            <div class="chat-list__item-message-date"><% this.items[key].date %></div>
                            <div class="chat-list__item-message-new">
                                <% if(this.items[key].newMessages > 0) {%>
                                    <div class="message-new-count"><% this.items[key].newMessages %></div>
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
