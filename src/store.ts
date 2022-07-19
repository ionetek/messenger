import Store from './core/store/store';

export const store = new Store({
  currentUser: {
    avatar: '',
    first_name: '',
    second_name: '',
    email: '',
    login: '',
    phone: '',
    isLoading: true,
  },
  dialogId: null,
  token: null,
  chatList: [],
  currentChat: {},
  currentChatId: null,
  messages: [],
  loginPage: {
    isLoading: false,
  },
  registrationPage: {
    isLoading: false,
  },
  accountEditPage: {
    isLoading: false,
  },
  passwordEditPage: {
    isLoading: false,
  },
  createNewChat: {
    title: '',
    isOpened: false,
    isLoading: false,
  },
});
