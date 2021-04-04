import Vue from 'vue'

export const SpaceState = new Vue({
  data: function() {
    return {
      spaceMap: {}
    }
  },
  methods: {
    getSpaceMap () {
      return this.spaceMap
    },
    getSpaceById (spaceId) {
      return this.spaceMap[spaceId]
    },
    addSpace(space) {
      if (space.isRequesting === undefined) {
        space.isRequesting = false
      }
      if (space.members === undefined) {
        space.members = []
      }

      this.$set(this.spaceMap, space.id, Vue.observable(space))
    },
    removeSpace (spaceId) {
      if (this.spaceMap[spaceId] !== undefined) {
        this.$delete(this.spaceMap, spaceId)
      }
    },
    setSpaceProps (spaceId, props) {
      const space = this.getSpaceById(spaceId)

      Object.assign(space, props)
    },
    addMember (spaceId, member) {
      const space = this.getSpaceById(spaceId)
      space.members.push(member)
    },
    removeMember (spaceId, uid) {
      const space = this.getSpaceById(spaceId)

      for (let i=0; i<space.members.length; i++) {
        if (space.members[i].uid === uid) {
          space.members.splice(i, 1)
        }
      }
    }
  }
})