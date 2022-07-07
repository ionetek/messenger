import Block from '../../core/block/Block';
import BackIcon from './backIcon.svg';
import Input from '../../components/input/Input';
import validate from '../../utils/validate/Validate';
import { store } from '../../store';
import accountController from '../../controllers/account/AccountController';
import Button from '../../components/button/Button';
import Loader from '../../components/loader/Loader';
import avatar from '../../utils/avatar/Avatar';

export default class AccountEdit extends Block {
  constructor(props: TProps) {
    document.title = 'Edit account';

    const errors: any = [];

    const { currentUser, accountEditPage } = store.getState();
    const defaultValues = {
      avatar: currentUser.avatar,
      first_name: currentUser.first_name,
      second_name: currentUser.second_name,
      login: currentUser.login,
      email: currentUser.email,
      phone: currentUser.phone,
      isLoading: currentUser.isLoading,
      isLoadingForm: accountEditPage.isLoading,

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
      {
        selector: '.profile-info__avatar-button',
        events: {
          change: (e: Event) => {
            const formData = new FormData();
            const { files } = <HTMLInputElement>e.target;
            if (!files?.length) {
              return;
            }
            const [file] = files;
            formData.append('avatar', file);
            accountController.updateAvatar(formData);
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
        avatar: state.currentUser.avatar,
        first_name: state.currentUser.first_name,
        second_name: state.currentUser.second_name,
        email: state.currentUser.email,
        login: state.currentUser.login,
        phone: state.currentUser.phone,
        isLoading: state.currentUser.isLoading,
        isLoadingForm: state.accountEditPage.isLoading,
      });
    });
  }

  handleSubmit(target: Event) {
    if (validate(this, true)) {
      const formData: IUserInfoData = {};
      // @ts-ignore
      Object.entries(target).forEach(([key, child]) => {
        // @ts-ignore
        if (child.nodeName === 'INPUT') {
          // @ts-ignore
          formData[child.name] = child.value;
        }
      });

      formData.display_name = 'Displayname';

      store.setState({
        accountEditPage: {
          isLoading: true,
        },
      });

      accountController.updateInfo(formData).then(() => {
        store.setState({
          accountEditPage: {
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
      value: this.props.first_name,
      events: {
        blur: (e: any) => {
          store.setState({
            currentUser: {
              first_name: e.target.value,
            },
          });
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
      value: this.props.second_name,
      events: {
        blur: (e: any) => {
          store.setState({
            currentUser: {
              second_name: e.target.value,
            },
          });
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
      value: this.props.email,
      events: {
        blur: (e: any) => {
          store.setState({
            currentUser: {
              email: e.target.value,
            },
          });
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
      value: this.props.login,
      events: {
        blur: (e: any) => {
          store.setState({
            currentUser: {
              login: e.target.value,
            },
          });
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
      value: this.props.phone,
      events: {
        blur: (e: any) => {
          store.setState({
            currentUser: {
              phone: e.target.value,
            },
          });
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

    const button = new Button({
      text: 'Confirm',
      type: 'submit',
      className: 'btn btn-success btn-lg mw200',
      isLoading: this.props.isLoadingForm,
    });

    const loader = new Loader();

    this.children.loader = loader;
    this.children.firstname = firstname;
    this.children.secondname = secondname;
    this.children.email = email;
    this.children.login = login;
    this.children.phone = phone;
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
                    <h1 class="text-center">Account edit</h1>
                   
                    <% if (this.isLoading) { %>
                      <div class="p-5 text-center text-success">
                          <% this.loader %>
                      </div>
                    <% } else { %>
                    <div class="profile-info text-center">
                        <label class="profile-info__avatar">
                                <div class="profile-info__avatar-img" style="background-image: url('${avatar(this.props.avatar)}')"></div>
                                <div class="profile-info__avatar-hover">
                                    Update photo
                                </div>
                                <input type="file" class="profile-info__avatar-button" />
                        </label>
                    </div>
                    <div class="h-delimiter"></div>
                    <form id="accountEditForm">
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
                            <% this.button %>
                        </div>
                    </form>
                    <% } %>
                </div>
           </div>
      </div>
    `;
    return this.compile(temp, this.props);
  }
}
