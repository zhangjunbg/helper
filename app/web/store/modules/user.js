import {
  getToken,
} from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    userAuth: [],
    btnAuth: {},
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_USERAUTH: (state, data) => {
      state.userAuth = data;

    },
    SET_USERINFO: (state, data) => {
      state.userInfo = data;

    },
    SET_BTNAUTH: (state, data) => {
      state.btnAuth = data
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {}
}

export default user