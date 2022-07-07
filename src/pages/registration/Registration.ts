import Block from '../../core/block/Block';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';
import authController from '../../controllers/auth/AuthController';
import { store } from '../../store';
import Button from '../../components/button/Button';

export default class Registration extends Block {
  constructor(props: TProps) {
    document.title = 'Registration';

    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      firstNameValue: '',
      secondNameValue: '',
      emailValue: '',
      loginValue: '',
      phoneValue: '',
      passwordValue: '',
      passwordConfirmValue: '',
      isLoading: store.getState().registrationPage.isLoading,

    };

    const customEvents = [
      {
        selector: '#registrationForm',
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
        isLoading: state.registrationPage.isLoading,
      });
    });
  }

  handleSubmit(target: any) {
    if (validate(this, true)) {
      const formData: IRegistrationData = {};
      // @ts-ignore
      Object.entries(target).forEach(([key, child]) => {
        // @ts-ignore
        if (child.nodeName === 'INPUT') {
          // @ts-ignore
          formData[child.name] = child.value;
        }
      });

      store.setState({
        registrationPage: {
          isLoading: true,
        },
      });

      authController.signUp(formData).then((r) => {
        console.log('R', r);
        store.setState({
          registrationPage: {
            isLoading: false,
          },
        });
      });
    }
  }

  render() {
    const firstname = new Input({
      label: 'First name',
      name: 'first_name',
      type: 'text',
      errors: this.props.errors,
      value: this.props.firstNameValue,
      events: {
        blur: (e: any) => {
          this.setProps({ firstNameValue: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Only letters. The first is the capital',
        rules: {
          pattern: '(^[A-Z]{1}[a-z\\-]{1,14}$)|(^[А-Я]{1}[а-я\\-]{1,14}$)',
        },
      },
    });

    const secondname = new Input({
      label: 'Second name',
      name: 'second_name',
      type: 'text',
      errors: this.props.errors,
      value: this.props.secondNameValue,
      events: {
        blur: (e: any) => {
          this.setProps({ secondNameValue: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Only letters. The first is the capital',
        rules: {
          pattern: '(^[A-Z]{1}[a-z\\-]{1,14}$)|(^[А-Я]{1}[а-я\\-]{1,14}$)',
        },
      },
    });

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
        focus: () => validate(this),
      },
      required: {
        text: 'Invalid email',
        rules: {
          pattern: '[\\w.-]+@([A-Za-z0-9-]+\\.)+[A-Za-z0-9]+',
        },
      },
    });

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

    const phone = new Input({
      label: 'Phone',
      name: 'phone',
      type: 'text',
      errors: this.props.errors,
      value: this.props.phoneValue,
      events: {
        blur: (e: any) => {
          this.setProps({ phoneValue: e.target.value });
          validate(this);
        },
        focus: () => validate(this),
      },
      required: {
        text: 'Invalid phone',
        rules: {
          pattern: '^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{10,15}$',
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
        text: 'Min 8 characters. Required to have a capital letter and a number',
        rules: {
          pattern: '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
        },
      },
    });

    const button = new Button({
      text: 'Register',
      type: 'submit',
      className: 'btn btn-success btn-lg mw200',
      isLoading: this.props.isLoading,
    });

    this.children.firstname = firstname;
    this.children.secondname = secondname;
    this.children.email = email;
    this.children.login = login;
    this.children.phone = phone;
    this.children.password = password;
    this.children.button = button;

    const ctx = this.children;
    const temp = `<div class="main">
           <div class="content content-center">
                <div class="container container-xs">
                    <h1 class="text-center">Registration</h1>
                    <form id="registrationForm">
                        <div class="row">
                            <% this.firstname %>
                            <% this.secondname %>
                        </div>
                        <div class="row">
                            <% this.email %>
                        </div>
                        <div class="row">
                            <% this.login %>
                            <% this.phone %>
                        </div>
                        <div class="row">
                            <% this.password %>
                        </div>
                        <div class="row justify-content-center">
                            <% this.button %>
                        </div>
                        <div class="row justify-content-center">
                            <a href="/login" class="text-gray router-link">I have an account</a>
                        </div>
                    </form>
                </div>
           </div>
       </div>`;
    return this.compile(temp, ctx);
  }
}
