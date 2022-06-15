import Block from '../../core/block/Block';
import './Dialog.css';
import DialogMenuIcon from './dialogMenuIcon.svg';
import AttachmentIcon from './attachmentIcon.svg';
import SubmitIcon from './submitIcon.svg';
import EmptyDialog from './empty.svg';
import validate from '../../utils/validate/Validate';
import Textarea from '../textarea/Textarea';

export default class Dialog extends Block {
  constructor(props: TProps) {
    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      messageValue: '',
    };

    const customEvents = [
      {
        selector: '#messageForm',
        events: {
          submit: (e: any) => {
            e.preventDefault();
            const target = { ...e.target };
            // Костыльный метод, блокирующий вызовы blur, при отправке формы
            this.removeChildrenListeners();
            this.handleSubmit(target);
          },
        },
      },
    ];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, errors, ...defaultValues };

    super(propsAndChildren, customEvents);
  }

  handleSubmit(target: any) {
    const isValidated = validate(this, true);

    if (isValidated === true) {
      const formData = {};
      // @ts-ignore
      Object.entries(target).forEach(([key, child]) => {
        // @ts-ignore
        if (child.nodeName === 'INPUT' || child.nodeName === 'TEXTAREA') {
          // @ts-ignore
          formData[child.name] = child.value;
        }
      });

      console.log(formData);
    }
  }

  render() {
    const messageTextarea = new Textarea({
      name: 'message',
      type: 'text',
      errors: this.props.errors,
      value: this.props.messageValue,
      events: {
        blur: (e: any) => {
          this.setProps({ messageValue: e.target.value });
          validate(this);
        },
      },
      required: {
        text: 'Введите сообщение',
        rules: {
          min: 1,
        },
      },
    });
    this.children.messageTextarea = messageTextarea;

    const ctx = { ...this.props, messageTextarea };

    const temp = `<div class="dialog">
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
            <form id="messageForm">
            <div class="dialog__footer">
                
                  <div class="dialog__footer-attachment">
                      <a class="btn"><img src="${AttachmentIcon}" /></a>
                  </div>
                  <div class="dialog__footer-textarea">
                      <div class="input-wrapper mb-0">
                          <% this.messageTextarea %>
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
                    <p class="text-gray">Select a chat to send a message</p>
                </div>
            </div>
            <% }  %>
        </div>`;
    return this.compile(temp, ctx);
  }
}
