import { PageState } from './page.js'
import { PageAction } from './pageAction.js'
import { SpaceState } from './space.js'
import { SpaceAction } from './spaceAction.js'
import { ClipboardState } from './clipboard.js'
import { ClipboardAction } from './clipboardAction.js'
import { GlobalDialogState } from './globalDialogs.js'
import { TreeState } from './tree.js'
import { TreeAction } from './treeAction.js'
import { UserState } from './user.js'
import { UserAction } from './userAction.js'
import { ThemeState } from './theme.js'
import { Notify } from './notify.js'
import { LocalStorage } from './localStorage.js'

export const state = {
  install: function (vue) {
    vue.prototype.$state = {
      theme:           ThemeState,
      user:            UserState,
      userAction:      UserAction,
      tree:            TreeState,
      treeAction:      TreeAction,
      page:            PageState,
      pageAction:      PageAction,
      space:           SpaceState,
      spaceAction:     SpaceAction,
      clipboard:       ClipboardState,
      clipboardAction: ClipboardAction,
      globalDialogs:   GlobalDialogState,
      notify:          Notify,
      LocalStorage:    LocalStorage
    }
  }
}