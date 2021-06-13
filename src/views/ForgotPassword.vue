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
                      {{ $t('forgotPassword.resetPassword') }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="12">
                      <v-alert
                        dense
                        :type="messageType"
                        border="left"
                        :style = "{visibility: message === '' ? 'hidden': 'visible'}"
                      >
                        {{message}}
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field 
                        outlined
                        dense 
                        validate-on-blur
                        :label="$t('forgotPassword.email')"
                        v-model="email"
                        :rules="[rules.required, rules.email]"
                        @input="clearMessage()"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-8" align="center">
                    <v-col cols="12" class="text-right">
                      <v-btn color="primary" @click="sendPasswordResetEmail()">{{ $t('forgotPassword.submit') }}</v-btn>
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
      email: '',

      rules: {
        required: value => !!value || this.$t('register.fieldErrors.required'),
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('register.fieldErrors.invalidEmail')
        }
      },

      areAllFieldsValid: true,
      message: '',
      messageType: 'error',

      isRequesting: false
    }
  },
  methods: {
    clearMessage () {
      if (this.message !== '') {
        this.message = ''
      }
    },
    showErrorMessage (msg) {
      this.messageType = 'error'
      this.message = msg
    },
    showSuccMessage (msg) {
      this.messageType = 'success'
      this.message = msg
    },
    async sendPasswordResetEmail() {
      if (this.areAllFieldsValid === false) {
        return
      }

      try {
        this.requesting = true
        await this.$state.userAction.sendPasswordResetEmail({
          email: this.email
        })
        this.showSuccMessage(this.$t('forgotPassword.succ'))
      } catch (err) {
        if (err.wrongCode === API_CODE.INVALID_PARAM) {
          this.showErrorMessage(this.$t('forgotPassword.invalidEmail'))
        } else {
          this.showErrorMessage(this.$t('errors.systemError'))
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