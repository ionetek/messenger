import Block from '../../core/block/Block';
import Input from '../input/Input';
import validate from '../../utils/validate/Validate';
import CloseIcon from './closeIcon.svg';
import Button from '../button/Button';
import chatController from '../../controllers/chat/ChatController';
import { getFormData } from '../../utils/getFormData/GetFormData';

export default class NewChatModal extends Block {
  constructor(props: TProps) {
    // CHILDREN
    const errors: any = [];
    const defaultValues = {
      isLoading: false,
      title: '',
    };

    const customEvents = [
      {
        selector: '#newChatForm',
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
        selector: '.btn-close',
        events: {
          click: () => {
            this.setProps({ isOpened: false });
          },
        },
      },

    ];

    // Объединяем текущие пропсы компонента и его детей
    const propsAndChildren = { ...props, errors, ...defaultValues };

    super(propsAndChildren, customEvents);
  }

  handleSubmit(formData: INewChatData) {
    if (validate(this, true)) {
      this.setProps({ isLoading: true });
      chatController.newChat(formData).then(() => {
        this.setProps({ isLoading: false, isOpened: false, title: '' });
      });
    }
  }

  render() {
    this.children.newChatInput = new Input({
      label: 'Chat name',
      name: 'title',
      type: 'text',
      errors: this.props.errors,
      value: this.props.title,
      events: {
        blur: (e: any) => {
          this.setProps({ title: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Required',
        rules: {
          min: 1,
        },
      },
    });

    this.children.button = new Button({
      text: 'Create',
      type: 'submit',
      className: 'btn btn-success btn-lg mw200',
      isLoading: this.props.isLoading,
    });

    let isOpenedClass;

    if (this.props.isOpened) {
      isOpenedClass = 'modal-opened';
    } else {
      isOpenedClass = '';
    }

    const temp = `<div class="modal-wrapper ${isOpenedClass}">
                       <div class="modal">
                            <div class="modal__header">
                                <h2 class="m-0">Create new chat</h2>
                                <a class="btn btn-nav btn-close">
                                    <img src="${CloseIcon}" alt="Close" />
                                </a>
                            </div>
                            <div class="modal__body">
                                <form id="newChatForm" >
                                
                                  <% this.newChatInput %>
                                  
                                  <div class="text-right">
                                      <% this.button %>
                                  </div>
                                </form>
                            </div>
                       </div>
                  </div>`;
    return this.compile(temp, this.props);
  }
}
