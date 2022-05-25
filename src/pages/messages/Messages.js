import Templator from '../../templator/index';
import ChatList from '../../features/chatlist/ChatList';
import Dialog from '../../features/dialog/Dialog';

const Messages = (props) => {
    const temp = `
        <div class="main">
            <div class="sidebar">
            ${ChatList(props.chats)}
            </div>
            <div class="content">
                <div class="panel">
                    <div class="container">
                        ${Dialog(props.dialog)}
                    </div>
                </div>
            </div>
        </div>
    `;

    return new Templator(temp).compile(props);
}

export default Messages;



