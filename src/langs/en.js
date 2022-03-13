import { SPACE_TYPE, SPACE_MEMBER_ROLE, SEARCH_OBJECT_TYPE } from '@/common/constants.js'

export default {
  dict: {
    spaceTypeName: {
      [SPACE_TYPE.PERSON]:  'Personal Space',
      [SPACE_TYPE.GROUP]:   'Team Space',
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
    leftDrawer: 'show/hide left drawer',
    rightDrawer: 'show/hide right drawer',
    search: 'search',
    languages: 'Languages',
    home: 'home'
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
    historyDialog: {
      title: 'history',
      table: {
        version: 'Version',
        stime: 'Creation Time',
        author: 'Author',
        view: 'view'
      }
    },
    discardChangesDialog: {
      title: 'unsaved document',
      desc: 'the document has not been saved, discard the changes?',
      okText: 'discard',
      cancelText: 'cancel'
    },
    widget: {
      insertLinkDialog: {
        title: 'link',
        cancel: 'cancel',
        ok: 'insert',
        titleFieldPlaceHolder: 'title'
      },
      insertNetworkImageDialog: {
        title: 'image',
        cancel: 'cancel',
        ok: 'insert',
      },
      insertTableBoard: {
        title: 'Insert Table',
        info: '{row} * {col} table'
      }
    },
    markdown: {
      toolbar: {
        uploadLocalImage: 'Upload a Local Image',
        insertNetworkImage: 'Insert a Network Image',
        buttonTips: {
          undo: 'Undo',
          redo: 'Redo',
          bold: 'Strong',
          italic: 'Italic',
          strike: 'Strikethrough',
          underline: 'Underline',
          subscript: 'Subscript',
          superscript: 'Superscript',
          mark: 'Highlight',
          heading1: 'Heading 1',
          heading2: 'Heading 2',
          heading3: 'Heading 3',
          bulletedList: 'Bulleted List',
          numberedList: 'Numbered List',
          quote: 'Quote',
          codeBlock: 'Code',
          link: 'Link',
          insertTable: 'Insert Table',
          openPreview: 'Open Preview',
          closePreview: 'Close Preview',
          horizontalRule: 'Horizontal Rule',
        }
      },
    },
    richText: {
      toolbar: {
        uploadLocalImage: 'Upload a Local Image',
        insertNetworkImage: 'Insert a Network Image',
        buttonTips: {
          undo: 'Undo',
          redo: 'Redo',
          bold: 'Strong',
          italic: 'Italic',
          strike: 'Strikethrough',
          underline: 'Underline',
          subscript: 'Subscript',
          superscript: 'Superscript',
          highlight: 'Highlight',
          heading1: 'Heading 1',
          heading2: 'Heading 2',
          heading3: 'Heading 3',
          bulletedList: 'Bulleted List',
          numberedList: 'Numbered List',
          taskList: 'Task List',
          quote: 'Quote',
          codeBlock: 'Code',
          link: 'Link',
          unlink: 'Unlink',
          insertTable: 'Insert Table',
          deleteTable: 'Delete Table',
          addColBefore: 'Insert Column to the Left',
          addColAfter: 'Insert Column to the right',
          deleteColumn: 'Delete Column',
          addRowBefore: 'Insert Row Above',
          addRowAfter: 'Insert Row Below',
          deleteRow: 'Delete Row',
          splitCell: 'Split Cell',
          mergeCells: 'Merge Cells',
          horizontalRule: 'Horizontal Rule',
        }
      },
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
        markdown: '+ Markdown',
        mind: '+ Mind',
        attachment: '+ Attachment',
        spreadsheet: '+ Spreadsheet',
        importSqlTable: ' Import Database Table Structures',
      },
      outdatedAlert: 'this page is outdated!',
      refresh: 'refresh',
      trashDialog: {
        title: 'TRASH',
        empty: 'EMPTY'
      },
      importSqlTableDialog: {
        title: 'Import Database Table Structures',
        sqlFieldTitle: 'SQL Create Table Statements',
        cancel: 'cancel',
        ok: 'import',
        markdown: {
          field: 'Field',
          type: 'Type',
          default: 'Default',
          comment: 'Comment',
        } 
      }
    }
  },

  search: {
    page: {
      chip: {
        [SEARCH_OBJECT_TYPE.SPACE]: 'SPACE',
        [SEARCH_OBJECT_TYPE.TREE_NODE]: 'NODE',
        [SEARCH_OBJECT_TYPE.ARTICLE]: 'ARTICLE'
      }
    },
    component: {
      placeholder: 'search',
      dropdown: {
        thisSpace: 'in this space',
        thisUser: 'in this user',
        wholeSite: 'all site'
      }
    }
  },

  home: {
    spaceMenu: {
      remove: 'Remove',
      settings: 'Settings'
    },
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

  left: {
    search: 'search in tree'
  },

  trashTree: {
    root: 'Trash',
    contextMenu: {
      restore: 'restore'
    }
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
    },
    menus: {
      trash: 'trash',
      exportPdf: 'export to pdf'
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
    email: 'E-Mail Address',
    password: 'Password',
    submit: 'Log in',
    remember: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    register: 'Register',
    required: 'Required',
    invalidEmail: 'The email address is invalid!',
    invalidEmailOrPassword: 'Wrong password. Try again or click "Forgot Your password" to reset it.',
  },

  register: {
    register: 'Register',

    name: 'Name',
    email: 'E-Mail address',
    password: 'Password',
    confirmPassword: 'Password Confirmation',

    submit: 'Register',

    fieldErrors: {
      required: 'required',
      invalidEmail: 'The email address is invalid!',
      invalidPassword: '密码至少8个字符',
      invalidConfirmPassword: '密码和确认密码不一致'
    },

    duplicateEmail: 'This E-Mail address has been taken!'
  },

  forgotPassword: {
    resetPassword: 'Reset Password',
    email: 'E-Mail Address',
    submit: 'Send Password Reset Link',
    succ: 'We have emailed your password reset link!',
    invalidEmail: "We can't find a user with that email address."
  },

  resetPassword: {
    resetPassword: 'Reset Password',
    email: 'E-Mail Address',
    password: 'Password',
    confirmPassword: 'Password Confirmation',
    submit: 'RESET PASSWORD'
  }

}
