import Block from '../../core/block/Block';
import BackIcon from './backIcon.svg';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';
import { store } from '../../store';
import accountController from '../../controllers/account/AccountController';
import Button from '../../components/button/Button';

export default class PasswordEdit extends Block {
  constructor(props: TProps) {
    document.title = 'Edit password';

    const errors: any = [];
    const defaultValues = {
      passwordValue: '',
      passwordConfirmValue: '',
      isLoading: store.getState().passwordEditPage.isLoading,
    };

    const customEvents = [
      {
        selector: '#passwordEditForm',
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

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        isLoading: state.passwordEditPage.isLoading,
      });
    });
  }

  handleSubmit(target: Event) {
    if (validate(this, true)) {
      const formData: IPasswordUpdateData = {};
      // @ts-ignore
      Object.entries(target).forEach(([key, child]) => {
        // @ts-ignore
        if (child.nodeName === 'INPUT') {
          // @ts-ignore
          formData[child.name] = child.value;
        }
      });

      store.setState({
        passwordEditPage: {
          isLoading: true,
        },
      });

      accountController.updatePassword(formData).then(() => {
        store.setState({
          passwordEditPage: {
            isLoading: false,
          },
        });
      });
    }
  }

  render() {
    const password = new Input({
      label: 'Old password',
      name: 'oldPassword',
      type: 'password',
      errors: this.props.errors,
      value: this.props.passwordValue,
      events: {
        blur: (e: any) => {
          this.setProps({ passwordValue: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Min 8 characters. Required to have a capital letter and a number',
        rules: {
          pattern: '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
        },
      },
    });

    const passwordConfirm = new Input({
      label: 'New password',
      name: 'newPassword',
      type: 'password',
      errors: this.props.errors,
      value: this.props.passwordConfirmValue,
      events: {
        blur: (e: any) => {
          this.setProps({ passwordConfirmValue: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Min 8 characters. Required to have a capital letter and a number',
        rules: {
          pattern: '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
        },
      },
    });

    const button = new Button({
      text: 'Confirm',
      type: 'submit',
      className: 'btn btn-success btn-lg mw200',
      isLoading: this.props.isLoading,
    });

    this.children.password = password;
    this.children.passwordConfirm = passwordConfirm;
    this.children.button = button;

    const temp = `
    <div class="main align-items-start pt-5">
           <div class="content content-center">
                <div class="container container-xs">
                    <div class="nav-header">
                        <div class="nav-header__item">
                             <a class="btn btn-nav router-link" href="/account">
                                <img src="${BackIcon}" />
                             </a>
                        </div>
                    </div>
                    <h1 class="text-center">Edit password</h1>
                    <form id="passwordEditForm">
                    <div class="row">
                            <% this.password %>
                    </div>
                    <div class="row">
                            <% this.passwordConfirm %>
                        </div>
                        <div class="row justify-content-center">
                            <% this.button %>
                        </div>
</form>
                </div>
           </div>
      </div>
    `;
    return this.compile(temp, this.props);
  }
}
