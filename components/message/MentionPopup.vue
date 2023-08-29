<template>
  <tippy ref="tippy" :maxWidth="220" theme="light-border p-0" :animate-fill="false" interactive placement="top-right" trigger="click" :onHidden="() => {filter = ''}">
    <div slot="trigger" class="toolbar-icon" id="mpu-toolbar-icon">
      <fa :icon="faAddressCard" />
    </div>
    <!-- <user-select mode="full" :userId="contacts[0].id"></user-select> -->
    <div class="container" id="mpu-container">
      <input type="text" v-model="filter" class="filter-input" placeholder="Enter name" @focus.stop @click.stop >
      <div class="user-list flex-grow-1 overflow-y-auto" id="mpu-list">
        <div class="item align-center gap-025 bg-hover-light" :id="'mpu-'+index" v-for="(user, index) in users" :key="user.id" @click.stop="selectUser(user)">
          <bib-avatar size="1rem" :src="user.avatar" />
          <div class="name text-truncate" id="mpu-name">{{ user.firstName }} {{ user.lastName }}</div>
        </div>
      </div>
    </div>
  </tippy>
</template>

<script>
import { mapGetters } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { TippyComponent } from 'vue-tippy';

export default {
  components: {
    fa: FontAwesomeIcon,
    tippy: TippyComponent,
  },
  data() {
    return {
      filter: '',
      faAddressCard,
    };
  },
  computed: {
    ...mapGetters({
      contacts: "user/getTeamMembers"
    }),
    users() {
      if (!this.filter) {
        return this.contacts;
      }

      const regex = new RegExp(this.filter, 'i');
      return Object.values(this.contacts).filter(
        ({ firstName, lastName }) => regex.test(firstName) || regex.test(lastName)
      );
    },
  },
  methods: {
    selectUser(user) {
      this.$refs.tippy.tip.hide();
      this.$emit('select', user);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  /*display: flex;
  flex-direction: row;*/
  /*width: 450px;*/
  /*height: 220px;*/
  /*overflow: hidden;*/
  border-radius: 0.25rem;
  background: #fff;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.15);
  padding: 10px;

  .filter-input {
    font-size: $font-size-sm;
    border-radius: 0.2rem;
    border: 1px solid $gray2;
    width: 100%;
    margin: 0.3rem 0;
    padding: 0.3rem 0.4rem;

    &:focus {
      outline: none;
      border-color: $gray6;
      box-shadow: 0 0 5px $gray5;
    }
  }
}

.user-list {
  max-height: 220px;
}

.item {
  padding: 3px 0;
  cursor: pointer;
}

.name {
  font-size: 0.9rem;
  color: var(--bib-text);
  max-width: 10rem;
}
</style>