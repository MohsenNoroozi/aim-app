import axios from 'axios'
import {Notify} from 'quasar'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const handleError = (err) => {
  let msg = null, caption = null

  if (!err.response) {
    msg = 'Connection lost.'
    caption = 'Please check your settings and try again later.'
  } else if (err.response.status === 422) {
    msg = (err.response?.data?.errors?.[0]?.['msg'] || Object.values(err.response?.data)?.[0] || 'The given data was invalid.')
  } else if (err.response.status === 401 || err.response.status === 403 || err.response.status === 419) {
    msg = (err.response?.data?.message || 'You do not have permission to access this resource')
  } else if (err.response.status === 404) {
    msg = (err.response?.data?.message || 'Requested resource not found.')
  } else if (err.response.status >= 400 && err.response.status < 500) {
    msg = err.response?.data?.message || 'The given data was invalid.'
  } else if (err.response.status >= 500) {
    msg = 'An error occurred.'
    caption = 'please try again later.'
  }

  if (msg)
    Notify.create({
      type: 'negative',
      message: msg,
      caption: caption
    })

  return Promise.reject(err)
}

export const web = () => {
  let web = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  web.interceptors.response.use(r => r, handleError)
  return web
}

export const api = () => {
  let api = axios.create({
    baseURL: baseUrl + '/api/',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
      'Content-Type': 'application/json',
    }
  })
  api.interceptors.response.use(r => r, handleError)
  return api
}
