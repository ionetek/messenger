import Client from './Client';
import config from '../../config';

describe('HTTP CLIENT', () => {
  it('SIGN IN', (done) => {
    Client
      .post(`${config.API_URL}/auth/signin`, {
        withCredentials: true,
        data: JSON.stringify({ login: 'ionetek', password: 'Kukis783060' }),

      })
      .then(() => {
        done();
      })
      .catch(() => {
        done(new Error('Request failed'));
      });
  });
});
