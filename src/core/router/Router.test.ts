import { expect } from 'chai';

import Router from './Router';
import Block from '../block/Block';

describe('ROUTER TESTING:', () => {
  const router = new Router('#root');

  class IndexPage extends Block {
  }

  class Login extends Block {
  }

  class Messages extends Block {
  }

  class Error404 extends Block {
  }

  let callbackCounter = 0;

  router
    .onRoute(() => {
      callbackCounter += 1;
    })
    .use('/', IndexPage)
    .use('/login', Login)
    .use('/messages/:id', Messages)
    .use('*', Error404)
    .start();

  it('NAVIGATION', () => {
    router.go('/');
    router.go('/about');
    router.go('/messages/12');
    router.go('/efeverv');
    expect(router.history.length).to.eq(5);

    expect(callbackCounter).to.eq(5);
  });

  it('URL PARSER', () => {
    router.go('/messages/12');
    const { pathname } = router.getCurrentRoute() || {};
    expect(pathname).to.eq('/messages/:id');
  });
});
