import { SPACE_TYPE, SPACE_MEMBER_ROLE, SEARCH_OBJECT_TYPE } from '@/common/constants.js'

export default {
  dict: {
    spaceTypeName: {
      [SPACE_TYPE.PERSON]:  '个人空间',
      [SPACE_TYPE.GROUP]:   '团队空间',
      [SPACE_TYPE.PROJECT]: '项目空间'
    },
    spaceMemberRoleName: {
      [SPACE_MEMBER_ROLE.CREATOR]:  '创建者',
      [SPACE_MEMBER_ROLE.ADMIN]:    '管理者',
      [SPACE_MEMBER_ROLE.ORDINARY]: '普通成员'
    }
  },
  appBar: {
    viewer: {
      menu: {
        logOut: '退出'
      }
    },
    leftDrawer: '显示/隐藏左侧边栏',
    rightDrawer: '显示/隐藏右侧边栏',
    search: '搜索',
    languages: '语言'
  },
  article: {
    buttonTips: {
      edit: '编辑',
      save: '保存',
      remove: '删除',
      exit: '退出编辑',
      fullscreen: '全屏',
      exitFullscreen: '退出全屏'
    },
    menus: {
      history: '历史版本',
      copy: '复制',
      cut: '剪切'
    },
    removeDialog: {
      title: '删除',
      desc: '确定要删除吗?',
      okText: '确定',
      cancelText: '取消'
    },
    historyDialog: {
      title: '历史版本',
      table: {
        version: '版本号',
        stime: '保存时间',
        author: '作者',
        view: '查看'
      }
    },
    richText: {
      toolbar: {
        uploadLocalImage: '上传本地图片',
        insertNetworkImage: '插入网络图片'
      },
      insertNetworkImageDialog: {
        title: '图片',
        cancel: '取消',
        ok: '确定',
      },
      insertLinkDialog: {
        title: '链接',
        cancel: '取消',
        ok: '确定',
        titlePlaceHolder: '标题'
      }
    },
    mind: {
      defaultRootNodeText: '新建脑图'
    },
    attachment: {
      defaultTitle: '附件',
      uploadButtonTip: '上传'
    }
  },
  page: {
    articlePage: {
      buttons: {
        richText: '+ 富文本',
        markdown: '+ MARKDOWN',
        mind: '+ 脑图',
        attachment: '+ 附件'
      },
      outdatedAlert: '当前页面内容有更新！',
      refresh: '刷新',
      trashDialog: {
        title: '垃圾箱'
      }
    }
  },

  search: {
    page: {
      chip: {
        [SEARCH_OBJECT_TYPE.SPACE]: '空间',
        [SEARCH_OBJECT_TYPE.TREE_NODE]: '结点',
        [SEARCH_OBJECT_TYPE.ARTICLE]: '文章'
      }
    },
    component: {
      placeholder: '搜索',
      dropdown: {
        thisSpace: '此空间',
        thisUser: '此用户',
        wholeSite: '全站'
      }
    }
  },

  home: {
    spaceMenu: {
      remove: '删除',
      settings: '设置'
    },
    createSpaceDialog: {
      title: '创建{spaceTypeName}',
      fields: {
        title: '名称',
        nonMember: '非空间成员: ',
        readable: '可读',
        writable: '可写'
      },
      actions: {
        cancel: '取消',
        create: '创建'
      }
    },
    removeSpaceDialog: {
      title: '删除空间',
      desc: '真的要删除该空间吗?',
      actions: {
        cancel: '取消',
        remove: '删除'
      }
    },
    settingSpaceDialog: {
      title: '设置空间',
      tabs: {
        info: '基本信息',
        members: '成员管理'
      },
      info: {
        fields: {
          title: '名称',
          desc: '描述',
          nonMember: '非空间成员: ',
          readable: '可读',
          writable: '可写'
        },
        actions: {
          cancel: '取消',
          save:   '保存'
        }
      },
      members: {
        table: {
          header: {
            user: '用户',
            email: '邮箱',
            role: '角色',
            operations: '操作'
          }
        },
        actions: {
          close: '关闭'
        }
      }
    }
  },

  left: {
    search: '查找树结点'
  },

  trashTree: {
    root: '回收站',
    contextMenu: {
      restore: '恢复'
    }
  },

  docTree: {
    contextMenu: {
      create: '添加',
      rename: '重命名',
      remove: '删除'
    },
    defaultTitle: '未命名',
    error: {
      treeChanged: '目录树已经变更，请刷新后重试！'
    }
  },


  articleList: {
    buttons: {
      incIndent: '增加缩进',
      decIndent: '减少缩进',
      copy: '复制',
      cut: '剪切',
      paste: '粘贴'
    },
    menus: {
      trash: '垃圾箱',
      exportPdf: '导出PDF'
    }
  },

  errors: {
    unsavedArticles: '有文档尚未保存！',
    systemError: '系统异常，请稍候再试！',
    notLoggedIn: '请您先登录！',
    treeUpdated: '文档树已经更新，请刷新后重试！',
    permissionDenied: '您没有权限进行此操作！',
  },

  login: {
    logo: '/img/logo-zh.png',
    login: '登录',
    email: '邮箱',
    password: '密码',
    submit: '登录',
    remember: '记录登录状态',
    forgotPassword: '忘记密码?',
    register: '注册',
    required: '必填',
    invalidEmail: '邮箱地址格式有误',
    invalidEmailOrPassword: '错误的邮箱地址或密码!',
    systemError: '系统异常'
  },

  register: {
    register: '注册',

    name: '名称',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',

    submit: '注册',

    fieldErrors: {
      required: '必填',
      invalidEmail: '邮箱地址格式有误',
      invalidPassword: '密码至少8个字符',
      invalidConfirmPassword: '密码和确认密码不一致'
    },

    systemError: '系统异常',
    duplicateEmail: '邮箱地址已被占用'
  },

  forgotPassword: {
    resetPassword: '重置密码',
    email: '邮箱',
    submit: '发送密码重置链接',
    succ: '已将密码重置链接发到你的邮箱！',
    invalidEmail: '无效的邮箱地址!'
  },

  resetPassword: {
    resetPassword: '重置密码',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    submit: '重置密码'
  }
}
