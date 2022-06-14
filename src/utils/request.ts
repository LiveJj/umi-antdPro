import { extend } from 'umi-request';
import type { RequestOptionsInit } from 'umi-request';
import { Toast } from 'antd-mobile';
import { notification } from 'antd';
import { history } from 'umi';

const codeMessage: { [propName: string]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
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

const baseUrl = process.env.NODE_ENV === 'development' ? '' : 'https://appdcapi.s-moko.cn';

/**
 * 错误异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  const { status, statusText } = response ?? {};
  if (status < 200 || status >= 300) {
    // response.json().then((res) => {
    // const { message } = res || {};
    const msg = codeMessage[status] || statusText;
    notification.error({ message: msg, description: statusText });
    // });
  }
  if (status === 401) {
    // 与后端约定不带token访问时报错401，当报错401时重定向到登录页面
    sessionStorage.clear();
    localStorage.clear();
    history.push('/user/login');
  }
  if (!response) {
    Toast.show({ content: '您的网络发生异常，无法连接服务器' });
  }
  return response; //抛出错误，之前这里一直时return response导致接口一直获取不到错误信息。
};

/*
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  prefix: baseUrl,
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 携带token.
request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
  // 不携带token的请求数组
  let notCarryTokenArr: string[] = [];
  if (notCarryTokenArr.includes(url)) {
    return {
      url,
      options,
    };
  }
  // 给每个请求带上token
  let headers = {
    Authorization: getUserToken(),
    'content-type': 'application/x-www-form-urlencoded',
    // apikey: 'web-user',
  };

  return {
    url,
    options: { ...options, interceptors: true, headers },
  };
});

const getUserToken = (): string => {
  let userToken: string = '';
  if (localStorage.getItem('token')) {
    userToken = localStorage.getItem('token') || '';
  } else {
    userToken = sessionStorage.getItem('token') || '';
  }
  return userToken;
};
export default request;
/**
 * @url 请求的url
 * @parameter 上传的参数
 */

// 封装的get,post,put,delete请求  参数{params ：{}}
//当涉及下载附件时 参数中需要添加responseType:'blob',getResponse:true
// const get = async (url: string, parameter?: any): Promise<any> => {
//   try {
//     const res = await request(url, { method: 'get', ...parameter });
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

// const deletes = async (url: string, parameter?: Record<string, unknown>): Promise<any> => {
//   try {
//     const res = await request(url, { method: 'delete', ...parameter });
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

// /*post 与 put请求的参数格式：
//  {
//    data:传往后端的参数，
//    requestType: 'form' 控制 'Content-Type': 'application/x-www-form-urlencoded; 为这个
//  }
//  */
// const post = async (url: string, args: RequestOptionsInit): Promise<any> => {
//   try {
//     const res = await request(url, {
//       method: 'post',
//       ...args,
//     });
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

// const put = async (url: string, args: RequestOptionsInit): Promise<any> => {
//   try {
//     const res = await request(url, { method: 'put', ...args });
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

// const patch = async (url: string, args: RequestOptionsInit): Promise<any> => {
//   try {
//     const res = await request(url, { method: 'patch', ...args });
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

// export default {
//   get,
//   post,
//   put,
//   deletes,
//   patch,
// };
