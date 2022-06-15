import Block from '../../core/block/Block';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';

export default class Login extends Block {
  constructor(props: TProps) {
    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      emailValue: '',
      passwordValue: '',
      firstnameValue: '',
    };

    const customEvents = [
      {
        selector: '#loginForm',
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
    const email = new Input({
      label: 'Email',
      name: 'email',
      type: 'text',
      errors: this.props.errors,
      value: this.props.emailValue,
      events: {
        blur: (e: any) => {
          this.setProps({ emailValue: e.target.value });
          validate(this);
        },
      },
      required: {
        text: 'Некорректный email',
        rules: {
          pattern: '[\\w.-]+@([A-Za-z0-9-]+\\.)+[A-Za-z0-9]+',
        },
      },
    });

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
        text: 'Некорректный пароль',
        rules: {
          min: 8,
        },
      },
    });

    this.children.email = email;
    this.children.password = password;

    const ctx = this.children;
    const temp = `<div class="main">
           <div class="content content-center">
                <div class="container container-xs">
                    <h1 class="text-center">Login</h1>
                    <form id="loginForm">
                        <div class="row">
                            <% this.email %>
                        </div>
                        <div class="row">
                            <% this.password %>
                        </div>
                        <div class="row justify-content-center">
                            <button type="submit" class="btn btn-success btn-lg mw200">Login</button>
                        </div>
                        <div class="row justify-content-center">
                            <a href="/registration.html" class="text-gray">Create an account</a>
                        </div>
                    </form>
                </div>
           </div>
       </div>  
                    `;
    return this.compile(temp, ctx);
  }
}
