import Client from '../../core/client/Client';
import config from '../../config';
import { errorHandler } from '../../utils/errorHandler/ErrorHandler';


class UserController {
  public getUser(userId: number) {
    return Client
      .get(`${config.API_URL}/user/${userId}`)
      .then((user: TObj) => {
        return user;
      })
      .catch(errorHandler);
  }
}

export default new UserController();