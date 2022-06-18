import Block from '../../core/block/Block';
import ChatList from '../../components/chatlist/ChatList';
import Dialog from '../../components/dialog/Dialog';

export default class Messages extends Block {
  render() {
    // CHILDREN LIST
    this.children.chatlist = new ChatList(this.props.chats);
    this.children.dialog = new Dialog(this.props.dialog);

    const ctx = this.children;

    const temp = `
        <div class="main">
            <div class="sidebar">
            <% this.chatlist %>
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
    return this.compile(temp, ctx);
  }
}
