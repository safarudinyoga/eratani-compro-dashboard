import { message } from 'antd';
import axios from 'axios'
import { getErrorMessage, RESPONSE_STATUS } from './apiHelper';
import { COOKIES, setCookie, SITE_COOKIES } from './cookies';
import { history } from './history';

export const _axios = axios.create({ baseURL: 'https://compro-api.eratani.co.id' });
// _axios.defaults.headers.common['Authorization'] = `Bearer ${COOKIES.get('access_token')}`;
_axios.interceptors.request.use(
  (config) => {
    const access_token = COOKIES.get(SITE_COOKIES.ACCESSTOKEN)

    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  (res) => {
    return res
  },
  async (error) => {
    console.log(error, 'error');
    message.error(getErrorMessage(error))
    const config = error.config
    if (config.url !== '/api/auth/login' && error.response) {
      // expired => change to renew token
      if (error.response.status === 401 && !config._retry) {
        config._retry = true
        const cookies_refresh_token = COOKIES.get(SITE_COOKIES.REFRESHTOKEN)

        try {
          const { data: { access_token, refresh_token }, status } = await _axios.post('/api/auth/renew-tokens', null, {
            headers: {
              Authorization: `Bearer ${cookies_refresh_token}`
            }
          })
          if (RESPONSE_STATUS.includes(status)) {
            setCookie(SITE_COOKIES.ACCESSTOKEN, access_token, 1)
            setCookie(SITE_COOKIES.REFRESHTOKEN, refresh_token, access_token, 1)
          }
        } catch (err) {
          history.replace('/login')
          message.error(getErrorMessage(err))
        }
      }
    }
  }
)
