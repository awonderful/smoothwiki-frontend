import { PageState } from './page.js'
import { PageAction } from './pageAction.js'
import { SpaceState } from './space.js'
import { SpaceAction } from './spaceAction.js'
import { TreeState } from './tree.js'

export const state = {
  install: function (vue) {
    vue.prototype.$state = {
      tree:        TreeState,
      page:        PageState,
      pageAction:  PageAction,
      space:       SpaceState,
      spaceAction: SpaceAction
    }
  }
}