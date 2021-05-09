<template>
  <v-app id="inspire">

    <v-main>
      <v-container fill-height>
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="8" xl="3">
            <v-card
              color="white"
              rounded
            >
              <v-form 
                ref="form" 
                v-model="areAllFieldsValid"
                lazy-validation
              >
                <v-container class="pa-5 pb-10">
                  <v-row class="mb-5" align="center">
                    <v-col cols="12" class="text-left">
                      {{ $t('register.register') }}
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
                        validate-on-blur
                        :label="$t('register.name')"
                        v-model="name"
                        :rules="[rules.required]"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field 
                        outlined
                        dense 
                        validate-on-blur
                        :label="$t('register.email')"
                        v-model="email"
                        :rules="[rules.required, rules.email]"
                        @input="clearErrorMessage()"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field
                        outlined 
                        dense 
                        validate-on-blur
                        :label="$t('register.password')"
                        type="password" 
                        v-model="password"
                        :rules="[rules.required, rules.password]"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field
                        outlined 
                        dense 
                        validate-on-blur
                        :label="$t('register.confirmPassword')"
                        type="password" 
                        v-model="confirmPassword"
                        :rules="[rules.required, rules.confirmPassword]"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-8" justify="space-between" align="center">
                    <v-col cols="12" class="text-right">
                      <v-btn color="primary" @click="register()">{{ $t('register.submit') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>

import { API_CODE } from '@/common/constants.js'

export default {
  computed: {
  },
  data: function() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',

      rules: {
        required: value => !!value || this.$t('register.fieldErrors.required'),
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('register.fieldErrors.invalidEmail')
        },
        password: value => value.length >= 8 || this.$t('register.fieldErrors.invalidPassword'),
        confirmPassword: value=> this.confirmPassword === this.password || this.$t('register.fieldErrors.invalidConfirmPassword')
      },

      areAllFieldsValid: true,
      errorMessage: '',

      isRequesting: false
    }
  },
  methods: {
    clearErrorMessage () {
      if (this.errorMessage !== '') {
        this.errorMessage = ''
      }
    },
    async register() {
      if (this.areAllFieldsValid === false) {
        return
      }

      try {
        this.requesting = true
        await this.$state.userAction.register({
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmPassword
        })
        this.$router.push({name: 'home'})
      } catch (err) {
        console.log(err)
        if (err.wrongCode === API_CODE.DUPLICATE_EMAIL) {
          this.errorMessage = this.$t('register.duplicateEmail')
        } else {
          this.errorMessage = this.$t('register.systemError')
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
    height: 2em;
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