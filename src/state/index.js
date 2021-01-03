import Vue from 'vue'
import {PageState} from './page.js'
import {PageAction} from './pageAction.js'
import {TreeState} from './tree.js'

export const state = {
  install: function (vue) {
    vue.prototype.$state = {
      tree: TreeState,
      page: PageState,
      pageAction: PageAction
    }
  }
}