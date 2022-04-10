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
				:append-icon="mdiMagnify"
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
			class="menu" 
		>
      <v-list-item-group
        color="primary"
      >
        <v-list-item @click="search('space')" v-if="this.spaceId > 0">
					<v-icon small color="grey" class="mr-2">{{mdiMagnify}}</v-icon>
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
							{{mdiKeyboardReturn}}
						</v-icon>
					</v-btn>
        </v-list-item>

				<v-divider></v-divider>

        <v-list-item @click="search('user')">
					<v-icon small color="grey" class="mr-2">{{mdiMagnify}}</v-icon>
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
							{{mdiKeyboardReturn}}
						</v-icon>
					</v-btn>
        </v-list-item>

				<v-divider></v-divider>

        <v-list-item @click="search('site')">
					<v-icon small color="grey" class="mr-2">{{mdiMagnify}}</v-icon>
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
							{{mdiKeyboardReturn}}
						</v-icon>
					</v-btn>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiMagnify, mdiKeyboardReturn } from '@mdi/js'

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
	computed: {
		spaceId () {
			if (this.$route.name === 'space-node') {
				const spaceId = this.$route.params.spaceId
				return parseInt(spaceId)
			}
			return 0
		}
	},
  data: function () {
    return {
			mdiMagnify,
			mdiKeyboardReturn,

      keyword: '',
			isDropdownVisible: false,
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
		search(range) {
			const route = {
				name: 'search',
				params: {
					range: range
				},
				query: {
					keyword:   this.keyword,
					spaceId:   this.spaceId,
					whichPage: 1,
					pageSize:  20,
				}
			}
			if (this.target === '_blank') {
				const url = this.$router.resolve(route).href
				this.jumpTo(url)
			} else {
				this.$router.push(route)
			}
		},
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
	.menu {
		max-width: 100vw;
	}
</style>