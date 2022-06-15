export const state: TProps = {
  chats: {
    title: 'Messages',
    count: 12,
    items: [
      {
        id: 1,
        message: 'Помой посуду 😡',
        name: 'Alina Tekunova',
        photo: 'images/user-1.jpg',
        date: '15:40',
        newMessages: 3,
      },
      {
        id: 2,
        message: 'Принеси зажигалку',
        name: 'Maxim Titov',
        photo: 'images/user-2.jpg',
        date: '04:20',
        newMessages: 1,
      },
      {
        id: 3,
        message: 'Терентьев',
        name: 'Михал Палыч',
        photo: 'images/user-3.jpg',
        date: '11:15',
        newMessages: 0,
      },
      {
        id: 4,
        message: 'Очень интересно, что он сказал',
        name: 'Yana Ivanova',
        photo: 'images/user-4.jpg',
        date: '16 мая',
        newMessages: 0,
      },
      {
        id: 5,
        message: 'Отправила на почту',
        name: 'Dariya Tihonova',
        photo: 'images/user-5.jpg',
        date: '16 мая',
        newMessages: 0,
      },
    ],
  },
  dialog: {
    name: 'Михал Палыч',
    photo: 'images/user-3.jpg',
    messages: [
      {
        id: 1, text: 'Алё!', user_id: 3, date: '16:20', read: true,
      },
      {
        id: 2, text: 'Чё с деньгами?', user_id: 3, date: '16:21', read: true,
      },
      {
        id: 3, text: 'Ты кто такой?', user_id: 0, date: '16:22', read: true,
      },
      {
        id: 4, text: 'Михал Палыч', user_id: 3, date: '16:22', read: true,
      },
      {
        id: 5, text: 'Какой Михал Палыч?!', user_id: 0, date: '16:24', read: true,
      },
      {
        id: 6, text: 'Терентьев', user_id: 3, date: '16:26', read: true,
      },
      {
        id: 7,
        text: 'Кстати, вот <a href="500.html">ссылка</a> на 500ю ошибку',
        user_id: 0,
        date: '16:26',
        read: true,
      },
    ],
  },
};
