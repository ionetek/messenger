enum Methods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

const defaultHeaders = {
  'Content-type': 'application/json; charset=UTF-8',
};

// Необязательный метод
function queryStringify(data = {} as TQueryData) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  // Здесь достаточно и [object Object] для объекта
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}

class Client {
  get = (url: string, options: TObj = {}) => {
    if (!!options.data) {
      url = `${url}${queryStringify(options.data)}`;
    }
    return this.request(url, { ...options, method: Methods.Get }, options!.timeout);
  };

  post = (url: string, options: TObj = {}) => this.request(url, { ...options, method: Methods.Post }, options!.timeout);

  put = (url: string, options: TObj = {}) => this.request(url, { ...options, method: Methods.Put }, options!.timeout);

  delete = (url: string, options: TObj = {}) => this.request(url, {
    ...options,
    method: Methods.Delete,
  }, options!.timeout);

  request = (url: string, options: IQueryOptions, timeout = 10000) => {
    let { headers = {} } = options;
    const { method, data } = options;

    try {
      if (Object.keys(headers).length == 0 && !(data instanceof FormData)) {
        headers = defaultHeaders;
      }
    } catch {
      if (Object.keys(headers).length == 0) {
        headers = defaultHeaders;
      }
    }

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new window.XMLHttpRequest();
      const isGet = method === Methods.Get;

      xhr.withCredentials = true;

      xhr.open(
        method,
        url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        let resp: any = '';

        if (xhr.response === 'OK') {
          resp = { status: 'OK' };
        } else {
          resp = JSON.parse(xhr.response);
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(resp);
        } else {
          reject(resp);
        }

        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}

export default new Client();
