import Vue from 'vue'
import { SpaceState } from './space.js'
import * as API from '@/common/API.js'

export const SpaceAction = new Vue({
  data: {
    isCreating: false
  },
  methods: {
    async createSpace(space) {
      if (this.isCreating === true) {
        return
      }

      try {
        this.isCreating = true
        const res = await API.createSpace({
          title:       space.title,
          desc:        space.desc,
          type:        space.type,
          othersRead:  space.othersRead,
          othersWrite: space.othersWrite
        })
        SpaceState.addSpace({
          id:          res.data.id,
          title:       space.title,
          desc:        space.desc,
          type:        space.type,
          othersRead:  space.othersRead,
          othersWrite: space.othersWrite
        })
      } finally {
        this.isCreating = false
      }
    },

    async updateSpace(spaceId, props) {
      const space = SpaceState.getSpaceById(spaceId)
      if (space.isRequesting === true) {
        return
      }

      try {
        space.isRequesting = true
        const res = await API.updateSpace({
          spaceId:     spaceId,
          title:       props.title,
          desc:        props.desc,
          othersRead:  props.othersRead,
          othersWrite: props.othersWrite
        })
        SpaceState.setSpaceProps(spaceId, {
          title:       props.title,
          desc:        props.desc,
          othersRead:  props.othersRead,
          othersWrite: props.othersWrite
        })
      } finally {
        space.isRequesting = false
      }
    },

    async removeSpace(spaceId) {
      const space = SpaceState.getSpaceById(spaceId)
      if (space.isRequesting === true) {
        return
      }

      try {
        space.isRequesting = true
        const res = await API.removeSpace({
          spaceId:  spaceId
        })
        SpaceState.removeSpace(spaceId)
      } finally {
        space.isRequesting = false
      }
    },

    async getSpaces() {
      const res = await API.getSpaces({})

      for (const space of res.data.data.spaces) {
        SpaceState.addSpace(space)
      }
    },

    async refreshSpaceMembers(spaceId) {
      const space = SpaceState.getSpaceById(spaceId)
      const res = await API.getSpaceMembers({spaceId: spaceId})

      for (const member of res.data.data.members) {
        SpaceState.addMember(spaceId, member)
      }
    },

    async addSpaceMember(spaceId, email, role) {
      const res = await API.addSpaceMember({
        spaceId: spaceId,
        email: email,
        role: role
      })
      SpaceState.addMember(spaceId, res.data.data.member)
    },

    async removeSpaceMember(spaceId, uid) {
      const space = SpaceState.getSpaceById(spaceId)
      await API.removeSpaceMember({
        spaceId: spaceId,
        uid: uid
      })
      SpaceState.removeMember(spaceId, uid)
    }

  }
})