import Block from '../../core/block/Block';
import BackIcon from './backIcon.svg';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';

export default class Account extends Block {
  constructor(props: TProps) {
    // CHILDREN

    const errors: any = [];
    const defaultValues = {
      firstNameValue: 'Ivan',
      secondNameValue: 'Tekunov',
      emailValue: 'ivan@oviland.ru',
      loginValue: 'ionetek',
      phoneValue: '+79175398984',

    };

    const customEvents = [
      {
        selector: '#accountEditForm',
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
        focus: () => validate(this),
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

    this.children.firstname = firstname;
    this.children.secondname = secondname;
    this.children.email = email;
    this.children.login = login;
    this.children.phone = phone;

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
                    <h1 class="text-center">Account edit</h1>
                    <form id="accountEditForm">
                        <div class="profile-info text-center">
                            <div class="profile-info__avatar">
                                <img src="images/avatar.jpg" />
                                <div class="profile-info__avatar-hover">
                                    Update photo
                                </div>
                            </div>
                        </div>
                        <div class="h-delimiter"></div>
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
                        <div class="row justify-content-center">
                            <button type="submit" class="btn btn-success btn-lg mw200">Confirm</button>
                        </div>
                    </form>
                    
                </div>
           </div>
      </div>
    `;
    return this.compile(temp, ctx);
  }
}
