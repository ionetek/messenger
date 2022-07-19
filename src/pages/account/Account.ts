import Block from '../../core/block/Block';
import BackIcon from './backIcon.svg';
import EditIcon from './editIcon.svg';
import authController from '../../controllers/auth/AuthController';
import Loader from '../../components/loader/Loader';
import { store } from '../../store';
import avatar from '../../utils/avatar/Avatar';
import router from '../../router';

export default class Account extends Block {
  constructor(props: TProps) {
    document.title = 'Account';
    const { currentUser } = store.getState();
    const defaultValues = {
      avatar: currentUser.avatar,
      first_name: currentUser.first_name,
      second_name: currentUser.second_name,
      login: currentUser.login,
      email: currentUser.email,
      phone: currentUser.phone,
      isLoading: currentUser.isLoading,

    };

    const customEvents = [
      {
        selector: '#sign-out',
        events: {
          click: () => {
            authController.signOut();
          },
        },
      },
      {
        selector: '#back',
        events: {
          click: () => {
            console.log('BACk');
            store.setState({
              currentChat: {},
            });
            router.go('/messages');
          },
        },
      },

    ];

    super({ ...props, ...defaultValues }, customEvents);
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
      });
    }, 'account');
  }

  render() {
    const loader = new Loader();

    this.children.loader = loader;

    const temp = `
    <div class="main align-items-start pt-5">
           <div class="content content-center">
                <div class="container container-xs">
                    <div class="nav-header">
                        <div class="nav-header__item">
                             <a class="btn btn-nav" id="back">
                                <img src="${BackIcon}" />
                             </a>
                        </div>
                        <div class="nav-header__item">
                             <a class="btn btn-nav router-link" href="/account-edit">
                                <img src="${EditIcon}" />
                             </a>
                        </div>
                    </div>
                    <% if (this.isLoading) { %>
                      <div class="p-5 text-center text-success">
                          <% this.loader %>
                      </div>
                    <% } else { %>
                   
                    <div class="profile-info text-center">
                        <div class="profile-info__avatar">
                                <div class="profile-info__avatar-img" style="background-image: url('${avatar(this.props.avatar)}')"></div>
                               
                        </div>
                        <div class="profile-info__name">
                        <% this.first_name %>&nbsp;<% this.second_name %>
                        </div>
                        <div class="profile-info__login">
                            @<% this.login %>
                        </div>
                        <div class="h-delimiter"></div>
                        <div class="row">
                            <div class="profile-info__item">
                                <div class="profile-info__item-label">
                                    Email
                                </div>
                                <div class="profile-info__item-value">
                                    <% this.email %>
                                </div>
                            </div>
                            <div class="profile-info__item">
                                <div class="profile-info__item-label">
                                    Phone
                                </div>
                                <div class="profile-info__item-value">
                                    <% this.phone %>
                                </div>
                            </div>
                        </div>
                        <div class="h-delimiter"></div>
                        <div class="row">
                            <a class="btn text-underline text-gray router-link" href="/password-edit">Change password</a>
                        </div>
                        <div class="row">
                            <a class="btn text-underline text-red" id="sign-out">Sign out</a>
                        </div>
                    </div>
                    <% } %>  
                </div>
           </div>
      </div>
    `;
    return this.compile(temp, this.props);
  }
}
