import axios from 'axios'
import { API_BASE_URL, API_CODE } from '@/common/constants.js'

axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true

axios.interceptors.response.use(function (response) {
  if (response.data.code === API_CODE.SUCC) {
    return response
  }
  throw {
    wrongCode: response.data.code,
    response: response
  }
}, function (error) {
  return Promise.reject(error);
})


export const login = function (data) {
  const config = {
    url:    '/login',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}

export const logout = function (data) {
  const config = {
    url:    '/logout',
    method: 'POST',
    data: data
  }

  return axios.request(config)
}

export const register = function (data) {
  const config = {
    url:    '/register',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}

export const sendPasswordResetEmail = function (data) {
  const config = {
    url:    '/password/email',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}

export const getUserInfo = function (params) {
   const config = {
    url:    '/api/user/info',
    method: 'GET',
    params: params
  }
  return axios.request(config)
}

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

export const getTreeVersion = function (params) {
  const config = {
    url:    '/api/tree/version',
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

export const restoreTreeNode = function (params) {
  const config = {
    url:    '/api/tree/node/restore',
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

export const getArticlesVersions = function (params) {
  const config = {
    url:    '/api/article-page/version',
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

export const getTrashArticles = function (params) {
  const config = {
    url:    '/api/article-page/trash/get',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getArticleHistoryVersions = function (params) {
  const config = {
    url:    '/api/article-page/article/versions',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getHistoryArticle = function (params) {
  const config = {
    url:    '/api/article-page/article/history/get',
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

export const transferArticle = function (params) {
  const config = {
    url:    '/api/article-page/article/transfer',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getArticle = function (params) {
  const config = {
    url:    '/api/article-page/article/get',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const setArticleLevel = function (params) {
  const config = {
    url:    '/api/article-page/article/level',
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

export const downloadAttachment = function (params) {
  const config = {
    url:    '/api/attachment/download',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getArticleAttachments = function (params) {
  const config = {
    url:    '/api/attachment/list/article',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getAttachmentsByIds = function (params) {
  const config = {
    url:    '/api/attachment/list/ids',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getSpaces = function (params) {
  const config = {
    url:    '/api/space/list',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const createSpace = function (data) {
  const config = {
    url:    '/api/space/create',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}

export const updateSpace = function (data) {
  const config = {
    url:    '/api/space/update',
    method: 'POST',
    data:   data
  }

  return axios.request(config)
}


export const removeSpace = function (params) {
  const config = {
    url:    '/api/space/remove',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const getSpaceMembers = function (params) {
  const config = {
    url:    '/api/space/member/list',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const addSpaceMember = function (params) {
  const config = {
    url:    '/api/space/member/add',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const removeSpaceMember = function (params) {
  const config = {
    url:    '/api/space/member/remove',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}

export const search = function (params) {
  const config = {
    url:    '/api/search',
    method: 'GET',
    params: params
  }

  return axios.request(config)
}