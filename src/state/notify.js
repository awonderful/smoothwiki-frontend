import Vue from 'vue'
import { LocalStorage } from './localStorage.js'

export const Notify = new Vue({
  data: function () {
    return {
      instanceId: Date.now(),
      event: {
        timestamp: 0,
        name: '',
        data: {},
        from: 0,
        to: 0
      }
    }
  },
  computed: {
    localStorageEvent() {
      return LocalStorage.getProp('event')
    }
  },
  methods: {
    sendLocalNotification(name, data) {
      this.$emit(name, data)
    },
    sendExternalNotification(name, data, to) {
      LocalStorage.setProp('event', {
        timestamp: Date.now(),
        name: name,
        data: data,
        from: this.instanceId,
        to: to !== undefined && to !== null
            ? to
            : 0
      })
    }
  },
  watch: {
    localStorageEvent(newEvent) {
      if ((newEvent.to === 0 || newEvent.to === this.instanceId) && newEvent.from !== this.instanceId && newEvent.timestamp > this.event.timestamp) {
        this.event = newEvent
        this.$emit('EXTERNAL_' + this.event.name, this.event)
      }
    }
  }
})