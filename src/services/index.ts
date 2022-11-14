import request from './request';
import urls from './RESTFULURL';
let FUNS: { [key: string]: any } = {};
let APPFUNS: any = {};

const LoadToken = (options: any, loadToken: boolean) => {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  if (loadToken) {
    options.headers = options.headers || {};
    const TOKEN = sessionStorage.Token;
    if (TOKEN !== '' && !options.headers.Authorization) {
      options.headers.Authorization = TOKEN;
    }
  }
  return options;
};
const InitRequests = (req: any, urlsObj: any, loadToken: boolean, ignores: string[]) => {
  Object.keys(urlsObj).forEach((key) => {
    const sub = urlsObj[key];

    switch (typeof sub) {
      case 'function':
        if (!ignores.includes(key)) {
          req[key] = (options: any, ...args: any) => {
            return request(sub(...args), LoadToken(options, loadToken));
          };
        }
        break;
      case 'string':
        if (!ignores.includes(key)) {
          req[key] = (options: any) => {
            return request(
              sub,
              LoadToken(options, loadToken || key === 'createAPPtoken'),
            );
          };
        }
        break;
      case 'object':
        req[key] = {};
        if (key === 'person' && !loadToken) {
          ignores = ['login', 'logout', 'register', 'changeWorkspace'];
        }
        InitRequests(req[key], sub, loadToken, ignores);

        break;
      default:
        throw new Error('Configuration not supported.');
    }
  });
};

InitRequests(FUNS, urls, true, []);

InitRequests(APPFUNS, urls, false, []);

export default FUNS;
export { APPFUNS };
