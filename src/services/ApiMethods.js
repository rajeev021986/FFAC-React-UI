export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAppHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'authtype': localStorage.getItem('authtype'),
    'userId': localStorage.getItem('userId'),
  };
};

class ApiMethods {
  static apiRequest = async (method, url, body = {}, isBlob = false) => {
    url = API_BASE_URL + url;
    const options = {
      method,
      headers: getAppHeaders(),
    };
    if (method !== 'GET' && method !== 'DELETE') {
      options.body = JSON.stringify(body);
    }

    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(async (res) => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('authtype');
            // window.location.reload();
            reject(new Error('Unauthorized'));
          }

          const contentType = res.headers.get('content-type');
          let data;

          if (isBlob || contentType?.includes('application/octet-stream')) {
            data = await res.blob();
          } else {
            data = await res.json();
          }

          if (!res.ok) {
            reject(data);
          } else {
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  static get(url, payload) {
    return this.apiRequest('GET', url, payload);
  }

  static post(url, payload) {
    return this.apiRequest('POST', url, payload);
  }

  static put(url, payload) {
    return this.apiRequest('PUT', url, payload);
  }

  static delete(url) {
    return this.apiRequest('DELETE', url);
  }
  static postBlob(url, payload) {
    return this.apiRequest('POST', url, payload, true);
  }
}

export default ApiMethods;
