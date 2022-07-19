import Client from './Client';
import config from '../../config';

describe('HTTP CLIENT', () => {
  it('SIGN IN', (done) => {
    Client
      .post(`${config.API_URL}/auth/signin`, {
        withCredentials: true,
        data: JSON.stringify({ login: 'Test-user', password: 'Qwerty123' }),

      })
      .then(() => {
        done();
      })
      .catch(() => {
        done(new Error('Request failed'));
      });
  });
});
