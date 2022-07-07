import { store } from '../../store';
import Block from '../../core/block/Block';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';
import AuthController from '../../controllers/auth/AuthController';
import Button from '../../components/button/Button';

export default class Login extends Block {
  constructor(props: TProps) {
    document.title = 'Login';
    const errors: any = [];
    const defaultValues = {
      loginValue: '',
      passwordValue: '',
      isLoading: store.getState().loginPage.isLoading,
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

  componentDidMount() {
    store.subscribe((state) => {
      this.setProps({
        isLoading: state.loginPage.isLoading,
      });
    });
  }

  handleSubmit(target: any) {
    const isValidated = validate(this, true);

    if (isValidated === true) {
      const formData: ILoginData = {};
      // @ts-ignore
      Object.entries(target).forEach(([key, child]) => {
        // @ts-ignore
        if (child.nodeName === 'INPUT') {
          // @ts-ignore
          formData[child.name] = child.value;
        }
      });
      store.setState({
        loginPage: {
          isLoading: true,
        },
      });
      AuthController.signIn(formData).then(() => {
        store.setState({
          loginPage: {
            isLoading: false,
          },
        });
      });
    }
  }

  render() {
    const login = new Input({
      label: 'Login',
      name: 'login',
      type: 'text',
      errors: this.props.errors,
      value: this.props.loginValue,
      events: {
        blur: (e: any) => {
          this.setProps({ loginValue: e.target.value });
          validate(this);
        },
      },
      required: {
        text: 'Only letters, numbers and _',
        rules: {
          pattern: '^(?=.*[A-Za-z])[A-Za-z0-9_\\-]{3,20}$',
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
        focus: () => validate(this),
      },
      required: {
        text: 'Invalid password',
        rules: {
          min: 8,
        },
      },
    });

    const button = new Button({
      text: 'Login',
      type: 'submit',
      className: 'btn btn-success btn-lg mw200',
      isLoading: this.props.isLoading,
    });

    this.children.login = login;
    this.children.password = password;
    this.children.button = button;

    const ctx = this.children;
    const temp = `<div class="main">
           <div class="content content-center">
                <div class="container container-xs">
                    <h1 class="text-center">Login</h1>
                    <form id="loginForm">
                        <div class="row">
                            <% this.login %>
                        </div>
                        <div class="row">
                            <% this.password %>
                        </div>
                        <div class="row justify-content-center">
                            <% this.button %>
                        </div>
                        <div class="row justify-content-center">
                            <a class="text-gray router-link" href="/registration">Create an account</a>
                        </div>
                    </form>
                </div>
           </div>
       </div>  
                    `;
    return this.compile(temp, ctx);
  }
}
