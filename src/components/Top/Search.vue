<template>
  <v-menu
		close-delay="200"
		bottom
		offset-y
		min-width="25em"
		:open-on-click="false"
		:open-on-hover="false"
		:open-on-focus="false"
		:close-on-click="false"
		:close-on-content-click="true"
		v-model="isDropdownVisible"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-text-field
				dense
				filled
				rounded
				outlined
				hide-details
				append-icon="mdi-magnify"
				autocomplete="off"
				v-model="keyword"
				:label="$t('search.component.placeholder')"
				@input="handleInputEvent($event)"
				@focus="handleFocusEvent($event)"
				@blur="handleBlurEvent()"
				v-bind="attrs"
				v-on="on"
				class="input mr-3"
			/>
		</template>

    <v-list 
			dense 
		>
      <v-list-item-group
        color="primary"
      >
        <v-list-item @click="searchInThisSpace()" v-if="this.spaceId > 0">
					<v-icon small color="grey" class="mr-2">mdi-magnify</v-icon>
          <v-list-item-title>
						{{ keyword }}
					</v-list-item-title>
					<v-btn
						color="primary"
						x-small
						outlined
					>
						{{ $t('search.component.dropdown.thisSpace') }}
						<v-icon right x-small>
							mdi-keyboard-return
						</v-icon>
					</v-btn>
        </v-list-item>

				<v-divider></v-divider>

        <v-list-item @click="searchInThisUser()">
					<v-icon small color="grey" class="mr-2">mdi-magnify</v-icon>
          <v-list-item-title>
						{{ keyword }}
					</v-list-item-title>
					<v-btn
						color="primary"
						x-small
						outlined
					>
						{{ $t('search.component.dropdown.thisUser') }}
						<v-icon right>
							mdi-keyboard-return
						</v-icon>
					</v-btn>
        </v-list-item>

				<v-divider></v-divider>

        <v-list-item @click="searchInWholeSite()">
					<v-icon small color="grey" class="mr-2">mdi-magnify</v-icon>
          <v-list-item-title>
						{{ keyword }}
					</v-list-item-title>
					<v-btn
						color="primary"
						x-small
						outlined
					>
						{{ $t('search.component.dropdown.wholeSite') }}
						<v-icon right>
							mdi-keyboard-return
						</v-icon>
					</v-btn>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import SpaceRouteParamsHandling from '@/common/spaceRouteParamsHandling.js'

export default {
  props: {
		value: {
			type: String,
			default: ''
		},
		target: {
			type: String,
			default: '_blank'
		}
  },
  mixins: [
    SpaceRouteParamsHandling
  ],
  data: function () {
    return {
      keyword: '',
			isDropdownVisible: false
    }
  },
  methods: {
		handleFocusEvent() {
			this.isDropdownVisible = this.keyword.trim().length > 0
		},
		handleInputEvent(event) {
			this.isDropdownVisible = this.keyword.trim().length > 0
			this.$emit('update:value', this.keyword)
			this.$emit('input', event)
		},
		handleBlurEvent() {
			setTimeout(function(){
				this.isDropdownVisible = false;
			}.bind(this), 200)
		},
		jumpTo(url) {
			window.open(url, this.target).focus()
		},
		searchInThisSpace() {
			const url = this.$router.resolve({
				name: 'search',
				params: {
					type: 'space'
				},
				query: {
					spaceId: this.spaceId,
					keyword: this.keyword
				}
			}).href
			this.jumpTo(url)
		},
		searchInThisUser() {
			const viewr = this.$state.user.getUserInfo()
			const url = this.$router.resolve({
				name: 'search',
				params: {
					type: 'user'
				},
				query: {
					uid: viewer.uid,
					keyword: this.keyword
				}
			}).href
			this.jumpTo(url)
		},
		searchWholeSite() {
			const url = this.$router.resolve({
				name: 'search',
				params: {
					type: 'site'
				},
				query: {
					keyword: this.keyword
				}
			}).href
			this.jumpTo(url)
		}
  }
}
</script>

<style scoped>
	.input {
		max-width: 400px;
	}
	.input >>> .v-input__slot {
		min-height: 30px !important;
	}
	.input >>> .v-label {
		top: 7px !important;
	}
	.input >>> .v-input__append-inner {
		margin-top: 5px !important;
	}
</style>