import config from '../../config';

function avatar(path: string = '') {
  if (path) {
    return config.RESOURCES_URL + path;
  }
  return '/images/avatar.svg';
}

export default avatar;
