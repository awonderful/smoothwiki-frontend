import { SPACE_TYPE, SPACE_MEMBER_ROLE } from '@/common/constants.js'

export default {
  dict: {
    spaceTypeName: {
      [SPACE_TYPE.PERSON]:  'Personal Space',
      [SPACE_TYPE.GROUP]:   'Group Space',
      [SPACE_TYPE.PROJECT]: 'Poject Space'
    },
    spaceMemberRoleName: {
      [SPACE_MEMBER_ROLE.CREATOR]:  'creator',
      [SPACE_MEMBER_ROLE.ADMIN]:    'administrator',
      [SPACE_MEMBER_ROLE.ORDINARY]: 'ordinary member'
    }
  },
  appBar: {
    viewer: {
      menu: {
        logOut: 'Log out'
      }
    },
    languages: 'Languages'
  },
  article: {
    buttonTips: {
      edit: 'edit',
      save: 'save',
      remove: 'remove',
      exit: 'exit edit mode',
      fullscreen: 'full screen',
      exitFullscreen: 'exit full screen mode'
    },
    menus: {
      history: 'history',
      copy: 'copy',
      cut: 'cut'
    },
    removeDialog: {
      title: 'remove',
      desc: 'do you really want to remove it?',
      okText: 'remove',
      cancelText: 'cancel'
    },
    richText: {
      toolbar: {
        uploadLocalImage: 'upload a local image',
        insertNetworkImage: 'insert a network image'
      },
      insertNetworkImageDialog: {
        title: 'image',
        cancel: 'cancel',
        ok: 'insert',
      },
      insertLinkDialog: {
        title: 'link',
        cancel: 'cancel',
        ok: 'insert',
        titlePlaceHolder: 'title'
      }
    },
    mind: {
      defaultRootNodeText: 'New Topic'
    },
    attachment: {
      defaultTitle: 'attachment',
      uploadButtonTip: 'upload'
    }
  },
  page: {
    articlePage: {
      buttons: {
        richText: '+ Rich Text',
        markdown: '+ MARKDOWN',
        mind: '+ Mind',
        attachment: '+ Attachment'
      }
    }
  },


  home: {
    createSpaceDialog: {
      title: 'Create a {spaceTypeName}',
      fields: {
        title: 'title',
        nonMember: 'non-member: ',
        readable: 'readable',
        writable: 'writable'
      },
      actions: {
        cancel: 'cancel',
        create: 'create'
      }
    },
    removeSpaceDialog: {
      title: 'Remove',
      desc: 'do you really want to remove this space?',
      actions: {
        cancel: 'cancel',
        remove: 'remove'
      }
    },
    settingSpaceDialog: {
      title: 'Setting',
      tabs: {
        info: 'info',
        members: 'members'
      },
      info: {
        fields: {
          title: 'title',
          desc: 'description',
          nonMember: 'non-member: ',
          readable: 'readable',
          writable: 'writable'
        },
        actions: {
          cancel: 'cancel',
          save:   'save'
        }
      },
      members: {
        table: {
          header: {
            user: 'user',
            email: 'email',
            role: 'role',
            operations: 'operations'
          }
        },
        actions: {
          close: 'close'
        }
      }
    }
  },

  trashTree: {
    root: 'Trash'
  },

  docTree: {
    contextMenu: {
      create: 'append',
      rename: 'rename',
      remove: 'remove'
    },
    defaultTitle: 'UNTITLED',
    error: {
      treeChanged: 'The tree has been updated, and try again after refreshing!'
    }
  },


  articleList: {
    buttons: {
      incIndent: 'increase indent',
      decIndent: 'decrease indent',
      copy: 'copy',
      cut: 'cut',
      paste: 'paste'
    }
  },

  errors: {
    unsavedArticles: 'There are some unsaved articles!',
    systemError: 'System Error！ Try again later!',
    notLoggedIn: 'You are not logged in！',
    treeUpdated: 'The tree has been updated! Refresh the page and try again!',
    permissionDenied: 'Permission denied!',
  },

  login: {
    logo: '/img/logo-en.png',
    login: 'Log in',
    email: 'Email',
    password: 'Password',
    submit: 'Log in',
    remember: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    register: 'Register',
    required: 'Required',
    invalidEmail: 'The email address is invalid!',
    invalidEmailOrPassword: 'Wrong password. Try again or click "Forgot Your password" to reset it.',
    systemError: 'System Error!'
  }
}
