import Block from '../../core/block/Block';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';

export default class Registration extends Block {
  constructor(props: TProps) {
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
      },
      required: {
        text: 'С заглавной рус. / англ. буквы',
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
      },
      required: {
        text: 'С заглавной рус. / англ. буквы',
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
      },
      required: {
        text: 'Некорректный email',
        rules: {
          pattern: '^(?!.*@.*@.*$)(?!.*@.*--.*\\..*$)(?!.*@.*-\\..*$)(?!.*@.*-$)((.*)?@.+(\\..{1,11})?)$',
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
        text: 'Некорректные данные',
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
      },
      required: {
        text: 'Некорректный номер телефона',
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
      },
      required: {
        text: 'Мин. 8 символов. Обязательно хотя бы одна заглавная буква и цифра',
        rules: {
          pattern: '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
        },
      },
    });

    this.children.firstname = firstname;
    this.children.secondname = secondname;
    this.children.email = email;
    this.children.login = login;
    this.children.phone = phone;
    this.children.password = password;

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
                            <button type="submit" class="btn btn-success btn-lg mw200">Register</button>
                        </div>
                        <div class="row justify-content-center">
                            <a href="/login.html" class="text-gray">I have an account</a>
                        </div>
                    </form>
                </div>
           </div>
       </div>`;
    return this.compile(temp, ctx);
  }
}
