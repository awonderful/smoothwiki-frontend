import { SPACE_TYPE, SPACE_MEMBER_ROLE } from '@/common/constants.js'

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
    languages: '语言'
  },
  article: {
    removeDialog: {
      title: '删除',
      desc: '确定要删除吗?',
      okText: '确定',
      cancelText: '取消'
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
    attachment: {
      defaultTitle: '附件'
    }
  },
  page: {
    articlePage: {
      buttons: {
        richText: '+ 富文本',
        markdown: '+ MARKDOWN',
        attachment: '+ 附件'
      }
    }
  },


  home: {
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
  space: {
    docTree: {
      contextMenu: {
        create: '添加',
        rename: '重命名',
        remove: '删除'
      },
      defaultTitle: '未命名'
    },
    trashTree: {
      root: '回收站'
    }
  },

  articleList: {
    buttons: {
      incIndent: '增加缩进',
      decIndent: '减少缩进'
    }
  },

  errors: {
    unsavedArticles: '有文档尚未保存！'
  }
}
