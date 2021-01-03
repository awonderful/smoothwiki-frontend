import axios from 'axios'
import { API_BASE_URL, API_CODE_SUCC } from '@/common/constants.js'

axios.defaults.baseURL = API_BASE_URL
axios.interceptors.response.use(function (response) {
  if (response.data.code === API_CODE_SUCC) {
    return response
  }
  throw {
    wrongCode: {
      response: response
    } 
  }
}, function (error) {
  return Promise.reject(error);
})


export const getTree = function (params) {
  const config = {
    url:    '/api/tree/get',
    method: 'GET',
    params: params
  }
  return axios.request(config)
}

export const getTrashTree = function (params) {
  const config = {
    url:    '/api/tree/trash/get',
    method: 'GET',
    params: params
  }
  return axios.request(config)
}

export const appendTreeNode = function (params) {
  const config = {
    url:    '/api/tree/node/append',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const renameTreeNode = function (params) {
  const config = {
    url:    '/api/tree/node/rename',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const removeTreeNode = function (params) {
  const config = {
    url:    '/api/tree/node/remove',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const moveTreeNode = function (params) {
  const config = {
    url:    '/api/tree/node/move',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getArticles = function (params) {
  const config = {
    url:    '/api/article-page/get',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const updateArticle = function (data) {
  const config = {
    url:    '/api/article-page/article/update',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}

export const addArticle = function (data) {
  const config = {
    url:    '/api/article-page/article/add',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}

export const removeArticle = function (params) {
  const config = {
    url:    '/api/article-page/article/remove',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const moveArticle = function (params) {
  const config = {
    url:    '/api/article-page/article/move',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const uploadAttachment = function (data) {
  const config = {
    url:    '/api/attachment/upload',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}