<template>
  <v-app id="inspire">

    <v-main>
      <v-container fill-height>
        <v-row justify="center" align="center" no-gutters>
          <v-col xl="3" lg="5" md="6" sm="8" cols="12">
            <v-card
              color="white"
              rounded
            >
              <v-container class="pa-5 pb-10">
                <v-row class="mb-5" align="center">
                  <v-col cols="6" class="text-left">
                    {{ $t('login.login') }}
                  </v-col>
                  <v-col cols="6" class="text-right">
                    <img class="logo" :src="$t('login.logo')"/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="12">
                    <v-alert
                      dense
                      type="error"
                      border="left"
                      :style = "{visibility: errorMessage === '' ? 'hidden': 'visible'}"
                    >
                      {{errorMessage}}
                    </v-alert>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field 
                      outlined
                      dense 
                      :label="$t('login.email')"
                      v-model="email"
                      :error-messages="emailErrorMessages"
                      @focus="clearEmailError()"
                      @input="clearError()"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      outlined 
                      dense 
                      :label="$t('login.password')"
                      type="password" 
                      v-model="password"
                      :error-messages="passwordErrorMessages"
                      @focus="clearPasswordError()"
                      @input="clearError()"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-checkbox :label="$t('login.remember')" v-model="remember"></v-checkbox>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mt-8" justify="space-between" align="center">
                  <v-col cols="4" class="text-left">
                    <router-link to="/forgot-password" class="link grey--text">{{ $t('login.forgotPassword') }}</router-link>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <router-link to="/register" class="link grey--text">{{ $t('login.register') }}</router-link>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <v-btn color="primary" @click="login()">{{ $t('login.submit') }}</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container class="language-selector-wrapper">
                <v-row no-gutters justify="start">
                  <v-col cols="12" class="text-left">
                    <v-select
                      dense
                      :items="localeItems"
                      item-text="title"
                      item-value="locale"
                      v-model="$i18n.locale"
                      class="language-selector"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>

import { API_CODE, USER_STATUS } from '@/common/constants.js'

export default {
  computed: {
  },
  data: function() {
    return {
      email: '',
      password: '',
      remember: false,
      emailErrorMessages: [],
      passwordErrorMessages: [],
      requesting: false,

      errorMessage: '',

      locale: 'zh_CN',
      localeItems: [
        {title: '简体中文', locale: 'zh_CN'},
        {title: 'English', locale: 'en'}
      ]
    }
  },
  methods: {
    clearEmailError() {
      if (this.emailErrorMessages.length > 0) {
        this.emailErrorMessages = []
      }
    },
    clearPasswordError() {
      if (this.passwordErrorMessages.length > 0) {
        this.passwordErrorMessages = []
      }
    },
    clearError() {
      if (this.errorMessage !== '') {
        this.errorMessage = ''
      }
    },
    async login () {
      if (this.email.length === 0) {
        this.emailErrorMessages = [this.$t('login.required')]
        return
      }

      if (this.password.length === 0) {
        this.passwordErrorMessages = [this.$t('login.required')]
        return
      }

      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (emailPattern.test(this.email) === false) {
        this.emailErrorMessages = [this.$t('login.invalidEmail')]
        return
      }

      try {
        this.requesting = true
        await this.$state.userAction.login({
          email: this.email,
          password: this.password,
          remember: this.remember === true ? 'on': 'off'
        })
        this.$router.push({name: 'home'})
      } catch (err) {
        this.$state.user.setUserStatus(USER_STATUS.NOT_LOGGED_IN)
        if (err.wrongCode === API_CODE.INVALID_PARAM) {
          this.errorMessage = this.$t('login.invalidEmailOrPassword')
        } else {
          this.errorMessage = this.$t('errors.systemError')
        }
      } finally {
        this.requesting = false
      }
    }
  }
}
</script>

<style scoped>
  .logo {
    max-width: 100%;
    max-height: 2em;
  }
  .language-selector-wrapper {
    position: absolute;
    bottom: -5em;
  }
  .language-selector {
    width: 100px;
  }
  .language-selector >>> .v-input__slot::before {
    border: 0 !important;
  }
  .link {
    text-decoration: none;
  }
</style>