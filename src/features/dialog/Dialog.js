import Templator from '../../templator/index';
import './Dialog.css';
import DialogMenuIcon from './dialogMenuIcon.svg';
import AttachmentIcon from './attachmentIcon.svg';
import SubmitIcon from './submitIcon.svg';
import EmptyDialog from './empty.svg';


const Dialog = (props) => {
    const temp = `
        <div class="dialog">
            <% if (this.messages) { %>
            <div class="dialog__header">
                <div class="dialog__header-photo">
                    <img src="<% this.photo %>" />
                </div>
                <div class="dialog__header-title">
                    <% this.name %>
                </div>
                <div class="dialog__header-menu">
                    <a href="" class="btn"><img src="${DialogMenuIcon}" /></a>
                </div>
            </div>
            <div class="dialog__body">
                <% for (key in this.messages) { %>
                <div class="dialog__body-message-wrapper <% this.messages[key].user_id == 0 ? ' message-s' : ' message-r' %>">
                    <div class="dialog__body-message">
                        <% this.messages[key].text %>
                    </div>
                </div>   
                <% } %>
            </div>
            <div class="dialog__footer">
                <div class="dialog__footer-attachment">
                    <a class="btn"><img src="${AttachmentIcon}" /></a>
                </div>
                <div class="dialog__footer-textarea">
                    <div class="input-wrapper mb-0">
                        <textarea rows="2" class="input-wrapper__form-control-gray" placeholder="Your message"></textarea>
                    </div>
                    
                </div>
                <div class="dialog__footer-submit">
                        <a class="btn btn-success"><img src="${SubmitIcon}" /></a>
                </div>
            </div>
            <% } else { %>
            <div class="dialog__body dialog__body_empty">
                <div>
                    <img src="${EmptyDialog}" />
                </div>
                <div>
                    <p class="text-gray">Select a chat to send a message</p>
                </div>
            </div>
            <% }  %>
        </div>
    `;

    return new Templator(temp).compile(props);
}

export default Dialog;



