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
    languages: '语言',
    home: '主页'
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
    discardChangesDialog: {
      title: '未保存的文档',
      desc: '文档尚未保存，放弃修改？',
      okText: '放弃',
      cancelText: '取消'
    },
    widget: {
      insertNetworkImageDialog: {
        title: '图片',
        cancel: '取消',
        ok: '确定',
      },
      insertLinkDialog: {
        title: '链接',
        cancel: '取消',
        ok: '确定',
        titleFieldPlaceHolder: '标题',
      },
      insertTableBoard: {
        title: '插入表格',
        info: '{row}行 {col}列'
      }
    },
    markdown: {
      toolbar: {
        uploadLocalImage: '上传本地图片',
        insertNetworkImage: '插入网络图片',
        buttonTips: {
          undo: '恢复',
          redo: '重做',
          bold: '强调',
          italic: '倾斜',
          strike: '删除线',
          underline: '下划线',
          subscript: '下标',
          superscript: '上标',
          mark: '高光',
          heading1: '一级标题',
          heading2: '二级标题',
          heading3: '三级标题',
          bulletedList: '符号列表',
          numberedList: '编号列表',
          taskList: '任务列表',
          quote: '引用',
          codeBlock: '代码',
          link: '链接',
          insertTable: '插入表格',
          openPreview: '预览',
          closePreview: '关闭预览',
          horizontalRule: '插入水平线',
        }
      },
    },
    richText: {
      toolbar: {
        uploadLocalImage: '上传本地图片',
        insertNetworkImage: '插入网络图片',
        buttonTips: {
          undo: '恢复',
          redo: '重做',
          bold: '强调',
          italic: '倾斜',
          strike: '删除线',
          underline: '下划线',
          subscript: '下标',
          superscript: '上标',
          highlight: '高光',
          heading1: '一级标题',
          heading2: '二级标题',
          heading3: '三级标题',
          bulletedList: '符号列表',
          numberedList: '编号列表',
          taskList: '任务列表',
          quote: '引用',
          codeBlock: '代码',
          link: '链接',
          unlink: '取消链接',
          insertTable: '插入表格',
          deleteTable: '删除表格',
          addColBefore: '在左侧插入列',
          addColAfter: '在右侧插入列',
          deleteColumn: '删除列',
          addRowBefore: '在上方插入行',
          addRowAfter: '在下方插入行',
          deleteRow: '删除行',
          splitCell: '拆分单元格',
          mergeCells: '合并单元格',
          horizontalRule: '插入水平线',
        }
      },
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
        attachment: '+ 附件',
        spreadsheet: '+ 数据表格',
        graph: '+ 图形',
        importSqlTable: '导入数据库表结构',
      },
      outdatedAlert: '当前页面内容有更新！',
      refresh: '刷新',
      trashDialog: {
        title: '垃圾箱',
        empty: '空'
      },
      importSqlTableDialog: {
        title: '导入数据库表结构',
        sqlFieldTitle: 'SQL建表语句',
        cancel: '取消',
        ok: '导入',
        markdown: {
          field: '字段',
          type: '类型',
          default: '默认值',
          comment: '说明'
        } 
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
