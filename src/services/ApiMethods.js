export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getAppHeaders = () => {
   return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'authtype' : localStorage.getItem('authtype')
   }
}


class ApiMethods {
   static apiRequest = async (method, url, body = {}) => {
      url = API_BASE_URL + url;
      const options = {
         method,
         headers: getAppHeaders(),
      };

      // Include body only if the method is not GET or DELETE
      if (method !== 'GET' && method !== 'DELETE') {
         options.body = JSON.stringify(body);
      }
      
      return new Promise((resolve, reject) => {

         console.log("resolve>>>>>>>>>>>>",resolve);
         
         fetch(url, options)
            .then(res => res.json())
            .then(resolve)
            .catch(reject);
      });
   }

   static get(url) {
      return this.apiRequest('GET', url);
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

}

export default ApiMethods;
