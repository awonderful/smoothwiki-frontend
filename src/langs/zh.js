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
  tree: {
    contextmenu: {
      create: '添加',
      rename: '重命名',
      remove: '删除'
    }
  }
}
