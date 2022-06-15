import Block from '../../core/block/Block';
import BackIcon from './backIcon.svg';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';

export default class PasswordEdit extends Block {
  constructor(props: TProps) {
    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      passwordValue: '',
      passwordConfirmValue: '',
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

  handleSubmit(target: any) {
    const isValidated = validate(this, true);

    if (isValidated === true) {
      const formData = {};
      // @ts-ignore
      Object.entries(target).forEach(([key, child]) => {
        // @ts-ignore
        if (child.nodeName === 'INPUT') {
          // @ts-ignore
          formData[child.name] = child.value;
        }
      });

      console.log(formData);
    }
  }

  render() {
    const password = new Input({
      label: 'Password',
      name: 'password',
      type: 'password',
      errors: this.props.errors,
      value: this.props.passwordValue,
      events: {
        blur: (e: any) => {
          this.setProps({ passwordValue: e.target.value });
          validate(this);
        },
      },
      required: {
        text: 'Мин. 8 символов. Обязательно хотя бы одна заглавная буква и цифра',
        rules: {
          pattern: '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
        },
      },
    });

    const passwordConfirm = new Input({
      label: 'Confirm password',
      name: 'password_confirm',
      type: 'password',
      errors: this.props.errors,
      value: this.props.passwordConfirmValue,
      events: {
        blur: (e: any) => {
          this.setProps({ passwordConfirmValue: e.target.value });
          validate(this);
        },
      },
      required: {
        text: 'Мин. 8 символов. Обязательно хотя бы одна заглавная буква и цифра',
        rules: {
          pattern: '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
        },
      },
    });

    this.children.password = password;
    this.children.passwordConfirm = passwordConfirm;

    const ctx = this.children;

    const temp = `
    <div class="main align-items-start pt-5">
           <div class="content content-center">
                <div class="container container-xs">
                    <div class="nav-header">
                        <div class="nav-header__item">
                             <a class="btn btn-nav" href="/account.html">
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
                            <button type="submit" class="btn btn-success btn-lg mw200" >Confirm</button>
                        </div>
</form>
                </div>
           </div>
      </div>
    `;
    return this.compile(temp, ctx);
  }
}
