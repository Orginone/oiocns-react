// @ts-nocheck
import axios from 'axios';
import Qs from 'qs';

export const requestInstance = axios.create({});

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）或 登录失效。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 处理成功调用后 信息处理
function responseLog(response) {
  const { data } = response;

  switch (data.code) {
    case 500:
      break;

    default:
      break;
  }
}

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response) {
    const { status, statusText } = response;
    if ((status >= 200 && status < 300) || status === 304) {
      // 如果不需要除了data之外的数据，可以直接 return response.data
      return response.data;
    }
    return {
      status,
      err: codeMessage[status] || statusText,
    };
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    err: '网络异常',
  };
}

/**
 * requestInstance 实例全局请求响应处理
 * 添加一个返回拦截器 （于transformResponse之后处理）
 * 返回的数据类型默认是json，若是其他类型（text）就会出现问题，因此用try,catch捕获异常
 */
const axiosResponse = {
  success: (response) => {
    responseLog(response);
    return checkStatus(response);
  },
  error: (error) => {
    const { response, code } = error;
    // 接口请求异常统一处理
    if (code === 'ECONNABORTED') {
      // Timeout error
      console.log('Timeout error', code);
    }
    if (response) {
      const { status, statusText } = response;
      console.log('出错了', status, statusText);

      switch (status) {
        case 401:
          console.error('登录失效');
          window.location.href = '/passport/login';
          break;
        default:
          break;
      }

      return Promise.reject(checkStatus(response));
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      console.log('断网了~');
    }
  },
};

requestInstance.interceptors.response.use(axiosResponse.success, axiosResponse.error);

/**
 * 基于axios ajax请求
 * @param url
 * @param method
 * @param timeout
//  * @param prefix 用来拼接url地址
 * @param data
 * @param params
 * @param headers
 * @param dataType
 * @returns {Promise.<T>}
 */
export default function request(
  url,
  {
    method = 'post',
    timeout = 10 * 1000,
    data = {},
    params = {},
    headers = {},
    dataType = 'json',
  },
) {
  const formatHeaders = {
    'Content-Type': 'application/json; charset=UTF-8',
    ...headers,
  };

  const defaultConfig = {
    url,
    method,
    params: params,
    data,
    timeout,
    headers: formatHeaders,
    responseType: dataType,
    // 这里将 response.data 为 string 做了 JSON.parse 的转换处理
    transformResponse: axios.defaults.transformResponse.concat(function (resData: any) {
      if (typeof resData === 'string' && resData.length) {
        try {
          return JSON.parse(resData);
        } catch (e) {
          console.error(e);
          return {};
        }
      }
      return resData;
    }),
  };

  if (method === 'get') {
    defaultConfig.data = {};
  } else {
    const contentType = formatHeaders['Content-Type'];

    if (typeof contentType !== 'undefined') {
      if (contentType.indexOf('multipart') !== -1) {
        // 类型 `multipart/form-data;`
        defaultConfig.data = data;
      } else if (contentType.indexOf('json') !== -1) {
        // 类型 `application/json`
        // 服务器收到的raw body(原始数据) '{name:'jhon',sex:'man'}'（普通字符串）
        defaultConfig.data = JSON.stringify(data);
      } else {
        // 类型 `application/x-www-form-urlencoded`
        // 服务器收到的raw body(原始数据) name=homeway&key=nokey
        defaultConfig.data = Qs.stringify(data);
      }
    }
  }

  return requestInstance(defaultConfig);
}

// 上传文件封装
export const uploadFile = (url, formData) => {
  return request(url, {
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
