import { API_CODE } from '@/common/constants.js'

export default {
  errorCaptured (err) {
    console.log(err)

    // an api call returned an error code.
    if (typeof err.wrongCode === 'number') {
      let msg = this.$t('errors.systemError')
      const errorMap = {
        [API_CODE.NOT_LOGGED_IN]: this.$t('errors.notLoggedIn'),
        [API_CODE.PERMISSION_DENIED]: this.$t('errors.permissionDenied'),
        [API_CODE.TREE_UPDATED]: this.$t('errors.treeUpdated')
      }
      const code = err.wrongCode
      if (errorMap[code] !== undefined) {
        msg = errorMap[code]
      }

      this.$state.globalDialogs.showErrorDialog({
        message: msg
      })
    }



    //return false
  }
}