import request from '@/utils/request';

// 登录
export async function loginSubmit(data) {
  return request('/api/Login/Submit', {
    method: 'POST',
    data,
  });
}
// 获取用户信息
export const queryCurrentUser = (data) => {
  return request(`/api/auth/user/getUserInfo`, {
    data,
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// 搜索GitHub用户
export const searchUsers = (params) => {
  return request(`/repos/search/users`, {
    params,
    method: 'GET',
  });
};

// 获取验证码
export const getSMSCodeLogin = (data) => {
  return request(`/moko/account/SendVerifCodeForLogin`, {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
